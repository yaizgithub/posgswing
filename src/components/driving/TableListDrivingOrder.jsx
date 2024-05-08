import React from 'react'
import { Table } from "antd";
import { useBayData } from '../../hooks/useBayData';
import CountDown from './CountDown';


const TableListDrivingOrder = () => {

  const {data} = useBayData([1,8],true);

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
    //     render: (value, item, index) => index + 1,
    //     // render={(value, item, index) => (page - 1) * 10 + index}
    // },
    {
        title: "name",
        dataIndex: "name",
        key: "name",
    },
    // {
    //     title: "status",
    //     dataIndex: "status",
    //     key: "status",
    // },
    {
        title: "Customer",
        dataIndex: "customer",
        key: "customer",
    },
    // {
    //     title: "Descriptiom",
    //     dataIndex: "description",
    //     key: "description",
    // },
    {
        title: "time_start",
        dataIndex: "time_start",
        key: "time_start",
        // align: "right",
        // render: (value) => {
        //     return value.toLocaleString("id");
        // },
    },
    {
        title: "time_end",
        dataIndex: "time_end",
        key: "time_end",
        // align: "right",
        // render: (value) => {
        //     return value.toLocaleString("id");
        // },
    },
    {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        // align: "right",
        // render: (value) => {
        //     return value.toLocaleString("id");
        // },
    },


    
];

  return (
    <div>

      <Table
                size="middle"
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            // console.log(record);
                        }, // click row
                        onDoubleClick: (event) => {
                            //
                         },
                        
                    };
                }}
                rowClassName={(record, rowIndex)=>{
                    return record.status === "0" ? null : "tableColor"
                }}
            />
    </div>
  )
}

export default TableListDrivingOrder