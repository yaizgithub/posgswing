import React, { forwardRef, useEffect, useState } from "react";
import { useWaktuServerData } from "../../../hooks/useWaktuServer";
import { useSelector } from "react-redux";
import { Divider, Skeleton } from "antd";
import dayjs from "dayjs";

import { useLocation } from "react-router-dom";
import { useRegistrasiRestoOrderByRegistrasiIdData } from "../../../hooks/registrasi/useRegistrasiRestoData";


const PagePrintRestoOrder = forwardRef((props, ref) => {
    // const contentRef = useRef();
    // // Mengekspos fungsi pencetakan ke komponen induk
    // useImperativeHandle(ref, () => ({
    //     printChildContent: () => {
    //         window.print(); // Atau panggil fungsi pencetakan kustom di sini
    //     },
    // }));

    const { matrixSelected } = useSelector((state) => state.mymatrixselected);
    const location = useLocation();

    const [dataPrint, setDataPrint] = useState({
        regisid:"",
        nama:"",
        bay:"",
        nomeja:"",
    });


    // const regisId = location.state.regisId;
    let jumlah = 0;

    ///HOOKs
    const { data: waktuServer } = useWaktuServerData();
    const { data, isLoading, isError, error } =
        useRegistrasiRestoOrderByRegistrasiIdData(
            matrixSelected.registrasi_id,
            true
        );

        useEffect(() => {
            if (data?.data !== undefined) {
                setDataPrint({
                    regisid:data.data[0].registrasi_id,
                    nama:data.data[0].nama,
                    bay:data.data[0].bay,
                    nomeja:data.data[0].noMejaRestoran,
                });
            } else {
                setDataPrint({
                    regisid:"",
                    nama:"",
                    bay:"",
                    nomeja:"",
                });
            }
          }, [data])

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

            <div ref={ref} className="mt-5 bg-white m-0 w-[250px] pl-[10px] text-[12px]">
                <div className="mb-3 flex justify-between items-end">
                    <div>
                        <div>No. : {dataPrint.regisid}</div>
                        <div>Customer : {dataPrint.nama}</div>
                        <div className="font-bold">Bay : {dataPrint.bay ?? "-"}</div>
                    </div>
                    <div className="text-right pr-2">
                        {/* <div>{dayjs(waktuServer?.waktuserver).format("DD/MM/YYYY")}</div>                         */}
                        <div className="font-bold">No. Meja : {dataPrint.noMejaRestoran ?? "-"}</div>
                    </div>
                </div>
                <Divider
                    style={{
                        margin: "5px 0px",
                        borderColor: "#5E5D5D",
                        borderStyle: "dashed",
                    }}
                />

                {/* body */}
                <div>

                    {data?.data?.map((e, key) => {
                        jumlah = jumlah + e.qty;
                        return (
                            <div key={key} className="">
                                <ul>
                                    <div className="pl-3 flex justify-between pr-2 pb-1">
                                        <div>
                                            <li>{e.items_name} </li>
                                        </div>
                                        <div>
                                            <li>{e.qty}</li>
                                        </div>
                                    </div>
                                </ul>
                            </div>
                        );
                    })}
                    <Divider
                        style={{
                            margin: "5px 0px",
                            borderColor: "#5E5D5D",
                            borderStyle: "dashed",
                        }}
                    />
                    <div className="pl-3 flex justify-between pr-2 pb-1">
                        <div>Total</div>
                        <div>{jumlah}</div>
                    </div>
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
        </div>
    );
});

export default PagePrintRestoOrder;
