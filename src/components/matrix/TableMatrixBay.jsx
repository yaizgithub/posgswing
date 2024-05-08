import React from 'react'
import { useMatrixbayDataOrderByDate } from '../../hooks/useMatrixbayData';
import { Skeleton, Table } from "antd";

const TableMatrixBay = () => {

    const {data, isLoading, isError, error} = useMatrixbayDataOrderByDate("2024-02-06",true);
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
            title: "id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Time",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "bay1",
            dataIndex: "bay1",
            key: "bay1",
            align: "center",       
           
        },
        {
            title: "bay2",
            dataIndex: "bay2",
            key: "bay2",
            align: "center",
            
        },
        {
            title: "bay3",
            dataIndex: "bay3",
            key: "bay3",
            align: "center",
            
        },
        {
            title: "bay4",
            dataIndex: "bay4",
            key: "bay4",
            align: "center",
            
        },
        {
            title: "bay5",
            dataIndex: "bay5",
            key: "bay5",
            align: "center",
            
        },
        {
            title: "bay6",
            dataIndex: "bay6",
            key: "bay6",
            align: "center",
            
        },
        {
            title: "bay7",
            dataIndex: "bay7",
            key: "bay7",
            align: "center",
            
        },
        {
            title: "bay8",
            dataIndex: "bay8",
            key: "bay8",
            align: "center",
            
        },
        {
            title: "bay9",
            dataIndex: "bay9",
            key: "bay9",
            align: "center",
            
        },
        {
            title: "bay10",
            dataIndex: "bay10",
            key: "bay10",
            align: "center",
            
        },
        
    ];

  return (
    <div>
         <Table
                // size="small"
                pagination={false}
                bordered
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onSelect={(column) => { console.log(column) }}                
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            // console.log({record:record, rowIndex:rowIndex, colIndex:colIndex});
                            // console.log(col);
                        }, // click row
                        
                    };
                }}
                
                rowClassName={"custom-table-row"}
                
            />
    </div>
  )
}

export default TableMatrixBay