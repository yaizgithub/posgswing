import { Descriptions, Form, InputNumber, Select, Skeleton, Space } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTotalPaymentData } from "../../hooks/usePaymentData";
import { useEffect } from "react";
import { reduxUpdateTtotalBayar } from "../../features/mytotalbayarSlice";
import { reduxGetTotals } from "../../features/mypaymentSlice";

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

const BillingPayment = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    let rumusChange = 0;

    const { numberIdentifikasi, dataSelected } = useSelector((state) => state.mydataselected);    
    const { totalOrder, totalDisc, discPersenTambahan, discTambahan, totalTagihan, sudahBayar } = useSelector(
        (state) => state.mypayment
    );

    ///HOOKs
    // const {data: dataTotalPaymentData} = useTotalPaymentData(numberIdentifikasi,true);


    // useEffect(() => {
    //     ///get grand total
    //     if (dataTotalPaymentData) {
    //         let discPersen = dataTotalPaymentData?.data[0]?.disc_persen_tambahan ?? 0;
    //         let discTambahan = dataTotalPaymentData?.data[0]?.disc_tambahan ?? 0;
    //         dispatch(reduxGetTotals({discPersenTambahan:discPersen})); 
    //         form.setFieldsValue({
    //             total_order: totalOrder,
    //             total_disc: totalDisc, 
    //             disc_persen: discPersen,
    //             disc_tambahan: discTambahan,
    //             grand_total: dataTotalPaymentData?.data[0]?.total ?? 0,
    //             payment: dataTotalPaymentData?.data[0]?.totNilaiBayar ?? 0,
    //         });
    //         // onChangeDiscPersen(discPersen)
    //     } 
    //     // else {
    //     //     // dispatch(reduxGetTotals({discPersenTambahan:0}));     
    //     //     form.setFieldsValue({
    //     //         total_order: totalOrder,
    //     //         total_disc: totalDisc,            
    //     //         disc_persen:discPersenTambahan,
    //     //         disc_tambahan:discTambahan,                
    //     //         grand_total: totalTagihan,
    //     //         payment: 0,
    //     //     });        
    //     // }

    // }, [dispatch, dataTotalPaymentData]);

    useEffect(() => {
        form.setFieldsValue({
            total_order: totalOrder,
            total_disc: totalDisc,            
            disc_persen:discPersenTambahan,
            disc_tambahan: discTambahan,                
            grand_total: totalTagihan,
            payment: sudahBayar,
        });   
    }, [form, totalOrder, totalDisc, discPersenTambahan,discTambahan, totalTagihan])
    

    


   

    const onChangeDiscPersen = (v) => {
        if (v !== undefined) {
            dispatch(reduxGetTotals({discPersenTambahan:v}));      
            console.log("A");      
        } else {
            console.log("B");      
            dispatch(reduxGetTotals({discPersenTambahan:0}));            
        }

        // // console.log(v);
        // let jumlah = 0;
        // let rumusDisc = 0;
        // let rumusPb1 = 0;
        // let rumusSubTotal = 0;
        // if (v === undefined) {
        //     rumusDisc = 0;
        // } else {
        //     rumusDisc = dataTotalRestoOrder?.data[0]?.price * (v / 100);
        // }
        // jumlah = dataTotalRestoOrder?.data[0]?.price - rumusDisc;
        // console.log(jumlah);
        // rumusPb1 = (jumlah + dataTotalRestoOrder?.data[0]?.srvchg) * (10 / 100);
        // rumusSubTotal = jumlah + dataTotalRestoOrder?.data[0]?.srvchg + rumusPb1;

        // form.setFieldsValue({disc: rumusDisc});

        // form.setFieldsValue({pb1: rumusPb1});

        // form.setFieldsValue({total: rumusSubTotal});

        // ///update redux
        // dispatch(
        //     reduxUpdateTotalResto({
        //         restoPrice: dataTotalRestoOrder?.data[0]?.price,
        //         restoDisc: rumusDisc,
        //         restoSrvchg: dataTotalRestoOrder?.data[0]?.srvchg,
        //         restoPb1: rumusPb1,
        //         restoSubTotal: rumusSubTotal,
        //     })
        // );

        // dispatch(reduxGetTotals());
        
    };    

    return (
        <div>
            <Form
                labelCol={{
                    // offset: 1,
                    span: 6,
                }}
                wrapperCol={{
                    offset: 1,
                    span: 16,
                }}
                form={form}
                name="form-billing-payment"
            >
                <Form.Item
                    name="total_order"
                    label="Order"
                    style={{ margin: "0px", paddingBottom: "5px" }}
                >
                    <InputNumber
                        readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "170px", backgroundColor: "#F5F5F5" }}
                    />
                </Form.Item>

                <Form.Item hidden
                    name="total_disc"
                    label="Disc"
                    style={{ margin: "0px", paddingBottom: "5px" }}
                >
                    <InputNumber
                        readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "170px", backgroundColor: "#F5F5F5" }}
                    />
                </Form.Item>

                <Form.Item label="Disc" style={{ margin: "0px", paddingBottom: "5px" }}>
                    <Space.Compact>
                        <Form.Item
                            name={"disc_persen"}
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
                            name="disc_tambahan"
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
                                style={{ width: "100px", backgroundColor: "#F5F5F5" }}
                            />
                        </Form.Item>
                    </Space.Compact>
                </Form.Item>

                <Form.Item
                    name="grand_total"
                    label="Total"
                    style={{ margin: "0px", paddingBottom: "5px" }}
                >
                    <InputNumber
                        readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "170px", backgroundColor: "#F5F5F5" }}
                    />
                </Form.Item>
                <Form.Item
                    name="payment"
                    label="Payment"
                    style={{ margin: "0px", paddingBottom: "5px" }}
                >
                    <InputNumber
                        readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "170px", backgroundColor: "#F5F5F5" }}
                    />
                </Form.Item>
                <Form.Item
                    name="change"
                    label="Change"
                    style={{ margin: "0px", paddingBottom: "5px" }}
                >
                    <InputNumber
                        readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "170px", backgroundColor: "#F5F5F5" }}
                    />
                </Form.Item>
            </Form>
        </div>
    );
};

export default BillingPayment;
