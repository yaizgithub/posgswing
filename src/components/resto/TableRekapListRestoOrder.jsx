import React from 'react'
import { Popconfirm, Table } from "antd";

import { useRekapListRestoOrderData } from '../../hooks/useRekapListRestoOrderData';

const TableRekapListRestoOrder = () => {

    const { data } = useRekapListRestoOrderData(true);

    const columns = [
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
        //     key: "index",
        //     // width: "10px",
        //     render: (value, item, index) => index + 1
        // },
        // {
        //     title: "Bay",
        //     dataIndex: "bay",
        //     key: "bay",
        //     align:'center'
        //     // width: "20px",
        // },
        // {
        //     title: "Table",
        //     dataIndex: "no_meja",
        //     key: "no_meja",
        //     align:'center'
        //     // width: "20px",
        // },
        {
            title: "Items",
            dataIndex: "items_name",
            key: "items_name",
            // width: "20px",
        },
        {
            title: "Qty",
            dataIndex: "totQty",
            key: "totQty",
            align: "right",
            // width: "10px",
        },


        // {
        //     title: "hpp",
        //     dataIndex: "hrg_jual",
        //     key: "hrg_jual",
        //     align: "right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },
        // {
        //     title: "nilai_disc",
        //     dataIndex: "nilai_disc",
        //     key: "nilai_disc",
        //     align: "right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },
        // {
        //     title: "PriceAf",
        //     dataIndex: "hrg_stl_disc",
        //     key: "hrg_stl_disc",
        //     align: "right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },
        // {
        //     title: "ServChg",
        //     dataIndex: "nilai_service_charge",
        //     key: "nilai_service_charge",
        //     align: "right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },
        // {
        //     title: "Pb1",
        //     dataIndex: "nilai_pb_satu",
        //     key: "nilai_pb_satu",
        //     align: "right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },
        // {
        //     title: "Price",
        //     dataIndex: "total",
        //     key: "total",
        //     align: "right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },
    ];

    return (
        <div>
            <Table
                scroll={{x:false, y:300}}
                style={{height:"300px"}}
                pagination={false}
                // style={{ width: "30%" }}
                // size="small"
                className='mytable'
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            // console.log(record);
                        }, // click row
                        onDoubleClick: (event) => {
                        },
                        //   onContextMenu: event => {}, // right button click row
                        //   onMouseEnter: event => {}, // mouse enter row
                        //   onMouseLeave: event => {}, // mouse leave row
                    };
                }}
                rowClassName={'custom-table-row'}
            />
        </div>
    )
}

export default TableRekapListRestoOrder