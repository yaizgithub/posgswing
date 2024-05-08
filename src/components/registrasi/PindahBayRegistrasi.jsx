import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Skeleton,
    Space,
    TimePicker,
    message,
} from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { usePackageDrivingData } from "../../hooks/usePackageDrivingData";
import { useSalesData } from "../../hooks/useSalesData";
import { useDispatch, useSelector } from "react-redux";
import { useOneRegistrasiData, useUpdateRegistrasiData } from "../../hooks/registrasi/useRegistrasiData";
import { useRegistrasiDrivingOrderByRegistrasiIdData, useUpdateRegistrasiDrivingData } from "../../hooks/registrasi/useRegistrasiDrivingData";
import { useBayOrderByStatusData, useUpdateSebagianBayData, useUpdateStatusBayData } from "../../hooks/useBayData";
import axios from "axios";
import { baseUrl } from "../../config";
import { useUpdateMatrixbayData, useUpdatePindahBayMatrixbayData } from "../../hooks/useMatrixbayData";
import { useWaktuServerData } from "../../hooks/useWaktuServer";
import { getOnePackageDriving } from "../../features/packagedriving/onepackagedrivingSlice";
import { reduxUpdateBayAwal } from "../../features/mybayawalSlice";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const formatDate = "DD/MM/YYYY";
const { Search } = Input;

