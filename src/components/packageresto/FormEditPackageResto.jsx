import {
    Button,
    Checkbox,
    Divider,
    Form,
    Image,
    Input,
    InputNumber,
    Select,
    Space,
    message,
} from "antd";
import React, { useEffect, useState } from "react";
import { usePostPackageRestoData, useUpdateImagePackageRestoData, useUpdatePackageRestoData } from "../../hooks/usePackageRestoData";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../config";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const arrayKategori = [
    {
        label: "Food",
        value: "F",
    },
    {
        label: "Beverage",
        value: "B",
    },
];

const arrayClassMenu = [
    {
        label: "Noodles",
        value: "noodles",
    },
    {
        label: "Rice",
        value: "rice",
    },
    {
        label: "Vegetables",
        value: "vegetables",
    },
    {
        label: "Fish",
        value: "fish",
    },
    {
        label: "Hot",
        value: "hot",
    },
    {
        label: "Ice",
        value: "ice",
    },
];

const FormEditPackageResto = (props) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const { userid } = useSelector((state) => state.auth);
    const { dataSelected } = useSelector((state) => state.mydataselected);

    const [myImage, setMyImage] = useState("https://fakeimg.pl/150x100/");
    const [saveImage, setSaveImage] = useState(null);

    const [isLoading, setisLoading] = useState(false);
    const [isCheked, setisCheked] = useState(false);
    const [isChekedService, setisChekedService] = useState(false);

    useEffect(() => {        
        setisCheked(dataSelected.tax_status === "1" ? true : false);
        setisChekedService(dataSelected.service_charge_status === "1" ? true : false);
        form.setFieldsValue({
            categori_menu: dataSelected.categori_menu,
            class_menu: dataSelected.class_menu,
            target_printer: dataSelected.target_printer,
            id: dataSelected.id,
            name: dataSelected.name,
            hrg_jual: dataSelected.hrg_jual,
            disc_persen: dataSelected.disc_persen,
            disc_rp: dataSelected.disc_rp,
            nilai_disc: dataSelected.nilai_disc,
            hrg_stl_disc: dataSelected.hrg_stl_disc,                        
            service_charge_persen: dataSelected.service_charge_persen,
            nilai_service_charge: dataSelected.nilai_service_charge,
            pb_satu_persen: dataSelected.pb_satu_persen,
            nilai_pb_satu: dataSelected.nilai_pb_satu,
            total: dataSelected.total,            
        });
        setMyImage(dataSelected.image ?? "https://fakeimg.pl/150x100/")
    }, [form, dataSelected]);

    ///HOOKs
    const { mutateAsync: mutateUpdatePackageRestoData } = useUpdatePackageRestoData();
    const { mutateAsync: mutateUpdateImagePackageRestoData } = useUpdateImagePackageRestoData();

    const successMessage = (type, message) => {
        messageApi.open({
          type: type,
          content: message,
        });
      };    

    // const rumus = () => {
    //     ///rumusnya
    //     let hpp = form.getFieldValue("hrg_jual");
    //     let discPersen = form.getFieldValue("disc_persen");
    //     let discRp = form.getFieldValue("disc_rp");
    //     let srvChgPersen = form.getFieldValue("service_charge_persen");
    //     let pb1Persen = form.getFieldValue("pb_satu_persen");
    //     let nDisc = 0;
    //     if (discPersen > 0) {
    //         nDisc = hpp * (discPersen / 100);
    //     } else {
    //         nDisc = discRp;
    //     }
    //     let priceAf = hpp - nDisc;
    //     let jumlah = priceAf; //priceAf * qty
    //     let nSrvChg = jumlah * (srvChgPersen / 100);
    //     let nPb1 = (jumlah + nSrvChg) * (pb1Persen / 100);
    //     let total = jumlah + nSrvChg + nPb1;

    //     form.setFieldsValue({
    //         nilai_disc: nDisc,
    //         hrg_stl_disc: priceAf,
    //         service_charge_persen: srvChgPersen,
    //         nilai_service_charge: nSrvChg,
    //         pb_satu_persen: pb1Persen,
    //         nilai_pb_satu: nPb1,
    //         total: total,
    //     });
    // };

    const onFinish = async (v) => {
        setisLoading(true);
        let data = {
            // id: v.id,
            name: v.name,
            hrg_jual: v.hrg_jual,
            // disc_persen: v.disc_persen,
            // disc_rp: v.disc_rp,
            // nilai_disc: v.nilai_disc,
            // hrg_stl_disc: v.hrg_stl_disc,
            // service_charge_persen: v.service_charge_persen,
            // nilai_service_charge: v.nilai_service_charge,
            // pb_satu_persen: v.pb_satu_persen,
            // nilai_pb_satu: v.nilai_pb_satu,
            // total: v.total,
            tax_status: isCheked,
            service_charge_status: isChekedService,
            categori_menu: v.categori_menu,            
            class_menu: v.class_menu,      
            target_printer:v.target_printer,      
            updator: userid,
        };
        await mutateUpdatePackageRestoData([dataSelected.id,data]);
        setisLoading(false);
        props.closeModal();
        successMessage('success','Updated data success');
    };

    const onReset = () => {
        form.setFieldsValue({
            id: null,
            name: null,
            hrg_jual: 0,
            nilai_disc: 0,
            hrg_stl_disc: 0,
            // service_charge_persen: 0,
            // nilai_service_charge: 0,
            // pb_satu_persen: 0,
            // nilai_pb_satu: 0,
            // total: 0,
        });
        setisLoading(false);
    };

    // const onChangeForm = () => {
    //     rumus();
    // };


    const onChangeTax = (v) => {
        // // console.log(v.target.checked);
        // if (v.target.checked) {
        //     form.setFieldsValue({ pb_satu_persen: 10 });
        // } else {
        //     form.setFieldsValue({ pb_satu_persen: 0 });
        // }
        setisCheked(v.target.checked);
    };
    const onChangeSrvChg = (v) => {
        // // console.log(v.target.checked);
        // if (v.target.checked) {
        //     form.setFieldsValue({ pb_satu_persen: 10 });
        // } else {
        //     form.setFieldsValue({ pb_satu_persen: 0 });
        // }
        setisChekedService(v.target.checked);
    };


    const handleFile = (e) => {
        // console.log(e.target.files[0]);
        let uploaded = e.target.files[0];
        // console.log(URL.createObjectURL(uploaded));
        setMyImage(URL.createObjectURL(uploaded));
        setSaveImage(uploaded);
    }

    const onClickUpload = async() => {
        if (!saveImage) {
            successMessage('error','Select image..!');
        } else {
            const formData = new FormData();
            formData.append("image", saveImage);
            await axios.post(baseUrl + `/upload`, formData)
                .then(async(res) => {
                    // console.log(res.data);
                    let imageName = res.data.image;
                    let data={
                        image:imageName
                    }
                    await mutateUpdateImagePackageRestoData([dataSelected.id,data]);
                    successMessage('success','Success upload image');
                    setSaveImage(null);
                    setMyImage("https://fakeimg.pl/150x100/");
                    props.closeModal();
                }).catch((err) => {console.log(err);
                    successMessage('error','Something error..!');});
        }
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
                name="form-edit-packageresto"
                onFinish={onFinish}
                // initialValues={{
                //     hrg_jual: 0,
                //     disc_persen: 0,
                //     disc_rp: 0,
                //     nilai_disc: 0,
                //     hrg_stl_disc: 0,
                //     service_charge_persen: 0,
                //     nilai_service_charge: 0,
                //     pb_satu_persen: 0,
                //     nilai_pb_satu: 0,
                //     total: 0,
                // }}
                // onChange={onChangeForm}
            // onClick={onChangeLocation}
            // onFieldsChange={onChangeLocation}
            // style={{
            //     maxWidth: 600,
            // }}
            >
                <Form.Item
                    name="categori_menu"
                    label="Category"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        showSearch
                        // onChange={onChangeCostCenter}
                        // placeholder="Optional"
                        // optionLabelProp="children"
                        optionFilterProp="children"
                        // onSearch={onSearchAkun}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        allowClear
                        // disabled={disabledCostCenter}
                        options={arrayKategori.map((e) => ({
                            value: e.value,
                            label: e.label,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="class_menu"
                    label="Class"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        showSearch
                        // onChange={onChangeCostCenter}
                        // placeholder="Optional"
                        // optionLabelProp="children"
                        optionFilterProp="children"
                        // onSearch={onSearchAkun}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        allowClear
                        // disabled={disabledCostCenter}
                        options={arrayClassMenu.map((e) => ({
                            value: e.value,
                            label: e.label,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="id"
                    label="Code"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input disabled style={{ width: "120px" }} />
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Item Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input style={{ width: "80%" }} />
                </Form.Item>

                <Form.Item                    
                    label="Price"
                    style={{
                        marginBottom: 0,
                    }}
                >
                    <Form.Item
                        name="hrg_jual"
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
                        <InputNumber                        
                            parser={parser}
                            formatter={formatter}
                            style={{ width: "120px" }}
                        />
                    </Form.Item>
                    <Form.Item
                        style={{
                            display: "inline-block",
                            width: "calc(25% - 8px)",
                            // margin: "0 8px",
                        }}
                    >
                        <Checkbox checked={isCheked} onChange={onChangeTax}>
                            Tax
                        </Checkbox>
                    </Form.Item>
                    <Form.Item
                        style={{
                            display: "inline-block",
                            width: "calc(25% - 8px)",
                            margin: "0 8px",
                        }}
                    >
                        <Checkbox checked={isChekedService} onChange={onChangeSrvChg}>
                            SrvChg
                        </Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item
                    name="target_printer"
                    label="Target Printer"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        showSearch
                        // onChange={onChangeCostCenter}
                        // placeholder="Optional"
                        // optionLabelProp="children"
                        optionFilterProp="children"
                        // onSearch={onSearchAkun}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        allowClear
                        // disabled={disabledCostCenter}
                        options={arrayKategori.map((e) => ({
                            value: e.value,
                            label: e.label,
                        }))}
                    />
                </Form.Item>

                {/* <Form.Item
                    name="hrg_jual"
                    label="Hpp"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <InputNumber
                        parser={parser}
                        formatter={formatter}
                        style={{ width: "120px" }}
                    />
                </Form.Item>

                <Form.Item
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
                            parser={parser}
                            formatter={formatter}
                            style={{ width: "120px" }}
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
                            parser={parser}
                            formatter={formatter}
                            style={{ width: "120px" }}
                        />
                    </Form.Item>
                </Form.Item>

                <Form.Item label="nDisc" name="nilai_disc">
                    <InputNumber
                    disabled
                        parser={parser}
                        formatter={formatter}
                        style={{ width: "120px" }}
                    />
                </Form.Item>

                <Form.Item label="Hpp - Disc" name="hrg_stl_disc">
                    <InputNumber
                        disabled
                        parser={parser}
                        formatter={formatter}
                        style={{ width: "120px" }}
                    />
                </Form.Item> */}

    
            
                <Form.Item wrapperCol={{ offset: 1, span: 16 }}>
                    <div>
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
                            <Button onClick={onReset} type="text">
                                Clear
                            </Button>
                        </Space>
                    </div>
                </Form.Item>
            </Form>
            <Divider />
            <div className="flex flex-col justify-center items-center">
                <div className="mt-1">
                    <Image src={myImage} width={150} height={100} />
                </div>
                <div className="mt-1 mb-2">
                    <Input type="file" className="" accept="image/*" onChange={handleFile}/>
                </div>
                <Button type="dashed" onClick={onClickUpload}>Upload image</Button>
            </div>
        </div>
    );
};

export default FormEditPackageResto;
