import {
    Button,
    Card,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    message,
} from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    useDeleteRegistrasiRestoData,
    useGetDetailsTransaksiRestoData,
    useRegistrasiRestoOrderByRegistrasiIdData,
    useRekapRegistrasiRestoOrderByRegistrasiIdData,
} from "../../../hooks/registrasi/useRegistrasiRestoData";
import { useUserVoidRegistrasiData } from "../../../hooks/useUserRegistrasiData";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { baseUrl } from "../../../config";
import EditRegisFormRestoOrder from "../../../components/registrasirestoorder/EditRegisFormRestoOrder";
import { getOnePackageResto } from "../../../features/packageresto/onepackagerestoSlice";
import { reduxUpdateNumberIdentifikasi } from "../../../features/mydataselectedSlice";

const dataDisc = [
    { disc: 5 },
    { disc: 10 },
    { disc: 15 },
    { disc: 20 },
    { disc: 25 },
    { disc: 30 },
    { disc: 35 },
    { disc: 40 },
    { disc: 45 },
    { disc: 50 },
    { disc: 55 },
    { disc: 60 },
    { disc: 65 },
    { disc: 70 },
    { disc: 75 },
];

const { TextArea } = Input;

const DetailsRestoOrder = (props) => {
    // const { dataSelected } = useSelector((state) => state.mydataselected);
    const dispatch=useDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const [isSHowModalDisc, setisSHowModalDisc] = useState(false);
    const [discPersen, setDiscPersen] = useState(0);
    const [isShowVoid, setIsShowVoid] = useState(0);
    const [isShowApprove, setIsShowApprove] = useState(0);
    const [recordID, setRecordID] = useState();
    const [noMeja, setNoMeja] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dataTerpilih, setDataTerpilih] = useState({
        items_id: "",
        items_name: "",
        hrg_jual: 0,
    });
    const [alasan, setAlasan] = useState("");
    const [selectedData, setSelectedData] = useState([]);

    ///HOOKs
    const { data: dataUserVoid } = useUserVoidRegistrasiData(true);
    const { data } = useGetDetailsTransaksiRestoData(props.registrasiID, true);
    const { mutateAsync: mutateDeleteTransaksiResto } =
        useDeleteRegistrasiRestoData();

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
        //     key:"index",
        //     render:(value, item, index) => index+1
        // },
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
            title: "items_name",
            dataIndex: "items_name",
            key: "items_name",
        },
        {
            title: "qty",
            dataIndex: "qty",
            key: "qty",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Price",
            dataIndex: "hrg_jual",
            key: "hrg_jual",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Disc%",
            dataIndex: "disc_persen",
            key: "disc_persen",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "DiscRp",
            dataIndex: "disc_rp",
            key: "disc_rp",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        // {
        //     title: "PriceAf",
        //     dataIndex: "hrg_stl_disc",
        //     key: "hrg_stl_disc",
        //     align: "right",
        //     render: (value) => {
        //         return value.toLocaleString("id");
        //     },
        // },
        {
            title: "ServChg",
            dataIndex: "nilai_service_charge",
            key: "nilai_service_charge",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Pb1",
            dataIndex: "nilai_pb_satu",
            key: "nilai_pb_satu",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Amount",
            dataIndex: "total",
            key: "total",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
    ];

    const handleDiscPersenChange = async (value) => {
        setIsShowVoid(true);
        let v = value ?? 0;
        setDiscPersen(v);
    };

    const handleUsernameChange = (event) => {
        setEmail(event);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleReasonsChange = (event) => {
        setAlasan(event.target.value);
    };

    const buatHistoryDeleteTransaksiResto = async (recordID, uservoid) => {
        let id = recordID;
        let user_void = uservoid;
        let reasons = alasan;

        await axios
            .post(baseUrl + `/historydelete/transaksi-restobyrecordid`, {
                id,
                user_void,
                reasons,
            })
            .then((res) => {
                console.log(res.data.message);
            })
            .catch((err) => console.log(err));
    };

    const deleteTransaksiResto = async () => {
        let data = {
            email: email,
            password: password,
        };
        await axios
            .post(baseUrl + `/users/uservoid`, data)
            .then(async (res) => {
                if (res.data.success) {
                    if (res.data.data.role === "1") {
                        // console.log(res.data.data);
                        let uservoid = res.data.data.id;

                        ///buatkan history
                        buatHistoryDeleteTransaksiResto(recordID, uservoid);

                        ///delete trasnsaksi registrasi
                        mutateDeleteTransaksiResto(recordID);

                        // ///ubah status meja di tbl_meja
                        // let a = {
                        //     status: "0",
                        // };
                        // await mutateUpdateStatusMeja([noMeja, a]);

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

    const validasiUserApprove=async()=>{
        let data = {
            email: email,
            password: password,
        };
        await axios
            .post(baseUrl + `/users/uservoid`, data)
            .then(async (res) => {
                if (res.data.success) {
                    if (res.data.data.role === "1") {
                        // console.log(res.data.data);
                        let uservoid = res.data.data.id;

                        setisSHowModalDisc(true);
                        setIsShowApprove(false);
                        
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

        
    }

    return (
        <div>
            {contextHolder}
            <Table
                scroll={{ x: false, y: 500 }}
                style={{ width: "900px", height: "200px" }}
                pagination={false}
                size="small"
                dataSource={data?.data}
                columns={columns}
                rowKey="id"
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (event) => {
                            setSelectedData(record);
                            setDataTerpilih({
                                items_id: record.items_id,
                                items_name: record.items_name,
                                hrg_jual: record.hrg_jual,
                            });
                            setIsShowApprove(true);
                            dispatch(getOnePackageResto(record.items_id));
                            dispatch(reduxUpdateNumberIdentifikasi({numberIdentifikasi:record.registrasi_id}));
                        },
                    };
                }}
                rowClassName={"custom-table-row"}
            />

            {/* MODAL DISCOUNT */}
            <Modal
                title={dataTerpilih.items_name}
                open={isSHowModalDisc}
                onCancel={() => setisSHowModalDisc(false)}
                footer={false}
            >
                {/* <Space>
                    Disc %
                    <Select
                        style={{ width: "70px" }}
                        // size="small"
                        // showSearch
                        // onChange={onChangeCostCenter}
                        placeholder="00"
                        // optionLabelProp="children"
                        optionFilterProp="children"
                        // onSearch={onSearchAkun}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        allowClear
                        // disabled={disabledCostCenter}
                        value={discPersen}
                        onChange={handleDiscPersenChange}
                        options={dataDisc.map((e) => ({
                            value: e.disc,
                            label: e.disc,
                        }))}
                    />
                    <Button>OK</Button>
                </Space> */}

                <Card title="Update Resto Order" size="small">
                    <EditRegisFormRestoOrder
                        selectedData={selectedData}
                        closeModal={() => setisSHowModalDisc(false)}
                        discHidden={false}
                    />
                </Card>
            </Modal>
            {/* END MODAL DISCOUNT */}

            {/* SHOW Modal Void */}
            <Modal
                title="Void"
                open={isShowVoid}
                onOk={deleteTransaksiResto}
                onCancel={() => setIsShowVoid(false)}
            >
                <div className="mb-3 mt-3">
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
                        style={{ width: "100%" }}
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


            {/* SHOW Modal Approve */}
            <Modal
                title="Approve"
                open={isShowApprove}
                onOk={validasiUserApprove}
                onCancel={() => setIsShowApprove(false)}
            >
                <div className="mb-3 mt-3">
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
                        style={{ width: "100%" }}
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
            {/* END SHOW Modal Approve */}
        </div>
    );
};

export default DetailsRestoOrder;
