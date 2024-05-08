import {
    Button,
    Card,
    DatePicker,
    Flex,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    TimePicker,
    message,
    notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useWaktuServerData } from "../../hooks/useWaktuServer";
import dayjs from "dayjs";

import { useSalesData } from "../../hooks/useSalesData";
import { baseUrl } from "../../config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateSebagianBayData } from "../../hooks/useBayData";
import { usePostRegistrasiData } from "../../hooks/registrasi/useRegistrasiData";
import { useReservasiDrivingOrderByReservasiIdData } from "../../hooks/reservasi/useReservasiDrivingData";
import { usePostRegistrasiDrivingData } from "../../hooks/registrasi/useRegistrasiDrivingData";
import { useReservasiRestoOrderByReservasiIdData } from "../../hooks/reservasi/useReservasiRestoData";
import { usePostRegistrasiRestoData } from "../../hooks/registrasi/useRegistrasiRestoData";
import TabTableRegistrasi from "../../containers/pages/registrasi/TabTableRegistrasi";
import { useUpdateMatrixbayData } from "../../hooks/useMatrixbayData";
import {
    usePackageDrivingData,
    usePackageDrivingNotFreeData,
} from "../../hooks/usePackageDrivingData";
import { getOnePackageDriving } from "../../features/packagedriving/onepackagedrivingSlice";
import { useSettingData } from "../../hooks/useSettingData";
import TableReservasiResto from "../reservasirestoorder/TableReservasiResto";
import {
    useOneReservasiData,
    useReservasiData,
} from "../../hooks/reservasi/useReservasiData";
import TableAllRegistrasi from "./TableAllRegistrasi";
import ViewPackageDriving from "../packagedriving/ViewPackageDriving";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const formatDate = "DD/MM/YYYY";

const { Search } = Input;

const { Option } = Select;

