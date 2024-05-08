import React, { useEffect, useRef, useState } from "react";
import PageInfoPlayer from "./PageInfoPlayer";
import PageInfoTotalDriving from "./PageInfoTotalDriving";
import PageInfoTotalFood from "./PageInfoTotalFood";
import PageInfoTotalBeverages from "./PageInfoTotalBeverages";
import PageInfoGrandTotal from "./PageInfoGrandTotal";
import TabDetailsOrder from "../../../components/billing/TabDetailsOrder";
import { Button, Collapse, Divider, Dropdown, Modal } from "antd";
import PagePaymentMetode from "../paymentmaster/PagePaymentMetode";
import PagePrintBilling from "../billing/PagePrintBilling";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import PageSplitBill from "../billing/PageSpliteBill";
import PageSpliteBillByItems from "../billing/PageSplitBillByItems";
import PageMergeBill from "../billing/PageMergeBill";
import {
    FaMoneyBillWave,
    FaReceipt,
    FaDivide,
    FaObjectGroup,
} from "react-icons/fa6";
import PagePrintBillingCharged from "../billing/PagePrintBillingCharged";
import { useChargedByPayerData } from "../../../hooks/useCharged";
import { useSelector } from "react-redux";

const PageDetailsPayment = () => {
    const componentRef = useRef();

    const { matrixSelected } = useSelector((state) => state.mymatrixselected);

    const [isShowPayment, setisShowPayment] = useState(false);
    const [isShowSplitBill, setisShowSplitBill] = useState(false);
    const [isShowSplitBillPerItems, setisShowSplitBillPerItems] =
        useState(false);
    const [isShowMergeBill, setisShowMergeBill] = useState(false);
    const [isShowPrint, setisShowPrint] = useState(false);

    ///HOOKs
    const { data } = useChargedByPayerData(matrixSelected.registrasi_id, true);

    const myitems = [
        {
            key: "1",
            label: "Total Driving & Discount",
            children: <PageInfoTotalDriving />,
        },
        {
            key: "2",
            label: "Total Food & Discount",
            children: <PageInfoTotalFood />,
        },
        {
            key: "3",
            label: "Total Beverages & Discount",
            children: <PageInfoTotalBeverages />,
        },
    ];

    const items = [
        {
            label: "Shared",
            key: "0",
        },
        {
            label: "By Items",
            key: "1",
        },
    ];

    const handleClickPayment = () => {
        setisShowPayment(true);
    };

    const handleClickPrintBill = useReactToPrint({
        content: () => componentRef.current,
        // onBeforePrint:()=> setIsPrinting(true),
    });

    const handleClickSplitBill = ({ key }) => {
        if (key === "0") {
            setisShowSplitBill(true);
        } else {
            setisShowSplitBillPerItems(true);
        }
    };

    return (
        <div>
            {/* <div>
                <div className="flex flex-wrap justify-between items-start gap-3">
                    <div className="flex justify-start items-start gap-3">
                        <PageInfoPlayer />
                        <Collapse items={items} defaultActiveKey={['4']} />
                        <div className="flex flex-wrap justify-start items-center gap-3 my-3">
                            <Button onClick={handleClickPayment}>Payment</Button>
                        </div>
                        <TabDetailsOrder />
                    </div>
                    <div>
                        <PagePrintBilling ref={componentRef} />
                        <ReactToPrint
                            trigger={() => <button>Cetak Halaman</button>}
                            content={() => componentRef.current}
                        />
                    </div>
                </div>
                <div>

                </div>
            </div> */}

            <div className="flex flex-wrap justify-start items-start gap-7">
                <div className="flex-1">
                    <div className="flex justify-start items-start gap-3">
                        <div>
                            <PageInfoPlayer />
                        </div>
                        <div className="w-[300px]">
                            <Collapse
                                items={myitems}
                                defaultActiveKey={["4"]}
                            />
                        </div>
                        <div>
                            <PageInfoGrandTotal />
                        </div>
                    </div>
                    <div>
                        <Divider />
                        <div className="flex flex-wrap justify-start items-center gap-3 my-3">
                            <Button
                                onClick={handleClickPayment}
                                type="primary"
                                icon={<FaMoneyBillWave />}
                            >
                                Payment
                            </Button>
                            <Button
                                onClick={handleClickPrintBill}
                                icon={<FaReceipt />}
                            >
                                Print Bill
                            </Button>
                            {/* <Button onClick={()=>{setisShowPrint(true); }} icon={<FaReceipt />}>Print Bill</Button> */}
                            <Dropdown
                                menu={{
                                    items,
                                    onClick: handleClickSplitBill,
                                }}
                                trigger={["click"]}
                            >
                                <Button icon={<FaDivide />}>Split Bill</Button>
                            </Dropdown>
                            <Button
                                onClick={() => setisShowMergeBill(true)}
                                icon={<FaObjectGroup />}
                            >
                                Join Bill
                            </Button>
                        </div>
                        <Divider />

                        {/* detail transaksi */}
                        <TabDetailsOrder />
                        {/* end detail transaksi */}
                    </div>
                </div>
                <div>
                    {/* <div className="mt-3">
                        <ReactToPrint
                            trigger={() => <Button type="primary">Print Bill</Button>}
                            content={() => componentRef.current}
                        />
                    </div> */}

                    <PagePrintBilling ref={componentRef} />
                </div>
            </div>

            {/* MODAL SHOW PAYMENT */}
            <Modal
                title="Payment Methode"
                open={isShowPayment}
                onCancel={() => setisShowPayment(false)}
                width={750}
                footer={false}
            >
                <PagePaymentMetode closeModal={() => setisShowPayment(false)} />
            </Modal>
            {/* END MODAL SHOW PAYMENT */}

            {/* SHOW SPLIT BILL */}
            <Modal
                title="Split Bill Shared"
                open={isShowSplitBill}
                onCancel={() => setisShowSplitBill(false)}
                width={350}
            >
                <PageSplitBill />
            </Modal>
            {/* END SHOW SPLIT BILL */}

            {/* SHOW SPLIT BILL Per Items */}
            <Modal
                title="Split Bill By Items"
                open={isShowSplitBillPerItems}
                onCancel={() => setisShowSplitBillPerItems(false)}
                width={550}
                footer={false}
            >
                <PageSpliteBillByItems
                    closeModal={() => setisShowSplitBillPerItems()}
                />
            </Modal>
            {/* END SHOW SPLIT BILL Per Items */}

            {/* SHOW MERGE BILL */}
            <Modal
                title="Join Bill"
                open={isShowMergeBill}
                onCancel={() => setisShowMergeBill(false)}
                width={"90%"}
                footer={false}
            >
                <PageMergeBill closeModal={() => setisShowMergeBill()} />
            </Modal>
            {/* END SHOW MERGE BILL */}

            {/* SHOW MODAL PRINT */}
            <Modal
                // title="Merge Bill"
                open={isShowPrint}
                onCancel={() => setisShowPrint(false)}
                width={350}
                footer={false}
            >
                <div ref={componentRef}>
                    <div className="mb-5">
                        <PagePrintBilling />
                    </div>
                    {data?.data !== undefined ? (
                        <Divider
                            style={{
                                margin: "5px 0px",
                                borderColor: "#5E5D5D",
                                borderStyle: "dashed",
                            }}
                        >
                            Charged
                        </Divider>
                    ) : null}
                    {data?.data?.map((e, i) => {
                        return (
                            <div key={i} className="mb-5">
                                <PagePrintBillingCharged regisId={e.id} />{" "}
                            </div>
                        );
                    })}
                </div>
            </Modal>

            {/* END SHOW MODAL PRINT */}
        </div>
    );
};

export default PageDetailsPayment;
