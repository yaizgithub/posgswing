import React, { useEffect, useRef, useState } from "react";
import { useAllBillingData } from "../../../hooks/useBillingData";
import { useSelector } from "react-redux";
import { Button, Flex, Input, InputNumber, Skeleton } from "antd";
import PagePrintBilling from "./PagePrintBilling";
import PagePrintSplitBill from "./PagePrintSplitBill";
import ReactToPrint, { useReactToPrint } from "react-to-print";

const PageSpliteBill = () => {
    const childRef = useRef();
    const inputRef = useRef(null);
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);

    const [jmlOrang, setJmlOrang] = useState(1);
    const [nama, setNama] = useState("");
    const [daftarNama, setDaftarNama] = useState([]);

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
    //     content: () => childRef.current,
    //   });

    const onClickAdd = () => {
        setDaftarNama([...daftarNama, nama]);
        setNama(null);

        // console.log(daftarNama);

        // Set focus pada input setelah tombol diklik
        inputRef.current.focus();
    };

    const onClickClear = () => {
        setDaftarNama([]);
    };

    return (
        <div>
            <div className="my-3">
                {/* <Flex justify="start" gap={10} align="center">
                    <div>How much do you want to share? : </div>                    
                    <InputNumber
                        value={jmlOrang}
                        placeholder="Jumlah Orang"
                        style={{ width: "50px" }}
                        onChange={handleJumlahOrang}
                    />
                    <div>Name : </div>
                    <Input
                        value={nama}
                        placeholder="Jumlah Orang"
                        style={{ width: "250px" }}
                        onChange={handleChangeNama}
                    />
                </Flex> */}
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
                {/* <div>
                    <PagePrintBilling />
                </div> */}
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
                                <PagePrintSplitBill
                                    jmlOrang={daftarNama.length}
                                    namaCustomer={e}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageSpliteBill;
