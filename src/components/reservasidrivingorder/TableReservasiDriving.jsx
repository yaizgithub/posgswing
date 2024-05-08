import { Button, Card, Modal, Popconfirm, Table } from "antd";
import React, { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
    useDeleteReservasiDrivingData,
    useReservasiDrivingOrderByReservasiIdData,
} from "../../hooks/reservasi/useReservasiDrivingData";
import EditFormDrivingOrder from "./EditFormDrivingOrder";
import { getOnePackageDriving } from "../../features/packagedriving/onepackagedrivingSlice";

const TableReservasiDriving = () => {

    const dispatch= useDispatch();
    const { numberIdentifikasi } = useSelector((state) => state.mydataselected);

    const [selectedData, setSelectedData] = useState();
    const [isShowEditDrivingOrder, setIsShowEditDrivingOrder] = useState(false);

    ///HOOKs
    const { data } = useReservasiDrivingOrderByReservasiIdData(
        numberIdentifikasi,
        true
    );
    const { mutateAsync: mutateDeleteReservasiDrivingData } =
        useDeleteReservasiDrivingData();

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
                            title="Delete Reservasi Data"
                            description={`Are you sure to delete ${record.id} ?`}
                            onConfirm={() => {
                                mutateDeleteReservasiDrivingData(record.id);                                    
                            }}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                            disabled={record.status === "1" ? true : false}
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
            {
                title: "items_name",
                dataIndex: "items_name",
                key: "items_name",
            },
            {
                title: "Hpp",
                dataIndex: "hrg_jual",
                key: "hrg_jual",
                align: "right",
                render: (value) => {
                    return value.toLocaleString("id");
                },
            },
            // {
            //     title: "qty_jam",
            //     dataIndex: "qty_jam",
            //     key: "qty_jam",
            //     align: "right",
            //     render: (value) => {
            //         return value.toLocaleString("id");
            //     },
            // },        
            {
                title: "qty",
                dataIndex: "qty",
                key: "qty",
                align: "right",
                render: (value) => {
                    return value.toLocaleString("id");
                },
            },        
            {
                title: "nilai_disc",
                dataIndex: "nilai_disc",
                key: "nilai_disc",
                align: "right",
                render: (value) => {
                    return value.toLocaleString("id");
                },
            },
            {
                title: "PriceAf",
                dataIndex: "hrg_stl_disc",
                key: "hrg_stl_disc",
                align: "right",
                render: (value) => {
                    return value.toLocaleString("id");
                },
            },
            {
                title: "ppn",
                dataIndex: "nilai_ppn",
                key: "nilai_ppn",
                align: "right",
                render: (value) => {
                    return value.toLocaleString("id");
                },
            },
            {
                title: "Price",
                dataIndex: "total",
                key: "total",
                align: "right",
                render: (value) => {
                    return value.toLocaleString("id");
                },
            },
        ];
    return (
        <div>
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
                            setIsShowEditDrivingOrder(true);
                            setSelectedData(record);
                            dispatch(getOnePackageDriving(record.items_id));  
                        },
                        //   onContextMenu: event => {}, // right button click row
                        //   onMouseEnter: event => {}, // mouse enter row
                        //   onMouseLeave: event => {}, // mouse leave row
                    };
                }}
            />

            {/* Modal Reservasi Resto Order */}
            <Modal
                open={isShowEditDrivingOrder}
                onCancel={() => setIsShowEditDrivingOrder(false)}
                footer={false}
            >
                <Card title="Reservasi - Update Driving Order" size="small">
                    <EditFormDrivingOrder
                        selectedData={selectedData}
                        closeModal={() => setIsShowEditDrivingOrder(false)}
                    />
                </Card>
            </Modal>
        </div>
    );
};

export default TableReservasiDriving;
