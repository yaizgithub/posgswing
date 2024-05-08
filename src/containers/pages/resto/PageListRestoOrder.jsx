import React, { useEffect, useState } from "react";
import TableListRestoOrder from "../../../components/resto/TableListRestoOrder";
import TableRekapListRestoOrder from "../../../components/resto/TableRekapListRestoOrder";
import { useDispatch } from "react-redux";
import { reduxUpdateTitle } from "../../../features/titleSlice";
import { Card } from "antd";
import TableListReservasiRestoOrder from "../../../components/resto/TableListReservasiRestoOrder";
import TableListRestoOrderStatusSatuAtauDua from "../../../components/resto/TableListRestoOrderStatusSatuAtauDua";
import TableListReservasiRestoOrderStatusSatuAtauDua from "../../../components/resto/TableListReservasiRestoOrderStatusSatuAtauDua";
import TableListRestoOrderGroupBayAndMeja from "../../../components/resto/TableListRestoOrderGroupBayAndMeja";

const PageListRestoOrder = () => {
    const dispatch = useDispatch();



    useEffect(() => {
        dispatch(
            reduxUpdateTitle({
                rTitle: "List Order Resto",
            })
        );
    }, [dispatch]);



    return (
        <div>
            <div className="mb-5 flex flex-wrap justify-between items-start gap-7">
            <div className="flex-1">
                <Card
                    title="Reservasi Order (Waiting)"
                    size="small"
                    styles={{ header: { backgroundColor: "#7077A1", color: "#ffffff" } }}
                // extra={<div className="text-white font-semibold">{formatTime(currentTime)}</div>}
                >
                    <TableListReservasiRestoOrder />
                </Card>
            </div>
            <div  className="flex-1">
                <Card
                    title="Reservasi Order (Process)"
                    size="small"
                    styles={{ header: { backgroundColor: "#7077A1", color: "#ffffff" } }}
                // extra={<div className="text-white font-semibold">{formatTime(currentTime)}</div>}
                >
                    <TableListReservasiRestoOrderStatusSatuAtauDua />
                </Card>
            </div>
            </div>
            <div className="flex flex-wrap justify-between items-start gap-7">
                <div className="flex-1">
                    <div className="mb-10">
                        <Card
                            title="List Order Today (Waiting)"
                            size="small"
                            styles={{ header: { backgroundColor: "#08633D", color: "#ffffff" } }}

                        >
                            {/* <TableListRestoOrder /> */}
                            <TableListRestoOrderGroupBayAndMeja />
                        </Card>
                    </div>
                    {/* <div>
                        <Card
                            title="Total Order By Items"
                            size="small"
                            style={{ width: "500px" }}
                            styles={{ header: { backgroundColor: "#08633D", color: "#ffffff" } }}
                        >
                            <TableRekapListRestoOrder />
                        </Card>
                    </div> */}
                </div>
                <div className="flex-1">
                        <Card
                            title="List Order Today (Process & Ready)"
                            size="small"
                            styles={{ header: { backgroundColor: "#08633D", color: "#ffffff" } }}

                        >
                            <TableListRestoOrderStatusSatuAtauDua />
                        </Card>
                    </div>


            </div>
        </div>
    );
};

export default PageListRestoOrder;
