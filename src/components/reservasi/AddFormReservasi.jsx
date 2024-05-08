import {
    Button,
    Card,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    TimePicker,
    message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useWaktuServerData } from "../../hooks/useWaktuServer";
import dayjs from "dayjs";
import { usePostReservasiData } from "../../hooks/reservasi/useReservasiData";

import { useSalesData } from "../../hooks/useSalesData";
import { baseUrl } from "../../config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { reduxUpdateNumberIdentifikasi } from "../../features/mydataselectedSlice";
import { useBayOrderByStatusData } from "../../hooks/useBayData";
import { useUpdateMatrixbayData } from "../../hooks/useMatrixbayData";
import TabTableReservasi from "../../containers/pages/reservasi/TabTableReservasi";
import {
    usePostReservasiDrivingData,
    useTotalJamReservasiDrivingOrderByReservasiIdData,
} from "../../hooks/reservasi/useReservasiDrivingData";
import { getOnePackageDriving } from "../../features/packagedriving/onepackagedrivingSlice";
import { usePackageDrivingData, usePackageDrivingNotFreeData } from "../../hooks/usePackageDrivingData";
import { useSettingData } from "../../hooks/useSettingData";
import ViewPackageDriving from "../packagedriving/ViewPackageDriving";
import TableAllRegistrasi from "../registrasi/TableAllRegistrasi";

const formatDate = "DD/MM/YYYY";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const { Search } = Input;