const PindahBayRegistrasi = (props) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const dispatch = useDispatch();

    const { matrixSelected } = useSelector((state) => state.mymatrixselected);
    const onePackageDrivingData = useSelector((state) => state.onepackagedriving);
    const { userid } = useSelector((state) => state.auth);

    const [namaPlayer, setNamaPlayer] = useState();
    const [isShowModal, setIsShowModal] = useState();
    const [kodepackage, setKodePackage] = useState();
    const [isShowModalPackage, setIsShowModalPackage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    ///HOOKs
    const { data: dataWaktuServer } = useWaktuServerData(true);
    const { data: dataPackageDriving } = usePackageDrivingData(true);
    const { data: dataSales } = useSalesData(true);
    const { data: dataRegistrasiDrivingOrderByRegistrasiId } =
        useRegistrasiDrivingOrderByRegistrasiIdData(
            matrixSelected.registrasi_id,
            true
        );
    const {
        data: dataOneRegistrasi,
        isLoading: isLoadingOneRegistrasi,
        isError,
        error,
    } = useOneRegistrasiData(matrixSelected.registrasi_id, true);
    const { data: dataBayOrderByStatus } = useBayOrderByStatusData("0", true);

    const { mutateAsync: mutateUpdateRegistrasi } = useUpdateRegistrasiData();
    const { mutateAsync: mutateUpdateSebagianBayData } =
        useUpdateSebagianBayData();
    const { mutateAsync: mutateUpdateMatrixbayData } = useUpdateMatrixbayData();
    const { mutateAsync: mutateUpdatePindahBayMatrixbay } = useUpdatePindahBayMatrixbayData();
    const { mutateAsync: mutateUpdateRegistrasiDriving } =
        useUpdateRegistrasiDrivingData();
    // const {mutateAsync: mutateUpdateStatusBay} = useUpdateStatusBayData(matrixSelected.registrasi_id, true);


    useEffect(() => {
        if (matrixSelected.registrasi_id !== undefined) {
            ///utk data packate driving
            if (dataRegistrasiDrivingOrderByRegistrasiId) {
                let idpackage = dataRegistrasiDrivingOrderByRegistrasiId?.data[0].items_id;
                form.setFieldsValue({
                    items_id: idpackage,
                });
                dispatch(getOnePackageDriving(idpackage));
            }

            ///utk data registrasi
            if (dataOneRegistrasi) {

                form.setFieldsValue({
                    registrasi_id: matrixSelected.registrasi_id,
                    date: dayjs(dataOneRegistrasi?.data[0].date),
                    time: dayjs(dataOneRegistrasi?.data[0].time, "HH:mm"),
                    bay: dataOneRegistrasi?.data[0].bay,
                    nama: dataOneRegistrasi?.data[0].nama,
                    no_hp: dataOneRegistrasi?.data[0].no_hp,
                    sales: dataOneRegistrasi?.data[0].sales,
                });
            }
        }
    }, [form, matrixSelected.registrasi_id, dataOneRegistrasi, dataRegistrasiDrivingOrderByRegistrasiId]);

    useEffect(() => {
        console.log(onePackageDrivingData);
        if (onePackageDrivingData.data !== undefined) {
            form.setFieldsValue({
                qty_jam: onePackageDrivingData?.data[0]?.qty_jam,
                hrg_jual: onePackageDrivingData?.data[0]?.hrg_jual,
            });
        }
    }, [form, onePackageDrivingData]);

    if (isLoadingOneRegistrasi) {
        return (
            <div>
                <Skeleton active />
            </div>
        );
    }

    if (isError) {
        console.log(error.message);
        return (
            <div>
                <div className="text-red-600 mb-2">{error.message}</div>
                <Skeleton active />
            </div>
        );
    }

    const successMessage = (type, message) => {
        messageApi.open({
            type: type,
            content: message,
        });
    };

    const updateRegistrasi = async (registrasiNumber, v) => {
        const data = {
            id: registrasiNumber,
            reservasi_id: v.reservasi_id,
            date: dayjs(v.date).format("YYYY-MM-DD HH:mm:ss"),
            nama: v.nama,
            no_hp: v.no_hp,
            alamat: v.alamat,
            time: dayjs(v.time).format("HH:mm"),
            bay: v.bay,
            sales: v.sales,
            // status: "0",            
            updator: userid,
        };
        await mutateUpdateRegistrasi([matrixSelected.registrasi_id, data]);
        setIsLoading(false);
    };

    const updateOrderanDriving = async (registrasiNumber, v) => {
        let data = {
            registrasi_id: registrasiNumber,
            items_id: v.items_id,
            // time_start: dayjs(v.date).format("HH:mm:ss"),
            // time_end: dayjs(v.date)
            //     .add(v.qty_jam, "hour")
            //     .format("HH:mm:ss"),
            qty_jam: v.qty_jam,
            qty: v.qty,
            hrg_jual: v.hrg_jual,
            disc_persen: 0,
            disc_rp: 0,
            nilai_persen: 0,
            nilai_disc: 0,
            hrg_stl_disc: 0,
            ppn_persen: 0,
            nilai_ppn: 0,
            total: 0,
            // status: "0",            
            updator: userid,
        };
        await mutateUpdateRegistrasiDriving([registrasiNumber + '-001', data]);
        successMessage("success", "Update data success");
    };

    const updateMatrixData = async (registrasiNumber, idMatrix) => {
        let data = {
            namaCustomer:form.getFieldValue("nama") + ",check-in," + registrasiNumber,
        };
        // console.log({ id: idMatrix, bay: matrixSelected.namaBay, data: data });
        await mutateUpdateMatrixbayData([idMatrix, matrixSelected.namaBay, data]);
    };

    const updatePindahBayMatrixData = async (registrasiNumber,idMatrix) => {
        ///1. pindahkan data matrixbay ke matrixbay yang dituju
        let namabay = 'bay' + form.getFieldValue("bay");
        if (matrixSelected.status === 'check-in') {
            let data = {
                namaCustomer:form.getFieldValue("nama") + ",check-in," + registrasiNumber,
            };        
            await mutateUpdateMatrixbayData([idMatrix, namabay, data]);            
        } else if (matrixSelected.status === 'play') {
            let data = {
                namaCustomer:form.getFieldValue("nama") + ",play," + registrasiNumber,
            };        
            await mutateUpdateMatrixbayData([idMatrix, namabay, data]);            
        }
        
        ///2. bersihkan matrixbay sebelumnya
        let dataB = {
            namaCustomer: "",
            registrasi_id:registrasiNumber,
        };
        await mutateUpdatePindahBayMatrixbay([matrixSelected.namaBay, dataB]);
    };


    // const updateCountDownBayDiDatabase=(seconds)=>{
    //     axios.put(baseUrl+`/bay/edit-countdown/${props.id}`, {countdown:seconds});
    // }

    const updateSebagianBayStatusPindahBay = async (registrasiNumber, nomorBay, jmlJam) => {
        let x = {
            status: "1",
            registrasi_id: registrasiNumber,
            jml_jam: jmlJam,
            status_pindah_bay:"1",            
            // time_start: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
            // time_end: dayjs(dataWaktuServer?.waktuserver)
            //     .add(jmlJam, "hour")
            //     .format("HH:mm:ss"),
            // time_current: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
        };
        await mutateUpdateSebagianBayData([nomorBay, x]);
        // openNotificationDrivingOrder("topRight");
    };

    const updateBay = async (registrasiNumber, nomorBay, jmlJam) => {
        let x = {
            status: "1",
            registrasi_id: registrasiNumber,
            jml_jam: jmlJam,     
            status_pindah_bay:null,       
            // time_start: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
            // time_end: dayjs(dataWaktuServer?.waktuserver)
            //     .add(jmlJam, "hour")
            //     .format("HH:mm:ss"),
            // time_current: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
        };
        await mutateUpdateSebagianBayData([nomorBay, x]);
        // openNotificationDrivingOrder("topRight");
    };

    const clearOneBay = async (bayid) => {
        await axios.put(baseUrl+`/bay/edit-oneclear/${bayid}`)
        .then((res)=>{
            console.log("berhasil clear one bay");
        }).catch((err)=>console.log(err));
    };


    const onFinish = async (v) => {
        setIsLoading(true);
        await updateRegistrasi(matrixSelected.registrasi_id, v);
        
        ///ambil bay awal dan simpan ke tbl_bay_awal
        let dataX = {
            bay_awal:matrixSelected.bay_id,
        }
        await axios.put(baseUrl+`/bayawal/edit/1`, dataX)
        .then(()=>console.log('Update tbl_bay_awal berhasil'))
        .catch((err)=>console.log(err));


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
                // updateMatrixData(matrixSelected.registrasi_id, depan + "0" + nomorUrut);

                // ///jika pindah bay    
                // console.log({
                //     bay_awal:matrixSelected.bay_id,
                //     bay_akhir:parseInt(form.getFieldValue("bay"))
                // });            
                if (matrixSelected.bay_id !== parseInt(form.getFieldValue("bay"))) {
                    updatePindahBayMatrixData(matrixSelected.registrasi_id, depan + "0" + nomorUrut);
                }
            } else {                
                // updateMatrixData(matrixSelected.registrasi_id, depan + nomorUrut);

                ///jika pindah bay
                if (matrixSelected.bay_id !== parseInt(form.getFieldValue("bay"))) {
                    updatePindahBayMatrixData(matrixSelected.registrasi_id, depan + nomorUrut);
                }
            }
        }
        ///update bay time        
        if (matrixSelected.bay_id !== parseInt(form.getFieldValue("bay"))) {
            ///jika pindah bay
            await updateSebagianBayStatusPindahBay(matrixSelected.registrasi_id, v.bay, totaljam);
            await clearOneBay(matrixSelected.bay_id);
        } else {
            await updateBay(matrixSelected.registrasi_id, v.bay, totaljam);
        }

        setIsLoading(false);
        props.closeModal();
    };

    const onChangePackage = (v) => {
        dispatch(getOnePackageDriving(v));
    }

    const onChangeNama = (v) => {
        setNamaPlayer(v.target.value);
    };

    const onSearchNama = (v) => {
        setNamaPlayer(v);
        setIsShowModal(true);
    };

    const onClickSearchPackage = () => {
        setIsShowModalPackage(true);
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
                name="form-pindah-bay"
                onFinish={onFinish}
                initialValues={{
                    date: dayjs(dataWaktuServer?.waktuserver),
                    qty: 1,
                    // nilai_disc: 0,
                    // hrg_stl_disc: 0,
                    // ppn_persen: 0,
                    // nilai_ppn: 0,
                    // total: 0, 
                }}
                // onClick={onChangeLocation}
                // onFieldsChange={onChangeLocation}
                style={{
                    maxWidth: 600,
                }}
            >
                <Form.Item 
                hidden
                label="Number">
                    <Space.Compact>
                        <Form.Item name="registrasi_id" noStyle>
                            <Input disabled />
                        </Form.Item>
                        {/* <Form.Item noStyle>
                            <Button onClick={onClickCheck}>Check Reservasi</Button>
                        </Form.Item> */}
                    </Space.Compact>
                </Form.Item>

                <Form.Item
                hidden
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
                    name="nama"
                    label="Customer Nama"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    {/* <Search onChange={onChangeNama} /> */}
                    <Search
                        readOnly
                        placeholder="input search text"
                        onChange={onChangeNama}
                        onSearch={onSearchNama}
                        style={{
                            width: 250,
                            // backgroundColor:"#E9E6E6"
                        }}
                        styles={{input:{backgroundColor:"#E2E0E0"}}}
                    />
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
                            showSearch
                            // onChange={onChangeCostCenter}
                            placeholder="---Select---"
                            // optionLabelProp="children"
                            optionFilterProp="children"
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
                                label: e.id,
                                // label: (<div className="flex justify-between">
                                //     <div>{e.name}</div>
                                //     <div>{e.hrg_jual.toLocaleString()}</div>
                                // </div>),
                            }))}
                        />
                    </Form.Item>
                </Form.Item>

                

                <Form.Item
                hidden
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

                <Form.Item
                hidden
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
                        options={dataPackageDriving?.data?.map((e) => ({
                            value: e.id,
                            label: e.name + " @" + e.hrg_jual.toLocaleString("id"),
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    hidden 
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

                <Form.Item hidden name="total" label="Total">
                    <InputNumber
                        readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "120px", backgroundColor: "#ECEBEB" }}
                    />
                </Form.Item> */}

                <Form.Item 
                hidden
                name="sales" label="sales">
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
                            Update
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default PindahBayRegistrasi;
