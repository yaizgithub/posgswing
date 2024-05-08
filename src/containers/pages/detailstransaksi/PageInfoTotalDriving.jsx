import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useWaktuServerData } from "../../../hooks/useWaktuServer";
import { useOneRegistrasiData } from "../../../hooks/registrasi/useRegistrasiData";
import { Card, Flex, Input, InputNumber, Modal, Select, Skeleton, Space, message } from "antd";
import dayjs from "dayjs";
import { useGetSumTransaksiDrivingData, useUpdatePerhitunganTransaksiDrivingByRegisIdData } from "../../../hooks/registrasi/useRegistrasiDrivingData";
import axios from "axios";
import { baseUrl } from "../../../config";
import { useUserVoidRegistrasiData } from "../../../hooks/useUserRegistrasiData";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

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

const PageInfoTotalDriving = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const { userid } = useSelector((state) => state.auth);
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);

    const [amount, setAmount] = useState(0);
    const [discPersen, setDiscPersen] = useState(0);
    const [nilaiDisc, setNilaiDisc] = useState(0);
    const [nilaiPpn, setNilaiPpn] = useState(0);
    const [subTotal, setSubTotal] = useState(0);

    const [isShowVoid, setIsShowVoid] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    ///HOOKs
    const { data: dataUserVoid } = useUserVoidRegistrasiData(true);
    const {
        data: dataSumTransaksiDriving,
        isLoading,
        isError,
        error,
    } = useGetSumTransaksiDrivingData(matrixSelected.registrasi_id, true);
    const { mutateAsync: mutateUpdatePerhitunganTransaksiDrivingByRegisId } = useUpdatePerhitunganTransaksiDrivingByRegisIdData();

    useEffect(() => {
        if (dataSumTransaksiDriving?.data !== undefined) {
            let amount = dataSumTransaksiDriving?.data[0].sumJumlah;
            let discpersen = dataSumTransaksiDriving?.data[0].disc_persen;
            let nilaidisc = dataSumTransaksiDriving?.data[0].sumTotNilaiDisc;
            let nilaippn = dataSumTransaksiDriving?.data[0].sumTotNilaiPpn;
            let subtotal = dataSumTransaksiDriving?.data[0].sumTotal;

            setAmount(amount);
            setDiscPersen(discpersen);
            setNilaiDisc(nilaidisc);
            setNilaiPpn(nilaippn);
            setSubTotal(subtotal);
        } else {
            setAmount(0);
            setDiscPersen(0);
            setNilaiDisc(0);
            setNilaiPpn(0);
            setSubTotal(0);            
        }
    }, [dataSumTransaksiDriving])


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

    const successMessage = (type, message) => {
        messageApi.open({
            type: type,
            content: message,
        });
    };

    const handleUsernameChange = (event) => {
        setEmail(event);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };



    const updateDiscAllItems = async () => {
        ///cek usernya apakah rolenya 1
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
                        // let uservoid = res.data.data.id;

                        let ndisc = amount * (discPersen / 100);
                        let subtotal = amount - ndisc;
                        let nppn = subtotal * (11 / 100);
                        let tot = subtotal + nppn;
                        setNilaiDisc(ndisc);
                        setNilaiPpn(nppn);
                        setSubTotal(tot);

                        ///masukkan diskonnya ke database
                        let dataA = {
                            disc_persen: discPersen,
                            updator: userid
                        }
                        await mutateUpdatePerhitunganTransaksiDrivingByRegisId([matrixSelected.registrasi_id, dataA]);

                        successMessage("success", "berhasil merubah discount");
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



    }

    const handleDiscPersenChange = async (value) => {
        setIsShowVoid(true);
        let v = value ?? 0;
        setDiscPersen(v);
    };



    return (
        <div>
            {contextHolder}
            <Card
                title="Driving"
                size="small"
                // style={{ width: "450px" }}
                styles={{
                    header: { backgroundColor: "#DAE8FE" },
                    body: { backgroundColor: "#EFF4FD" },
                }}
            >
                <div className="flex justify-start gap-7">
                    <div className="w-72">
                        <Flex justify="space-between">
                            <div>Amount</div>
                            <div>
                                <InputNumber
                                    value={amount}
                                    formatter={formatter}
                                    parser={parser}
                                    style={{ width: "120px" }}
                                />
                            </div>
                        </Flex>
                        <Flex justify="space-between">
                            <div>Disc</div>
                            <div>
                                <Space>
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
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
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
                                    <InputNumber
                                        value={nilaiDisc}
                                        formatter={formatter}
                                        parser={parser}
                                        style={{ width: "120px" }}
                                    />
                                </Space>
                            </div>
                        </Flex>
                        <Flex justify="space-between" align="center">
                            <div>Tax</div>
                            <div>
                                <Space>
                                    <Select
                                        disabled
                                        style={{ width: "70px" }}
                                        // size="small"
                                        // showSearch
                                        // onChange={onChangeCostCenter}
                                        placeholder="00"
                                        // optionLabelProp="children"
                                        optionFilterProp="children"
                                        // onChange={onChangeDiscPersen}
                                        // onSearch={onSearchAkun}
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        allowClear
                                        // disabled={disabledCostCenter}
                                        value={11}
                                        options={dataDisc.map((e) => ({
                                            value: e.disc,
                                            label: e.disc,
                                        }))}
                                    />
                                    <InputNumber
                                        value={nilaiPpn}
                                        formatter={formatter}
                                        parser={parser}
                                        style={{ width: "120px" }}
                                    />
                                </Space>
                            </div>
                        </Flex>
                        <Flex justify="space-between">
                            <div>Sub Total</div>
                            <div>
                                <InputNumber
                                    value={subTotal}
                                    formatter={formatter}
                                    parser={parser}
                                    style={{ width: "120px" }}
                                />
                            </div>
                        </Flex>
                    </div>
                </div>
            </Card>


            {/* SHOW Modal Void */}
            <Modal
                title="Void"
                open={isShowVoid}
                onOk={updateDiscAllItems}
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
            </Modal>
            {/* END SHOW Modal Void */}
        </div>
    );
};

export default PageInfoTotalDriving;