const AddFormReservasi = (props) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const dispatch = useDispatch();
    const { userid } = useSelector((state) => state.auth);
    const { numberIdentifikasi } = useSelector((state) => state.mydataselected);
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);
    const onePackageDrivingData = useSelector((state) => state.onepackagedriving);

    const [isLoading, setIsLoading] = useState(false);
    // const [numberReservasi, setNumberReservasi] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [isShowModalOrder, setIsShowModalOrder] = useState(false);
    const [isShowModalRestoOrder, setIsShowModalRestoOrder] = useState(false);
    const [isShowModal, setIsShowModal] = useState(false);
    const [isShowModalPackage, setIsShowModalPackage] = useState(false);
    const [idReservasi, setIdReservasi] = useState();
    const [namaPlayer, setNamaPlayer] = useState();
    const [persenPpn, setPersenPpn] = useState(0);
    const [kodepackage, setKodePackage] = useState();

    ///HOOKs
    const { data: dataSetting } = useSettingData(true);
    const { data: dataPackageDrivingNotFree } = usePackageDrivingNotFreeData(true);
    const { data: dataSales } = useSalesData(true);
    const { mutateAsync: mutatePostReservasi } = usePostReservasiData();
    const { mutateAsync: mutateUpdateMatrixbayData } = useUpdateMatrixbayData();
    const { mutateAsync: mutatePostReservasiDriving } =
        usePostReservasiDrivingData();

    useEffect(() => {
        let matrixTime = dayjs(matrixSelected.time, "HH:mm:ss");
        form.setFieldsValue({
            time: matrixTime,
            bay: matrixSelected.bay_id,
            date: dayjs(props.tanggal),
        });
    }, [form, matrixSelected]);

    useEffect(() => {
        // console.log(onePackageDrivingData);
        if (onePackageDrivingData.data !== undefined) {
            form.setFieldsValue({
                qty_jam: onePackageDrivingData?.data[0]?.qty_jam,
                hrg_jual: onePackageDrivingData?.data[0]?.hrg_jual,
                // disc_persen: onePackageDrivingData?.data[0]?.disc_persen,
            });
            rumus();
        }
    }, [form, onePackageDrivingData]);

    useEffect(() => {
        onResetPackage();
    }, []);

    const successMessage = () => {
        messageApi.open({
            type: "success",
            content: "Saving data success",
        });
    };

    const rumus = () => {
        // ///cek ppn, srvChg

        // ///rumusnya
        // let qty = form.getFieldValue("qty");
        // let hpp = form.getFieldValue("hrg_jual");
        // let discPersen = 0; //form.getFieldValue("disc_persen");
        // let discRp = 0; //form.getFieldValue("disc_rp");
        // let nDisc = 0; //form.getFieldValue("nilai_disc");
        // let ppnPersen = 0.11; //persenPpn;
        // // if (discPersen > 0) {
        // //     nDisc = hpp * (discPersen / 100);
        // // } else if (discRp > 0) {
        // //     nDisc = discRp;
        // // } else {
        // //     nDisc = 0;
        // // }
        // let priceAf = hpp - nDisc;
        // let jumlah = priceAf * qty;
        // let nPpn = jumlah * ppnPersen;
        // let total = jumlah + nPpn;

        // form.setFieldsValue({
        //     qty: qty,
        //     nilai_disc: nDisc,
        //     hrg_stl_disc: jumlah,
        //     ppn_persen: ppnPersen,
        //     nilai_ppn: nPpn,
        //     total: total,
        // });
    };

    const simpanOrderanDriving = async (reservasiNumber, v) => {
        ///1. generate number reservasi resto order
        await axios
            .get(
                baseUrl + `/transaksi-driving/generate?registrasi_id=${reservasiNumber}`
            )
            .then(async (res) => {
                let noUrutOrder = res.data.data;

                ///ambil data dari package driving
                // let item = onePackageDrivingData.data[0];

                let nDisc = 0; 
                let ppnPersen = 0.11;
                let priceAf = v.hrg_jual - nDisc;
                let jumlah = priceAf * v.qty;
                let nPpn = jumlah * ppnPersen;
                let total = jumlah + nPpn;

                let data = {
                    id: noUrutOrder,
                    reservasi_id: reservasiNumber,
                    items_id: v.items_id,
                    time_start: dayjs(props.tanggal?.waktuserver).format("HH:mm:ss"),
                    time_end: dayjs(props.tanggal?.waktuserver)
                        .add(v.qty_jam, "hour")
                        .format("HH:mm:ss"),
                    qty_jam: v.qty_jam,
                    qty: v.qty,
                    hrg_jual: v.hrg_jual,
                    disc_persen: 0, //v.disc_persen,
                    disc_rp: 0, //v.disc_rp,
                    nilai_persen: 0, //v.nilai_persen,
                    nilai_disc: 0, //v.nilai_disc,
                    hrg_stl_disc: v.hrg_jual,
                    ppn_persen: 11,
                    nilai_ppn: nPpn,
                    total: total,
                    status: "0",
                    user_id: userid,
                    updator: userid,
                };
                await mutatePostReservasiDriving(data);
                successMessage();
            })
            .catch((err) => console.log(err));
    };

    const simpanReservasi = async (reservasiNumber, v) => {
        const data = {
            id: reservasiNumber,
            date: dayjs(props.tanggal).format("YYYY-MM-DD HH:mm:ss"),
            nama: v.nama,
            no_hp: v.no_hp,
            alamat: v.alamat,
            time: dayjs(v.time).format("HH:mm"),
            bay: v.bay,
            sales: v.sales,
            status: "0",
            user_id: userid,
            updator: userid,
        };
        await mutatePostReservasi(data);
    };

    const updateMatrixData = async (reservasiNumber, idMatrix) => {
        ///update data matrix
        let data = {
            namaCustomer: form.getFieldValue("nama") + ",booking," + reservasiNumber,
        };
        console.log({ id: idMatrix, bay: matrixSelected.namaBay, data: data });

        await mutateUpdateMatrixbayData([idMatrix, matrixSelected.namaBay, data]);
        ///End update data matrix
    };

    const simpanData = async (v) => {
        setIsLoading(true);
        await axios
            .get(baseUrl + `/reservasi/generate`)
            .then(async (res) => {
                // console.log(res.data.data);
                let reservasiNumber = res.data.data;
                setIdReservasi(reservasiNumber);

                // ///simpan ke redux
                // dispatch(
                //     reduxUpdateNumberIdentifikasi({ numberIdentifikasi: reservasiNumber })
                // );

                await simpanReservasi(reservasiNumber, v);
                await simpanOrderanDriving(reservasiNumber, v);

                ///update data matrix
                let totaljam = form.getFieldValue("qty_jam");
                for (let index = 0; index < totaljam; index++) {
                    // ///update data matrix
                    let depan = matrixSelected.id.substr(0, 6);
                    let idRow = parseInt(matrixSelected.id.substr(6, 2));
                    let nomorUrut = idRow + index;
                    // console.log({nomorUrut:nomorUrut, p : nomorUrut.toString().length});
                    if (nomorUrut.toString().length < 2) {
                        updateMatrixData(reservasiNumber, depan + "0" + nomorUrut);
                    } else {
                        // console.log(idRow.toString().length);
                        updateMatrixData(reservasiNumber, depan + nomorUrut);
                    }
                }

                setIsLoading(false);
                onReset();
                props.closeModal();
            })
            .catch((err) => console.log(err));
    };

    const onFinish = async (v) => {
        await simpanData(v);
    };

    const onResetPackage = () => {
        setIdReservasi(null);
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

    const onReset = () => {
        // form.resetFields();
        setNamaPlayer(null);
        form.setFieldsValue({
            reservasi_id: null,
            nama: null,
            no_hp: null,
            alamat: null,
            sales: null,
        });

        onResetPackage();
        setIsLoading(false);
    };

    // const onClickAccept = async () => {
    //     ///cek total jam orderan driving
    //     console.log("---xxx---");
    //     console.log(dataTotalJamReservasiDrivingOrder);
    //     console.log("---xxx---");
    //     if (dataTotalJamReservasiDrivingOrder?.success) {
    //         let totaljam = dataTotalJamReservasiDrivingOrder?.data[0]?.totJam;
    //         // for (let index = 0; index < totaljam; index++) {
    //         //     ///update data matrix
    //         //     console.log(parseInt(matrixSelected.id) + index);
    //         //     updateMatrixData(parseInt(matrixSelected.id) + index);
    //         // }

    //         ///update data matrix
    //         for (let index = 0; index < totaljam; index++) {
    //             ///update data matrix
    //             let depan = matrixSelected.id.substr(0, 6);
    //             let idRow = parseInt(matrixSelected.id.substr(6, 2));
    //             if (idRow.toString().length < 2) {
    //                 // console.log({depan:depan, panjangBelakang:idRow.toString().length, hasil:depan +"0"+ (parseInt(idRow) + index)});
    //                 updateMatrixData(depan + "0" + (parseInt(idRow) + index));
    //             } else {
    //                 // console.log({depan:depan, panjangBelakang:idRow.toString().length, hasil:depan +"0"+ (parseInt(idRow) + index)});
    //                 updateMatrixData(depan + (parseInt(idRow) + index));
    //             }
    //         }
    //     } else {
    //         console.log("Data total jam tidak ditemukan");
    //     }
    //     setIsShowModalOrder(false);
    //     props.closeModal();
    // };

    const onChangeNama = (v) => {
        setNamaPlayer(v.target.value);
    };

    const onChangePackage = (v) => {
        dispatch(getOnePackageDriving(v));
        // // console.log("X");
        // if (v === undefined) {
        //     onResetPackage();
        // }

        // ///cek ppn
        // if (dataPackageDrivingNotFree?.data[0].tax_status === "1") {
        //     let persenPpn = dataSetting?.data[1].persen / 100;
        //     setPersenPpn(persenPpn);
        // } else {
        //     setPersenPpn(0);
        // }
        // rumus();
    };

    const onSearchNama = (v) => {
        setNamaPlayer(v);
        setIsShowModal(true);
    };

    const getDataPackage = (idpackage, hrgjual) => {
        dispatch(getOnePackageDriving(idpackage));
        setKodePackage(idpackage);
        form.setFieldsValue({ items_id: idpackage, hrg_jual: hrgjual });
        // onChangePackage(idpackage);
        // console.log(idpackage);
    };

    const onClickSearchPackage = () => {
        console.log("a");
        setIsShowModalPackage(true);
    };

    const getNamaDanNoHP = (nama, no_hp) => {
        form.setFieldsValue({ nama: nama, no_hp: no_hp });
        setNamaPlayer(nama); 
    };

    const handleInputHandphoneChange=(event)=>{
        // Memastikan bahwa input hanya berupa angka telepon
    const value = event.target.value.replace(/\D/g, '');
    // console.log(value); // Cetak nilai input di konsol
    form.setFieldsValue({no_hp:value});
    }

    return (
        <div>
            {contextHolder}
            <Form
                labelCol={{
                    // offset: 1,
                    span: 6,
                }}
                wrapperCol={{
                    // offset: 1,
                    span: 14,
                }}
                form={form}
                name="form-add-reservasi"
                onFinish={onFinish}
            // initialValues={{ date: dayjs(props.tanggal) }}
            // onClick={onChangeLocation}
            // onFieldsChange={onChangeLocation}
            // style={{
            //     maxWidth: 600,
            // }}
            >
                <Form.Item
                    // name="date"
                    label="Reservasi Number"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    style={{ padding: 0, margin: 5 }}
                >
                    <span className="font-bold">{numberIdentifikasi}</span>
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Date"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <DatePicker disabled format={formatDate} />
                </Form.Item>

                <Form.Item
                    label="Time"
                    style={{
                        marginBottom: 0,
                    }}
                >
                    <Form.Item
                        name="time"
                        // rules={[
                        //     {
                        //         required: true,
                        //     },
                        // ]}
                        style={{
                            display: "inline-block",
                            width: "calc(50% - 8px)",
                        }}
                    >
                        <TimePicker disabled format={"HH:mm"} />
                    </Form.Item>
                    <Form.Item
                        label="Bay"
                        name="bay"
                        // rules={[
                        //     {
                        //         required: true,
                        //     },
                        // ]}
                        style={{
                            display: "inline-block",
                            width: "calc(50% - 8px)",
                            margin: "0 8px",
                        }}
                    >
                        <Input disabled />
                    </Form.Item>
                </Form.Item>

                <Form.Item
                    name="nama"
                    label="Customer Nama"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    {/* <Input onChange={onChangeNama} /> */}
                    <Search
                        placeholder="input search text"
                        onChange={onChangeNama}
                        onSearch={onSearchNama}
                        style={{
                            width: 250,
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="no_hp"
                    label="Handphone"
                // rules={[
                //     {
                //         required: true,
                //     },
                // ]}
                >
                    <Input
                        onChange={handleInputHandphoneChange}
                        style={{ width: "200px" }}
                    />
                </Form.Item>

                <Form.Item
                    hidden
                    name="alamat"
                    label="Address"
                // rules={[
                //     {
                //         required: true,
                //     },
                // ]}
                >
                    <Input placeholder="Optional" />
                </Form.Item>

                <Form.Item
                    name="items_id"
                    label="Package"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        showSearch
                        // onChange={onChangeCostCenter}
                        placeholder="---Select---"
                        // optionLabelProp="children"
                        optionFilterProp="children"
                        onChange={onChangePackage}
                        // onSearch={onSearchAkun}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        allowClear
                        // disabled={disabledCostCenter}
                        options={dataPackageDrivingNotFree?.data?.map((e) => ({
                            value: e.id,
                            label: e.name + " @" + e.hrg_jual.toLocaleString("id"),
                        }))}
                    />
                </Form.Item>

                <Form.Item 
                // hidden
                name="hrg_jual" label="Price">
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

                {/* <Form.Item
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
                </Form.Item> */}

                <Form.Item name="sales" label="sales">
                    <Select
                        showSearch
                        // onChange={onChangeCostCenter}
                        placeholder="---Select---"
                        // optionLabelProp="children"
                        optionFilterProp="children"
                        // onChange={onChangeBidangKerja}
                        // onSearch={onSearchAkun}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        allowClear
                        // disabled={disabledCostCenter}
                        options={dataSales?.data?.map((e) => ({
                            value: e.id,
                            label: e.id + " @" + e.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 1, span: 16 }}>
                    <Space>
                        <Button
                            // disabled={isDisabled}
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                        // style={{ width: 100 }}
                        >
                            Create Registrasi Number
                        </Button>
                        <Button onClick={onReset} type="text">
                            Clear
                        </Button>
                    </Space>
                </Form.Item>
            </Form>


            {/* MODAL SHOW ALL PLAYER */}
            <Modal
                onCancel={() => setIsShowModal(false)}
                open={isShowModal}
                closeIcon={false}
            >
                <TableAllRegistrasi
                    namaPlayer={namaPlayer}
                    AmbilNamaDanNoHP={getNamaDanNoHP}
                    closeModal={() => setIsShowModal(false)}
                />
            </Modal>
            {/* END MODAL SHOW ALL PLAYER */}


        </div>
    );
};

export default AddFormReservasi;
