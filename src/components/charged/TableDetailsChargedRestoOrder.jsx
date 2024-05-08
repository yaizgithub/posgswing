import { Table } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useRekapChargedRegistrasiRestoData } from "../../hooks/useCharged";

const TableDetailsChargedRestoOrder = (props) => {
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);

    ///HOOKs
    const { data } = useRekapChargedRegistrasiRestoData([
        props.regisId,
        matrixSelected.registrasi_id,
        true,
    ]);

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
            dataIndex: "totQty",
            key: "totQty",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
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
            title: "Disc%",
            dataIndex: "disc_persen",
            key: "disc_persen",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        // {
        //     title: "PriceAf",
        //     dataIndex: "hrg_stl_disc",
        //     key: "hrg_stl_disc",
        //     align: "right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },
        {
            title: "ServChg",
            dataIndex: "totSrvCharge",
            key: "totSrvCharge",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Pb1",
            dataIndex: "totNilaiPpSatu",
            key: "totNilaiPpSatu",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Amount",
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
            title={() => 'Transaction F&B'}
                pagination={false}
                scroll={{ x: false, y: 700 }}
            style={{height:"200px"}}
                size="small"
                dataSource={data?.data}
                columns={columns}
                rowKey="items_name"
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

export default TableDetailsChargedRestoOrder;
