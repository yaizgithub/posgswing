import {
    Descriptions,
    Form,
    Input,
    InputNumber,
    Select,
    Skeleton,
    Space,
} from "antd";
import React, { useEffect } from "react";
import { useTotalRestoOrder } from "../../hooks/registrasi/useRegistrasiRestoData";
import { useDispatch, useSelector } from "react-redux";
import {
    reduxGetTotals,
    reduxUpdateTotalResto,
} from "../../features/mypaymentSlice";
import { useTotalPaymentData } from "../../hooks/usePaymentData";

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

const BillingRestoOrder = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const { dataSelected } = useSelector((state) => state.mydataselected);

    const dataTotalRestoOrder = useSelector((state) => state.billingrestoorder);

    ///HOOKs
    const { data: dataTotalPaymentData } = useTotalPaymentData(
        dataSelected.id,
        true
    );

    useEffect(() => {
        form.setFieldsValue({
            price: dataTotalRestoOrder?.data[0]?.price ?? 0,
            disc: dataTotalRestoOrder?.data[0]?.disc ?? 0,
            srvchg: dataTotalRestoOrder?.data[0]?.srvchg ?? 0,
            pb1: dataTotalRestoOrder?.data[0]?.pb1 ?? 0,
            total: dataTotalRestoOrder?.data[0]?.total ?? 0,
        });

        dispatch(
            reduxUpdateTotalResto({
                restoPrice: dataTotalRestoOrder?.data[0]?.price ?? 0,
                restoDisc: dataTotalRestoOrder?.data[0]?.disc ?? 0,
                restoSrvchg: dataTotalRestoOrder?.data[0]?.srvchg ?? 0,
                restoPb1: dataTotalRestoOrder?.data[0]?.pb1 ?? 0,
                restoSubTotal: dataTotalRestoOrder?.data[0]?.total ?? 0,
            })
        );

        ///Cukup di resto saja atau di driving di pasang ini script, ndak perlu 2x di tulis
        //get total payment
        if (dataTotalPaymentData?.success) {
            let discPersen = dataTotalPaymentData?.data[0]?.disc_persen_tambahan ?? 0;
            let sudahBayar = dataTotalPaymentData?.data[0]?.totNilaiBayar ?? 0;
            dispatch(reduxGetTotals({ discPersenTambahan: discPersen, sudahBayar:sudahBayar }));            
        } else {
            dispatch(reduxGetTotals({ discPersenTambahan: 0, sudahBayar: 0 }));
        }
    }, [dispatch, dataTotalRestoOrder, dataTotalPaymentData]);

    const onChangeDiscPersen = (v) => {
        // console.log(v);
        let jumlah = 0;
        let rumusDisc = 0;
        let rumusPb1 = 0;
        let rumusSubTotal = 0;
        if (v === undefined) {
            rumusDisc = 0;
        } else {
            rumusDisc = dataTotalRestoOrder?.data[0]?.price * (v / 100);
        }
        jumlah = dataTotalRestoOrder?.data[0]?.price - rumusDisc;
        console.log(jumlah);
        rumusPb1 = (jumlah + dataTotalRestoOrder?.data[0]?.srvchg) * (10 / 100);
        rumusSubTotal = jumlah + dataTotalRestoOrder?.data[0]?.srvchg + rumusPb1;

        form.setFieldsValue({ disc: rumusDisc });

        form.setFieldsValue({ pb1: rumusPb1 });

        form.setFieldsValue({ total: rumusSubTotal });

        ///update redux
        dispatch(
            reduxUpdateTotalResto({
                restoPrice: dataTotalRestoOrder?.data[0]?.price,
                restoDisc: rumusDisc,
                restoSrvchg: dataTotalRestoOrder?.data[0]?.srvchg,
                restoPb1: rumusPb1,
                restoSubTotal: rumusSubTotal,
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
                name="form-billing-resto"
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
                    name="srvchg"
                    label="SrvChg"
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
                    name="pb1"
                    label="Pb1"
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

export default BillingRestoOrder;
