import { Button, Form, Input, InputNumber, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useUpdateSebagianPaymentData } from "../../hooks/usePaymentData";
import { useSelector } from "react-redux";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const { TextArea } = Input;

const FormEditPayment = (props) => {
    const [form] = Form.useForm();

    const {userid} = useSelector((state)=>state.auth);

    const [isLoading, setisLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            nilai_bayar: props.recordSelected.nilai_bayar,
            remark: props.recordSelected.remark,
        });
    }, [form, props.recordSelected]);

    ///HOOKs
    const {mutateAsync: mutateUpdateSebagianPaymentData} = useUpdateSebagianPaymentData();

    const onFinish = async(v) => {
        setisLoading(true);
        let data = {
            nilai_bayar:v.nilai_bayar,
            kembalian: 0, //v.nilai_bayar - props.recordSelected.nilai_bayar,
            remark:v.remark,
            updator:userid,
        }
        await mutateUpdateSebagianPaymentData([props.recordSelected.id, data]);
        setisLoading(false);
        props.closeModal();
    };
    return (
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
                name="form-edit-payment"
                onFinish={onFinish}
                initialValues={{ qty: 1, total: 0 }}
            // onClick={onChangeLocation}
            // onFieldsChange={onChangeLocation}
            // style={{
            //     maxWidth: 600,
            // }}
            >
                <Form.Item name="nilai_bayar" label="Value">
                    <InputNumber
                        formatter={formatter}
                        parser={parser}
                        style={{ width: 120 }}
                    />
                </Form.Item>
                <Form.Item name="remark" label="Remark">
                    <TextArea
                        rows={3}
                    // style={{ width: 120}}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 1, span: 20 }}>
                    <div className="float-right">
                        <Space>
                            <Button onClick={() => props.closeModal()}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                style={{ width: 70 }}
                            >
                                Update
                            </Button>
                        </Space>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default FormEditPayment;
