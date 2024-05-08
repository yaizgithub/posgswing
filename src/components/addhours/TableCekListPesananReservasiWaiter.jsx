import React from "react";
import { Modal, Table } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useOneListRestoOrderReservasiData } from "../../hooks/useListRestoOrderReservasiData";
import "./style.css";
import { useUpdateStatusWhereSatuToDuaReservasiRestoData } from "../../hooks/reservasi/useReservasiRestoData";

const { confirm } = Modal;

const TableCekListPesananReservasiWaiter = () => {
    const {userid} = useSelector((state)=>state.auth);
    const {matrixSelected} = useSelector((state)=>state.mymatrixselected);

    ///HOOKs
    const { data } = useOneListRestoOrderReservasiData(matrixSelected.bay_id, true);
    const {mutateAsync: mutateUpdateStatusWhereSatuToDuaReservasiResto} = useUpdateStatusWhereSatuToDuaReservasiRestoData();

    const showConfirm = (id) => {
        confirm({
          title: 'Confirmasi Orderan',
          icon: <ExclamationCircleFilled />,
          content: 'Yakin pesanan sudah selesai?',
          okText: 'Ya',
    okType: 'info',
    cancelText: 'Tidak',
          onOk() {
             updateStatusOrderan(id);
          },
          onCancel() {
            // console.log('Cancel');
          },
        });
      };


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
            title: "No.",
            key: "index",
            render: (value, item, index) => index + 1,
            // render={(value, item, index) => (page - 1) * 10 + index}
        },
        {
            title: "Bay",
            dataIndex: "bay",
            key: "bay",
        },
        {
            title: "Meja",
            dataIndex: "noMejaRestoran",
            key: "noMejaRestoran",
        },
        // {
        //     title: "Customer",
        //     dataIndex: "nama",
        //     key: "nama",
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
            // render: (value) => {
            //     return value.toLocaleString("id");
            // },
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
                return <div>{record.status_order === '1' ? 'Ready' : record.status_order === null ? 'blm dibuat':'selesai'}</div>
            }
        },
        

        
    ];

    const updateStatusOrderan=async(id)=>{
        // console.log(id);
        let data = {
            status_order:"2",
            updator:userid,
        }
        await mutateUpdateStatusWhereSatuToDuaReservasiResto([id, data]);
    }

    const rowClassName = (record, index) => {        
        return (record.time_difference <= '00:00:00' && record.status_order !== "1") && (record.time_difference <= '00:00:00' && record.status_order !== "2") ? 'blink-row' :'';
      };

    return (
        <div>            
            <Table
            pagination={false}
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
                            showConfirm(record.id);
                         },
                        
                    };
                }}
                rowClassName={rowClassName}
            />
        </div>
    );
};

export default TableCekListPesananReservasiWaiter;
