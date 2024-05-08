import {  Table } from "antd";
import React from "react";
import {
    usePaymentOrderByRegistrasiIdData,
} from "../../hooks/usePaymentData";


const ViewTablePayment = (props) => {

    ///HOOKs
    const { data } = usePaymentOrderByRegistrasiIdData(props.registrasiID, true);    

    const columns = [               
        {
            title: "Payment",
            dataIndex: "description",
            key: "description",
            width: "120px",
        },
        {
            title: "Value",
            dataIndex: "nilai_bayar",
            key: "nilai_bayar",
            // width:"10px",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Remark",
            dataIndex: "remark",
            key: "remark",
            // width:"20px",
        },
    ];

    return (
        <div>
            <Table
                size="small"
                style={{ width: "550px" }}
                dataSource={data?.data}
                columns={columns}
                rowKey="id"                
            />
        </div>
    );
};

export default ViewTablePayment;
