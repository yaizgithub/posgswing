import React, { forwardRef } from "react";
import {
    useAllBillingData,
} from "../../../hooks/useBillingData";
import { useWaktuServerData } from "../../../hooks/useWaktuServer";
import { useSelector } from "react-redux";
import { Button, Divider, Skeleton, Watermark } from "antd";
import imgLogo from "../../../image/logo.jpg";
import dayjs from "dayjs";
import { usePaymentOrderByRegistrasiIdData, useTotalPaymentData } from "../../../hooks/usePaymentData";

const PagePrintSplitBill = forwardRef((props, ref) => {
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);    
 
    ///HOOKs
    const { data: waktuServer } = useWaktuServerData();
    const { data: dataTotalPayment } = useTotalPaymentData(
        [matrixSelected.registrasi_id, matrixSelected.registrasi_id, matrixSelected.registrasi_id]
    );
    const {
        data: dataAllBilling,
        isLoading,
        isError,
        error,
    } = useAllBillingData(matrixSelected.registrasi_id);
    const {data: dataPayment} = usePaymentOrderByRegistrasiIdData(matrixSelected.registrasi_id, true)

    

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

    return (
        <div>
            {/* <ReactToPrint 
                trigger={()=>{
                    return <Button>Print</Button>
                }}
                content={()=>componentRef}
                pageStyle={"print"}
            /> */}
            <Watermark content="Split Bill GSwing">
            <div ref={ref} className="bg-white m-0 w-[290px] pl-[20px] text-[12px]">
                <div className="flex justify-center items-center">
                    <div>
                        <img src={imgLogo} width={"30px"} alt="imgLogo" />
                    </div>
                    <div className="font-semibold p-3 text-center text-[16px]">
                        GSWING
                    </div>
                </div>
                <div>
                    <div className="font-semibold text-center ">
                        Jl. Tanjung Bunga No. xxx
                    </div>
                    <div className="font-semibold text-center ">Makassar</div>
                    <div className="font-semibold text-center ">
                        0411 - 2222222, 3333333
                    </div>
                    <div className="font-semibold text-center ">71.xxx.xxx.x-801.000</div>
                </div>
                <Divider
                    style={{
                        margin: "5px 0px",
                        borderColor: "#5E5D5D",
                        borderStyle: "dashed",
                    }}
                />
                <div className="mb-3 flex justify-between items-end">
                    <div>
                        <div>No. : {dataAllBilling?.data[0].registrasi_id}</div>
                        <div>Customer : {props.namaCustomer}</div>
                        <div>Bay : {dataAllBilling?.data[0].bay ?? "-"}</div>
                    </div>
                    <div className="text-right pr-2">
                        <div>{dayjs(waktuServer?.waktuserver).format("DD/MM/YYYY")}</div>
                        <div>Cashier : {dataAllBilling?.data[0].namaUser}</div>
                        <div>No. Meja : {dataAllBilling?.data[0].no_meja ?? "-"}</div>
                    </div>
                </div>
                {/* <Divider style={{margin:"5px 0px", borderColor:"#5E5D5D", borderStyle:"dashed"}}/> */}

                {/* body */}
                <div>
                    {dataAllBilling?.data?.map((e, key) => {
                        let jumlah = (e.hrg_jual * e.qty) / props.jmlOrang;
                        // totQty = totQty + e.qty;
                        return (
                            <div key={key} className="">
                                <ul>
                                    <li>{e.items_name}</li>
                                    <div className="pl-3 flex justify-between pr-2 pb-1">
                                        <div>
                                            <li>
                                                {props.jmlOrang !== 1 ? 1 : e.qty}
                                            </li>
                                        </div>
                                        <div>
                                            <li>{jumlah.toLocaleString("id")}</li>
                                        </div>
                                    </div>
                                </ul>
                            </div>
                        );
                    })}

                    <Divider style={{margin:"5px 0px", borderColor:"#5E5D5D", borderStyle:"dashed"}}/>
                    {/* <div className="mt-3 flex justify-between items-center">
                        <div>Total Item</div>
                        <div className="pr-2">{totQty.toLocaleString("id")}</div>
                    </div> */}
                    <div className="flex justify-between items-center">
                        <div>Transaction</div>
                        <div className="pr-2">{(dataTotalPayment?.data[0].subTotal/props.jmlOrang).toLocaleString("id")}</div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>Disc</div>
                        <div className="pr-2">
                            {(dataTotalPayment?.data[0].totNilaiDisc/props.jmlOrang).toLocaleString("id")}
                        </div>
                    </div>                    

                    <div className="flex justify-between items-center">
                        <div>Service</div>
                        <div className="pr-2">
                        {(dataTotalPayment?.data[0].totSrvCharge/props.jmlOrang).toLocaleString("id")}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>Tax</div>
                        <div className="pr-2">
                        {(dataTotalPayment?.data[0].totNilaiPpn/props.jmlOrang).toLocaleString("id")}
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>Pb1</div>
                        <div className="pr-2">
                        {(dataTotalPayment?.data[0].totNilaiPpSatu/props.jmlOrang).toLocaleString("id")}
                        </div>
                    </div>
                    {/* <Divider style={{margin:"5px 0px", borderColor:"#5E5D5D", borderStyle:"dashed"}}/> */}
                    <div className="flex justify-between items-center">
                        <div className="text-[14px] font-semibold">Total</div>
                        <div className="pr-2 text-[14px] font-semibold">
                        {(dataTotalPayment?.data[0].grandTotal/props.jmlOrang).toLocaleString("id")}
                        </div>
                    </div>
                    {/* <div className="flex justify-between items-center">
                        <div>Change</div>
                        <div className="pr-2">
                            {(dataTotalPayment?.data[0].selisih/props.jmlOrang).toLocaleString("id")}
                        
                        </div>
                    </div> */}

                    {/* <div className="mt-3 mb-1">PAYMENT DETAIL :</div>

                    {dataPayment?.data.map((e, key) => (
                        <div key={key}>
                            <ul>
                                <div className="flex justify-between pr-2 pb-1">
                                    <div>
                                        <li>{e.description.toLocaleString("id")}</li>
                                    </div>
                                    <div>
                                        <li>{e.nilai_bayar.toLocaleString("id")}</li>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    ))} */}

                    <Divider
                        style={{
                            margin: "5px 0px",
                            borderColor: "#5E5D5D",
                            borderStyle: "dashed",
                        }}
                    />
                    <div className="italic">
                        Date :{" "}
                        {dayjs(waktuServer?.waktuserver).format("DD/MM/YYYY HH:mm:ss")}
                    </div>
                </div>
                {/* end body */}
            </div>
            </Watermark>

            
        </div>
    );
});




export default PagePrintSplitBill;
