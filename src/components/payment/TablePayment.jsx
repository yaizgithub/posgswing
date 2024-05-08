import { Button, Card, Modal, Popconfirm, Table } from "antd";
import React, { useState } from "react";
import {
    useDeletePaymentData,
    usePaymentOrderByRegistrasiIdData,
} from "../../hooks/usePaymentData";
import { useSelector } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import FormEditPayment from "./FormEditPayment";

const TablePayment = () => {
    const { dataSelected } = useSelector((state) => state.mydataselected);

    const [isShowModalEdit, setisShowModalEdit] = useState(false);
    const [recordSelected, setRecordSelected] = useState();

    ///HOOKs
    const { data } = usePaymentOrderByRegistrasiIdData(dataSelected.id, true);
    const { mutateAsync: mutateDeletePaymentData } = useDeletePaymentData();

    const columns = [
        {
            title: "Action",
            key: "action",
            width: "10px",
            render: (_, record) => {
                // console.log(record);
                // setDataTerpilih(record);
                // dispatch(reduxUpdateSelected({ dataSelected: record }));
                return (
                    <>                    
                        <Popconfirm
                            title="Delete Registrasi Data"
                            description={`Are you sure to delete payment method ?`}
                            onConfirm={() => mutateDeletePaymentData(record.id)}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                            disabled ={record.payment_id === 'CF' ? true : false}
                                icon={<DeleteOutlined />}
                                shape="circle"
                                type="text"
                                size="small"
                            />
                        </Popconfirm>
                    </>
                );
            },
        },
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
        //     title: "re",
        //     // dataIndex: dayjs(data.data.date).format("DD/MM/YYY"),
        //     key: "date",
        //     render: (record) => {
        //         return dayjs(record.date).format("DD/MM/YYYY");
        //     },
        // },
        {
            title: "Payment",
            dataIndex: "description",
            key: "Description",
            width: "120px",
        },
        {
            title: "Value",
            dataIndex: "nilai_bayar",
            key: "nilai_bayar",
            // width:"10px",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Remark",
            dataIndex: "remark",
            key: "remark",
            // width:"20px",
        },
    ];

    return (
        <div>
            <Table
                size="small"
                style={{ width: "550px" }}
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            // console.log(record);
                        }, // click row
                        onDoubleClick: (event) => {
                            if (record.payment_id !== 'CF') {                                                            
                                setRecordSelected(record);
                                setisShowModalEdit(true);
                                console.log(record);
                            }
                        },
                        //   onContextMenu: event => {}, // right button click row
                        //   onMouseEnter: event => {}, // mouse enter row
                        //   onMouseLeave: event => {}, // mouse leave row
                    };
                }}
            />

            {/* MODAL EDIT PAYMENT */}
            <Modal
                open={isShowModalEdit}
                onCancel={() => setisShowModalEdit(false)}
                // style={{ top: "300px" }}
                footer={false}
            >
                <Card title="Update Payment" size="small">
                    <FormEditPayment
                        recordSelected={recordSelected}
                        closeModal={() => setisShowModalEdit(false)}
                    />
                </Card>
            </Modal>
            {/* END MODAL EDIT PAYMENT */}
        </div>
    );
};

export default TablePayment;
