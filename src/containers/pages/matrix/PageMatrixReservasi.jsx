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
    notification,
} from "antd";
import { useWaktuServerData } from "../../../hooks/useWaktuServer";
import dayjs from "dayjs";
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
import GridMatrixReservasi from "../../../components/matrix/reservasi/GridMatrixReservasi";
import { FaCartShopping } from "react-icons/fa6";
import TableReservasiResto from "../../../components/reservasirestoorder/TableReservasiResto";
import PageAddRestoOrderReservasi from "./PageAddRestoOrderReservasi";

const PageMatrixReservasi = () => {
    const dispatch = useDispatch();
    const [api, contextHolder] = notification.useNotification();

    const { userid } = useSelector((state) => state.auth);
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);
    // const { numberIdentifikasi } = useSelector((state) => state.mydataSelected);
    
    const [isDisabled, setisDisabled] = useState(true);
    const [isShowModalOrderResto, setIsShowModalOrderResto] = useState(false);
    const [isShowModalKeranjang, setIsShowModalKeranjang] = useState(false);
    const [tanggal, setTanggal] = useState();
    const [radioAktif, setRadioAktif] = useState({start:"1", end:"10"})

    ///HOOKs
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
                rTitle: "Reservasi",
            })
        );

        ///cek status matrix, hanya yg status booking bisa order makanan 
        if (matrixSelected?.status === 'booking') {
            setisDisabled(false);
            // setisDisabledReservasi(true);
        } else {
            setisDisabled(true);
            // setisDisabledReservasi(false);
        }
    }, [dispatch, matrixSelected]);


    const createMatrix = async (id, date, time) => {
        let data = {
            id: id,
            date: dayjs(date).format("YYYY-MM-DD"),
            time: time,
        };
        await axios
            .post(baseUrl + `/matrix`, data)
            .then((res) => {
                console.log(res.data.message);
            })
            .catch((err) => console.log(err));
    };

    const buatkanMatrixBay = async (date) => {
        let tgl = dayjs(date).format("YYYY-MM-DD");
        await axios
            .get(baseUrl + `/matrix/orderbydate?date=${tgl}}`)
            .then((res) => {
                if (res.data.success) {
                    // console.log("matrix sudah ada");
                    // errorMessage();
                } else {
                    ///buat matrix
                    let idBay = dayjs(tgl).format("DDMMYY");

                    for (let i = 6; i <= 23; i++) {
                        // console.log(i);
                        if (i.toString().length < 2) {
                            let time = `0${i}:00:00`;
                            // createMatrix(i, tgl, time);
                            createMatrix(idBay + `0${i}`, tgl, time);
                        } else {
                            let time = `${i}:00:00`;
                            // createMatrix(i, tgl, time);
                            createMatrix(idBay + i, tgl, time);
                        }
                    }
                    // successMessage();
                }
            })
            .catch((err) => console.log(err));
    };

    const onCLickRestoOrder = () => {
        setIsShowModalOrderResto(true);
    };

    const onChangeDate = (v) => {
        let date = dayjs(v);
        setTanggal(date);
        buatkanMatrixBay(date);
    };

    const items = [
        {
            key: "1",
            label: "Date",
            children: (
                <DatePicker
                    format={"DD/MM/YYYY"}
                    onChange={onChangeDate}
                    defaultValue={dayjs(dataWaktuServer?.waktuserver)}
                />
            ),
        },
        {
            key: "2",
            label: "Player",
            children: matrixSelected?.namaCustomer,
        },
    ];

    const onClickKeranjang=()=>{
        setIsShowModalKeranjang(true);
    }

    const onChangeRadioGroup=(v)=>{
        let value = v.target.value;
        if (value === "10") {
            setRadioAktif({start:"1", end:"10"});            
        } else if (value === "20") {
            setRadioAktif({start:"11", end:"20"});                    
        } else if (value === "30") {
            setRadioAktif({start:"21", end:"30"});                    
        } else if (value === "40") {
            setRadioAktif({start:"31", end:"40"});            
        } else if (value === "vip") {
            setRadioAktif({ start: "41", end: "44" });
        }
    }

    return (
        <div>
            {contextHolder}
            <div className="mb-5 flex flex-wrap justify-between items-center gap-3">
                <div>
                    <Card
                        title="Player Info"
                        size="small"
                        style={{ width: "450px" }}
                        styles={{
                            header: { backgroundColor: "#682D2D", color: "white" },
                            body: { backgroundColor: "#EFF4FD" },
                        }}
                    >
                        <div className="mb-2">
                            <Descriptions
                                bordered
                                size="small"
                                items={items}
                                contentStyle={{ backgroundColor: "white" }}
                            />
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-3">
                            <div>
                                <Button
                                    onClick={onCLickRestoOrder}
                                    disabled={isDisabled}
                                    style={{ backgroundColor: "#92C7CF" }}
                                >
                                    F&B Order
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
                        <span>Finish</span>
                    </Flex>
                    <Flex align="center" gap={7} justify="start">
                        <div className="h-5 w-5 border bg-[#807D7D]" />
                        <span>Paid</span>
                    </Flex>
                </div>
                <div>
                    <Radio.Group defaultValue={"10"} buttonStyle="solid" onChange={onChangeRadioGroup}>
                        <Radio.Button value="10">1-10</Radio.Button>
                        <Radio.Button value="20">11-20</Radio.Button>
                        <Radio.Button value="30">21-30</Radio.Button>
                        <Radio.Button value="40">31-40</Radio.Button>
                        <Radio.Button value="vip">41-44</Radio.Button>
                    </Radio.Group>
                </div>
            </div>

            {/* <TableMatrixBay /> */}
            <GridMatrixReservasi tanggal={tanggal} start={radioAktif.start} end={radioAktif.end}/>            

            

            {/* MODAL SHOW ORDER RESTO */}
            <Modal
                width="900px"
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
                        <PageAddRestoOrderReservasi
                        tanggal={tanggal}
                            closeModal={() => setIsShowModalOrderResto(false)}
                        />
                    </div>
                </Card>
            </Modal>
            {/* END MODAL SHOW ORDER RESTO */}


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
                <TableReservasiResto />
            </Modal>
            {/* END MODAL KERANJANG */}
        </div>
    );
};

export default PageMatrixReservasi;
