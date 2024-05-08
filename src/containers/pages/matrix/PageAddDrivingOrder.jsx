import {
    Avatar,
    Button,
    Card,
    Divider,
    Form,
    InputNumber,
    Radio,
    Segmented,
    Space,
    message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSettingData } from "../../../hooks/useSettingData";
import { usePackageDrivingData, usePackageDrivingNotFreeData } from "../../../hooks/usePackageDrivingData";
import { getOnePackageDriving } from "../../../features/packagedriving/onepackagedrivingSlice";
import TableRegistrasiDriving from "../../../components/registrasidrivingorder/TableRegistrasiDriving";
import axios from "axios";
import { baseUrl } from "../../../config";
import { useWaktuServerData } from "../../../hooks/useWaktuServer";
import dayjs from "dayjs";
import {
    usePostRegistrasiDrivingData,
    useTotalJamRegistrasiDrivinRegisIdData,
    useTotalJamTerpakaiRegistrasiDrivinRegisIdData,
} from "../../../hooks/registrasi/useRegistrasiDrivingData";
import { useUpdateMatrixbayData } from "../../../hooks/useMatrixbayData";
import { useUpdateSebagianBayData } from "../../../hooks/useBayData";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const PageAddDrivingOrder = (props) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const dispatch = useDispatch();

    const onePackageDrivingData = useSelector((state) => state.onepackagedriving);
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);
    const { userid } = useSelector((state) => state.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [persenPpn, setPersenPpn] = useState(0);

    ///HOOKs
    const { data: dataSetting } = useSettingData(true);
    const { data: dataWaktuServer } = useWaktuServerData(true);
    const { data: dataPackageDrivingNotFree } = usePackageDrivingNotFreeData(true);
    // const {
    //     data: dataTotalJamTerpakaiDrivingOrder,
    //     refetch: refetchTotalJamTerpakaiDrivingOrder,
    // } = useTotalJamTerpakaiRegistrasiDrivinRegisIdData(
    //     matrixSelected?.registrasi_id,
    //     true
    // );
    // const {
    //     data: dataTotalJamDrivingOrder,
    //     refetch: refetchTotalJamDrivingOrder,
    // } = useTotalJamRegistrasiDrivinRegisIdData(
    //     matrixSelected?.registrasi_id,
    //     true
    // );

    const { mutateAsync: mutatePostRegistrasiDriving } =
        usePostRegistrasiDrivingData();
    const { mutateAsync: mutateUpdateMatrixbayData } = useUpdateMatrixbayData();
    const { mutateAsync: mutateUpdateSebagianBayData } =
        useUpdateSebagianBayData();

    useEffect(() => {
        // console.log(onePackageDrivingData);
        if (onePackageDrivingData.data !== undefined) {
            form.setFieldsValue({
                qty_jam: onePackageDrivingData?.data[0]?.qty_jam,
                hrg_jual: onePackageDrivingData?.data[0]?.hrg_jual,
                disc_persen: onePackageDrivingData?.data[0]?.disc_persen,
            });
            rumus();
        }
    }, [form, onePackageDrivingData.data]);

    useEffect(() => {
        onResetPackage();
    }, [matrixSelected]);

    const successMessage = (message) => {
        messageApi.open({
            type: "success",
            content: message,
        });
    };

    const rumus = () => {
        ///cek ppn, srvChg

        ///rumusnya
        let qty = form.getFieldValue("qty");
        let hpp = form.getFieldValue("hrg_jual");
        let discPersen = form.getFieldValue("disc_persen");
        let discRp = form.getFieldValue("disc_rp");
        let nDisc = form.getFieldValue("nilai_disc");
        let ppnPersen = persenPpn/100;
        if (discPersen > 0) {
            nDisc = hpp * (discPersen / 100);
        } else if (discRp > 0) {
            nDisc = discRp;
        } else {
            nDisc = 0;
        }
        let priceAf = hpp - nDisc;
        let jumlah = priceAf * qty;
        let nPpn = jumlah * ppnPersen;
        let total = jumlah + nPpn;

        form.setFieldsValue({
            qty: qty,
            nilai_disc: nDisc,
            hrg_stl_disc: jumlah,
            ppn_persen: persenPpn,
            nilai_ppn: nPpn,
            total: total,
        });
    };

    const onChangePackage = (v) => {
        // console.log(v.target.value);
        dispatch(getOnePackageDriving(v.target.value));
        // console.log("X");
        if (v.target.value === undefined) {
            onResetPackage();
        }

        ///cek pb1
        if (dataPackageDrivingNotFree?.data[0].tax_status === "1") {
            let persenPpn = dataSetting?.data[1].persen;
            setPersenPpn(persenPpn);
        } else {
            setPersenPpn(0);
        }
        rumus();
    };

    const onResetPackage = () => {
        form.setFieldsValue({
            items_id: null,
            qty_jam: 0,
            qty: 1,
            hrg_jual: 0,
            disc_persen: 0,
            disc_rp: 0,
            nilai_persen: 0,
            nilai_disc: 0,
            hrg_stl_disc: 0,
            service_charge_persen: 0,
            nilai_service_charge: 0,
            ppn_persen: 0,
            nilai_ppn: 0,
            total: 0,
            remark: null,
        });
    };

    const onFinish = async (v) => {
        ///1. generate number reservasi resto order
        setIsLoading(true);
        await axios
            .get(
                baseUrl +
                `/transaksi-driving/generate?registrasi_id=${matrixSelected.registrasi_id}`
            )
            .then(async (res) => {
                let noUrutOrder = res.data.data;

                ///ambil data dari package driving
                // let item = onePackageDrivingData.data[0];
                let data = {
                    id: noUrutOrder,
                    registrasi_id: matrixSelected.registrasi_id,
                    items_id: v.items_id,
                    time_start: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
                    time_end: dayjs(dataWaktuServer?.waktuserver)
                        .add(v.qty_jam, "hour")
                        .format("HH:mm:ss"),
                    qty_jam: v.qty_jam,
                    qty: v.qty,
                    hrg_jual: v.hrg_jual,
                    disc_persen: v.disc_persen,
                    disc_rp: v.disc_rp,
                    nilai_persen: v.nilai_persen,
                    nilai_disc: v.nilai_disc,
                    hrg_stl_disc: v.hrg_stl_disc,
                    ppn_persen: v.ppn_persen,
                    nilai_ppn: v.nilai_ppn,
                    total: v.total,
                    status: "0",
                    user_id: userid,
                    updator: userid,
                };
                await mutatePostRegistrasiDriving(data);
                // successMessage(`Package ${v.items_id} has been selected`);

                onClickProses();
            })
            .catch((err) => console.log(err));
    };

    const updateMatrixData = async (registrasiNumber, id) => {
        ///update data matrix
        let data = {
            namaCustomer: matrixSelected.namaCustomer + ",play," + registrasiNumber,
        };
        await mutateUpdateMatrixbayData([id, matrixSelected.namaBay, data]);
        ///End update data matrix
    };

    const updateBay = async (jmlJam) => {
        // console.log("---vvv---");
        // console.log({regisId: matrixSelected.registrasi_id, nomorBay:matrixSelected.bay_id, jmlJam:jmlJam});
        // console.log("---vvv---");
        let x = {
            status: "1",
            registrasi_id: matrixSelected.registrasi_id,
            jml_jam: jmlJam * 3600,
            time_start: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
            // time_end: dayjs(dataWaktuServer?.waktuserver)
            //     .add(jmlJam, "hour")
            //     .format("HH:mm:ss"),
            // time_current: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
        };
        await mutateUpdateSebagianBayData([matrixSelected.bay_id, x]);
        successMessage(`Successfully added the package`);
        // await axios.put(baseUrl+`/bay/edit-sebagian/${matrixSelected.bay_id}`, x).then((res)=>{
        //     // console.log("berhasil merubah sebagian data bay");
        // }).catch((err)=>console.log(err));
    };

    const cekJamTambahan = async (nomorUrutAkhir) => {
        let jamTambahan =  parseInt(form.getFieldValue('qty_jam')); //res.data.data[0].totJam;        
        // console.log({jamTambahan:jamTambahan});
        ///update data matrix
        for (let index = 0; index < jamTambahan; index++) {
            // ///update data matrix
            let depan = matrixSelected.id.substr(0, 6);
            let idRow = parseInt(nomorUrutAkhir);
            let nomorUrut = idRow + index + 1;
            // console.log({nomorUrut:nomorUrut, p : nomorUrut.toString().length});
            if (nomorUrut.toString().length < 2) {
                updateMatrixData(
                    matrixSelected.registrasi_id,
                    depan + "0" + nomorUrut
                );
            } else {
                // console.log(idRow.toString().length);
                updateMatrixData(matrixSelected.registrasi_id, depan + nomorUrut);
            }
        }
        /// update bay time
        await updateBay(jamTambahan);

        // await axios
        //     .get(
        //         baseUrl +
        //         `/transaksi-driving/totaljam?registrasi_id=${matrixSelected.registrasi_id}`
        //     )
        //     .then(async (res) => {
        //         // console.log(res.data.data[0]);
        //         let totaljam =  parseInt(form.getFieldValue('qty_jam')); //res.data.data[0].totJam;
        //         alert(totaljam);
        //         console.log({totaljam:totaljam});
        //         ///update data matrix
        //         for (let index = 0; index < totaljam; index++) {
        //             // ///update data matrix
        //             let depan = matrixSelected.id.substr(0, 6);
        //             let idRow = parseInt(nomorUrutAkhir);
        //             let nomorUrut = idRow + index + 1;
        //             // console.log({nomorUrut:nomorUrut, p : nomorUrut.toString().length});
        //             if (nomorUrut.toString().length < 2) {
        //                 updateMatrixData(
        //                     matrixSelected.registrasi_id,
        //                     depan + "0" + nomorUrut
        //                 );
        //             } else {
        //                 // console.log(idRow.toString().length);
        //                 updateMatrixData(matrixSelected.registrasi_id, depan + nomorUrut);
        //             }
        //         }
        //         /// update bay time
        //         await updateBay(totaljam);
        //     })
        //     .catch((err) => console.log(err));
    };

    const onClickProses = async () => {
        ///1. ambil nomor urut id terakhir player di tbl_matrix_bay
        ///   gunanya utk melanjutkan nomor urut tersebut utk di isi di matrix
        await axios
            .get(
                baseUrl +
                `/matrix/maxid?namaBay=${matrixSelected.namaBay}&registrasi_id=${matrixSelected.registrasi_id}`
            )
            .then(async (res) => {
                // console.log(res.data);
                if (res.data.max_id) {
                    let id = res.data.max_id;
                    let nomorUrutAkhir = parseInt(id.substr(6, id.length));

                    ///2. cek jam tambahan orderan driving
                    cekJamTambahan(nomorUrutAkhir);
                }
                setIsLoading(false);
                props.closeModal();
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    return (
        <div>
            {contextHolder}
            <div className="flex flex-wrap justify-start items-start gap-3">
                <div className="flex-1">
                    <Form
                        // labelCol={{
                        //     // offset: 1,
                        //     span: 6,
                        // }}
                        // wrapperCol={{
                        //     // offset: 1,
                        //     span: 14,
                        // }}
                        form={form}
                        name="form-add-package"
                        initialValues={{ items_id: null }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="items_id"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select package!",
                                },
                            ]}
                        >
                            {/* <Segmented                            
                                size="middle"
                                onChange={onChangePackage}
                                options={dataPackageDrivingNotFree?.data.map((e) => ({
                                    label: (
                                        <div
                                            style={{
                                                padding: 10,
                                            }}
                                        >
                                            <Avatar
                                                style={{
                                                    backgroundColor: "#f56a00",
                                                }}
                                            >
                                                {e.id}
                                            </Avatar>
                                            <div>{e.name}</div>
                                        </div>
                                    ),
                                    value: e.id,
                                }))}
                            /> */}
                            <Radio.Group buttonStyle="solid" onChange={onChangePackage}>
                                <div className="flex flex-wrap justify-start items-center gap-2">
                                    {dataPackageDrivingNotFree?.data.map((e, key) => {
                                        return (
                                            <div key={key}>
                                                <Radio.Button
                                                    value={e.id}
                                                    style={{ height: "80px", width: "159px" }}
                                                >
                                                    <div className="flex justify-center items-center gap-3">
                                                        <div className="pt-1 font-semibold text-[14px]">
                                                            {e.name}
                                                        </div>
                                                        <div>
                                                            {e.disc_persen > 0 ? (
                                                                <div className="text-right text-[12px]">
                                                                    <span className="border rounded-full bg-red-700 px-1 text-white">
                                                                        {e.disc_persen} %
                                                                    </span>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="text-center">Rp. {e.price}</div>
                                                </Radio.Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="hrg_jual" label="Price" hidden>
                            <InputNumber
                                readOnly
                                formatter={formatter}
                                parser={parser}
                                style={{ width: 120, backgroundColor: "silver" }}
                            />
                        </Form.Item>

                        <Form.Item
                            hidden
                            name="qty_jam"
                            label="Qty Jam"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber disabled formatter={formatter} parser={parser} />
                        </Form.Item>

                        <Form.Item
                            hidden
                            name="qty"
                            label="Qty"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber formatter={formatter} parser={parser} />
                        </Form.Item>

                        <Form.Item
                            hidden
                            name="disc_persen"
                            label="Disc %"
                        // rules={[
                        //     {
                        //         required: true,
                        //     },
                        // ]}
                        >
                            <InputNumber
                                readOnly
                                formatter={formatter}
                                parser={parser}
                                style={{ backgroundColor: "#F0EEEE" }}
                            />
                        </Form.Item>

                        <Form.Item
                            hidden
                            label="Disc %"
                            style={{
                                marginBottom: 0,
                            }}
                        >
                            <Form.Item
                                name="disc_persen"
                                style={{
                                    display: "inline-block",
                                    width: "calc(50% - 8px)",
                                }}
                            >
                                <InputNumber
                                    disabled
                                    parser={parser}
                                    formatter={formatter}
                                    style={{ width: "120px" }}
                                    maxLength={2}
                                    max={90}
                                    min={0}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Disc Rp."
                                name="disc_rp"
                                style={{
                                    display: "inline-block",
                                    width: "calc(50% - 8px)",
                                    margin: "0 8px",
                                }}
                            >
                                <InputNumber
                                    disabled
                                    parser={parser}
                                    formatter={formatter}
                                    style={{ width: "120px" }}
                                    min={0}
                                />
                            </Form.Item>
                        </Form.Item>

                        <Form.Item
                            hidden
                            label="nDisc"
                            style={{
                                marginBottom: 0,
                            }}
                        >
                            <Form.Item
                                name="nilai_disc"
                                style={{
                                    display: "inline-block",
                                    width: "calc(50% - 8px)",
                                }}
                            >
                                <InputNumber
                                    disabled
                                    parser={parser}
                                    formatter={formatter}
                                    style={{ width: "120px" }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="PriceAff"
                                name="hrg_stl_disc"
                                style={{
                                    display: "inline-block",
                                    width: "calc(50% - 8px)",
                                    margin: "0 8px",
                                }}
                            >
                                <InputNumber
                                    disabled
                                    parser={parser}
                                    formatter={formatter}
                                    style={{ width: "120px" }}
                                />
                            </Form.Item>
                        </Form.Item>

                        <Form.Item
                            hidden
                            label="Ppn"
                            style={{
                                marginBottom: 0,
                            }}
                        >
                            <Form.Item
                                name="ppn_persen"
                                style={{
                                    display: "inline-block",
                                    width: "calc(50% - 8px)",
                                }}
                            >
                                <InputNumber
                                    disabled
                                    parser={parser}
                                    formatter={formatter}
                                    style={{ width: "120px" }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="nilai_ppn"
                                label="nPpn"
                                style={{
                                    display: "inline-block",
                                    width: "calc(50% - 8px)",
                                    margin: "0 8px",
                                }}
                            >
                                <InputNumber
                                    disabled
                                    parser={parser}
                                    formatter={formatter}
                                    style={{ width: "120px" }}
                                />
                            </Form.Item>
                        </Form.Item>

                        <Form.Item hidden name="total" label="Price">
                            <InputNumber
                                readOnly
                                formatter={formatter}
                                parser={parser}
                                style={{ width: "120px", backgroundColor: "#ECEBEB" }}
                            />
                        </Form.Item>

                        <Divider />

                        <div className="hidden md:block">
                            <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
                                <Space>
                                    <Button onClick={() => props.closeModal()} type="text">
                                        Close
                                    </Button>

                                    <Button
                                        // disabled={isDisabled}
                                        type="primary"
                                        htmlType="submit"
                                        loading={isLoading}
                                    // style={{ width: 100 }}
                                    // style={{ backgroundColor: "#449E50", color: "#ffffff" }}
                                    >
                                        Proses
                                    </Button>
                                </Space>
                            </Form.Item>
                        </div>

                        {/* utk tombol proses mobile */}
                        <div className="md:hidden">
                            <Form.Item >
                                <Button
                                    // disabled={isDisabled}
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoading}
                                    block
                                    style={{height:"50px"}}
                                >
                                    Proses
                                </Button>

                            </Form.Item>
                        </div>
                    </Form>
                </div>
                {/* <Divider type="vertical" style={{ height: "200px" }} />
                <div className="flex-1">
                    <TableRegistrasiDriving />
                    <Divider />
                    <div className="mt-5 text-right">
                        <Button type="primary" onClick={onClickProses}>
                            Proses
                        </Button>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default PageAddDrivingOrder;
