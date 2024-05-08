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
    Tooltip,
    notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useWaktuServerData } from "../../hooks/useWaktuServer";
import dayjs from "dayjs";
import { usePostReservasiData } from "../../hooks/reservasi/useReservasiData";

import { useSalesData } from "../../hooks/useSalesData";
import { baseUrl } from "../../config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    reduxUpdateNomorBay,
    reduxUpdateNumberIdentifikasi,
} from "../../features/mydataselectedSlice";
import {
    useBayOrderByStatusData,
    useUpdateSebagianBayData,
    useUpdateStatusBayData,
} from "../../hooks/useBayData";
import { usePostRegistrasiData } from "../../hooks/registrasi/useRegistrasiData";
import ViewReservasi from "../reservasi/ViewReservasi";
import { useReservasiDrivingOrderByReservasiIdData } from "../../hooks/reservasi/useReservasiDrivingData";
import {
    usePostRegistrasiDrivingData,
    useRegistrasiDrivingOrderByRegistrasiIdData,
    useTotalJamRegistrasiDrivinRegisIdData,
    useUpdateTimeRegistrasiDrivingData,
} from "../../hooks/registrasi/useRegistrasiDrivingData";
import { useReservasiRestoOrderByReservasiIdData } from "../../hooks/reservasi/useReservasiRestoData";
import {
    usePostRegistrasiRestoData,
    useRegistrasiRestoOrderByRegistrasiIdData,
    useUpdateStatusWhereNullRegistrasiRestoData,
} from "../../hooks/registrasi/useRegistrasiRestoData";
import TabTableRegistrasi from "../../containers/pages/registrasi/TabTableRegistrasi";
import { useUpdateMatrixbayData } from "../../hooks/useMatrixbayData";
import { reduxUpdateMatrixSelected } from "../../features/mymatrixselectedSlice";
import { usePackageDrivingData } from "../../hooks/usePackageDrivingData";
import { getOnePackageDriving } from "../../features/packagedriving/onepackagedrivingSlice";
import { useSettingData } from "../../hooks/useSettingData";

// const formatNumber = (value) => new Intl.NumberFormat().format(value);
// const NumericInput = (props) => {
//     const { value, onChange } = props;
//     const handleChange = (e) => {
//         const { value: inputValue } = e.target;
//         const reg = /^-?\d*(\.\d*)?$/;
//         if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
//             onChange(inputValue);
//         }
//     };

//     // '.' at the end or only '-' in the input box.
//     const handleBlur = () => {
//         let valueTemp = value;
//         if (value.charAt(value.length - 1) === "." || value === "-") {
//             valueTemp = value.slice(0, -1);
//         }
//         onChange(valueTemp.replace(/0*(\d+)/, "$1"));
//     };
//     const title = value ? (
//         <span className="numeric-input-title">
//             {value !== "-" ? formatNumber(Number(value)) : "-"}
//         </span>
//     ) : (
//         "Input a number"
//     );
//     return (
//         <Tooltip
//             trigger={["focus"]}
//             title={title}
//             placement="topLeft"
//             overlayClassName="numeric-input"
//         >
//             <Input
//                 {...props}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Input a number"
//                 maxLength={16}
//             />
//         </Tooltip>
//     );
// };

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const formatDate = "DD/MM/YYYY";

