import {
    Button,
    Card,
    Drawer,
    Image,
    Input,
    Popconfirm,
    Skeleton,
    Space,
    Table,
} from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
    DeleteOutlined,
    CloseOutlined,
    FileAddOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
    useDeletePackageRestoData,
    usePackageRestoData,
} from "../../hooks/usePackageRestoData";
import FormAddPackageResto from "./FormAddPackageResto";
import { reduxUpdateSelected } from "../../features/mydataselectedSlice";
import FormEditPackageResto from "./FormEditPackageResto";

const TablePackageResto = () => {
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState();
    const [isShowModal, setisShowModal] = useState();
    const [isShowModalEdit, setisShowModalEdit] = useState();

    ///HOOKs
    const { data, isLoading, isError, error } = usePackageRestoData(true);
    const { mutateAsync: mutateDeletePackageResto } = useDeletePackageRestoData();
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

    // if (data) {
    //     console.log(data?.data);
    // }

    const columns = [
        {
            title: "Action",
            key: "action",
            render: (_, record) => {
                // console.log(record);
                // setDataTerpilih(record);
                // dispatch(reduxUpdateSelected({ dataSelected: record }));
                return (
                    <>
                        <Popconfirm
                            title="Delete Registrasi Data"
                            description={`Are you sure to delete ${record.id} ?`}
                            onConfirm={() => mutateDeletePackageResto(record.id)}
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
                    </>
                );
            },
        },

        {
            title: "id",
            dataIndex: "id",
            key: "id",
            filteredValue: [searchText],
            onFilter: (value, record) => {
                return (
                    String(record.id).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.name).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.qty_jam).toLowerCase().includes(value.toLowerCase())
                );
            },
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
        
        // {
        //     title: "categori_menu",
        //     dataIndex: "categori_menu",
        //     key: "categori_menu",
        // },
        {
            title: "Package Name",
            dataIndex: "name",
            key: "name",
        },

        {
            title: "Price",
            dataIndex: "hrg_jual",
            key: "hrg_jual",
            align:"right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "SrvChg",
            dataIndex: "service_charge_status",
            key: "service_charge_status",
            align:"center",
        },        
        {
            title: "Tax",
            dataIndex: "tax_status",
            key: "tax_status",
            align:"center",
        },        
        // {
        //     title: "Disc%",
        //     dataIndex: "disc_persen",
        //     key: "disc_persen",
        //     align:"right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },
        // {
        //     title: "Disc Rp.",
        //     dataIndex: "disc_rp",
        //     key: "disc_rp",
        //     align:"right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },
        // {
        //     title: "nDisc",
        //     dataIndex: "nilai_disc",
        //     key: "nilai_disc",
        //     align:"right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },
        // {
        //     title: "Hpp-Disc",
        //     dataIndex: "hrg_stl_disc",
        //     key: "hrg_stl_disc",
        //     align:"right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },
        // {
        //     title: "Price",
        //     dataIndex: "total",
        //     key: "total",
        //     align:"right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },

        
    ];

    const onClickNew = () => {
        setisShowModal(true);
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-3">
                <div>
                    <Space>
                        <Button
                            icon={<FileAddOutlined />}
                            onClick={onClickNew}
                            type="primary"
                        >
                            Add Menu
                        </Button>
                    </Space>
                </div>
                <div className="">
                    <Input.Search
                        placeholder="Search here..."
                        onSearch={(value) => {
                            setSearchText(value);
                        }}
                    />
                </div>
            </div>

            <Table
                size="small"
                // style={{ width: "300px" }}
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            // console.log(record);
                        }, // click row
                        onDoubleClick: (event) => {
                            setisShowModalEdit(true);
                            dispatch(reduxUpdateSelected({ dataSelected: record }));
                        },
                    };
                }}
            />

            {/* Drawer Add Package Resto */}
            <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setisShowModal(false)}
                        />
                        <span className="pl-3">Package Resto</span>
                    </>
                }
                placement={"right"}
                closable={false}
                onClose={() => setisShowModal(false)}
                open={isShowModal}
                key={"addpackageresto"}
                styles={{
                    header: {
                        background: "#618264",
                    },
                }}
                style={{ background: "#F5F5F5" }}
                width={590}
            // height={"95%"}
            >
                <Card title="Package Resto Entry" size="small">
                    <FormAddPackageResto />
                </Card>
            </Drawer>
            {/* End Drawer Add Package Resto */}

            {/* Drawer Edit Package Resto */}
            <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setisShowModalEdit(false)}
                        />
                        <span className="pl-3">Package Resto</span>
                    </>
                }
                placement={"right"}
                closable={false}
                onClose={() => setisShowModalEdit(false)}
                open={isShowModalEdit}
                key={"editpackageresto"}
                styles={{
                    header: {
                        background: "#618264",
                    },
                }}
                style={{ background: "#F5F5F5" }}
                width={800}
            // height={"95%"}
            >
                <Card title="Package Resto Update" size="small">
                    <FormEditPackageResto closeModal={() => setisShowModalEdit(false)} />
                </Card>
            </Drawer>
            {/* End Drawer Edit Package Resto */}
        </div>
    );
};

export default TablePackageResto;
