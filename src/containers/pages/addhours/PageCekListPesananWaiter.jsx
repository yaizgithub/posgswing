import React, { useEffect } from "react";
import TableCekListPesananReservasiWaiter from "../../../components/addhours/TableCekListPesananReservasiWaiter";
import { reduxUpdateTitle } from "../../../features/titleSlice";
import { useDispatch } from "react-redux";
import { Card } from "antd";
import TableCekListPesananWaiter from "../../../components/addhours/TableCekListPesananWaiter";

const PageCekListPesananWaiter = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            reduxUpdateTitle({
                rTitle: "List Pesanan",
            })
        );
    }, [dispatch]);
    return (
        <div>
            {/* <Card
                title="Reservasi Order"
                size="small"
                styles={{ header: { backgroundColor: "#7077A1", color: "#ffffff" } }}
            >
                <TableCekListPesananReservasiWaiter />
            </Card> */}
            <Card
                title="Today Order"
                size="small"
                styles={{ header: { backgroundColor: "#08633D", color: "#ffffff" } }}
            >
                <TableCekListPesananWaiter />
            </Card>
        </div>
    );
};

export default PageCekListPesananWaiter;
