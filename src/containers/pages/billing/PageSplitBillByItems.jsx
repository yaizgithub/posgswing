import React, { useEffect, useRef, useState } from "react";
import { useAllBillingData } from "../../../hooks/useBillingData";
import { useSelector } from "react-redux";
import {
    Button,
    Divider,
    Flex,
    Input,
    InputNumber,
    Modal,
    Skeleton,
    Space,
} from "antd";
import PagePrintBilling from "./PagePrintBilling";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import PagePrintSplitBillByItems from "./PagePrintSplitBillByItems";
import PagePrintPembagianSplitBillByItems from "./PagePrintPembagianSplitBillByItems";
import axios from "axios";
import { baseUrl } from "../../../config";

const PageSpliteBillByItems = (props) => {
    const childRef = useRef();
    const inputRef = useRef(null);

    const { matrixSelected } = useSelector((state) => state.mymatrixselected);

    const [daftarNama, setDaftarNama] = useState([]);
    const [nama, setNama] = useState("");
    const [isShowPembagianSplitBill, setisShowPembagianSplitBill] =
        useState(false);

    ///HOOKs
    const {
        data: dataAllBilling,
        isLoading,
        isError,
        error,
    } = useAllBillingData(matrixSelected.registrasi_id);
    // const { data: dataPayment } = usePaymentOrderByRegistrasiIdData(
    //     matrixSelected.registrasi_id,
    //     true
    // );

    useEffect(() => {
        if (dataAllBilling?.data !== undefined) {
            console.log(dataAllBilling?.data);
        }
    }, [dataAllBilling]);

    useEffect(() => { }, [daftarNama]);

    if (isLoading) {
        return (
            <div>
                <Skeleton active />
            </div>
        );
    }

    if (isError) {
        console.log(error.message);
        return (
            <div>
                <div className="text-red-600 mb-2">{error.message}</div>
                <Skeleton active />
            </div>
        );
    }

    const handleChangeNama = (e) => {
        console.log(e.target.value);
        setNama(e.target.value);
    };

    // const handleClickPrintBill = useReactToPrint({
    //     content: () => componentRef.current,
    //   });

    const onClickAdd = () => {
        setDaftarNama([...daftarNama, nama]);
        setNama(null);
        console.log(daftarNama);

        // Set focus pada input setelah tombol diklik
        inputRef.current.focus();
    };

    const onClickClear = async() => {
        setDaftarNama([]);
        
        ///bersihkan data di database
        await axios.delete(baseUrl+`/splitbill`).then(()=>{
            console.log('berhasil menghapus data');
        }).catch((err)=>alert('error delete splitbill'));


    };

    return (
        <div>
            <div className="my-3">
                <Flex justify="start" gap={10} align="center">
                    <div>Name : </div>
                    <Input
                        ref={inputRef}
                        value={nama}
                        onChange={handleChangeNama}
                        style={{ width: "200px" }}
                    />
                    <Button onClick={onClickAdd}>Add</Button>
                    <Button onClick={onClickClear}>clear</Button>
                </Flex>
                <div className="mt-2 ml-14">
                    {daftarNama.map((data, index) => (
                        <span
                            key={index}
                            className="ml-[5px] px-3 py-1 bg-amber-500 rounded-md"
                        >
                            {data}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap justify-between items-start">
                <div>
                    {/* <div className="mt-3">
                        <ReactToPrint
                            trigger={() => <Button type="primary">Print Bill</Button>}
                            content={() => componentRef.current}
                        />
                    </div> */}
                    <PagePrintSplitBillByItems
                        // ref={componentRef}
                        daftarNama={daftarNama}
                    />
                </div>
                {/* <div>
                    <PagePrintBilling />
                </div>  */}
            </div>

            <Divider />
            <div className="text-right">
                <Space>
                    <Button onClick={() => props.closeModal(false)}>Close</Button>
                    <Button
                        type="primary"
                        onClick={() => setisShowPembagianSplitBill(true)}
                    >
                        OK
                    </Button>
                </Space>
            </div>

            {/* SHOW SPLIT BILL Per Items */}
            <Modal
                title="Print Split Bill By Items"
                open={isShowPembagianSplitBill}
                onCancel={() => setisShowPembagianSplitBill(false)}
                width={350}
                onOk={() => setisShowPembagianSplitBill(false)}
                style={{ top: 20 }}
                footer={false}
            >
                <div>
                    <div className="mt-3">
                        <ReactToPrint
                            trigger={() => <Button type="primary">Print Bill</Button>}
                            content={() => childRef.current}
                        />
                    </div>
                    <div ref={childRef}>
                        {daftarNama.map((e, i) => (
                            <div key={i} className="mb-5">
                                <PagePrintPembagianSplitBillByItems nama={e} />
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
            {/* END SHOW SPLIT BILL Per Items */}
        </div>
    );
};

export default PageSpliteBillByItems;
