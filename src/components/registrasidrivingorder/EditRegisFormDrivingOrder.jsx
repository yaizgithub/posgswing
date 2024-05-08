import { Button, Form, InputNumber, Select, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import { usePackageDrivingData } from "../../hooks/usePackageDrivingData";
import { useDispatch, useSelector } from "react-redux";
import { getOnePackageDriving } from "../../features/packagedriving/onepackagedrivingSlice";
import {
    useTotalJamRegistrasiDrivinRegisIdData,
    useUpdateRegistrasiDrivingData,
} from "../../hooks/registrasi/useRegistrasiDrivingData";
import { reduxUpdateQtyDriving } from "../../features/mydataselectedSlice";
import { useWaktuServerData } from "../../hooks/useWaktuServer";
import { useSettingData } from "../../hooks/useSettingData";
import dayjs from "dayjs";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const EditRegisFormDrivingOrder = (props) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const dispatch = useDispatch();
    const onePackageDrivingData = useSelector((state) => state.onepackagedriving);
    const { numberIdentifikasi } = useSelector((state) => state.mydataselected);
    const { userid } = useSelector((state) => state.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [itemsId, setItemsId] = useState("");
    const [persenPpn, setPersenPpn] = useState(0);    

    useEffect(() => {
        console.log(props.selectedData);
        let v = props.selectedData;
        form.setFieldsValue({
            items_id: v.items_id,
            qty_jam: v.qty_jam,
            qty: v.qty,
            hrg_jual: v.hrg_jual,
            disc_persen: v.disc_persen,
            disc_rp: v.disc_rp,
            nilai_persen: v.nilai_persen,
            nilai_disc: v.nilai_disc,
            hrg_stl_disc: v.hrg_stl_disc,
            ppn_persen: v.ppn_persen,
            nilai_ppn: v.nilai_ppn,
            total: v.total,
            status: v.status,
        });        
        ///cek pb1
        if (dataPackageDriving?.data[0].tax_status === "1") {
            let persenPpn = dataSetting?.data[1].persen / 100;
            setPersenPpn(persenPpn);
        } else {
            setPersenPpn(0);
        }     
        rumus();   
    }, [form, props.selectedData]);


    useEffect(() => {
        if (onePackageDrivingData.data !== undefined) {
            form.setFieldsValue({
                qty_jam: onePackageDrivingData?.data[0]?.qty_jam,
                hrg_jual: onePackageDrivingData?.data[0]?.hrg_jual,
                disc_persen:onePackageDrivingData?.data[0]?.disc_persen,
            });
            rumus();            
        }
    }, [form, onePackageDrivingData.data,persenPpn]);


    

    ///HOOKs
    const { data: dataSetting } = useSettingData(true);
    const { data: dataWaktuServer } = useWaktuServerData(true);
    const { data: dataPackageDriving } = usePackageDrivingData(true);
    const { mutateAsync: dataUpdateRegistrasiDriving } =
        useUpdateRegistrasiDrivingData();
    const { refetch: refetchTotalJamDrivingOrder } =
        useTotalJamRegistrasiDrivinRegisIdData(numberIdentifikasi, true);

    const successMessage = () => {
        messageApi.open({
            type: "success",
            content: "Updated data success",
        });
    };

    const rumus = () => {
        ///cek ppn, srvChg

        ///rumusnya
        let qty = form.getFieldValue("qty");
        let hpp = form.getFieldValue("hrg_jual");
        let discPersen = form.getFieldValue("disc_persen");
        let discRp = form.getFieldValue("disc_rp");
        let nDisc = form.getFieldValue("nilai_disc");
        let ppnPersen = persenPpn;
        if (discPersen > 0) {
            nDisc = hpp * (discPersen / 100);
        } else if (discRp > 0) {
            nDisc = discRp;
        } else {
            nDisc = 0;
        }
        let priceAf = hpp - nDisc;
        let jumlah = priceAf * qty;
        let nPpn = jumlah * ppnPersen;
        let total = jumlah + nPpn;

        form.setFieldsValue({
            qty: qty,
            nilai_disc: nDisc,
            hrg_stl_disc: jumlah,
            ppn_persen: ppnPersen,
            nilai_ppn: nPpn,
            total: total,
        });
    };    

    const onFinish = async (v) => {
        setIsLoading(true);
        dispatch(reduxUpdateQtyDriving({ qtyDriving: v.qty_jam }));

        ///ambil data dari package driving
        // let item = onePackageDrivingData.data[0];
        let data = {
            // id: props.selectedData.id,
            registrasi_id: numberIdentifikasi,
            items_id: v.items_id,
            time_start:dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
            time_end:dayjs(dataWaktuServer?.waktuserver).add(v.qty_jam,"hour").format("HH:mm:ss"),
            qty_jam: v.qty_jam,
            qty: v.qty,
            hrg_jual: v.hrg_jual,
            disc_persen: v.disc_persen,
            disc_rp: v.disc_rp,
            nilai_persen: v.nilai_persen,
            nilai_disc: v.nilai_disc,
            hrg_stl_disc: v.hrg_stl_disc,
            ppn_persen: v.ppn_persen,
            nilai_ppn: v.nilai_ppn,
            total: v.total,
            status: v.status,
            user_id: userid,
            updator: userid,
        };
        await dataUpdateRegistrasiDriving([props.selectedData.id, data]);

        //hitung total jam
        refetchTotalJamDrivingOrder();
        setIsLoading(false);
        successMessage();
        props.closeModal();
    };

    const onChangeForm = () => {
        // console.log("FFFF");
        rumus();
    };    

    const onChangePackage = (v) => {
        setItemsId(v);
        dispatch(getOnePackageDriving(v));
        // console.log("X");

        ///cek pb1
        if (dataPackageDriving?.data[0].tax_status === "1") {
            let persenPpn = dataSetting?.data[1].persen / 100;
            setPersenPpn(persenPpn);
        } else {
            setPersenPpn(0);
        }
        rumus();
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
                name="form-edit-regis-driving"
                onFinish={onFinish}
                onChange={onChangeForm}
            // initialValues={{ items_id:props.selectedData.items_id, qty: props.selectedData.qty, total:props.selectedData.total }}
            // onClick={onChangeLocation}
            // onFieldsChange={onChangeLocation}
            // style={{
            //     maxWidth: 600,
            // }}
            >
                <Form.Item name="items_id" label="Paket Driving">
                    <Select
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
                        options={dataPackageDriving?.data?.map((e) => ({
                            value: e.id,
                            label: e.id + " @" + e.name,
                        }))}
                    />
                </Form.Item>

                <Form.Item name="hrg_jual" label="Price">
                    <InputNumber
                        readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: 120, backgroundColor: "silver" }}
                    />
                </Form.Item>

                <Form.Item
                hidden
                    name="qty_jam"
                    label="Qty Jam"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <InputNumber disabled formatter={formatter} parser={parser} />
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
                    <InputNumber formatter={formatter} parser={parser} />
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
                        label="PriceAf"
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
                    // hidden
                    label="Ppn"
                    style={{
                        marginBottom: 0,
                    }}
                >
                    <Form.Item
                        name="ppn_persen"
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
                        name="nilai_ppn"
                        label="nPpn"
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

                <Form.Item name="total" label="Amount">
                    <InputNumber
                        disabled
                        formatter={formatter}
                        parser={parser}
                        style={{ width: "120px" }}
                    />
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

export default EditRegisFormDrivingOrder;
