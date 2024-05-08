import {
    Button,
    Card,
    Drawer,
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
import { reduxUpdateSelected } from "../../features/mydataselectedSlice";
import {
    useDeletePackageDrivingData,
    usePackageDrivingData,
} from "../../hooks/usePackageDrivingData";
import FormAddPackageDriving from "./FormAddPackageDriving";
import FormEditPackageDriving from "./FormEditPackageDriving";

const ViewPackageDriving = (props) => {
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState("");
    const [isShowModal, setisShowModal] = useState();
    const [isShowModalEdit, setisShowModalEdit] = useState();

    ///HOOKs
    const { data, isLoading, isError, error } = usePackageDrivingData(true);
    const { mutateAsync: mutateDeletePackageDriving } =
        useDeletePackageDrivingData();
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
            title: "Code",
            dataIndex: "id",
            key: "id",
            filteredValue: [searchText],
            onFilter: (value, record) => {
                return (
                    String(record.id).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.name).toLowerCase().includes(value.toLowerCase())
                );
            },
        },
        {
            title: "Package Name",
            dataIndex: "name",
            key: "name",
        },
        // {
        //     title: "Hours",
        //     dataIndex: "qty_jam",
        //     key: "qty_jam",
        //     align: "center",
        // },
        {
            title: "Price",
            dataIndex: "hrg_jual",
            key: "hrg_jual",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
    ];

    const onClickNew = () => {
        setisShowModal(true);
    };

    return (
        <div>
            <div className="">
                <Input.Search
                    placeholder="Search here..."
                    onSearch={(value) => {
                        setSearchText(value);
                    }}
                />
            </div>

            <Table
                pagination={false}
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
                            props.ambilDataPackageDriving(record.id, record.hrg_jual);
                            props.closeModal();
                        },
                    };
                }}
                className="custom-table-row"
            />

            {/* Drawer Add Package Driving */}
            <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setisShowModal(false)}
                        />
                        <span className="pl-3">Package Driving</span>
                    </>
                }
                placement={"right"}
                closable={false}
                onClose={() => setisShowModal(false)}
                open={isShowModal}
                key={"addpackagedriving"}
                styles={{
                    header: {
                        background: "#618264",
                    },
                }}
                style={{ background: "#F5F5F5" }}
                width={590}
            // height={"95%"}
            >
                <Card title="Package Driving Entry" size="small">
                    <FormAddPackageDriving />
                </Card>
            </Drawer>
            {/* End Drawer Add Package Driving */}

            {/* Drawer Edit Package Driving */}
            <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setisShowModalEdit(false)}
                        />
                        <span className="pl-3">Package Driving</span>
                    </>
                }
                placement={"right"}
                closable={false}
                onClose={() => setisShowModalEdit(false)}
                open={isShowModalEdit}
                key={"editpackageDriving"}
                styles={{
                    header: {
                        background: "#618264",
                    },
                }}
                style={{ background: "#F5F5F5" }}
                width={800}
            // height={"95%"}
            >
                <Card title="Package Driving Update" size="small">
                    <FormEditPackageDriving
                        closeModal={() => setisShowModalEdit(false)}
                    />
                </Card>
            </Drawer>
            {/* End Drawer Edit Package Driving */}
        </div>
    );
};

export default ViewPackageDriving;
