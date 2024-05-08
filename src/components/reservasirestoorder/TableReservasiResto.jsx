import { Button, Card, Modal, Popconfirm, Table } from "antd";
import React, { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
    useDeleteReservasiRestoData,
    useReservasiRestoOrderByReservasiIdData,
} from "../../hooks/reservasi/useReservasiRestoData";
import EditFormRestoOrder from "./EditFormRestoOrder";
import { getOnePackageResto } from "../../features/packageresto/onepackagerestoSlice";

const TableReservasiResto = () => {
    const dispatch = useDispatch();

    // const { numberIdentifikasi } = useSelector((state) => state.mydataselected);
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);

    const [selectedData, setSelectedData] = useState();
    const [isShowEditRestoOrder, setIsShowEditRestoOrder] = useState(false);

    ///HOOKs
    const { data } = useReservasiRestoOrderByReservasiIdData(
        matrixSelected.registrasi_id,
        true
    );
    const { mutateAsync: mutateDeleteReservasiRestoData } =
        useDeleteReservasiRestoData();

        const columns = [
            {
                title: "Action",
                key: "action",
                render: (_, record) => {
                    // console.log(record);
                    // setDataTerpilih(record);
                    // dispatch(reduxUpdateSelected({ dataSelected: record }));
                    return (
                        <Popconfirm
                            title="Delete Registrasi Data"
                            description={`Are you sure to delete ${record.id} ?`}
                            onConfirm={() => mutateDeleteReservasiRestoData(record.id)}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                disabled={record.status_order === "0" ? true : false}
                                icon={<DeleteOutlined />}
                                shape="circle"
                                type="text"
                                size="small"
                            />
                        </Popconfirm>
                    );
                },
            },
            // {
            //     title: "id",
            //     dataIndex: "id",
            //     key: "id",
            //     filteredValue: [searchText],
            //     onFilter: (value, record) => {
            //         let status = record.status;
            //         if (status === "0") {
            //             status = "open";
            //         } else if (status === "1") {
            //             status = "release";
            //         }
            //         return (
            //             String(record.id).toLowerCase().includes(value.toLowerCase()) ||
            //             String(dayjs(record.date).format("DD/MM/YYYY"))
            //                 .toLowerCase()
            //                 .includes(value.toLowerCase()) ||
            //             String(record.nama).toLowerCase().includes(value.toLowerCase()) ||
            //             String(record.no_hp).toLowerCase().includes(value.toLowerCase()) ||
            //             String(record.alamat).toLowerCase().includes(value.toLowerCase()) ||
            //             String(record.time).toLowerCase().includes(value.toLowerCase()) ||
            //             String(record.bay).toLowerCase().includes(value.toLowerCase()) ||
            //             String(record.sales).toLowerCase().includes(value.toLowerCase())
            //         );
            //     },
            // },
            // {
            //     title: "No.",
            //     key:"index",
            //     render:(value, item, index) => index+1
            // },
            {
                title: "items_name",
                dataIndex: "items_name",
                key: "items_name",
            },
            {
                title: "qty",
                dataIndex: "qty",
                key: "qty",
                align: "right",
                render: (value) => {
                    return value.toLocaleString("id");
                },
            },
            // {
            //     title: "Price",
            //     dataIndex: "hrg_jual",
            //     key: "hrg_jual",
            //     align: "right",
            //     render: (value) => {
            //         return value.toLocaleString("id");
            //     },
            // },
            {
                title: "Amount",
                dataIndex: "total",
                key: "total",
                align: "right",
                render: (value) => {
                    return value.toLocaleString("id");
                },
            },
            {
                title: "Remark",
                dataIndex: "remark",
                key: "remark",
            },
            {
                title: "Status",
                dataIndex: "status_order",
                key: "status_order",
                render:(_,record)=>{                    
                    // return <div>{record.status_order === '1' ? 'Ready' : record.status_order === 0 ? 'blm dibuat':'X'}</div>
                    return <div>{record.status_order === null ? (
                        'waiting'
                    ) : record.status_order === '1' ? (
                        <div className="bg-yellow-200 rounded-sm text-yellow-700 text-center">process</div>
                    ) : record.status_order === '2' ? (
                        <div className="bg-green-200 rounded-sm text-green-900 text-center">ready</div>
                    ) : (
                        <div className="bg-red-200 rounded-sm text-red-900 text-center">finish</div>
                    )}</div>
                }
            },
    
        ];


    return (
        <div>
            <Table
            pagination={false}
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
                            setIsShowEditRestoOrder(true);
                            setSelectedData(record);
                            dispatch(getOnePackageResto(record.items_id));
                        },
                        //   onContextMenu: event => {}, // right button click row
                        //   onMouseEnter: event => {}, // mouse enter row
                        //   onMouseLeave: event => {}, // mouse leave row
                    };
                }}
            />

            {/* Modal Reservasi Resto Order */}
            <Modal
                open={isShowEditRestoOrder}
                onCancel={() => setIsShowEditRestoOrder(false)}
                footer={false}
            >
                <Card title="Reservasi - Update Resto Order" size="small">
                    <EditFormRestoOrder
                        selectedData={selectedData}
                        closeModal={() => setIsShowEditRestoOrder(false)}
                    />
                </Card>
            </Modal>
        </div>
    );
};

export default TableReservasiResto;
