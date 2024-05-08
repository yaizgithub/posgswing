import { Table } from "antd";
import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useChargedByPayerData, useGetDetailsChargedTransaksiDrivingData } from "../../hooks/useCharged";
import { reduxUpdateSelected } from "../../features/mydataselectedSlice";
import { useRegistrasiPayerNotNullData } from "../../hooks/registrasi/useRegistrasiData";

const TablePayer = (props) => {
    const dispatch = useDispatch();
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);

    const [selectedRowKeys, setSelectedRowKeys] = useState();

    ///HOOKs
    const { data } = useRegistrasiPayerNotNullData(
        matrixSelected.registrasi_id,
        true
    );

    const handleRowClick = (record) => {
        setSelectedRowKeys(record.id);
      };

    const columns = [
        // {
        //     title: "Ref.No",
        //     dataIndex: "id",
        //     key: "id",
        // },
        {
            title: "Payer",
            dataIndex: "payer",
            key: "payer",
            // align: "right",
        },
        
        
    ];

    return (
        <div>
            <Table
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
                            // props.rowSelectedRegistrasiId(record.id);
                        },
                        className: selectedRowKeys === record.id ? 'highlighted-row' : '' // Menambahkan kelas CSS jika baris dipilih    
                    }
                }}
                rowClassName={'custom-table-row'}
            />
        </div>
    );
};

export default TablePayer;
