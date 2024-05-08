import React, { useState } from "react";
import {
    Card,
    Input,
    Skeleton,
    Table,
    message,
} from "antd";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import {
    reduxUpdateNumberIdentifikasi,
    reduxUpdateSelected,
} from "../../features/mydataselectedSlice";
import {
    useRegistrasiByStatusData,
} from "../../hooks/registrasi/useRegistrasiData";


const { TextArea } = Input;

const ViewRegistrasi = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();

    const {matrixSelected} = useSelector((state)=>state.mymatrixselected);

    const [searchText, setSearchText] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState();

    ///HOOKs    
    const { data, isLoading, isError, error } = useRegistrasiByStatusData(['0', matrixSelected.registrasi_id, true]);
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

    const successMessage = (type, message) => {
        messageApi.open({
            type: type,
            content: message,
        });
    };

    const handleRowClick = (record) => {
        setSelectedRowKeys(record.id);
      };


    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (record) => {
                return dayjs(record.date).format("DD/MM/YYYY");
            },
            
        },
        {
            title: "Registrasi ID",
            dataIndex: "id",
            key: "id",
            filteredValue: [searchText],
            onFilter: (value, record) => {
                let status = record.status;
                if (status === "0") {
                    status = "Check-in";
                } else if (status === "1") {
                    status = "Paid";
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
                    String(record.no_meja).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.bay).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.sales).toLowerCase().includes(value.toLowerCase()) ||
                    String(status).toLowerCase().includes(value.toLowerCase())
                );
            },
        },

        {
            title: "Customer",
            dataIndex: "nama",
            key: "nama",
        },
        {
            title: "Handphone",
            dataIndex: "no_hp",
            key: "no_hp",
        },        
        {
            title: "Bay",
            dataIndex: "bay",
            key: "bay",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            // render(_, record) {
            //     return {
            //     //   props: {
            //     //     style: { color: record.status === "1" ? "#3B7AEF" : null }
            //     //   },
            //       children: <div className="font-semibold">{record.status === "1" ? <div className="bg-green-300 rounded-full">Paid</div> : "Check-in"}</div>
            //     };
            //   }
            render: (_, record) => {
                return (
                    <div className="font-semibold">
                        {record.status === "1" ? (
                            <div className="bg-green-300 rounded-full">Paid</div>
                        ) : (
                            "Check-in"
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            {contextHolder}
            <Card
                title="List Transaksi"
                size="small"
                extra={
                    <div className="w-[200px] float-right">
                        <Input.Search
                            placeholder="Search here..."
                            onSearch={(value) => {
                                setSearchText(value);
                            }}
                        />
                    </div>
                }
                styles={{ header: { backgroundColor: "#F8F6F4" } }}
            >
                <Table                
                    size="small"
                    dataSource={data?.data}
                    columns={columns}
                    rowKey="id"
                    // rowSelection={rowSelection}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                handleRowClick(record);
                                dispatch(reduxUpdateNumberIdentifikasi({numberIdentifikasi:record.id}));
                                props.namaCustomer(record.nama);
                            }, 
                            className: selectedRowKeys === record.id ? 'highlighted-row' : '' // Menambahkan kelas CSS jika baris dipilih                            
                        };
                    }}
                    rowClassName={'custom-table-row'}
                />
            </Card>

           

           
        </div>
    );
};

export default ViewRegistrasi;
