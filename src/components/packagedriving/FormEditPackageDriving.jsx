import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    message,
} from "antd";
import React, { useEffect, useState } from "react";
import { usePostPackageRestoData } from "../../hooks/usePackageRestoData";
import { useSelector } from "react-redux";
import {
    usePostPackageDrivingData,
    useUpdatePackageDrivingData,
} from "../../hooks/usePackageDrivingData";
import dayjs from "dayjs";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const FormEditPackageDriving = (props) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const { userid } = useSelector((state) => state.auth);
    const { dataSelected } = useSelector((state) => state.mydataselected);

    const [isLoading, setisLoading] = useState(false);
    const [isCheked, setisCheked] = useState(false);

    useEffect(() => {        
        setisCheked(dataSelected.tax_status === "1" ? true : false);
        form.setFieldsValue({
            id: dataSelected.id,
            name: dataSelected.name,
            qty_jam: dataSelected.qty_jam,
            hrg_jual: dataSelected.hrg_jual,
            disc_persen: dataSelected.disc_persen,
            disc_rp: dataSelected.disc_rp,
            nilai_disc: dataSelected.nilai_disc,
            hrg_stl_disc: dataSelected.hrg_stl_disc,
            ppn_persen: dataSelected.ppn_persen,
            nilai_ppn: dataSelected.nilai_ppn,
            total: dataSelected.total,
            effective_date: dataSelected.effective_date === null ? null : dayjs(dataSelected.effective_date),          
            expire_date: (dataSelected.expire_date === null || dataSelected.expire_date === undefined) ? null : dayjs(dataSelected.expire_date),
        });
    }, [dataSelected]);

    ///HOOKs
    const { mutateAsync: mutateUpdatePackageDrivingData } =
        useUpdatePackageDrivingData();


        const successMessage = () => {
            messageApi.open({
              type: 'success',
              content: 'Updated data success',    
            });
          };

    // const rumus = () => {
    //     ///rumusnya
    //     let qtyJam = form.getFieldValue("qty_jam");
    //     let hpp = form.getFieldValue("hrg_jual");
    //     let discPersen = form.getFieldValue("disc_persen");
    //     let discRp = form.getFieldValue("disc_rp");
    //     let ppnPersen = form.getFieldValue("ppn_persen");
    //     let nDisc = 0;
    //     if (discPersen > 0) {
    //         nDisc = hpp * (discPersen / 100);
    //     } else {
    //         nDisc = discRp;
    //     }
    //     let priceAf = hpp - nDisc;
    //     let jumlah = priceAf * qtyJam;
    //     let ppn = jumlah * (ppnPersen / 100);
    //     let total = jumlah + ppn;

    //     form.setFieldsValue({
    //         nilai_disc: nDisc,
    //         hrg_stl_disc: priceAf,
    //         ppn_persen: ppnPersen,
    //         nilai_ppn: ppn,
    //         total: total,
    //     });
    // };

    const onFinish = async (v) => {
        setisLoading(true);
        let data = {
            name: v.name,
            qty_jam: v.qty_jam,
            hrg_jual: v.hrg_jual,
            disc_persen: v.disc_persen, 
            disc_rp: v.disc_rp,
            nilai_disc: v.nilai_disc,
            hrg_stl_disc: v.hrg_stl_disc,
            ppn_persen: v.ppn_persen,
            nilai_ppn: v.nilai_ppn,
            total: v.total,
            tax_status: isCheked,
            effective_date: dayjs(v.effective_date).format("YYYY-MM-DD"),          
            expire_date: (v.expire_date === null || v.expire_date === undefined) ? null : dayjs(v.expire_date).format("YYYY-MM-DD"),          
            updator: userid,
        };
        await mutateUpdatePackageDrivingData([dataSelected.id, data]);
        setisLoading(false);
        props.closeModal();
        successMessage();
    };

    const onReset = () => {
        form.setFieldsValue({
            id: null,
            name: null,
            qty_jam: 1,
            hrg_jual: 0,
            nilai_disc: 0,
            hrg_stl_disc: 0,
            ppn_persen: 0,
            nilai_ppn: 0,
            total: 0,
        });
        setisLoading(false);
    };

    // const onChangeForm = () => {
    //     rumus();
    // };

    const onChangeTax = (v) => {
        // // console.log(v.target.checked);
        // if (v.target.checked) {
        //     form.setFieldsValue({ ppn_persen: 11 });
        // } else {
        //     form.setFieldsValue({ ppn_persen: 0 });
        // }
        setisCheked(v.target.checked);
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
                name="form-edit-packagedriving"
                onFinish={onFinish}
                // initialValues={{
                //     qty_jam: 1,
                //     hrg_jual: 0,
                //     disc_persen: 0,
                //     disc_rp: 0,
                //     nilai_disc: 0,
                //     hrg_stl_disc: 0,
                //     service_charge_persen: 0,
                //     nilai_service_charge: 0,
                //     ppn_persen: 0,
                //     nilai_ppn: 0,
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
                    name="id"
                    label="Code Package"
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
                    label="Package Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input style={{ width: "80%" }} />
                </Form.Item>

                <Form.Item
                    name="qty_jam"
                    label="Qty Jam"
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
                            disabled
                            parser={parser}
                            formatter={formatter}
                            style={{ width: "120px" }}
                        />
                    </Form.Item>
                    <Form.Item
                        style={{
                            display: "inline-block",
                            width: "calc(50% - 8px)",
                            margin: "0 8px",
                        }}
                    >
                        <Checkbox checked={isCheked} onChange={onChangeTax}>Tax</Checkbox>
                    </Form.Item>
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
                        parser={parser}
                        formatter={formatter}
                        style={{ width: "120px" }}
                    />
                </Form.Item>

                <Form.Item
                    name="effective_date"
                    label="Effective Date"
                    // rules={[
                    //     {
                    //         required: true,
                    //     },
                    // ]}
                >
                    <DatePicker format={"DD/MM/YYYY"}/>
                </Form.Item>

                <Form.Item
                    name="expire_date"
                    label="Expire Date"
                    // rules={[
                    //     {
                    //         required: true,
                    //     },
                    // ]}
                >
                    <DatePicker format={"DD/MM/YYYY"} />
                </Form.Item>

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
        </div>
    );
};

export default FormEditPackageDriving;
