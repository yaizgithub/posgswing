import React, { useState } from "react";
import { Button, Card, Drawer, Input, Popconfirm, Skeleton, Table } from "antd";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDeleteReservasiData, useReservasiData } from "../../hooks/reservasi/useReservasiData";
import AddFormReservasi from "./AddFormReservasi";
import EditFormReservasi from "./EditFormReservasi";
import { useDispatch } from "react-redux";
import { reduxUpdateNumberIdentifikasi, reduxUpdateSelected } from "../../features/mydataselectedSlice";
import TabTableReservasi from "../../containers/pages/reservasi/TabTableReservasi";

const ViewReservasi = (props) => {

    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState("");
    const [isShowModal, setisShowModal] = useState(false);
    const [isShowModalUpdate, setisShowModalUpdate] = useState(false);    

    ///HOOKs
    const {mutateAsync:mutateDeleteReservasi} = useDeleteReservasiData();
    const { data, isLoading, isError, error } = useReservasiData(true);
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

    const columns = [
      
        {
            title: "id",
            dataIndex: "id",
            key: "id",
            filteredValue: [searchText],
            onFilter: (value, record) => {
                let status = record.status;
                if (status === "0") {
                    status = "open";
                } else if (status === "1") {
                    status = "release";
                }
                return (
                    String(record.id).toLowerCase().includes(value.toLowerCase()) ||
                    String(dayjs(record.date).format("DD/MM/YYYY"))
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    String(record.nama).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.no_hp).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.alamat).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.time).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.bay).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.sales).toLowerCase().includes(value.toLowerCase())
                );
            },
        },
        {
            title: "Date",
            // dataIndex: dayjs(data.data.date).format("DD/MM/YYY"),
            key: "date",
            render: (record) => {
                return dayjs(record.date).format("DD/MM/YYYY");
            },
        },
        {
            title: "Nama",
            dataIndex: "nama",
            key: "nama",
        },
        {
            title: "Handphone",
            dataIndex: "no_hp",
            key: "no_hp",
        },
        {
            title: "Alamat",
            dataIndex: "alamat",
            key: "alamat",
        },
        {
            title: "time",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "Bay",
            dataIndex: "bay",
            key: "bay",
        },
        {
            title: "Sales",
            dataIndex: "sales",
            key: "sales",
        },
    ];

    const onClickNew=()=>{
        setisShowModal(true);
        dispatch(reduxUpdateNumberIdentifikasi({numberIdentifikasi:""}));
    }

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-3">
                <div>
                    <Button style={{ width: 80 }} onClick={onClickNew}>New</Button>
                </div>
                <div className="">
                    <Input.Search
                        placeholder="Search here..."
                        onSearch={(value) => {
                            setSearchText(value);
                        }}
                    />
                </div>
            </div>
            <Table
                size="small"
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            // console.log(record);
                        }, // click row
                        onDoubleClick: (event) => {                         
                            props.setRecordSelected(record);     
                            props.closeModal(); 
                            props.fromViewReservasi(true);  //kirim bahwa klik berasal dari ViewReservasi                
                        },
                        
                    };
                }}
            />

        </div>
    );
};

export default ViewReservasi;
