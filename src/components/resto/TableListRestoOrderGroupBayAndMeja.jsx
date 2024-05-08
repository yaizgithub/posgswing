import React, { useState } from "react";
import { Modal, Popconfirm, Table } from "antd";
import {
    useListRestoOrderData,
    useListRestoOrderGroupBayAndMejaData,
} from "../../hooks/useListRestoOrderData";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useUpdateStatusWhereNolRegistrasiRestoData } from "../../hooks/registrasi/useRegistrasiRestoData";
import TableListRestoOrder from "./TableListRestoOrder";

const { confirm } = Modal;

const TableListRestoOrderGroupBayAndMeja = () => {

    const { userid } = useSelector((state) => state.auth);
    
    const [isShowModal, setIsShowModal] = useState(false);
    const [bay, setBay] = useState(null);
    const [noMeja, setNoMeja] = useState(null);

    ///HOOKs
    const { data } = useListRestoOrderGroupBayAndMejaData(true);
    const { mutateAsync: mutateUpdateStatusWhereNolRegistrasiRestoData } =
        useUpdateStatusWhereNolRegistrasiRestoData();


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
        {
            title: "Status",
            dataIndex: "status_order",
            key: "status_order",
            render: (_, record) => {
                // return <div>{record.status_order === '1' ? 'Ready' : record.status_order === 0 ? 'blm dibuat':'X'}</div>
                return (
                    <div>
                        {record.status_order === "0" ? (
                            "waiting"
                        ) : record.status_order === "1" ? (
                            <div className="bg-yellow-200 rounded-sm text-yellow-700 text-center">
                                process
                            </div>
                        ) : record.status_order === "2" ? (
                            <div className="bg-green-200 rounded-sm text-green-900 text-center">
                                ready
                            </div>
                        ) : (
                            <div className="bg-red-200 rounded-sm text-red-900 text-center">
                                finish
                            </div>
                        )}
                    </div>
                );
            },
        },
    ];

    const updateStatusOrderan = async (id) => {
        // console.log(id);
        let data = {
            status_order: "1",
            updator: userid,
        };
        await mutateUpdateStatusWhereNolRegistrasiRestoData([id, data]);
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
                            setBay(record.bay);                          
                            setNoMeja(record.noMejaRestoran);                          
                            setIsShowModal(true);
                            console.log({bay:record.bay, meja:record.noMejaRestoran});
                        },
                    };
                }}
                rowClassName={"custom-table-row"}
            />

            <Modal open={isShowModal} onCancel={()=>setIsShowModal(false)} onOk={()=>setIsShowModal(false)}>
                <TableListRestoOrder bay={bay} noMeja = {noMeja}/>
            </Modal>
        </div>
    );
};

export default TableListRestoOrderGroupBayAndMeja;
