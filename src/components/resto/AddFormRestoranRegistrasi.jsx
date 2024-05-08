import { Badge, Button, Card, DatePicker, Form, Input, Modal, Select, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { useWaktuServerData } from '../../hooks/useWaktuServer';
import dayjs from "dayjs";
import { useSalesData } from '../../hooks/useSalesData';
import axios from 'axios';
import { baseUrl } from '../../config';
import { useDispatch, useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import PageAddRestoOrder from '../../containers/pages/matrix/PageAddRestoOrder';
import TableRegistrasiResto from '../registrasirestoorder/TableRegistrasiResto';
import { reduxUpdateMatrixSelected } from '../../features/mymatrixselectedSlice';
import { reduxUpdateNumberIdentifikasi } from '../../features/mydataselectedSlice';
import { useUpdateStatusMejaData } from '../../hooks/useMejaData';
import { usePostRegistrasiData } from '../../hooks/registrasi/useRegistrasiData';
import { useLocation } from 'react-router-dom';


const formatDate="DD/MM/YYYY";

const AddFormRestoranRegistrasi = (props) => {
    const [form] =Form.useForm();
    const dispatch = useDispatch();
    const location = useLocation();
    

    const { userid } = useSelector((state) => state.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [idRegistrasi, setIdRegistrasi] = useState();
    const [isShowModalOrderResto, setIsShowModalOrderResto] = useState(false);
    const [isShowModalKeranjang, setIsShowModalKeranjang] = useState(false);


    ///HOOKs
    const { data: dataWaktuServer } = useWaktuServerData(true);
    const { data: dataSales } = useSalesData(true);
    const {mutateAsync:mutatePostRegistrasiData} = usePostRegistrasiData();
    const {mutateAsync:mutateUpdateStatusMeja} = useUpdateStatusMejaData();

    // useEffect(() => {
    //   form.setFieldsValue({no_meja:props.noMeja})
    // }, [form, props])

    useEffect(() => {
        form.setFieldsValue({no_meja: location.state.nomorMeja})
      }, [form, location]);

    const simpanRestoRegistrasi=async(registrasiNumber, v)=>{
        let data = {
            id : registrasiNumber,
            reservasi_id : v.reservasi_id,
            no_meja : v.no_meja,
            date : dayjs(v.date).format("YYYY-MM-DD"),
            nama :v.nama,
            no_hp:v.no_hp,
            alamat:v.alamat,
            sales:v.sales,
            status:"0",
            user_id:userid,
            updator:userid,
        }
        await mutatePostRegistrasiData(data);
        setIsShowModalOrderResto(true);

    }

    const updateStatusMeja=async()=>{
        let data = {
            status:"1",
        }
        // await mutateUpdateStatusMeja([props.noMeja, data]);
        await mutateUpdateStatusMeja([location.state.nomorMeja, data]);
    }

    const onFinish=async(v)=>{
        await axios
            .get(baseUrl + `/registrasi/generate`)
            .then(async (res) => {
                let registrasiNumber = res.data.data;
                setIdRegistrasi(registrasiNumber);

                ///kirim ke redux
                dispatch(
                    reduxUpdateMatrixSelected({
                        matrixSelected: {
                            registrasi_id: registrasiNumber,
                        },
                    })
                );
                dispatch(
                    reduxUpdateNumberIdentifikasi({ numberIdentifikasi: registrasiNumber })
                );

                await simpanRestoRegistrasi(registrasiNumber, v);
                await updateStatusMeja();

            }).catch((err)=>console.log(err));
    }

    const onReset=()=>{
        form.setFieldsValue({
            reservasi_id: null,
            nama: null,
            no_hp: null,
            alamat: null,
            sales: null,
        });        
        setIsLoading(false);
    }


    const onClickKeranjang=()=>{
        setIsShowModalKeranjang(true);
    }

  return (
    <div>
        <div>
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
                name="form-resto-add-registrasi"
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
                    <span className="font-bold">{idRegistrasi}</span>
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
                    name="no_meja"
                    label="Table"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input readOnly style={{backgroundColor:"#F5F3F3"}}/>
                </Form.Item>
                

                <Form.Item
                    name="nama"
                    label="Customer Nama"
                    // rules={[
                    //     {
                    //         required: true,
                    //     },
                    // ]}
                >
                    <Input placeholder='Optional'/>
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
                    <Input placeholder='Optional'
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

                

                <Form.Item hidden name="sales" label="sales">
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
                            Buat Pesanan
                        </Button>
                        <Button onClick={onReset} type="text">
                            Clear
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>


        {/* MODAL SHOW ORDER RESTO */}
        <Modal
                width="900px"
                open={isShowModalOrderResto}
                onCancel={() => setIsShowModalOrderResto(false)}
                okText="Proses"
                footer={false}
                style={{ top: "30px" }}
                closable={false}
            // onOk={onClickProses}
            >
                <Card
                    // title={`F & B ORDER - Table ${props.noMeja}`}
                    title={`F & B ORDER - Table ${location.state.nomorMeja}`}
                    size="small"
                    styles={{
                        body: { backgroundColor: "#F8F8F8" },
                        header: { backgroundColor: "#92C7CF" },
                    }}
                    extra={
                        <div className="block md:hidden">
                        <Badge count={1} size="small" offset={[-10, 10]}>
                            <Button type="text" shape="circle" onClick={onClickKeranjang}>
                                <FaCartShopping fontSize={"24px"} />
                            </Button>
                        </Badge>
                        </div>
                    }
                >
                    <div className="mt-1">
                        <PageAddRestoOrder
                            closeModal={() => setIsShowModalOrderResto(false)}
                        />
                    </div>
                </Card>
            </Modal>
            {/* END MODAL SHOW ORDER RESTO */}


                        {/* MODAL KERANJANG */}
                        <Modal
            //  width="900px"
             open={isShowModalKeranjang}
             onCancel={() => setIsShowModalKeranjang(false)}
             okText="Proses"
             footer={false}
             style={{ top: "30px" }}
             closable={false}
            >
                <TableRegistrasiResto />
            </Modal>
            {/* END MODAL KERANJANG */}
    </div>
  )
}

export default AddFormRestoranRegistrasi