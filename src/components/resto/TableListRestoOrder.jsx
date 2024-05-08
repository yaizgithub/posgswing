import React from "react";
import { Modal, Popconfirm, Table } from "antd";
import { useListRestoOrderData, useOneListRestoOrderData, useOneListRestoranOrderByNoMejaData } from "../../hooks/useListRestoOrderData";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useUpdateStatusWhereNolRegistrasiRestoData } from "../../hooks/registrasi/useRegistrasiRestoData";

const { confirm } = Modal;

const TableListRestoOrder = (props) => {

    const {userid} = useSelector((state)=>state.auth);

    ///HOOKs
    // const { data } = useListRestoOrderData(true);
    const { data: dataListRestoOrderBay } = useOneListRestoOrderData(props.bay, true);
    const { data: dataListRestoOrderMeja } = useOneListRestoranOrderByNoMejaData(props.noMeja, true);
    const {mutateAsync: mutateUpdateStatusWhereNolRegistrasiRestoData} = useUpdateStatusWhereNolRegistrasiRestoData();

    const showConfirm = (id) => {
        confirm({
          title: 'Confirmasi Orderan',
          icon: <ExclamationCircleFilled />,
          content: 'Yakin pesanan akan diproses?',
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

        // {
        //     title: "No.",
        //     key: "index",
        //     render: (value, item, index) => index + 1,
        //     // render={(value, item, index) => (page - 1) * 10 + index}
        // },
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
                // return <div>{record.status_order === '1' ? 'Ready' : record.status_order === 0 ? 'blm dibuat':'X'}</div>
                return <div>{record.status_order === '0' ? (
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

    const updateStatusOrderan=async(id)=>{
        // console.log(id);
        let data = {
            status_order:"1",
            updator:userid,
        }
        await mutateUpdateStatusWhereNolRegistrasiRestoData([id, data]);
    }

    return (
        <div>
            <Table
                // scroll={{x:false, y:300}}
                // style={{height:"300px"}}
                pagination={false}
                size="middle"
                dataSource={props.bay !== null ? dataListRestoOrderBay?.data : dataListRestoOrderMeja?.data}
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
                rowClassName={'custom-table-row'}
            />
        </div>
    );
};

export default TableListRestoOrder;
