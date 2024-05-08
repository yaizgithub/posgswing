import { Button, Card, Drawer, Input, Popconfirm, Space, Table, Sc, Skeleton, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
    DeleteOutlined,
    MenuOutlined,
    FileAddOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDeleteUserRegistrasiData, useUserRegistrasiData } from "../../hooks/useUserRegistrasiData";
import AddFormUser from "./AddFormUser";
import { useDispatch, useSelector } from "react-redux";
import { reduxUpdateSelected } from "../../features/mydataselectedSlice";
import EditFormUser from "./EditFormUser";
import GridMenus from "../menus/GridMenus";
import { useOneUserMenu } from "../../hooks/useUserMenuData";
import GridMenuAplikasi from "../menus/GridMenuAplikasi";

const TableUserRegistrasi = () => {

    const dispatch = useDispatch();

    const {token} = useSelector((state)=>state.auth);

    const [searchText, setSearchText] = useState();
    const [isShowModal, setisShowModal] = useState();
    const [isShowEditModal, setisShowEditModal] = useState();
    const [isShowAddUserMenu, setisShowAddUserMenu] = useState();
    const [recordId, setRecordId] = useState()

    useEffect(() => {

    }, [recordId])
    

    ///HOOKs
    const {refetch: refetchOneUserMenu} = useOneUserMenu(recordId,false);
    const {mutateAsync:mutateDeleteUserRegistrasiData} =useDeleteUserRegistrasiData();
    const { data, isLoading, isError, error } = useUserRegistrasiData(token,true);
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

    const onClickIconAddUserMenu=(record)=>{
        setisShowAddUserMenu(true);        
        dispatch(reduxUpdateSelected({ dataSelected: record }));
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
                    <>
                        <Space>
                            <Popconfirm
                                title="Delete Registrasi Data"
                                description={`Are you sure to delete ${record.id} ?`}
                                onConfirm={() => mutateDeleteUserRegistrasiData(record.id)}
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
                            <Tooltip title="Add access menu ">
                            <Button
                                    icon={<MenuOutlined />}
                                    shape="circle"
                                    type="text"
                                    size="small"
                                    onClick={()=>onClickIconAddUserMenu(record)}
                                />                   
                                </Tooltip>  
                        </Space>
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
                let status = record.status;
                if (status === "0") {
                    status = "open";
                } else if (status === "1") {
                    status = "release";
                }
                return (
                    String(record.id).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.username).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.email).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.level).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.role).toLowerCase().includes(value.toLowerCase())
                );
            },
        },
        {
            title: "username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "level",
            dataIndex: "jabatan",
            key: "jabatan",
        },
        {
            title: "role",
            dataIndex: "role",
            key: "role",
        },
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
                            New User
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
            pagination={false}
                size="small"
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            // console.log(record);
                            setRecordId(record.id);
                            dispatch(reduxUpdateSelected({ dataSelected: record }));
                            refetchOneUserMenu();
                            
                        }, // click row
                        onDoubleClick: (event) => {
                            setisShowEditModal(true);
                            dispatch(reduxUpdateSelected({ dataSelected: record }));
                            // dispatch(
                            //     reduxUpdateNumberIdentifikasi({ numberIdentifikasi: record.id })
                            // );
                            // dispatch(reduxUpdateNomorBay({ nomorBay: record.bay }));
                        },
                    };
                }}
                rowClassName={"custom-table-row"}
            />

            {/* Drawer Add user */}
            <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setisShowModal(false)}
                        />
                        <span className="pl-3">Add User</span>
                    </>
                }
                placement={"right"}
                closable={false}
                onClose={() => setisShowModal(false)}
                open={isShowModal}
                key={"drawer-add-user"}
                styles={{
                    header: {
                        background: "#062E6F"
                    },
                }}
                style={{ background: "#F5F5F5" }}
                width={500}
            // height={"95%"}
            >
                <Card size="small">
                    <AddFormUser />
                </Card>
            </Drawer>
            {/* End Drawer Add user */}

            {/* Drawer Edit user */}
            <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setisShowEditModal(false)}
                        />
                        <span className="pl-3">Update User</span>
                    </>
                }
                placement={"right"}
                closable={false}
                onClose={() => setisShowEditModal(false)}
                open={isShowEditModal}
                key={"drawer-edit-user"}
                styles={{
                    header: {
                        background: "#062E6F",
                    },
                }}
                style={{ background: "#F5F5F5" }}
                width={500}
            // height={"95%"}
            >
                <Card size="small">
                    <EditFormUser closeModal={() => setisShowEditModal(false)}/>
                </Card>
            </Drawer>
            {/* End Drawer Edit user */}


             {/* Drawer Add user menu */}
             <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setisShowAddUserMenu(false)}
                        />
                        <span className="pl-3">User Menu</span>
                    </>
                }
                placement={"right"}
                closable={false}
                onClose={() => setisShowAddUserMenu(false)}
                open={isShowAddUserMenu}
                key={"drawer-add-user-menu"}
                styles={{
                    header: {
                        background: "#03193D",
                    },
                }}
                style={{ background: "#F5F5F5" }}
                width={500}
            // height={"95%"}
            >
                <Card title="Select Menu" size="small">
                    {/* <GridMenus /> */}
                    <GridMenuAplikasi />
                </Card>
            </Drawer>
            {/* End Drawer Add user menu */}
        </div>
    );
};

export default TableUserRegistrasi;
