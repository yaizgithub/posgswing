import { Button, Form, Input, InputNumber, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import {
    useOnePackageDrivingData,
    usePackageDrivingData,
} from "../../hooks/usePackageDrivingData";
import { useDispatch, useSelector } from "react-redux";
import { getOnePackageDriving } from "../../features/packagedriving/onepackagedrivingSlice";
import {
    usePostReservasiDrivingData,
    useReservasiDrivingOrderByReservasiIdData,
    useUpdateReservasiDrivingData,
} from "../../hooks/reservasi/useReservasiDrivingData";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const EditFormDrivingOrder = (props) => {
    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const onePackageDrivingData = useSelector((state) => state.onepackagedriving);
    const { numberIdentifikasi } = useSelector((state) => state.mydataselected);
    const { userid } = useSelector((state) => state.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [itemsId, setItemsId] = useState("");

    let noUrutOrder = "";
    let panjangDataOrder=0;

    // useEffect(() => {
    //     const v = props.selectedData;
    //     // console.log(v);
    //     form.setFieldsValue({ 
    //         items_id: v.items_id,
    //         qty: v.qty,
    //         total: v.total });
    // }, [onePackageDrivingData.data, props.selectedData]);

    useEffect(() => {
        form.setFieldsValue({ qty: onePackageDrivingData?.data[0]?.qty_jam, total: onePackageDrivingData?.data[0]?.total });
    }, [onePackageDrivingData.data]);

    useEffect(() => {
        // console.log(props.selectedData);
      form.setFieldsValue({
        items_id:props.selectedData.items_id, 
        qty: props.selectedData.qty, 
        total:props.selectedData.total
      })
    }, [props.selectedData])


    
    ///HOOKs
    const { data: dataPackageDriving } = usePackageDrivingData(true);
    const { mutateAsync: dataUpdateReservasiDriving } =
        useUpdateReservasiDrivingData();
    const { data: dataReservasiDrivingOrderByReservasiId, isLoading:isLoadingDataReservasi } =
        useReservasiDrivingOrderByReservasiIdData(numberIdentifikasi, true);


    if (isLoadingDataReservasi) {
        return <span>Loading...</span>
    }

    if (dataReservasiDrivingOrderByReservasiId) {
        if (dataReservasiDrivingOrderByReservasiId.success) {
            // console.log(dataReservasiDrivingOrderByReservasiId?.data?.length);
            panjangDataOrder = dataReservasiDrivingOrderByReservasiId?.data?.length;
            ///cek panjang data reservasi driving order
            if (panjangDataOrder >= 1 && panjangDataOrder <= 9) {
                noUrutOrder = numberIdentifikasi + "-00" + (parseInt(panjangDataOrder) + 1);           
            } else if (panjangDataOrder > 10 && panjangDataOrder < 99) {
                noUrutOrder = numberIdentifikasi +"-0"+ (parseInt(panjangDataOrder) + 1);
            } else {
                noUrutOrder = numberIdentifikasi +"-"+ (parseInt(panjangDataOrder) + 1);
            } 
        } else {
            noUrutOrder = numberIdentifikasi + "-001";
        }
            
    }  

    const onFinish = async (v) => {
        
        // let panjangDataOrder = 0;
        // if (dataReservasiDrivingOrderByReservasiId) {
        //     panjangDataOrder = dataReservasiDrivingOrderByReservasiId?.data.length;

        //     ///cek panjang data reservasi driving order
        //     if (panjangDataOrder >= 1 && panjangDataOrder < 2) {
        //         noUrutOrder = numberIdentifikasi + "-00" + panjangDataOrder + 1;
        //     } else {
        //         noUrutOrder = numberIdentifikasi + panjangDataOrder + 1;
        //     }
        // }

        ///ambil data dari package driving
        let item = onePackageDrivingData.data[0];
        let data = {
            // id: props.selectedData.id,
            reservasi_id: numberIdentifikasi,
            items_id: v.items_id,
            qty: v.qty,
            hrg_jual: item.hrg_jual,
            disc_persen: item.disc_persen,
            nilai_disc: item.nilai_disc,
            hrg_stl_disc: item.hrg_stl_disc,
            nilai_ppn: item.nilai_ppn,
            total: item.total,
            status: "0",
            user_id: userid,
            updator: userid,
        };
        await dataUpdateReservasiDriving([props.selectedData.id, data]);
        props.closeModal();
    };

    const onChangePackage = (v) => {
        setItemsId(v);
        dispatch(getOnePackageDriving(v));
    };

    const onReset=()=>{
        form.setFieldsValue({items_id:null, qty:0, total:0});
        setIsLoading(false);
    }

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
                name="form-edit-reservasi-driving"
                onFinish={onFinish}
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

                <Form.Item name="qty" label="Qty" hidden>
                    <InputNumber formatter={formatter} parser={parser} />
                </Form.Item>

                <Form.Item name="total" label="Price">
                    <InputNumber readOnly
                        formatter={formatter}
                        parser={parser}
                        style={{ width: 120, backgroundColor:"silver" }}
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

export default EditFormDrivingOrder;
