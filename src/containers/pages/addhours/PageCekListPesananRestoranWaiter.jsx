import React, { useEffect } from "react";
import { reduxUpdateTitle } from "../../../features/titleSlice";
import { useDispatch } from "react-redux";
import { Card } from "antd";
import TableCekListPesananRestoranWaiter from "../../../components/addhours/TableCekListPesananRestoranWaiter";
import { useLocation } from "react-router-dom";

const PageCekListPesananRestoranWaiter = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(
            reduxUpdateTitle({
                rTitle: "List Pesanan",
            })
        );
    }, [dispatch]);
    return (
        <div>
            <Card
                title="Today Order"
                size="small"
                styles={{ header: { backgroundColor: "#08633D", color: "#ffffff" } }}
            >
                <TableCekListPesananRestoranWaiter nomorMeja={location.state.nomorMeja}/>
            </Card>
        </div>
    );
};

export default PageCekListPesananRestoranWaiter;
