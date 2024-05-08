import { Button, Card, Descriptions, Drawer, Flex, Space, message } from "antd";
import React, { useState, useRef  } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import TabDetailsOrder from "./TabDetailsOrder";
import BillingDrivingOrder from "../registrasidrivingorder/BillingDrivingOrder";
import BillingRestoOrder from "../registrasirestoorder/BillingRestoOrder";
import BillingPayment from "./BillingPayment";
import TabPaymentMaster from "../paymentmaster/TabPaymentMaster";
import { CloseOutlined } from "@ant-design/icons";
import TablePayment from "../payment/TablePayment";
import { useUpdateStatusFinishToPaidMatrixBay } from "../../hooks/useMatrixbayData";
import { useNavigate } from "react-router-dom";
import {useReactToPrint} from 'react-to-print';
import PagePrintBilling from "../../containers/pages/billing/PagePrintBilling";
import axios from "axios";
import { baseUrl } from "../../config";
import { useUpdateStatusRegistrasiByIdData, useUpdateStatusRegistrasiByMejaData } from "../../hooks/registrasi/useRegistrasiData";
import { useUpdateStatusMejaData } from "../../hooks/useMejaData";

const BillingDescriptiom = (props) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    
  

    const dispatch = useDispatch();
    const { dataSelected } = useSelector((state) => state.mydataselected);        
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);        

    const [isShowModal, setIsShowModal] = useState(false);

    ///HOOKs
    const {mutateAsync: mutateUpdateStatusFinishToPaidMatrixBay} =useUpdateStatusFinishToPaidMatrixBay();
    const {mutateAsync: mutateUpdateStatusRegistrasiById} =useUpdateStatusRegistrasiByIdData();
    const {mutateAsync: mutateUpdateStatusRegistrasiByMeja} =useUpdateStatusRegistrasiByMejaData();
    const {mutateAsync: mutateUpdateStatusMeja} =useUpdateStatusMejaData();



    const successMessage = (type, message) => {
        messageApi.open({
            type: type,
            content: message,
        });
    };

    const items = [
        {
            key: "date",
            label: "Date",
            children: dayjs(dataSelected.date).format("DD/MM/YYYY"),
        },
        {
            key: "nama",
            label: "Customer",
            children: dataSelected.nama,
        },
        {
            key: "no_hp",
            label: "Handphone",
            children: dataSelected.no_hp,
        },

        {
            key: "id",
            label: "Registrasi",
            children: dataSelected.id,
        },

        {
            key: "alamat",
            label: "Alamat",
            children: dataSelected.alamat,
        },
    ];

    const onClickButtonPayment = () => {
        setIsShowModal(true);
    };

    const onClickPosting=async()=>{
        ///isi kembali cell dengan status paid
        let data = {
            isiCell: matrixSelected.namaCustomer + ",paid," + matrixSelected.registrasi_id,
            registrasi_id: matrixSelected.registrasi_id,
        };      
        await mutateUpdateStatusFinishToPaidMatrixBay([matrixSelected.namaBay, data]);


        if (matrixSelected.no_meja) {
            ///update status registrasi by no meja  
            let dt={status:"1"}     
            await mutateUpdateStatusRegistrasiByMeja([matrixSelected.no_meja, dt]);    


            ///ubah status meja di tbl_meja
            let a = {
                status:"0",
            }
            await mutateUpdateStatusMeja([matrixSelected.no_meja, a]);        
        } else {
            ///update status registrasi by id  
            let x={status:"1"}     
            await mutateUpdateStatusRegistrasiById([matrixSelected.registrasi_id, x]);
        }



        successMessage("success", "Posting data success");
        props.closeModal();
        setIsShowModal(false);
    }

    const componentRef = useRef();
    const handlePrint= useReactToPrint({
        content:()=>componentRef.current,
    })


    // const onClickBilling=()=>{
    //     navigate("/print-bill");
    // }

    return (
        <div>
            {contextHolder}
            <div>
                <div className="invisible absolute">
                    <PagePrintBilling ref={componentRef}/>
                </div>
                <div className="mb-5">
                    <Flex justify="center">
                        {/* customer info */}
                        <Descriptions
                            // title="Customer Info"
                            items={items}
                            bordered
                            size="small"
                            layout="horizontal"
                            style={{ width: "90%" }}
                            labelStyle={{ backgroundColor: "#EBEBEB" }}
                        />
                        {/* end customer info */}
                    </Flex>
                </div>
                <div className="flex flex-wrap justify-around pl-3 pr-3">
                    <div>
                        <Card title="Driving Bill" size="small" style={{ width: "230px" }}>
                            <BillingDrivingOrder />
                        </Card>
                    </div>
                    <div>
                        <Card title="Resto Bill" size="small" style={{ width: "230px" }}>
                            <BillingRestoOrder />
                        </Card>
                    </div>
                    <div>
                        <Card title="Payment" size="small" style={{ width: "300px" }}>
                            <BillingPayment />
                        </Card>
                    </div>
                </div>
                <div>
                    <Space>
                        <Button
                            style={{
                                width: "80px",
                                backgroundColor: "#3468C0",
                                color: "#ffffff",
                            }}
                            onClick={onClickButtonPayment}
                        >
                            Payment
                        </Button>
                        <Button type="dashed" onClick={handlePrint}>
                            Bill
                        </Button>
                        {/* <ReactToPrint 
                            trigger={() => <Button>Print this out!</Button>}
                            content={() => componentRef}
                        />
                        <PagePrintBilling ref={(el) => (componentRef = el)} />
                         */}
                    </Space>

                    <div className="mt-5">
                        <Card title="Details" size="small">
                            <TabDetailsOrder />
                        </Card>
                    </div>
                </div>
            </div>

            <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setIsShowModal(false)}
                        />
                        <span className="pl-3">Payment Method</span>
                    </>
                }
                placement={"bottom"}
                closable={false}
                onClose={() => setIsShowModal(false)}
                open={isShowModal}
                key={"bill"}
                styles={{
                    header: {
                        background: "#3468C0",
                    },
                }}
                style={{ background: "#F5F5F5" }}
                // width={800}
                height={"70%"}
            >
                <div className="mb-5">
                    <TabPaymentMaster />
                </div>
                <div>
                    <Card size="small">
                        <TablePayment />
                    </Card>
                </div>
                <div className="mt-3">
                    <Button type="primary" onClick={onClickPosting}>Posting</Button>
                </div>
            </Drawer>
        </div>
    );
};

export default BillingDescriptiom;
