import { Button, Card, Image, Input, Modal, Popconfirm, Skeleton, Table } from "antd";
import React, { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import {
    useDeleteRegistrasiVoucherData,
    useRegistrasiVoucherData,
} from "../../../hooks/voucher/useRegistrasiVoucher";
import FormAddRegistrasiVoucher from "../../../components/voucher/FormAddRegistrasiVoucher";

const TableRegistrasiVoucher = () => {


    const [isShowModalAdd, setisShowModalAdd] = useState(false);
    const [isShowModalEdit, setisShowModalEdit] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [searchText, setSearchText] = useState("");

    ///HOOKs
    const { data, isLoading, isError, error } = useRegistrasiVoucherData(true);
    const { mutateAsync: mutateDeleteRegistrasiVoucher } =
        useDeleteRegistrasiVoucherData(true);

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
        {
            title: "Action",
            key: "action",
            render: (_, record) => {
                // console.log(record);
                // setDataTerpilih(record);
                // dispatch(reduxUpdateSelected({ dataSelected: record }));
                return (
                    <Popconfirm
                        title="Delete Reservasi Data"
                        description={`Are you sure to delete ${record.id} ?`}
                        onConfirm={() => {
                            mutateDeleteRegistrasiVoucher(record.id);
                        }}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            shape="circle"
                            type="text"
                            size="small"
                        />
                    </Popconfirm>
                );
            },
        },
        {
            title: "id",
            dataIndex: "id",
            key: "id",
            filteredValue: [searchText],
            onFilter: (value, record) => {
                let status = record.status;
                if (status === "0") {
                    status = "open";
                } else if (status === "1") {
                    status = "release";
                }
                return (
                    String(record.nama).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.no_hp).toLowerCase().includes(value.toLowerCase())
                );
            },
        },
        {
            title: "Player",
            dataIndex: "nama",
            key: "nama",
        },       
        {
            title: "No. HP",
            dataIndex: "no_hp",
            key: "no_hp",            
        },
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (value) => {
                return <div className="">
                    <Image src={value} width={50} height={50} style={{ borderRadius: "10px" }}/>
                </div>;
            },
        },       
    ];
    return (
        <div>
            
            <Card
                title={(<Button type="primary" onClick={() => setisShowModalAdd(true)}>
                Add Player
            </Button>)}
                size="small"
                extra={
                    <div className="w-[200px] float-right">
                        <Input.Search
                            placeholder="Search here..."
                            onSearch={(value) => {
                                setSearchText(value);
                            }}
                        />
                    </div>
                }
                styles={{ header: { backgroundColor: "#F8F6F4" } }}
            >
            <Table
                size="small"
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            // console.log(record);
                        }, // click row
                        onDoubleClick: (event) => {
                            if (record.status === "0") {
                                setisShowModalEdit(true);
                                setSelectedData(record);
                            }
                        },
                    };
                }}
            />
            </Card>

            <Modal
            width={1000}
                closeIcon={false}            
                open={isShowModalAdd}
                onCancel={() => setisShowModalAdd(false)}
                footer={false}
            >
                <Card title="Add Player" size="small" styles={{header:{backgroundColor:"#D2E3C8"}}}>
                    <FormAddRegistrasiVoucher />
                </Card>
            </Modal>
        </div>
    );
};

export default TableRegistrasiVoucher;
