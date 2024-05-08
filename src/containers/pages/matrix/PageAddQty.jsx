import { Button, Form, Input, InputNumber, Select, Space, message } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseUrl } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import { usePackageRestoData } from "../../../hooks/usePackageRestoData";
import {
    usePostRegistrasiRestoData,
    useUpdateRegistrasiRestoData,
} from "../../../hooks/registrasi/useRegistrasiRestoData";
import { getOnePackageResto } from "../../../features/packageresto/onepackagerestoSlice";
import { useSettingData } from "../../../hooks/useSettingData";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const { TextArea } = Input;

const PageAddQty = (props) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const key = "updatable";
    const inputRef = useRef(null);

    const dispatch = useDispatch();

    const onePackageRestoData = useSelector((state) => state.onepackageresto);
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);
    const { userid } = useSelector((state) => state.auth);

    const [qtyItems, setQtyItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [persenPbSatu, setPersenPbSatu] = useState(0);
    const [persenSrvChg, setPersenSrvChg] = useState(0);
    const [isDisabled, setIsDisabled] = useState(true);

    ///HOOKs
    const { data: dataSetting } = useSettingData(true);
    const { data: dataPackageResto } = usePackageRestoData(true);
    const { mutateAsync: dataPostRegistrasiResto } = usePostRegistrasiRestoData();

    const tambahQty = () => {
        setQtyItems((a) => a + 1);
        setIsDisabled(false);
    };

    const kurangQty = () => {
        if (qtyItems < 2) {
            console.log("A");
            setQtyItems(0);
            setIsDisabled(true);
        } else {
            console.log("B");
            setQtyItems((a) => a - 1);
            setIsDisabled(false);
        }
    };

    useEffect(() => {
        if (onePackageRestoData.data !== undefined) {
            form.setFieldsValue({
                hrg_jual: onePackageRestoData?.data[0]?.hrg_jual,
                disc_persen: onePackageRestoData?.data[0]?.disc_persen ?? 0,
            });
            rumus();
        }
    }, [form, onePackageRestoData.data, persenSrvChg, persenSrvChg]);

    useEffect(() => {
        onResetPackage();
    }, [matrixSelected]);

    useEffect(() => {
        form.setFieldsValue({ items_id: props.itemTerpilih.id, qty: qtyItems });
    }, [form, props.itemTerpilih.id, qtyItems]);

    const successMessage = (type, message) => {
        messageApi.open({
            key,
            type: type,
            content: message,
        });
    };

    const sharedProps = {
        ref: inputRef,
    };

    const rumus = async () => {
        ///cek pb1, srvChg

        // console.log(persenSrvChg);

        ///rumusnya
        let qty = qtyItems;
        let hpp = form.getFieldValue("hrg_jual");
        let discPersen = form.getFieldValue("disc_persen");
        let discRp = form.getFieldValue("disc_rp");
        let nDisc = form.getFieldValue("nilai_disc");
        let srvChgPersen = persenSrvChg/100;
        let pb1Persen = persenPbSatu/100;
        if (discPersen > 0) {
            nDisc = hpp * (discPersen / 100);
        } else if (discRp > 0) {
            nDisc = discRp;
        } else {
            nDisc = 0;
        }
        let priceAf = hpp - nDisc;
        let jumlah = priceAf * qty;
        let nSrvChg = jumlah * srvChgPersen;
        let nPb1 = (jumlah + nSrvChg) * pb1Persen;
        let total = jumlah + nSrvChg + nPb1;
        // alert(nSrvChg);

        form.setFieldsValue({
            qty: qty,
            nilai_disc: nDisc,
            hrg_stl_disc: jumlah,
            service_charge_persen: persenSrvChg,
            nilai_service_charge: nSrvChg,
            pb_satu_persen: persenPbSatu,
            nilai_pb_satu: nPb1,
            total: total,
        });
    };

    const onFinish = async (v) => {
        ///1. generate number Registrasi resto order
        await axios
            .get(
                baseUrl +
                `/transaksi-resto/generate?registrasi_id=${matrixSelected.registrasi_id}`
            )
            .then(async (res) => {
                let noUrutOrder = res.data.data;

                setIsLoading(true);
                // let item = onePackageRestoData.data[0];

                let data = {
                    id: noUrutOrder,
                    registrasi_id: matrixSelected.registrasi_id,
                    no_meja: v.no_meja,
                    items_id: v.items_id,
                    qty: v.qty,
                    hrg_jual: v.hrg_jual,
                    disc_persen: v.disc_persen,
                    disc_rp: v.disc_rp,
                    nilai_persen: v.nilai_persen,
                    nilai_disc: v.nilai_disc,
                    hrg_stl_disc: v.hrg_stl_disc,
                    service_charge_persen: v.service_charge_persen,
                    nilai_service_charge: v.nilai_service_charge,
                    pb_satu_persen: v.pb_satu_persen,
                    nilai_pb_satu: v.nilai_pb_satu,
                    total: v.total,
                    // status_order: item.status_order,
                    status_order: null,
                    remark: v.remark,
                    user_id: userid,
                    updator: userid,
                };
                await dataPostRegistrasiResto(data);
                form.setFieldsValue({ items_id: null, qty: 1, total: 0, remark: null });
                setIsLoading(false);
                successMessage("success", `${qtyItems} Pesanan ditambahkan`);
                // onResetPackage();
            })
            .catch((err) => console.log(err));
        ///ambil data dari package resto
    };

    const onResetPackage = () => {
        form.setFieldsValue({
            // no_meja: null,
            items_id: null,
            qty: 0,
            hrg_jual: 0,
            disc_persen: 0,
            disc_rp: 0,
            nilai_persen: 0,
            nilai_disc: 0,
            hrg_stl_disc: 0,
            service_charge_persen: 0,
            nilai_service_charge: 0,
            pb_satu_persen: 0,
            nilai_pb_satu: 0,
            total: 0,
            remark: null,
        });
        setIsLoading(false);
    };

    const onChangeForm = () => {
        // console.log("FFFF");
        rumus();
    };

    const onClickItems = async (v) => {
        ///cek items
        let regisId = matrixSelected.registrasi_id;                
        await axios
            .get(
                baseUrl +
                `/transaksi-resto/cari?registrasi_id=${regisId}&items_id=${v}`
            )
            .then((res) => {                
                let status = res.data.status;                
                if (status) {
                    successMessage("warning", "Maaf item sudah dipesan");
                } else {
                    setIsLoading(true);
                    // console.log(v);

                    // form.setFieldsValue({ items_id: v, qty:qty });

                    dispatch(getOnePackageResto(v));
                    // console.log("X");
                    if (v === undefined) {
                        onResetPackage();
                    }

                    ///cek pb1
                    if (dataPackageResto?.data[0].tax_status === "1") {
                        let persenPb1 = dataSetting?.data[0].persen;
                        setPersenPbSatu(persenPb1);
                    } else {
                        setPersenPbSatu(0);
                    }

                    ///cek SrvChg
                    if (dataPackageResto?.data[0].service_charge_status === "1") {
                        let srvchg = dataSetting?.data[2].persen;
                        setPersenSrvChg(srvchg);

                        rumus();
                        setTimeout(() => {
                            ///simpan data
                            form.submit();
                        }, 10);
                    } else {
                        setPersenSrvChg(0);

                        rumus();

                        setTimeout(() => {
                            ///simpan data
                            form.submit();
                        }, 10);
                    }
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div>
            {contextHolder}
            <div className="flex flex-wrap flex-col justify-center items-center">
                <div className="flex justify-start items-start">
                    <Button size="small" onClick={kurangQty}>
                        -
                    </Button>
                    <div className="mr-1 font-semibold">
                        <InputNumber
                            readOnly
                            min={0}
                            size="small"
                            value={qtyItems}
                            style={{ width: "30px" }}
                            variant="borderless"
                        />
                    </div>
                    <Button size="small" onClick={tambahQty}>
                        +
                    </Button>
                </div>
                <div className="mt-2">
                    <Button
                    disabled={isDisabled}
                        loading={isLoading}
                        size="small"
                        type="primary"
                        block
                        shape="round"
                        onClick={() => onClickItems(props.itemTerpilih.id)}
                    >
                        Order
                    </Button>
                </div>
            </div>

            {/* form */}
            <Form
                // labelCol={{
                //     // offset: 1,
                //     span: 6,
                // }}
                // wrapperCol={{
                //     // offset: 1,
                //     span: 14,
                // }}
                form={form}
                name={`form-${Math.random()}`}
                onFinish={onFinish}
                initialValues={{
                    qty: 1,
                    hrg_jual: 0,
                    disc_persen: 0,
                    disc_rp: 0,
                    nilai_disc: 0,
                    hrg_stl_disc: 0,
                    service_charge_persen: 0,
                    nilai_service_charge: 0,
                    pb_satu_persen: 0,
                    nilai_pb_satu: 0,
                    total: 0,
                }}
                onChange={onChangeForm}
            // onClick={onChangeLocation}
            // onFieldsChange={onChangeLocation}
            // style={{
            //     maxWidth: 600,
            // }}
            >
                <Form.Item
                    hidden
                    name="items_id"
                    label="Item"
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
                        // onChange={onChangePackage}
                        // onSearch={onSearchAkun}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        allowClear
                        // disabled={disabledCostCenter}
                        options={dataPackageResto?.data?.map((e) => ({
                            value: e.id,
                            label: e.id + " @" + e.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item hidden name="hrg_jual" label="Price">
                    <InputNumber
                        readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: 120, backgroundColor: "#E9E7E7" }}
                    />
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
                    <InputNumber formatter={formatter} parser={parser} {...sharedProps} />
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
                    label="SrvChg"
                    style={{
                        marginBottom: 0,
                    }}
                >
                    <Form.Item
                        name="service_charge_persen"
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
                        name="nilai_service_charge"
                        label="nSrvChg"
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
                    label="pb1"
                    style={{
                        marginBottom: 0,
                    }}
                >
                    <Form.Item
                        name="pb_satu_persen"
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
                        name="nilai_pb_satu"
                        label="nPb1"
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

                <Form.Item hidden name="total" label="Amount">
                    <InputNumber
                        disabled
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "120px" }}
                    />
                </Form.Item>

                <Form.Item hidden name="remark" label="Remark">
                    <TextArea rows={3} placeholder="Optional" />
                </Form.Item>

                <Form.Item hidden wrapperCol={{ offset: 1, span: 16 }}>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            style={{ width: 100 }}
                        >
                            Add
                        </Button>
                        <Button onClick={onResetPackage} type="text">
                            Clear
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
            {/* end form */}
        </div>
    );
};

export default PageAddQty;
