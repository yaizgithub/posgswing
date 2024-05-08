import { Table } from "antd";
import React from "react";
import {
    useGetDetailsTransaksiDrivingData,
    useRekapRegistrasiDrivingOrderByRegistrasiIdData,
} from "../../hooks/registrasi/useRegistrasiDrivingData";
import { useSelector } from "react-redux";

const TableDetailsDrivingOrder = () => {
    const { dataSelected } = useSelector((state) => state.mydataselected);

    ///HOOKs
    const { data } = useGetDetailsTransaksiDrivingData(dataSelected.id, true);

    const columnsRekap = [
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
            title: "Items",
            dataIndex: "items_name",
            key: "items_name",
        },
        {
            title: "Qty",
            dataIndex: "totQty",
            key: "totQty",
            align: "right",
        },
        {
            title: "Total Hours",
            dataIndex: "totJam",
            key: "totJam",
            align: "right",
        },
        {
            title: "Price",
            dataIndex: "hrg_jual",
            key: "hrg_jual",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Amount",
            dataIndex: "jumlah",
            key: "jumlah",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Disc%",
            dataIndex: "disc_persen",
            key: "disc_persen",
            align: "right",
            // render: (value) => {
            //     return value.toLocaleString("id");
            // },
        },
        {
            title: "Ppn",
            dataIndex: "totNilaiPpn",
            key: "totNilaiPpn",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },

        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
    ];

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
        {
            title: "Items",
            dataIndex: "items_name",
            key: "items_name",
        },
        {
            title: "Qty",
            dataIndex: "qty",
            key: "qty",
            align: "right",
        },
        {
            title: "Total Hours",
            dataIndex: "qty_jam",
            key: "qty_jam",
            align: "right",
        },
        {
            title: "Price",
            dataIndex: "hrg_jual",
            key: "hrg_jual",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Amount",
            dataIndex: "jumlah",
            key: "jumlah",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Disc%",
            dataIndex: "disc_persen",
            key: "disc_persen",
            align: "right",
            // render: (value) => {
            //     return value.toLocaleString("id");
            // },
        },
        {
            title: "Ppn",
            dataIndex: "nilai_ppn",
            key: "nilai_ppn",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },

        {
            title: "Total",
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
                scroll={{ x: false, y: 500 }}
                style={{ width: "900px", height: "200px" }}
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
                    };
                }}
                rowClassName={"custom-table-row"}
            />
        </div>
    );
};

export default TableDetailsDrivingOrder;
