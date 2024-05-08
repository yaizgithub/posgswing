import { Descriptions, Form, InputNumber, Select, Skeleton, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useTotalDrivingOrder } from "../../hooks/registrasi/useRegistrasiDrivingData";
import { useDispatch, useSelector } from "react-redux";
import {
    reduxGetTotals,
    reduxUpdateTotalDriving,
} from "../../features/mypaymentSlice";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const dataDisc = [
    { disc: 10 },
    { disc: 20 },
    { disc: 30 },
    { disc: 40 },
    { disc: 50 },
];

const BillingDrivingOrder = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const dataTotalDrivingOrder = useSelector(
        (state) => state.billingdrivingorder
    );

    useEffect(() => {
        form.setFieldsValue({
            price: dataTotalDrivingOrder?.data[0]?.price ?? 0,
            disc: dataTotalDrivingOrder?.data[0]?.disc ?? 0,
            ppn: dataTotalDrivingOrder?.data[0]?.ppn ?? 0,
            total: dataTotalDrivingOrder?.data[0]?.total ?? 0,
        });

        dispatch(
            reduxUpdateTotalDriving({
                drivingPrice: dataTotalDrivingOrder?.data[0]?.price ?? 0,
                drivingDisc: dataTotalDrivingOrder?.data[0]?.disc ?? 0,
                drivingPpn: dataTotalDrivingOrder?.data[0]?.ppn ?? 0,
                drivingSubTotal: dataTotalDrivingOrder?.data[0]?.total ?? 0,
            })
        );

        // dispatch(reduxGetTotals());
        // dispatch(reduxGetTotals({ discPersenTambahan: 0 }));
    }, [dispatch, dataTotalDrivingOrder]);

    const onChangeDiscPersen = (v) => {
        // console.log(v);
        let jumlah = 0;
        let rumusDisc = 0;
        let rumusPpn = 0;
        let rumusSubTotal = 0;
        if (v === undefined) {
            rumusDisc = 0;
        } else {
            rumusDisc = dataTotalDrivingOrder?.data[0]?.price * (v / 100);
        }
        jumlah = dataTotalDrivingOrder?.data[0]?.price - rumusDisc;
        rumusPpn = jumlah * (11 / 100);
        rumusSubTotal = jumlah + rumusPpn;

        // setDisc(rumusDisc ?? 0);
        form.setFieldsValue({ disc: rumusDisc });

        //setPpn(rumusPpn);
        form.setFieldsValue({ ppn: rumusPpn });

        //setSubTotal(rumusSubTotal);
        form.setFieldsValue({ total: rumusSubTotal });

        ///update redux
        dispatch(
            reduxUpdateTotalDriving({
                drivingPrice: dataTotalDrivingOrder?.data[0]?.price,
                drivingDisc: rumusDisc,
                drivingPpn: rumusPpn,
                drivingSubTotal: rumusSubTotal,
            })
        );

        // dispatch(reduxGetTotals());
        dispatch(reduxGetTotals({ discPersenTambahan: 0 }));
    };

    return (
        <div>
            <Form
                labelCol={{
                    // offset: 1,
                    span: 8,
                }}
                wrapperCol={{
                    offset: 1,
                    span: 16,
                }}
                form={form}
                name="form-billing-driving"
            >
                <Form.Item
                    name="price"
                    label="Price"
                    style={{ margin: "0px", paddingBottom: "5px" }}
                >
                    <InputNumber
                        readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "110px", backgroundColor: "#F5F5F5" }}
                    />
                </Form.Item>

                {/* <Form.Item label="Disc" style={{ margin: "0px", paddingBottom: "5px" }}>
                    <Space.Compact>
                        <Form.Item
                            name="disc_persen"
                            noStyle
                        >
                            <Select
                                style={{ width: "70px" }}
                                // size="small"
                                // showSearch
                                // onChange={onChangeCostCenter}
                                placeholder="00"
                                // optionLabelProp="children"
                                optionFilterProp="children"
                                onChange={onChangeDiscPersen}
                                // onSearch={onSearchAkun}
                                filterOption={(input, option) =>
                                    (option?.label ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                allowClear
                                // disabled={disabledCostCenter}
                                options={dataDisc.map((e) => ({
                                    value: e.disc,
                                    label: e.disc,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item
                            name="disc"
                            noStyle
                            rules={[
                                {
                                    required: true,
                                    message: "Street is required",
                                },
                            ]}
                        >
                            <InputNumber
                                readOnly
                                formatter={formatter}
                                parser={parser}
                                style={{ width: "120px", backgroundColor: "#F5F5F5" }}
                            />
                        </Form.Item>
                    </Space.Compact>
                </Form.Item> */}

                <Form.Item
                    name="disc"
                    label="Disc"
                    style={{ margin: "0px", paddingBottom: "5px" }}
                >
                    <InputNumber
                        readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "110px", backgroundColor: "#F5F5F5" }}
                    />
                </Form.Item>

                <Form.Item
                    name="ppn"
                    label="Ppn"
                    style={{ margin: "0px", paddingBottom: "5px" }}
                >
                    <InputNumber
                        readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "110px", backgroundColor: "#F5F5F5" }}
                    />
                </Form.Item>
                <Form.Item
                    name="total"
                    label="Sub Total"
                    style={{ margin: "0px", paddingBottom: "5px" }}
                >
                    <InputNumber
                        readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "110px", backgroundColor: "#F5F5F5" }}
                    />
                </Form.Item>
            </Form>
        </div>
    );
};

export default BillingDrivingOrder;
