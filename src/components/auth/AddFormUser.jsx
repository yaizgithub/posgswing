import { Button, Form, Input, Select, Space } from "antd";
import React, { useState } from "react";
import { usePostUserRegistrasiData } from "../../hooks/useUserRegistrasiData";


const level = [
    {
        id: "kasir",
        name: "Kasir",
    },
    {
        id: "sales",
        name: "Sales",
    },
    {
        id: "waiter",
        name: "Waiter",
    },
    {
        id: "admin",
        name: "Admin",
    },
];

const AddFormUser = (props) => {
    const [form] = Form.useForm();
    
    const [isLoading, setIsLoading] = useState(false);


    ///HOOKs
    const {mutateAsync : mutatePostUserRegistrasiData} = usePostUserRegistrasiData();

    const onFinish=async(v)=>{
        setIsLoading(true);
        let data = {
            username:v.username,
            email:v.email,
            password: v.password,
            jabatan:v.jabatan,
            role:v.role,
        }
        await mutatePostUserRegistrasiData(data);
        setIsLoading(false);
    }

    const onReset=()=>{
        form.resetFields();
    }
    return (
        <div>
            <Form
                form={form}
                name="form-add-user"
                labelCol={{
                    // offset: 1,
                    span: 6,
                }}
                wrapperCol={{
                    // offset: 1,
                    span: 14,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="email"
                    rules={[
                        {
                            type: 'email',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="jabatan"
                    label="Level"
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
                        // onChange={onChangeBidangKerja}
                        // onSearch={onSearchAkun}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        allowClear
                        // disabled={disabledCostCenter}
                        options={level.map((e) => ({
                            value: e.id,
                            label: e.name,
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    name="role"
                    label="role"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 1, span: 20 }}>
                    <div className="float-right">
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                style={{ width: 70 }}
                            >
                                Save
                            </Button>
                            <Button onClick={onReset}>Reset</Button>
                        </Space>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddFormUser;
