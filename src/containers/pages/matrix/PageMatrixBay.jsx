import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reduxUpdateTitle } from "../../../features/titleSlice";
import {
    Badge,
    Button,
    Card,
    DatePicker,
    Descriptions,
    Drawer,
    Flex,
    Form,
    Input,
    Modal,
    Radio,
    Select,
    notification,
} from "antd";
import GridMatrixBay from "../../../components/matrix/registrasi/GridMatrixBay";
import { CloseOutlined } from "@ant-design/icons";

import { useWaktuServerData } from "../../../hooks/useWaktuServer";
import dayjs from "dayjs";
import AddFormReservasi from "../../../components/reservasi/AddFormReservasi";
import TabTableRegistrasi from "../registrasi/TabTableRegistrasi";
import {
    useRegistrasiRestoOrderByRegistrasiIdData,
    useUpdateStatusWhereNullRegistrasiRestoData,
} from "../../../hooks/registrasi/useRegistrasiRestoData";
import {
    useTotalJamRegistrasiDrivinRegisIdData,
    useTotalJamTerpakaiRegistrasiDrivinRegisIdData,
} from "../../../hooks/registrasi/useRegistrasiDrivingData";
import { useUpdateMatrixbayData } from "../../../hooks/useMatrixbayData";
import { baseUrl } from "../../../config";
import axios from "axios";
import PageDrivingOrder from "./PageAddDrivingOrder";
import PageAddDrivingOrder from "./PageAddDrivingOrder";
import PageAddRestoOrder from "./PageAddRestoOrder";
import { FaCartShopping } from "react-icons/fa6";
import TableRegistrasiResto from "../../../components/registrasirestoorder/TableRegistrasiResto";
import PageAddDrivingOrderFree from "./PageAddDrivingOrderFree";
import { useUserVoidRegistrasiData } from "../../../hooks/useUserRegistrasiData";
import { useNavigate } from "react-router-dom";

let colorCheckIn = "#f0ee97";
let colorPaidOff = "#8B2A1D";
let colorPlay = "#83FC93";
let colorBooking = "#DACEF8";
let colorFinish = "#D42B4449";
let colorText = "#ffffff";

const { TextArea } = Input;

