import React, { useEffect, useState } from "react";
import { Card, Divider } from "antd";
import {
    useBayData,
    useUpdateStatusBayData,
    useUpdateTimeCurrentBayData,
} from "../../../hooks/useBayData";

const PageDisplayTamu = () => {
    const [counter, setCounter] = useState();

    // useEffect(() => {
    //     const a = setInterval(() => {

    //         ///update durasi bay
    //          mutateUpdateTimeCurrentBay();

    //         ///update status kembali ke 0 jika durasinya sudah selesai
    //          mutateUpdateStatusBay();
    //     }, 1000);
    //     return()=>{
    //         clearInterval(a);
    //     }
    // });

    ///HOOKs
    const { data } = useBayData([1, 44], true);

    return (
        <div>
            <div className="flex flex-wrap justify-center items-center gap-7 ">
                {data?.data.map((e, key) => {
                    return (
                        <div key={key}>
                            <Card
                                title={<div className="text-center">BAY</div>}
                                size="small"
                                style={{ width: "220px" }}
                                styles={{
                                    header: {
                                        backgroundColor: e.status === "1" ? "#B42121" : "#138830",
                                        color: e.status === "1" ? "#A1A1A1" : "#FFFFFF",
                                        fontSize: "16px",
                                    },
                                    body: {
                                        backgroundColor: e.status === "1" ? "#F0EEEE" : null,
                                        color: e.status === "1" ? "#DAD6D6" : "#131574",
                                        // fontWeight: "bold",
                                    },
                                }}

                            >
                                <div className="text-7xl font-semibold text-center pb-2">{e.id}</div>
                                {/* <div className="flex justify-center items-center">
                                    {e.status === "1" ?(
                                        <div className="text-7xl font-semibold text-center bg-[#e2e3e4] rounded-lg w-28 pb-2">{e.id}</div>
                                    ): (

                                        <div className="text-7xl font-semibold text-center bg-[#003B46] rounded-lg w-32 pt-3 pb-5">{e.id}</div>
                                    )}
                                </div> */}
                            </Card>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PageDisplayTamu;
