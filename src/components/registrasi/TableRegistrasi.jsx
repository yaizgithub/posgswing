import React, { useState } from "react";
import {
    Button,
    Card,
    Drawer,
    Input,
    Modal,
    Popconfirm,
    Select,
    Skeleton,
    Space,
    Table,
    Tag,
    message,
} from "antd";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import {
    reduxUpdateNumberIdentifikasi,
    reduxUpdateSelected,
} from "../../features/mydataselectedSlice";
import {
    useDeleteRegistrasiData,
    useRegistrasiData,
} from "../../hooks/registrasi/useRegistrasiData";
import { getBillingDrivingOrder } from "../../features/billing/billingdrivingorderSlice";
import { getBillingRestoOrder } from "../../features/billing/billingrestoorderSlice";
import { reduxUpdateMatrixSelected } from "../../features/mymatrixselectedSlice";
import axios from "axios";
import { baseUrl } from "../../config";
import PageDetailsPayment from "../../containers/pages/detailstransaksi/PageDetailsPayment";
import { useUpdateStatusMejaData } from "../../hooks/useMejaData";
import { useUserVoidRegistrasiData } from "../../hooks/useUserRegistrasiData";

const { TextArea } = Input;

const TableRegistrasi = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState("");
    const [isShowBill, setisShowBill] = useState(false);
    const [isShowVoid, setIsShowVoid] = useState(false);
    const [recordID, setRecordID] = useState();
    const [noMeja, setNoMeja] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alasan, setAlasan] = useState("");
    const [isShowDetails, setisShowDetails] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState();

    ///HOOKs
    const { data: dataUserVoid } = useUserVoidRegistrasiData(true);
    const { mutateAsync: mutateDeleteRegistrasi } = useDeleteRegistrasiData();
    const { data, isLoading, isError, error } = useRegistrasiData(true);
    const { mutateAsync: mutateUpdateStatusMeja } = useUpdateStatusMejaData();

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

    const handleRowClick = (record) => {
        setSelectedRowKeys(record.id);
      };

    const successMessage = (type, message) => {
        messageApi.open({
            type: type,
            content: message,
        });
    };

    const tampilkanVoid = (record) => {
        setNoMeja(record.no_meja);
        setRecordID(record.id);
        setIsShowVoid(true);
    };

    const buatHistoryDeleteRegistrasiDriving = async (recordID, uservoid) => {
        let id = recordID;
        let user_void = uservoid;
        let reasons = alasan;
        await axios
            .post(baseUrl + `/historydelete/registrasi-driving`, {
                id,
                user_void,
                reasons,
            })
            .then((res) => {
                console.log(res.data.message);
            })
            .catch((err) => console.log(err));
    };

    const buatHistoryDeleteTransaksiDriving = async (recordID, uservoid) => {
        let registrasi_id = recordID;
        let user_void = uservoid;
        let reasons = alasan;
        await axios
            .post(baseUrl + `/historydelete/transaksi-driving`, {
                registrasi_id,
                user_void,
                reasons,
            })
            .then((res) => {
                console.log(res.data.message);
            })
            .catch((err) => console.log(err));
    };

    const deleteTransaksiDriving = async () => {
        let data = {
            email: email,
            password: password,
        };
        await axios
            .post(baseUrl + `/users/uservoid`, data)
            .then(async(res) => {
                if (res.data.success) {
                    if (res.data.data.role === "1") {
                        // console.log(res.data.data);
                        let uservoid = res.data.data.id;

                        ///buatkan history
                        buatHistoryDeleteRegistrasiDriving(recordID, uservoid);
                        buatHistoryDeleteTransaksiDriving(recordID, uservoid);

                        ///delete registrasi
                        mutateDeleteRegistrasi(recordID);

                        ///ubah status meja di tbl_meja
                        let a = {
                            status: "0",
                        };
                        await mutateUpdateStatusMeja([noMeja, a]);

                        successMessage("success", "Data berhasil dihapus");
                        setEmail("");
                        setPassword("");
                        setIsShowVoid(false);
                    } else {
                        successMessage("error", "Maaf hubungi bagian void.!");
                    }
                } else {
                    successMessage("error", res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleUsernameChange = (v) => {
        setEmail(v);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleReasonsChange = (event) => {
        setAlasan(event.target.value);
    };

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
                                onConfirm={() => tampilkanVoid(record)}
                                // onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    disabled={record.status === "1" ? true : false}
                                    icon={<DeleteOutlined />}
                                    shape="circle"
                                    type="text"
                                    size="small"
                                />
                            </Popconfirm>
                            {/* <Button
                                icon={<AuditOutlined />}
                                size="small"
                                onClick={() => {
                                    setisShowBill(true);
                                    dispatch(reduxUpdateSelected({ dataSelected: record }));

                                    //get total driving order
                                    dispatch(getBillingDrivingOrder(record.id));

                                    //get total resto order
                                    dispatch(getBillingRestoOrder(record.id));
                                    
                                }}
                            /> */}
                        </Space>
                    </>
                );
            },
        },
        {
            title: "Registrasi ID",
            dataIndex: "id",
            key: "id",
            filteredValue: [searchText],
            onFilter: (value, record) => {
                let status = record.status;
                if (status === "0") {
                    status = "Check-in";
                } else if (status === "1") {
                    status = "Paid";
                }
                return (
                    String(record.id).toLowerCase().includes(value.toLowerCase()) ||
                    String(dayjs(record.date).format("DD/MM/YYYY"))
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    String(record.nama).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.no_hp).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.alamat).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.time).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.no_meja).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.bay).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.sales).toLowerCase().includes(value.toLowerCase()) ||
                    String(status).toLowerCase().includes(value.toLowerCase())
                );
            },
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (record) => {
                return dayjs(record.date).format("DD/MM/YYYY");
            },
        },
        {
            title: "Customer",
            dataIndex: "nama",
            key: "nama",
        },
        {
            title: "Handphone",
            dataIndex: "no_hp",
            key: "no_hp",
        },
        {
            title: "Address",
            dataIndex: "alamat",
            key: "alamat",
        },
        // {
        //     title: "Time",
        //     dataIndex: "time",
        //     key: "time",
        // },
        {
            title: "Table",
            dataIndex: "no_meja",
            key: "no_meja",
        },
        {
            title: "Bay",
            dataIndex: "bay",
            key: "bay",
        },
        {
            title: "Sales",
            dataIndex: "sales",
            key: "sales",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            // render(_, record) {
            //     return {
            //     //   props: {
            //     //     style: { color: record.status === "1" ? "#3B7AEF" : null }
            //     //   },
            //       children: <div className="font-semibold">{record.status === "1" ? <div className="bg-green-300 rounded-full">Paid</div> : "Check-in"}</div>
            //     };
            //   }
            render: (_, record) => {
                return (
                    <div className="font-semibold">
                        {record.status === "1" ? (
                            <div className="bg-green-300 rounded-full">Paid</div>
                        ) : (
                            "Check-in"
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            {contextHolder}
            <Card
                title="List Transaksi"
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
                                handleRowClick(record);
                                props.recordSelectedID(record.id);
                                // console.log(record.id);
                            }, 
                            className: selectedRowKeys === record.id ? 'highlighted-row' : '', // Menambahkan kelas CSS jika baris dipilih
                            onDoubleClick: (event) => {
                                // setisShowBill(true);
                                setisShowDetails(true);
                                dispatch(
                                    reduxUpdateNumberIdentifikasi({
                                        numberIdentifikasi: record.id,
                                    })
                                );
                                dispatch(
                                    reduxUpdateSelected({
                                        dataSelected: {
                                            id: record.id,
                                            date: dayjs(record.date).format("YYYY-MM-DD"),
                                            nama: record.nama,
                                            no_hp: record.no_hp,
                                            alamat: record.alamat,
                                        },
                                    })
                                );

                                dispatch(
                                    reduxUpdateMatrixSelected({
                                        matrixSelected: {
                                            namaCustomer: record.nama,
                                            bay_id: record.bay,
                                            namaBay: `bay${record.bay}`,
                                            registrasi_id: record.id,
                                            no_meja: record.no_meja,
                                        },
                                    })
                                );

                                //get total driving order
                                dispatch(getBillingDrivingOrder(record.id));

                                //get total resto order
                                dispatch(getBillingRestoOrder(record.id));
                            },
                        };
                    }}
                    rowClassName={"custom-table-row"}
                />
            </Card>

            {/* Drawer BILL */}
            {/* <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setisShowBill(false)}
                        />
                        <span className="pl-3">Details</span>
                    </>
                }
                placement={"bottom"}
                closable={false}
                onClose={() => setisShowBill(false)}
                open={isShowBill}
                key={"bill"}
                styles={{
                    header: {
                        background: "#0C2D57",
                    },
                }}
                style={{ background: "#F5F5F5" }}
                // width={800}
                height={"95%"}
            >
                <BillingDescriptiom />
            </Drawer> */}
            {/* Drawer End BILL */}

            {/* Details transaksi */}
            <Modal
                title="Details Payment"
                open={isShowDetails}
                onCancel={() => setisShowDetails(false)}
                footer={false}
                width={"950px"}
            >
                <div className="mt-3">
                    <PageDetailsPayment />
                </div>
            </Modal>
            {/* END Details transaksi */}

            {/* SHOW Modal Void */}
            <Modal
                title="Void"
                open={isShowVoid}
                onOk={deleteTransaksiDriving}
                onCancel={() => setIsShowVoid(false)}
            >
                <div className="mb-3 mt-3">
                    {/* <Input
                        autoComplete="false"
                        value={email}
                        placeholder="email"
                        onChange={handleUsernameChange}
                    /> */}
                    <Select
                        showSearch
                        // onChange={onChangeCostCenter}
                        placeholder="---Select---"
                        // optionLabelProp="children"
                        optionFilterProp="children"                        
                        onChange={handleUsernameChange}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        allowClear
                        style={{width:"100%"}}
                        // disabled={disabledCostCenter}
                        options={dataUserVoid?.data?.map((e) => ({
                            value: e.email,
                            label: e.email,
                        }))}
                    />
                </div>
                <div className="mb-3">
                    <Input.Password
                        autoComplete="false"
                        value={password}
                        placeholder="password"
                        onChange={handlePasswordChange}
                    />
                </div>
                <div className="mb-7">
                    <TextArea
                        rows={4}
                        placeholder="Your reasons"
                        showCount={true}
                        maxLength={100}
                        onChange={handleReasonsChange}
                    />
                </div>
            </Modal>
            {/* END SHOW Modal Void */}
        </div>
    );
};

export default TableRegistrasi;
