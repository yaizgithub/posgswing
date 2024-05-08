import { Table } from "antd";
import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useChargedByPayerData, useGetDetailsChargedTransaksiDrivingData } from "../../hooks/useCharged";
import { reduxUpdateSelected } from "../../features/mydataselectedSlice";

const TableCharged = (props) => {
    const dispatch = useDispatch();
    const { dataSelected } = useSelector((state) => state.mydataselected);

    const [selectedRowKeys, setSelectedRowKeys] = useState();

    ///HOOKs
    const { data } = useChargedByPayerData(
        dataSelected.id,
        true
    );

    const handleRowClick = (record) => {
        setSelectedRowKeys(record.id);
      };

    const columns = [
        {
            title: "Ref.No",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Customer",
            dataIndex: "nama",
            key: "nama",
            // align: "right",
        },
        {
            title: "Handphone",
            dataIndex: "no_hp",
            key: "no_hp",
            // align: "right",
        },
        {
            title: "bay",
            dataIndex: "bay",
            key: "bay",
            // align: "right",
        },
        {
            title: "no_meja",
            dataIndex: "no_meja",
            key: "no_meja",
            // align: "right",
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
            title={() => 'Player'}
            pagination={false}
            scroll={{ x: false, y: 700 }}
            style={{height:"200px"}}
                size="small"
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            handleRowClick(record);
                            props.rowSelectedRegistrasiId(record.id);
                        },
                        className: selectedRowKeys === record.id ? 'highlighted-row' : '' // Menambahkan kelas CSS jika baris dipilih    
                    }
                }}
                rowClassName={'custom-table-row'}
            />
        </div>
    );
};

export default TableCharged;
