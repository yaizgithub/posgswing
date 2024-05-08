import { Button, Form, Input, InputNumber, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOnePackageResto } from "../../features/packageresto/onepackagerestoSlice";
import { usePackageRestoData } from "../../hooks/usePackageRestoData";

import { useMejaOrderByStatusData } from "../../hooks/useMejaData";
import { useUpdateRegistrasiRestoData } from "../../hooks/registrasi/useRegistrasiRestoData";
import { useSettingData } from "../../hooks/useSettingData";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const { TextArea } = Input;

const EditRegisFormRestoOrder = (props) => {
    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const onePackageRestoData = useSelector((state) => state.onepackageresto);
    const { numberIdentifikasi } = useSelector((state) => state.mydataselected);
    const { userid } = useSelector((state) => state.auth);
    
    const [isLoading, setIsLoading] = useState(false);
    const [itemsId, setItemsId] = useState("");
    const [persenPbSatu, setPersenPbSatu] = useState(0);
    const [persenSrvChg, setPersenSrvChg] = useState(0);


    useEffect(() => {
        let v = props.selectedData;
        form.setFieldsValue({
            no_meja: v.no_meja,
            items_id: v.items_id,
            qty: v.qty,
            hrg_jual: v.hrg_jual,
            disc_persen: v.disc_persen,
            disc_rp: v.disc_rp,
            nilai_disc: v.nilai_disc,
            hrg_stl_disc: v.hrg_stl_disc,
            service_charge_persen: v.service_charge_persen,
            nilai_service_charge: v.nilai_service_charge,
            pb_satu_persen: v.pb_satu_persen,
            nilai_pb_satu: v.nilai_pb_satu,
            total: v.total,
            remark:v.remark
        });
        
    }, [form, props.selectedData])

    useEffect(() => {
        if (onePackageRestoData.data !== undefined) {
            form.setFieldsValue({
                hrg_jual: onePackageRestoData?.data[0]?.hrg_jual,
            });
            rumus();
        }
    }, [form, onePackageRestoData.data, persenSrvChg, persenSrvChg]);    


    

    ///HOOKs
    const { data: dataSetting } = useSettingData(true);
    const { data: dataMeja } = useMejaOrderByStatusData("0", true);
    const { data: dataPackageResto } = usePackageRestoData(true);
    const { mutateAsync: dataUpdateRegistrasiResto } = useUpdateRegistrasiRestoData();
  

    const rumus = () => {
        ///cek pb1, srvChg
        ///cek pb1
        if (dataPackageResto?.data[0].tax_status === "1") {
            let persenPb1 = dataSetting?.data[0].persen / 100;
            setPersenPbSatu(persenPb1);
        } else {
            setPersenPbSatu(0);
        }

        ///cek SrvChg
        if (dataPackageResto?.data[0].service_charge_status === "1") {
            let srvchg = dataSetting?.data[2].persen / 100;
            setPersenSrvChg(srvchg);
        } else {
            setPersenSrvChg(0);
        }        

        console.log(persenSrvChg);

        ///rumusnya
        let qty = form.getFieldValue("qty");
        let hpp = form.getFieldValue("hrg_jual");
        let discPersen = form.getFieldValue("disc_persen");
        let discRp = form.getFieldValue("disc_rp");
        let nDisc = form.getFieldValue("nilai_disc");
        let srvChgPersen = persenSrvChg;
        let pb1Persen = persenPbSatu;
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

        form.setFieldsValue({
            qty: qty,
            nilai_disc: nDisc,
            hrg_stl_disc: jumlah,
            service_charge_persen: srvChgPersen,
            nilai_service_charge: nSrvChg,
            pb_satu_persen: pb1Persen,
            nilai_pb_satu: nPb1,
            total: total,
        });
    };

    const onFinish = async (v) => {
        ///ambil data dari package resto
        setIsLoading(true);
        // let item = onePackageRestoData.data[0];
        // console.log(item);        

        let data = {
            registrasi_id: numberIdentifikasi,
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
                    updator: userid,
        };
        await dataUpdateRegistrasiResto([props.selectedData.id, data]);
        setIsLoading(false);
        form.setFieldsValue({ items_id: null, qty: 1, total: 0, remark: null });
        props.closeModal();
    };

    const onChangeForm = () => {
        // console.log("FFFF");
        rumus();
        console.log("CCCCCCCCC");
    };

 
    const onChangePackage = (v) => {
        setItemsId(v);
        dispatch(getOnePackageResto(v));
        // console.log("X");


        rumus();
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
                name="form-edit-resto"
                onFinish={onFinish}
                initialValues={{ qty: 1 }}
                onChange={onChangeForm}
            // onClick={onChangeLocation}
            // onFieldsChange={onChangeLocation}
            // style={{
            //     maxWidth: 600,
            // }}
            >
                <Form.Item hidden name="no_meja" label="No. Meja">
                    <Select
                        showSearch
                        // onChange={onChangeCostCenter}
                        placeholder="Optional"
                        // optionLabelProp="children"
                        optionFilterProp="children"
                        // onSearch={onSearchAkun}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        allowClear
                        // disabled={disabledCostCenter}
                        options={dataMeja?.data?.map((e) => ({
                            value: e.id,
                            label: e.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item  name="items_id" label="Item">
                    <Select
                    disabled
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
                        options={dataPackageResto?.data?.map((e) => ({
                            value: e.id,
                            label: e.id + " @" + e.name,
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
                        style={{ width: 120, backgroundColor: "#E9E7E7" }}
                    />
                </Form.Item>

                <Form.Item name="qty" label="Qty">
                    <InputNumber formatter={formatter} parser={parser} />
                </Form.Item>

                <Form.Item
                hidden={props.discHidden}
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

                <Form.Item 
                hidden 
                name="total" label="Price">
                    <InputNumber
                        disabled
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "120px" }}
                    />
                </Form.Item>

                <Form.Item name="remark" label="Remark">
                    <TextArea rows={3} placeholder="Optional" />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 1, span: 16 }}>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            style={{ width: 100 }}
                        >
                            Update
                        </Button>
                        {/* <Button onClick={onReset} type="text">Clear</Button> */}
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditRegisFormRestoOrder;