const AddFormRegistrasi = (props) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    // const [api ] = notification.useNotification();

    const dispatch = useDispatch();
    const { userid } = useSelector((state) => state.auth);
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);
    const onePackageDrivingData = useSelector((state) => state.onepackagedriving);

    const [isLoading, setIsLoading] = useState(false);

    const [kodepackage, setKodePackage] = useState();
    const [myReservasiID, setMyReservasiID] = useState();
    const [idRegistrasi, setIdRegistrasi] = useState();
    const [namaPlayer, setNamaPlayer] = useState();
    const [persenPpn, setPersenPpn] = useState(0);
    const [isShowModal, setIsShowModal] = useState(false);
    const [isShowModalPackage, setIsShowModalPackage] = useState(false);

    ///HOOKs
    const { data: dataSetting } = useSettingData(true);
    const { data: dataPackageDrivingNotFree } =
        usePackageDrivingNotFreeData(true);
    const { data: dataWaktuServer } = useWaktuServerData(true);
    const { data: dataSales } = useSalesData(true);
    const { data: dataReservasiDrivingOrderByReservasiId } =
        useReservasiDrivingOrderByReservasiIdData(
            matrixSelected.registrasi_id,
            true
        );
    const { data: dataOneReservasi } = useOneReservasiData(
        matrixSelected.registrasi_id,
        true
    );
    const { data: dataReservasiRestoOrder } =
        useReservasiRestoOrderByReservasiIdData(matrixSelected.registrasi_id, true);

    const { mutateAsync: mutatePostRegistrasi } = usePostRegistrasiData();
    // const { mutateAsync: mutateUpdateStatusWhereNullRegistrasiRestoData } =
    //     useUpdateStatusWhereNullRegistrasiRestoData();
    const { mutateAsync: mutateUpdateSebagianBayData } =
        useUpdateSebagianBayData();
    // const { mutateAsync: mutateUpdateTimeRegistrasiDrivingData } =
    //     useUpdateTimeRegistrasiDrivingData();
    const { mutateAsync: mutateUpdateMatrixbayData } = useUpdateMatrixbayData();
    const { mutateAsync: mutatePostRegistrasiDriving } =
        usePostRegistrasiDrivingData();
    const { mutateAsync: dataPostRegistrasiResto } = usePostRegistrasiRestoData();

    useEffect(() => {
        // ///update status kembali ke 0 jika durasinya sudah selesai
        // mutateUpdateStatusBay();

        setMyReservasiID(matrixSelected.registrasi_id);

        ///isi form dari data matrix
        let matrixTime = dayjs(matrixSelected.time, "HH:mm:ss");

        let itemsID =
            matrixSelected.status === "booking"
                ? dataReservasiDrivingOrderByReservasiId?.data[0]?.items_id
                : null;

        form.setFieldsValue({
            time: matrixTime,
            bay: matrixSelected.bay_id,
            registrasi_id: matrixSelected.registrasi_id,
            reservasi_id: matrixSelected.registrasi_id,
            nama:
                matrixSelected.status === "booking"
                    ? matrixSelected.namaCustomer
                    : namaPlayer,
            items_id: itemsID,
            no_hp:
                matrixSelected.status === "booking"
                    ? dataOneReservasi?.data[0]?.no_hp
                    : null,
            sales:
                matrixSelected.status === "booking"
                    ? dataOneReservasi?.data[0]?.sales
                    : null,
        });

        if (matrixSelected.status === "booking") {
            onChangePackage(itemsID);
        }
    }, [form, matrixSelected, idRegistrasi, myReservasiID, namaPlayer]);

    useEffect(() => {
        // // console.log(onePackageDrivingData);
        //  ///utk itemsID
        //  if (matrixSelected.registrasi_id !== undefined) {
        //     ///utk data packate driving
        //     if (dataReservasiDrivingOrderByReservasiId) {
        //         let itemsID =
        //             matrixSelected.status === "booking"
        //                 ? dataReservasiDrivingOrderByReservasiId?.data[0]?.items_id
        //                 : null;
        //         form.setFieldsValue({
        //             items_id: itemsID,
        //         });
        //         dispatch(getOnePackageDriving(itemsID));

        //         if (matrixSelected.status === "booking") {
        //             onChangePackage(itemsID);
        //         }
        //     }
        // }

        if (onePackageDrivingData.data !== undefined) {
            form.setFieldsValue({
                qty_jam: onePackageDrivingData?.data[0]?.qty_jam,
                hrg_jual: onePackageDrivingData?.data[0]?.hrg_jual,
                disc_persen: onePackageDrivingData?.data[0]?.disc_persen,
            });
            rumus();
        }
    }, [form, onePackageDrivingData]);

    useEffect(() => {
        onResetPackage();
    }, []);

    // const openNotification = (placement) => {
    //     api.info({
    //         message: `Notification ${placement}`,
    //         description: "Pesanan segera diproses",
    //         placement,
    //     });
    // };

    const successMessage = (type, message) => {
        messageApi.open({
            type: type,
            content: message,
        });
    };

    const rumus = () => {
        // ///cek ppn, srvChg
        // ///rumusnya
        // let qty = form.getFieldValue("qty");
        // let hpp = form.getFieldValue("hrg_jual");
        // let discPersen = form.getFieldValue("disc_persen");
        // let discRp = form.getFieldValue("disc_rp");
        // let nDisc = form.getFieldValue("nilai_disc");
        // let ppnPersen = persenPpn;
        // if (discPersen > 0) {
        //     nDisc = hpp * (discPersen / 100);
        // } else if (discRp > 0) {
        //     nDisc = discRp;
        // } else {
        //     nDisc = 0;
        // }
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

    const simpanOrderanDriving = async (registrasiNumber, v) => {
        ///1. generate number reservasi resto order
        await axios
            .get(
                baseUrl +
                `/transaksi-driving/generate?registrasi_id=${registrasiNumber}`
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
                    registrasi_id: registrasiNumber,
                    items_id: v.items_id,
                    time_start: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
                    time_end: dayjs(dataWaktuServer?.waktuserver)
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
                await mutatePostRegistrasiDriving(data);
                successMessage("success", "Saving data success");
            })
            .catch((err) => console.log(err));
    };

    const transanferRestoOrder = async (registrasiNumber) => {
        console.log(dataReservasiRestoOrder?.data);
        if (dataReservasiRestoOrder?.data !== undefined) {
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
                    disc_rp: item.disc_rp,
                    nilai_persen: item.nilai_persen,
                    nilai_disc: item.nilai_disc,
                    hrg_stl_disc: item.hrg_stl_disc,
                    service_charge_persen: item.service_charge_persen,
                    nilai_service_charge: item.nilai_service_charge,
                    pb_satu_persen: item.pb_satu_persen,
                    nilai_pb_satu: item.nilai_pb_satu,
                    total: item.total,
                    // status_order: item.status_order,
                    status_order: item.status_order,
                    remark: item.remark,
                    user_id: userid,
                    updator: userid,
                };
                await dataPostRegistrasiResto(x);
            });
            // openNotification("topRight");
            successMessage("success", "F&B, Pesanan segera diproses");
        }
    };

    const simpanRegistrasi = async (registrasiNumber, v) => {
        const data = {
            id: registrasiNumber,
            reservasi_id: v.reservasi_id,
            date: dayjs(dataWaktuServer?.waktuserver).format("YYYY-MM-DD HH:mm:ss"),
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
        await mutatePostRegistrasi(data);
    };

    const updateMatrixData = async (registrasiNumber, idMatrix) => {
        ///update data matrix
        let data = {
            namaCustomer:
                form.getFieldValue("nama") + ",check-in," + registrasiNumber,
        };
        // console.log({ id: idMatrix, bay: matrixSelected.namaBay, data: data });

        await mutateUpdateMatrixbayData([idMatrix, matrixSelected.namaBay, data]);
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

                // ///simpan ke redux
                // dispatch(
                //     reduxUpdateidRegistrasi({
                //         idRegistrasi: registrasiNumber,
                //     })
                // );
                // dispatch(reduxUpdateNomorBay({ nomorBay: v.bay }));

                await simpanRegistrasi(registrasiNumber, v);
                await simpanOrderanDriving(registrasiNumber, v);
                if (matrixSelected.status === "booking") {
                    console.log("booking resto didapat, transfer ke resto");
                    await transanferRestoOrder(registrasiNumber);
                }

                ///update data matrix
                let totaljam = form.getFieldValue("qty_jam");
                console.log({ totaljam: totaljam });
                for (let index = 0; index < totaljam; index++) {
                    // ///update data matrix
                    let depan = matrixSelected.id.substr(0, 6);
                    let idRow = parseInt(matrixSelected.id.substr(6, 2));
                    let nomorUrut = idRow + index;
                    // console.log({nomorUrut:nomorUrut, p : nomorUrut.toString().length});
                    if (nomorUrut.toString().length < 2) {
                        updateMatrixData(registrasiNumber, depan + "0" + nomorUrut);
                    } else {
                        // console.log(idRow.toString().length);
                        updateMatrixData(registrasiNumber, depan + nomorUrut);
                    }
                }
                ///update bay time
                await updateBay(registrasiNumber, v.bay, totaljam);

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
        setIdRegistrasi(null);
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
        setKodePackage(null);
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

    // const getRecordSelected = (record) => {
    //     setMyReservasiID(record.id);

    //     form.setFieldsValue({
    //         reservasi_id: record.id,
    //         // date : dayjs(record.date),
    //         nama: record.nama,
    //         no_hp: record.no_hp,
    //         alamat: record.alamat,
    //         time: dayjs(record.time, "HH:mm:ss"),
    //         bay: record.bay,
    //         sales: record.sales,
    //     });
    // };

    const updateBay = async (registrasiNumber, nomorBay, jmlJam) => {
        let x = {
            status: "1",
            registrasi_id: registrasiNumber,
            jml_jam: jmlJam * 3600,
            time_start: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
            // time_end: dayjs(dataWaktuServer?.waktuserver)
            //     .add(jmlJam, "hour")
            //     .format("HH:mm:ss"),
            // time_current: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
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
    //     await mutateUpdateTimeRegistrasiDrivingData([idRegistrasi, x]);
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

        // ///cek pb1
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

    const getNamaDanNoHP = (nama, no_hp) => {
        form.setFieldsValue({ nama: nama, no_hp: no_hp });       
        setNamaPlayer(nama); 
    };

    const onClickSearchPackage = () => {
        setIsShowModalPackage(true);
    };

    const getDataPackage = (idpackage, hrgjual) => {
        dispatch(getOnePackageDriving(idpackage));
        setKodePackage(idpackage);
        form.setFieldsValue({ items_id: idpackage, hrg_jual: hrgjual });
        // onChangePackage(idpackage);
        // console.log(idpackage);
    };

    const handleInputHandphoneChange = (event) => {
        // Memastikan bahwa input hanya berupa angka telepon
        const value = event.target.value.replace(/\D/g, "");
        // console.log(value); // Cetak nilai input di konsol
        form.setFieldsValue({ no_hp: value });
    };



    return (
        <div>
            {contextHolder}
            {matrixSelected.status === "booking" ? (
                <div className="mb-5">
                    <Card
                        title="F&B Order"
                        size="small"
                        styles={{ header: { backgroundColor: "#F8F6F4" } }}
                    >
                        <TableReservasiResto />
                    </Card>
                </div>
            ) : null}

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
                initialValues={{
                    date: dayjs(dataWaktuServer?.waktuserver),
                    qty: 1,
                    nilai_disc: 0,
                    hrg_stl_disc: 0,
                    ppn_persen: 0,
                    nilai_ppn: 0,
                    total: 0,
                }}
            // onClick={onChangeLocation}
            // onFieldsChange={onChangeLocation}
            // style={{
            //     maxWidth: 600,
            // }}
            >
                <Flex>
                    <div>
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
                            <span className="font-bold">{idRegistrasi}</span>
                        </Form.Item>
                    </div>
                    {/* <div>
                        <Form.Item>
                            <Button>From Resto</Button>
                        </Form.Item>
                    </div> */}
                </Flex>

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

                <Form.Item hidden name="hrg_jual" label="Price">
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

                <Form.Item
                    hidden
                    name="total" label="Total">
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
                            style={{ width: 100 }}
                        >
                            Save
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

            {/* MODAL SHOW ALL PACKAGE */}
            <Modal
                onCancel={() => setIsShowModalPackage(false)}
                open={isShowModalPackage}
                closeIcon={false}
                footer={false}
            >
                <ViewPackageDriving
                    ambilDataPackageDrivingNotFree={getDataPackage}
                    closeModal={() => setIsShowModalPackage(false)}
                />
            </Modal>
            {/* END MODAL SHOW ALL PACKAGE */}
        </div>
    );
};

export default AddFormRegistrasi;
