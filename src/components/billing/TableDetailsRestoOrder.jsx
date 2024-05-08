import { Button, Input, InputNumber, Modal, Select, Space, Table } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRekapRegistrasiRestoOrderByRegistrasiIdData } from "../../hooks/registrasi/useRegistrasiRestoData";
import { useUserVoidRegistrasiData } from "../../hooks/useUserRegistrasiData";

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

const TableDetailsRestoOrder = () => {
    const { dataSelected } = useSelector((state) => state.mydataselected);

    const [isSHowModalDisc, setisSHowModalDisc] = useState(false);
    const [discPersen, setDiscPersen] = useState(0);
    const [isShowVoid, setIsShowVoid] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dataTerpilih, setDataTerpilih] = useState({
        items_id: "",
        items_name: "",
        hrg_jual: 0,
    });

    ///HOOKs
    const { data: dataUserVoid } = useUserVoidRegistrasiData(true);
    const { data } = useRekapRegistrasiRestoOrderByRegistrasiIdData(
        dataSelected.id,
        true
    );

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
            title: "items_name",
            dataIndex: "items_name",
            key: "items_name",
        },
        {
            title: "qty",
            dataIndex: "totQty",
            key: "totQty",
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
            dataIndex: "totSrvCharge",
            key: "totSrvCharge",
            align: "right",
            render: (value) => {
                return value.toLocaleString("id");
            },
        },
        {
            title: "Pb1",
            dataIndex: "totNilaiPpSatu",
            key: "totNilaiPpSatu",
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

    return (
        <div>
            <Table
                scroll={{ x: false, y: 500 }}
                style={{ width: "900px", height: "200px" }}
                pagination={false}
                size="small"
                dataSource={data?.data}
                columns={columns}
                rowKey="items_name"
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (event) => {
                            setDataTerpilih({
                                items_id: record.items_id,
                                items_name: record.items_name,
                                hrg_jual: record.hrg_jual,
                            });
                            setisSHowModalDisc(true);
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
            >
                
                <Space>
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
                    </Space>
            </Modal>
            {/* END MODAL DISCOUNT */}

            {/* SHOW Modal Void */}
            <Modal
                title="Void"
                open={isShowVoid}
                // onOk={}
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
            </Modal>
            {/* END SHOW Modal Void */}
        </div>
    );
};

export default TableDetailsRestoOrder;
