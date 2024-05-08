import { Button, Input, Modal, Popconfirm, Select, Space, Table, message } from "antd";
import React, { useState } from "react";
import {
    useDeleteRegistrasiDrivingData,
    useGetDetailsTransaksiDrivingData,
    useRekapRegistrasiDrivingOrderByRegistrasiIdData,
} from "../../../hooks/registrasi/useRegistrasiDrivingData";
import { useSelector } from "react-redux";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { baseUrl } from "../../../config";
import axios from "axios";
import { useUpdateStatusMejaData } from "../../../hooks/useMejaData";
import { useUserVoidRegistrasiData } from "../../../hooks/useUserRegistrasiData";


const { TextArea } = Input;

const DetailsDrivingOrder = (props) => {
    // const { dataSelected } = useSelector((state) => state.mydataselected);
    const [messageApi, contextHolder] = message.useMessage();

    ///HOOKs
    const { data } = useGetDetailsTransaksiDrivingData(props.registrasiID, true);
    const { data: dataUserVoid } = useUserVoidRegistrasiData(true);
    const { mutateAsync: mutateUpdateStatusMeja } = useUpdateStatusMejaData();
    const { mutateAsync: mutateDeleteTransaksiDriving } = useDeleteRegistrasiDrivingData();

    const [isShowVoid, setIsShowVoid] = useState(false);
    const [recordID, setRecordID] = useState();
    const [noMeja, setNoMeja] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alasan, setAlasan] = useState("");

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

    const columnsRekap = [
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
            title: "Items",
            dataIndex: "items_name",
            key: "items_name",
        },
        {
            title: "Qty",
            dataIndex: "totQty",
            key: "totQty",
            align: "right",
        },
        {
            title: "Total Hours",
            dataIndex: "totJam",
            key: "totJam",
            align: "right",
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
            title: "Amount",
            dataIndex: "jumlah",
            key: "jumlah",
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
            // render: (value) => {
            //     return value.toLocaleString("id");
            // },
        },
        {
            title: "Ppn",
            dataIndex: "totNilaiPpn",
            key: "totNilaiPpn",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },

        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
    ];

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
            title: "Items",
            dataIndex: "items_name",
            key: "items_name",
        },
        {
            title: "Qty",
            dataIndex: "qty",
            key: "qty",
            align: "right",
        },
        {
            title: "Total Hours",
            dataIndex: "qty_jam",
            key: "qty_jam",
            align: "right",
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
            title: "Amount",
            dataIndex: "jumlah",
            key: "jumlah",
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
            // render: (value) => {
            //     return value.toLocaleString("id");
            // },
        },
        {
            title: "Ppn",
            dataIndex: "nilai_ppn",
            key: "nilai_ppn",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },

        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
    ];

    const buatHistoryDeleteTransaksiDrivingByRecordID = async (recordID, uservoid) => {
        let id = recordID;
        let user_void = uservoid;
        let reasons = alasan;
        console.log({id:recordID});
        await axios
            .post(baseUrl + `/historydelete/transaksi-drivingbyrecordid`, {
                id,
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
                        buatHistoryDeleteTransaksiDrivingByRecordID(recordID, uservoid);

                        ///delete trasnsaksi registrasi
                        mutateDeleteTransaksiDriving(recordID);

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

    const handleUsernameChange = (v) => {
        setEmail(v);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleReasonsChange = (event) => {
        setAlasan(event.target.value);
    };

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
                        onClick: (event) => {
                            // console.log(record);
                        }, // click row
                    };
                }}
                rowClassName={"custom-table-row"}
            />


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

export default DetailsDrivingOrder;