const AddFormRegistrasiFromReservasi = () => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const dispatch = useDispatch();
    const { userid } = useSelector((state) => state.auth);
    const { numberIdentifikasi, nomorBay, qtyDriving } = useSelector(
        (state) => state.mydataselected
    );
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);
    const onePackageDrivingData = useSelector((state) => state.onepackagedriving);

    const [isLoading, setIsLoading] = useState(false);
    // const [numberReservasi, setNumberReservasi] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [isShowModal, setIsShowModal] = useState(false);
    const [isFromViewReservasi, setIsFromViewReservasi] = useState(false);
    const [myReservasiID, setMyReservasiID] = useState();
    const [isShowModalOrder, setisShowModalOrder] = useState(false);
    const [jam, setJam] = useState([]);
    const [idRegistrasi, setIdRegistrasi] = useState();
    const [namaPlayer, setNamaPlayer] = useState();
    const [value, setValue] = useState("");
    const [persenPpn, setPersenPpn] = useState(0);

    ///HOOKs
    const { data: dataSetting } = useSettingData(true);
    const { data: dataPackageDriving } = usePackageDrivingData(true);
    const { data: dataWaktuServer } = useWaktuServerData(true);
    const { data: dataBayOrderByStatus } = useBayOrderByStatusData("0", true);
    const { data: dataSales } = useSalesData(true);
    const { data: dataRegistrasiRestoOrderByRegistrasiIdData } = useRegistrasiRestoOrderByRegistrasiIdData(
        numberIdentifikasi,
        true
    );
    const {
        data: dataTotalJamDrivingOrder,
        refetch: refetchTotalJamDrivingOrder,
    } = useTotalJamRegistrasiDrivinRegisIdData(numberIdentifikasi, true);

    const { mutateAsync: mutatePostRegistrasi } = usePostRegistrasiData();
    const { mutate: mutateUpdateStatusBay } = useUpdateStatusBayData();
    const { mutateAsync: mutateUpdateStatusWhereNullRegistrasiRestoData } =
        useUpdateStatusWhereNullRegistrasiRestoData();
    const { mutateAsync: mutateUpdateSebagianBayData } =
        useUpdateSebagianBayData();
    const { mutateAsync: mutateUpdateTimeRegistrasiDrivingData } =
        useUpdateTimeRegistrasiDrivingData();
    const { mutateAsync: mutateUpdateMatrixbayData } = useUpdateMatrixbayData();

    useEffect(() => {
        ///update status kembali ke 0 jika durasinya sudah selesai
        mutateUpdateStatusBay();

        setMyReservasiID(matrixSelected.registrasi_id);

        ///isi form dari data matrix
        let matrixTime = dayjs(matrixSelected.time, "HH:mm:ss");

        form.setFieldsValue({
            time: matrixTime,
            bay: matrixSelected.bay_id,
            reservasi_id: matrixSelected.registrasi_id,
            nama:
                matrixSelected.status === "booking"
                    ? matrixSelected.namaCustomer
                    : namaPlayer,
        });
    }, [form, matrixSelected, numberIdentifikasi, myReservasiID, namaPlayer]);


    useEffect(() => {
        // console.log(onePackageDrivingData);
        if (onePackageDrivingData.data !== undefined) {
            form.setFieldsValue({
                qty_jam: onePackageDrivingData?.data[0]?.qty_jam,
                hrg_jual: onePackageDrivingData?.data[0]?.hrg_jual,
                disc_persen:onePackageDrivingData?.data[0]?.disc_persen,
            });
            rumus();            
        }        
    }, [form, onePackageDrivingData.data]);

    useEffect(() => {
        onResetPackage()
    }, [])
    


    ///buka reservasi orderan driving
    const { data: dataReservasiDrivingOrder } =
        useReservasiDrivingOrderByReservasiIdData(myReservasiID, true);
    const { mutateAsync: dataPostRegistrasiDriving } =
        usePostRegistrasiDrivingData();

    ///buka reservasi orderan driving
    const { data: dataReservasiRestoOrder } =
        useReservasiRestoOrderByReservasiIdData(myReservasiID, true);
    const { mutateAsync: dataPostRegistrasiResto } = usePostRegistrasiRestoData();

    const openNotification = (placement) => {
        api.success({
            message: `F & B Success `,
            description: "Pesanan diteruskan ke Kitchen",
            placement,
        });
    };

    const openNotificationDrivingOrder = (placement) => {
        api.success({
            message: `Driving Success `,
            description: "Waktu main sudah dimulai",
            placement,
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
        let ppnPersen = persenPpn;
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
            ppn_persen: ppnPersen,
            nilai_ppn: nPpn,
            total: total,
        });
    };

    const transanferDrivingOrder = async (registrasiNumber) => {
        await dataReservasiDrivingOrder?.data.forEach(async (item, index) => {
            let i = index + 1;
            if (`${i}`.length === 1) {
                i = `00${i}`;
            } else if (i.length === 2) {
                i = `0${i}`;
            } else {
                i = `${i}`;
            }
            let x = {
                id: registrasiNumber + "-" + i,
                registrasi_id: registrasiNumber,
                items_id: item.items_id,
                time_start:dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
                time_end:dayjs(dataWaktuServer?.waktuserver).add(item.qty_jam,"hour").format("HH:mm:ss"),
                qty_jam: item.qty_jam,
                qty: item.qty,
                hrg_jual: item.hrg_jual,
                disc_persen: item.disc_persen,
                disc_rp: item.disc_rp,
                nilai_persen: item.nilai_persen,
                nilai_disc: item.nilai_disc,
                hrg_stl_disc: item.hrg_stl_disc,
                ppn_persen: item.ppn_persen,
                nilai_ppn: item.nilai_ppn,
                total: item.total,
                status: item.status,
                user_id: userid,
                updator: userid,
            };
            await dataPostRegistrasiDriving(x);
        });
    };

    const transanferRestoOrder = async (registrasiNumber) => {
        await dataReservasiRestoOrder?.data.forEach(async (item, index) => {
            let i = index + 1;
            if (`${i}`.length === 1) {
                i = `00${i}`;
            } else if (i.length === 2) {
                i = `0${i}`;
            } else {
                i = `${i}`;
            }
            let x = {
                id: registrasiNumber + "-" + i,
                registrasi_id: registrasiNumber,
                no_meja: item.no_meja,
                items_id: item.items_id,
                qty: item.qty,
                hrg_jual: item.hrg_jual,
                disc_persen: item.disc_persen,
                nilai_disc: item.nilai_disc,
                hrg_stl_disc: item.hrg_stl_disc,
                nilai_service_charge: item.nilai_service_charge,
                nilai_pb_satu: item.nilai_pb_satu,
                total: item.total,
                status_order: item.status_order,
                user_id: userid,
                updator: userid,
            };
            await dataPostRegistrasiResto(x);
        });
    };

    const simpanRegistrasi = async (registrasiNumber, v) => {
        const data = {
            id: registrasiNumber,
            reservasi_id: v.reservasi_id,
            date: dayjs(dataWaktuServer?.waktuserver).format("YYYY-MM-DD HH:mm:ss"),
            nama: v.nama,
            no_hp: v.no_hp,
            alamat: v.alamat,
            time:  dayjs(v.time).format("HH:mm"),
            bay: v.bay,
            sales: v.sales,
            status: "0",
            user_id: userid,
            updator: userid,
        };
        await mutatePostRegistrasi(data);
    };

    const updateMatrixData = async (id) => {
        ///update data matrix
        let data = {
            namaCustomer: form.getFieldValue("nama") + ",check-in," + idRegistrasi,
        };

        await mutateUpdateMatrixbayData([id, matrixSelected.namaBay, data]);
        ///End update data matrix
    };

    const simpanData = async (v) => {
        setIsLoading(true);
        await axios
            .get(baseUrl + `/registrasi/generate`)
            .then(async (res) => {
                // console.log(res.data.data);
                let registrasiNumber = res.data.data;
                setIdRegistrasi(registrasiNumber);

                ///simpan ke redux
                dispatch(
                    reduxUpdateNumberIdentifikasi({
                        numberIdentifikasi: registrasiNumber,
                    })
                );
                dispatch(reduxUpdateNomorBay({ nomorBay: v.bay }));

                if (v.reservasi_id) {
                    ///cek apakah ada data reservasi driving order
                    await transanferDrivingOrder(registrasiNumber);

                    ///cek apakah ada data reservasi resto order
                    // console.log(dataReservasiRestoOrder);
                    if (dataReservasiRestoOrder?.success) {
                        await transanferRestoOrder(registrasiNumber);
                    }

                    await simpanRegistrasi(registrasiNumber, v);

                    ///update data matrix
                    updateMatrixData(registrasiNumber);
                } else {
                    await simpanRegistrasi(registrasiNumber, v);

                    ///update data matrix
                    updateMatrixData(registrasiNumber);
                }
                setIsDisabled(true);
                setIsLoading(false);
                setIsFromViewReservasi(false);

                ///tampilkan modal order
                setisShowModalOrder(true);
            })
            .catch((err) => console.log(err));
    };

    const onFinish = async (v) => {        
        await simpanData(v);
    };

    const onResetPackage=()=>{
        form.setFieldsValue({
            items_id:null,
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
    }

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

        setIsFromViewReservasi(false);
        setIsLoading(false);
        dispatch(reduxUpdateNumberIdentifikasi({ numberIdentifikasi: "" }));
    };

    const onClickCheck = () => {
        setIsShowModal(true);
    };

    const getRecordSelected = (record) => {
        setMyReservasiID(record.id);

        form.setFieldsValue({
            reservasi_id: record.id,
            // date : dayjs(record.date),
            nama: record.nama,
            no_hp: record.no_hp,
            alamat: record.alamat,
            time: dayjs(record.time, "HH:mm:ss"),
            bay: record.bay,
            sales: record.sales,
        });
    };

    const onChangeBay = (v) => {
        // console.log(v);
        dispatch(reduxUpdateNomorBay({ nomorBay: v }));
    };

    const updateBay = async (jmlJam) => {
        // console.log({Bay:nomorBay, regisId:numberIdentifikasi});
        //    let timeStart= dayjs(dataWaktuServer?.waktuserver);
        //    let timeEnd = dayjs(dataWaktuServer?.waktuserver).add(qtyDriving, "hour").format("HH:mm:ss")
        // let currentTime = dayjs(dataWaktuServer?.waktuserver).add(2, "minute").format("HH:mm:ss");
        let x = {
            status: "1",
            registrasi_id: numberIdentifikasi,
            jml_jam: jmlJam,
            time_start: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
            time_end: dayjs(dataWaktuServer?.waktuserver)
                .add(qtyDriving, "hour")
                .format("HH:mm:ss"),
            time_current: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
        };
        await mutateUpdateSebagianBayData([nomorBay, x]);
        // openNotificationDrivingOrder("topRight");
    };

    // const updateTimeRegistrasiDrivingOrder = async () => {
    //     let x = {
    //         time_start: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
    //         time_end: dayjs(dataWaktuServer?.waktuserver)
    //             .add(qtyDriving, "hour")
    //             .format("HH:mm:ss"),
    //     };
    //     await mutateUpdateTimeRegistrasiDrivingData([numberIdentifikasi, x]);
    // };

    const onClickProses = async () => {
        ///untuk restoran
        let data = {
            status_order: "0",
            updator: userid,
        };
        await mutateUpdateStatusWhereNullRegistrasiRestoData([
            numberIdentifikasi,
            data,
        ]);

        if (dataRegistrasiRestoOrderByRegistrasiIdData?.data?.length > 0) {
            openNotification("topRight");            
        }
        ///end utnuk restoran


        // ///update registari driving order time
        // await updateTimeRegistrasiDrivingOrder();
        setisShowModalOrder(false);

        ///cek total jam orderan driving        
        refetchTotalJamDrivingOrder();
        if (dataTotalJamDrivingOrder?.success) {
            let totaljam = dataTotalJamDrivingOrder?.data[0]?.totJam;            

            ///update data matrix
            for (let index = 0; index < totaljam; index++) {
                ///update data matrix
                let depan = matrixSelected.id.substr(0,6);
                let idRow = parseInt(matrixSelected.id.substr(6,2));
                if (idRow.toString().length < 2) {
                    // console.log({depan:depan, panjangBelakang:idRow.toString().length, hasil:depan +"0"+ (parseInt(idRow) + index)});
                    updateMatrixData(depan +"0"+ (parseInt(idRow) + index));                    
                } else {
                    // console.log({depan:depan, panjangBelakang:idRow.toString().length, hasil:depan +"0"+ (parseInt(idRow) + index)});
                    updateMatrixData(depan + (parseInt(idRow) + index));                    
                }                
            }

            ///update bay time
            await updateBay(totaljam);

        } else {
            console.log("Data total jam tidak ditemukan");
        }
    };

    const onChangeNama = (v) => {
        setNamaPlayer(v.target.value);
    };

    const onChangePackage = (v) => {        
        dispatch(getOnePackageDriving(v));
        // console.log("X");
        if (v === undefined) {
            onResetPackage();
        }

        ///cek pb1
        if (dataPackageDriving?.data[0].tax_status === "1") {
            let persenPpn = dataSetting?.data[1].persen / 100;
            setPersenPpn(persenPpn);
        } else {
            setPersenPpn(0);
        }
        rumus();
    };

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
                name="form-add-registrasi"
                onFinish={onFinish}
                initialValues={{ date: dayjs(dataWaktuServer?.waktuserver) }}
            // onClick={onChangeLocation}
            // onFieldsChange={onChangeLocation}
            // style={{
            //     maxWidth: 600,
            // }}
            >
                <Form.Item
                    // name="date"
                    label="Registrasi Number"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    style={{ padding: 0, margin: 5 }}
                >
                    <span className="font-bold">{numberIdentifikasi}</span>
                </Form.Item>

                <Form.Item label="Reservasi Number">
                    <Space.Compact>
                        <Form.Item name="reservasi_id" noStyle>
                            <Input disabled />
                        </Form.Item>
                        {/* <Form.Item noStyle>
                            <Button onClick={onClickCheck}>Check Reservasi</Button>
                        </Form.Item> */}
                    </Space.Compact>
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
                        <Select
                            disabled
                            showSearch
                            // onChange={onChangeCostCenter}
                            placeholder="---Select---"
                            // optionLabelProp="children"
                            optionFilterProp="children"
                            onChange={onChangeBay}
                            // onSearch={onSearchAkun}
                            filterOption={(input, option) =>
                                (option?.label ?? "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            allowClear
                            // disabled={disabledCostCenter}
                            options={dataBayOrderByStatus?.data?.map((e) => ({
                                value: e.id,
                                label: e.name,
                            }))}
                        />
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
                    <Input onChange={onChangeNama} />
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
                        // value={value}
                        // onChange={setValue}
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

                <Form.Item name="items_id" label="Package"
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
                        options={dataPackageDriving?.data?.map((e) => ({
                            value: e.id,
                            label: e.name,
                        }))}
                    />
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
                    name="disc_persen"
                    label="Disc %"
                    // rules={[
                    //     {
                    //         required: true,
                    //     },
                    // ]}
                >
                    <InputNumber readOnly formatter={formatter} parser={parser} style={{backgroundColor:"#F0EEEE"}}/>
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

                <Form.Item name="total" label="Price">
                    <InputNumber
                    readOnly
                        
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "120px", backgroundColor:"#ECEBEB"}}
                    />
                </Form.Item>

                

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

            {/* MODAL SHOW VIEW RESRVASI */}
            <Modal
                width={700}
                open={isShowModal}
                onCancel={() => setIsShowModal(false)}
            >
                <Card title="Reservasi Data" size="small">
                    <ViewReservasi
                        setRecordSelected={getRecordSelected}
                        closeModal={() => setIsShowModal(false)}
                        fromViewReservasi={(a) => setIsFromViewReservasi(a)}
                    />
                </Card>
            </Modal>
            {/* END MODAL */}

            {/* MODAL SHOW ORDER */}
            <Modal
                width={700}
                open={isShowModalOrder}
                onCancel={() => setisShowModalOrder(false)}
                okText="Proses"
                onOk={onClickProses}
            >
                <Card title="ORDER PACKAGE / F & B" size="small">
                    <div className="mt-1">
                        <TabTableRegistrasi
                        // closeModal={() => setisShowModalOrder(false)}
                        />
                    </div>
                </Card>
            </Modal>
            {/* END MODAL SHOW ORDER */}
        </div>
    );
};

export default AddFormRegistrasiFromReservasi;