const PageMatrixBay = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [api, contextHolder] = notification.useNotification();

    const { userid } = useSelector((state) => state.auth);
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);
    // const { numberIdentifikasi } = useSelector((state) => state.mydataSelected);

    // const [isShowModalOrder, setisShowModalOrder] = useState(false);
    const [isDisabled, setisDisabled] = useState(true);
    const [isDisabledReservasi, setisDisabledReservasi] = useState(true);
    const [isShowModalReservasi, setisShowModalReservasi] = useState(false);
    const [isShowModalOrderDriving, setIsShowModalOrderDriving] = useState(false);
    const [isShowModalOrderDrivingFree, setIsShowModalOrderDrivingFree] =
        useState(false);
    const [isShowModalOrderResto, setIsShowModalOrderResto] = useState(false);
    const [isShowModalKeranjang, setIsShowModalKeranjang] = useState(false);
    const [radioAktif, setRadioAktif] = useState({ start: "1", end: "10" });

    const [isShowVoid, setIsShowVoid] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alasan, setAlasan] = useState("");

    ///HOOKs
    const { data: dataUserVoid } = useUserVoidRegistrasiData(true);
    const { data: dataWaktuServer } = useWaktuServerData(true);
    const { mutateAsync: mutateUpdateMatrixbayData } = useUpdateMatrixbayData();
    const {
        data: dataTotalJamDrivingOrder,
        refetch: refetchTotalJamDrivingOrder,
    } = useTotalJamRegistrasiDrivinRegisIdData(
        matrixSelected?.registrasi_id,
        true
    );

    const {
        data: dataTotalJamTerpakaiDrivingOrder,
        refetch: refetchTotalJamTerpakaiDrivingOrder,
    } = useTotalJamTerpakaiRegistrasiDrivinRegisIdData(
        matrixSelected?.registrasi_id,
        true
    );

    const { mutateAsync: mutateUpdateStatusWhereNullRegistrasiRestoData } =
        useUpdateStatusWhereNullRegistrasiRestoData();
    const {
        data: dataRegistrasiRestoOrderByRegistrasiIdData,
        refetch: refetchRegistrasiRestoOrderByRegistrasiIdData,
    } = useRegistrasiRestoOrderByRegistrasiIdData(
        matrixSelected?.registrasi_id,
        false
    );

    useEffect(() => {
        dispatch(
            reduxUpdateTitle({
                rTitle: "Registrasi",
            })
        );

        ///cek matrix kosong atau tidak, jika kosong tdk bisa order driving n restro
        if (matrixSelected.namaCustomer?.length > 0) {
            setisDisabled(false);
            setisDisabledReservasi(true);
        } else {
            setisDisabled(true);
            setisDisabledReservasi(false);
        }
    }, [dispatch, matrixSelected]);

    const openNotification = (placement) => {
        api.success({
            message: `F & B Success `,
            description: "Pesanan diteruskan ke Kitchen",
            placement,
        });
    };

    // const onCLickDrivingOrder = () => {
    //     setisShowModalOrder(true);
    // };

    const items = [
        {
            key: "1",
            label: "Date",
            children: dayjs(dataWaktuServer?.waktuserver).format("DD/MM/YYYY"),
        },
        {
            key: "2",
            label: "Player",
            children: matrixSelected?.namaCustomer,
        },
    ];

    const onClickReservasi = () => {
        setisShowModalReservasi(true);
    };

    const updateMatrixData = async (id) => {
        ///update data matrix
        let data = {
            namaCustomer:
                matrixSelected.namaCustomer + ",play," + matrixSelected.registrasi_id,
        };
        await mutateUpdateMatrixbayData([id, matrixSelected.namaBay, data]);
        ///End update data matrix
    };

    const updateTambahJamBay = async (jmlJam) => {
        let data = {
            jml_jam: jmlJam,
        };
        await axios
            .put(
                baseUrl + `/bay/edit-tambahjam/${matrixSelected.registrasi_id}`,
                data
            )
            .then((res) => {
                console.log("berhasil tambah jam");
            })
            .catch((err) => console.log(err));
    };

    const onClickProses = async () => {
        let data = {
            status_order: "0",
            updator: userid,
        };
        await mutateUpdateStatusWhereNullRegistrasiRestoData([
            matrixSelected.registrasi_id,
            data,
        ]);

        refetchRegistrasiRestoOrderByRegistrasiIdData();
        if (dataRegistrasiRestoOrderByRegistrasiIdData?.data?.length > 0) {
            openNotification("topRight");
        }

        // ///update registari driving order time
        // await updateTimeRegistrasiDrivingOrder();
        // setisShowModalOrder(false);

        ///cek total jam lagi dipakai
        refetchTotalJamTerpakaiDrivingOrder();
        if (dataTotalJamTerpakaiDrivingOrder?.success) {
            let totaljamTerpakai = dataTotalJamTerpakaiDrivingOrder?.data[0]?.totJam;

            ///cek total jam orderan driving
            refetchTotalJamDrivingOrder();
            if (dataTotalJamDrivingOrder?.success) {
                let totaljamkosong = dataTotalJamDrivingOrder?.data[0]?.totJam;
                let totaljam = totaljamTerpakai + totaljamkosong;

                ///update data matrix
                for (let index = 0; index < totaljam; index++) {
                    // ///update data matrix
                    // console.log(parseInt(matrixSelected.id) + index);
                    // updateMatrixData(parseInt(matrixSelected.id) + index);
                    ///update data matrix
                    let depan = matrixSelected.id.substr(0, 6);
                    let idRow = parseInt(matrixSelected.id.substr(6, 2));
                    if (idRow.toString().length < 2) {
                        // console.log({depan:depan, panjangBelakang:idRow.toString().length, hasil:depan +"0"+ (parseInt(idRow) + index)});
                        updateMatrixData(depan + "0" + (parseInt(idRow) + index));
                    } else {
                        // console.log({depan:depan, panjangBelakang:idRow.toString().length, hasil:depan +"0"+ (parseInt(idRow) + index)});
                        updateMatrixData(depan + (parseInt(idRow) + index));
                    }
                }

                ///update bay tambah jam
                await updateTambahJamBay(totaljamkosong);
            } else {
                console.log("Data total jam tidak ditemukan");
            }
        } else {
            console.log("Data total jam terpakai tidak ditemukan");
        }
    };

    const onClickOrderDriving = () => {
        setIsShowModalOrderDriving(true);
    };
    const onClickOrderResto = () => {
        // setIsShowModalOrderResto(true);

        navigate('/daftar-order-resto');
    };
    const onClickOrderDrivingFree = async() => {
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

                        setIsShowVoid(false);
                        setIsShowModalOrderDrivingFree(true);

                        setEmail("");
                        setPassword("");
                        setIsShowVoid(false);
                    } else {
                        alert("error", "Maaf hubungi bagian void.!");
                    }
                } else {
                    alert("error", res.data.message);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        
    };

    const onClickKeranjang = () => {
        setIsShowModalKeranjang(true);
    };

    const onChangeRadioGroup = (v) => {
        let value = v.target.value;
        if (value === "10") {
            setRadioAktif({ start: "1", end: "10" });
        } else if (value === "20") {
            setRadioAktif({ start: "11", end: "20" });
        } else if (value === "30") {
            setRadioAktif({ start: "21", end: "30" });
        } else if (value === "40") {
            setRadioAktif({ start: "31", end: "40" });
        } else if (value === "vip") {
            setRadioAktif({ start: "41", end: "44" });
        }
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
            <div className="mb-5 flex flex-wrap justify-between items-center gap-3">
                <div>
                    <Card
                        title="Player Info"
                        size="small"
                        // style={{ width: "450px" }}
                        styles={{
                            header: { backgroundColor: "#DAE8FE" },
                            body: { backgroundColor: "#EFF4FD" },
                        }}
                    >
                        <div className="mb-2">
                            {/* <Descriptions
                                bordered
                                size="small"
                                items={items}
                                contentStyle={{ backgroundColor: "#F7F6E4" }}
                            /> */}
                            <Flex gap={10}>
                                <div>
                                    <table>
                                        {/* <thead></thead> */}
                                        <tbody>
                                            <tr>
                                                <td width={"50px"}>Date</td>
                                                <td>
                                                    :{" "}
                                                    {dayjs(dataWaktuServer?.waktuserver).format(
                                                        "DD/MM/YYYY"
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Play</td>
                                                <td>: {matrixSelected?.timeStart}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <table>
                                        {/* <thead></thead> */}
                                        <tbody>
                                            <tr>
                                                <td>Player</td>
                                                <td>: {matrixSelected?.namaCustomer}</td>
                                            </tr>
                                            <tr>
                                                <td>End</td>
                                                <td>: {matrixSelected?.timeEnd}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Flex>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-3">
                            <div>
                                <Button
                                    onClick={onClickOrderDriving}
                                    disabled={isDisabled}
                                    style={{ backgroundColor: "#92C7CF" }}
                                >
                                    Package Order
                                </Button>
                            </div>
                            <div>
                                <Button
                                    onClick={onClickOrderResto}
                                    disabled={isDisabled}
                                    style={{ backgroundColor: "#92C7CF" }}
                                >
                                    F&B Order
                                </Button>
                            </div>
                            <div>
                                <Button
                                    onClick={()=>setIsShowVoid(true)}
                                    disabled={isDisabled}
                                    style={{ backgroundColor: "#92C7CF" }}
                                >
                                    Free Hour
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
                <div>
                    <Flex align="center" gap={7} justify="start">
                        <div className="h-5 w-5 border bg-[#DACEF8]" />
                        <span>Reservasi</span>
                    </Flex>
                    <Flex align="center" gap={7} justify="start">
                        <div className="h-5 w-5 border bg-[#f0ee97]" />
                        <span>Check-in</span>
                    </Flex>
                    <Flex align="center" gap={7} justify="start">
                        <div className="h-5 w-5 border bg-[#83FC93]" />
                        <span>Play</span>
                    </Flex>
                    <Flex align="center" gap={7} justify="start">
                        <div className="h-5 w-5 border bg-[#D42B4449]" />
                        <span>Stop</span>
                    </Flex>
                    <Flex align="center" gap={7} justify="start">
                        <div className="h-5 w-5 border bg-[#807D7D]" />
                        <span>Paid</span>
                    </Flex>
                </div>
                <div className="flex flex-wrap flex-col justify-end items-end gap-3">
                    <div>
                        <Radio.Group
                            defaultValue={"10"}
                            buttonStyle="solid"
                            onChange={onChangeRadioGroup}
                        >
                            <Radio.Button value="10">1-10</Radio.Button>
                            <Radio.Button value="20">11-20</Radio.Button>
                            <Radio.Button value="30">21-30</Radio.Button>
                            <Radio.Button value="40">31-40</Radio.Button>
                            <Radio.Button value="vip">41-44</Radio.Button>
                        </Radio.Group>
                    </div>
                    {/* <div>
                        <Button
                            disabled={isDisabledReservasi}
                            onClick={onClickReservasi}
                            style={
                                isDisabledReservasi
                                    ? { backgroundColor: "#9C7CE7", color: "#AA90E6" }
                                    : { backgroundColor: "#9C7CE7", color: "white" }
                            }
                        >
                            Reservasi
                        </Button>
                    </div> */}
                </div>
            </div>

            {/* <TableMatrixBay /> */}
            <GridMatrixBay
                tanggal={dayjs(dataWaktuServer?.waktuserver)}
                start={radioAktif.start}
                end={radioAktif.end}
            />

            {/* MODAL SHOW ORDER */}
            {/* <Modal
                width={700}
                open={isShowModalOrder}
                onCancel={() => setisShowModalOrder(false)}
                okText="Proses"
                onOk={onClickProses}
            >
                <Card title="ORDER PACKAGE / F & B" size="small">
                    <div className="mt-1">
                        <TabTableRegistrasi
                        // closeModal={() => setisShowModalOrder(false)}
                        />
                    </div>
                </Card>
            </Modal> */}
            {/* END MODAL SHOW ORDER */}

            {/* Drawer Reservasi Entry*/}
            <Drawer
                title={
                    <>
                        <Button
                            shape="circle"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => setisShowModalReservasi(false)}
                        />
                        <span className="pl-3">Reservasi</span>
                    </>
                }
                placement={"right"}
                closable={false}
                onClose={() => setisShowModalReservasi(false)}
                open={isShowModalReservasi}
                key={"reservasi-entry"}
                styles={{
                    header: {
                        background: "#AA90E6",
                    },
                }}
                style={{ background: "#F5F5F5" }}
                width={800}
            >
                <Card title="Reservasi Entry" size="small">
                    <AddFormReservasi closeModal={() => setisShowModalReservasi(false)} />
                </Card>
            </Drawer>
            {/* END Drawer Reservasi Entry*/}

            {/* MODAL SHOW ORDER DRIVING */}
            <Modal
                width="630px"
                open={isShowModalOrderDriving}
                onCancel={() => setIsShowModalOrderDriving(false)}
                okText="Proses"
                footer={false}
            // onOk={onClickProses}
            >
                <Card
                    title={`PACKAGE ORDER - ${matrixSelected.namaCustomer}`}
                    size="small"
                    styles={{
                        body: { backgroundColor: "#F8F8F8" },
                        header: { backgroundColor: "#92C7CF" },
                    }}
                >
                    <div className="mt-1">
                        <PageAddDrivingOrder
                            closeModal={() => setIsShowModalOrderDriving(false)}
                        />
                    </div>
                </Card>
            </Modal>
            {/* END MODAL SHOW ORDER DRIVING */}

            {/* MODAL SHOW ORDER RESTO */}
            <Modal
                width="950px"
                open={isShowModalOrderResto}
                onCancel={() => setIsShowModalOrderResto(false)}
                okText="Proses"
                footer={false}
                style={{ top: "30px" }}
                closable={false}
            // onOk={onClickProses}
            >
                <Card
                    title={`F & B ORDER - ${matrixSelected.namaCustomer}`}
                    size="small"
                    styles={{
                        body: { backgroundColor: "#F8F8F8" },
                        header: { backgroundColor: "#92C7CF" },
                    }}
                    extra={
                        <div className="block md:hidden">
                            <Badge count={1} size="small" offset={[-10, 10]}>
                                <Button type="text" shape="circle" onClick={onClickKeranjang}>
                                    <FaCartShopping fontSize={"24px"} />
                                </Button>
                            </Badge>
                        </div>
                    }
                >
                    <div className="mt-1">
                        <PageAddRestoOrder
                            closeModal={() => setIsShowModalOrderResto(false)}
                        />
                    </div>
                </Card>
            </Modal>
            {/* END MODAL SHOW ORDER RESTO */}

            {/* MODAL SHOW ORDER DRIVING FREE*/}
            <Modal
                width="630px"
                open={isShowModalOrderDrivingFree}
                onCancel={onClickOrderDrivingFree}
                okText="Proses"
                footer={false}
            // onOk={onClickProses}
            >
                <Card
                    title={`FREE HOUR - ${matrixSelected.namaCustomer}`}
                    size="small"
                    styles={{
                        body: { backgroundColor: "#F8F8F8" },
                        header: { backgroundColor: "#92C7CF" },
                    }}
                >
                    <div className="mt-1">
                        <PageAddDrivingOrderFree
                            closeModal={() => setIsShowModalOrderDrivingFree(false)}
                        />
                    </div>
                </Card>
            </Modal>
            {/* END MODAL SHOW ORDER DRIVING FREE*/}

            {/* MODAL KERANJANG */}
            <Modal
                //  width="900px"
                open={isShowModalKeranjang}
                onCancel={() => setIsShowModalKeranjang(false)}
                okText="Proses"
                footer={false}
                style={{ top: "30px" }}
                closable={false}
            >
                <TableRegistrasiResto />
            </Modal>
            {/* END MODAL KERANJANG */}

            {/* SHOW Modal Void */}
            <Modal
                title="Void"
                open={isShowVoid}
                onOk={onClickOrderDrivingFree}
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
        </div>
    );
};

export default PageMatrixBay;
