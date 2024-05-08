import { Button, Dropdown, Input, Menu, Modal, Popconfirm } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import beepSound from "../../assets/metallic_beeps.mp3";
import {
    useUpdateStatusCheckinToPlayMatrixBay,
    useUpdateStatusPlayToFinishMatrixBay,
} from "../../hooks/useMatrixbayData";
import { useUpdateSebagianBayData, useUpdateStatusBayData } from "../../hooks/useBayData";
import axios from "axios";
import { baseUrl } from "../../config";
import { useUpdateTimeRegistrasiDrivingData } from "../../hooks/registrasi/useRegistrasiDrivingData";
import { useSelector } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { usePackageDrivingFreeData } from "../../hooks/usePackageDrivingData";



const CountdownStart = (props) => {
    const [modal, contextHolder] = Modal.useModal();
    const [isShowConfirmasi, setisShowConfirmasi] = useState(false);
    const [isShowVoid, setIsShowVoid] = useState(false);
    const [jmlTambahanMenit, setJmlTambahanMenit] = useState(false);

    const [countdownTime, setCountdownTime] = useState(0); // 3600 seconds = 1 hour
    const [timeLeft, setTimeLeft] = useState(countdownTime);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);
    const [isDisabled, setIsDisabled] = useState(false);
    

    ///HOOKs
    const { mutateAsync: mutateUpdateStatusCheckinToPlayMatrixBay } =
        useUpdateStatusCheckinToPlayMatrixBay();
    const { mutateAsync: mutateUpdateStatusPlayToFinishMatrixBay } =
        useUpdateStatusPlayToFinishMatrixBay();
    const { mutateAsync: mutateUpdateTimeRegistrasiDrivingData } =
        useUpdateTimeRegistrasiDrivingData();
    const { mutateAsync: mutateUpdateStatusBayData } = useUpdateStatusBayData();
    const { mutateAsync: mutateUpdateSebagianBayData } =
    useUpdateSebagianBayData();

    const { data: dataPackageDrivingFree } = usePackageDrivingFreeData(true);

    useEffect(() => {
        /// tambah jam
        setCountdownTime(countdownTime + props.jmlJam); // Add 1 hour (3600 seconds)
        setTimeLeft(timeLeft + props.jmlJam); // Update time left
        updateJumlahJamBay(props.regisId);
    }, [props.jmlJam, props.status, props.regisId]);

    useEffect(() => {
        if (props.statusPindahBay === "1") {
            copyValue();
        }
    }, [props.statusPindahBay])

    const items = [
    
        // {
        //     label: "Free 5 minute",
        //     key: 5,
        // },
        // {
        //     label: "Free 10 minute",
        //     key: 10,
        // },
        // {
        //     label: "Free 15 minute",
        //     key: 15,
        // },
        // {
        //     label: "Free 20 minute",
        //     key: 20,
        // },
        {
            label: "Free 30 minute",
            key: 30,
        },
        {
            label: "Free 1 Hour",
            key: 30,
        },
    ];


    const playSound = () => {
        new Audio(beepSound).play();
    };

    const updateTimeRegistrasiDrivingOrder = async () => {
        let x = {
            time_start: null, //dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
            time_end: null, //dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"), //dayjs(dataWaktuServer?.waktuserver).add(qtyDriving, "hour").format("HH:mm:ss"),
        };
        await mutateUpdateTimeRegistrasiDrivingData([props.regisId, x]);
    };

    const updateJumlahJamBay = async (regisId) => {
        console.log("jml jam dikosongkan kembali");
        let data = {
            jml_jam: "0",
        };
        await axios
            .put(baseUrl + `/bay/edit-tambahjam/${regisId}`, data)
            .then((res) => {
                console.log("success update jumlah jam");
            })
            .catch((err) => console.log(err));
    };

    const startCountdown = async () => {
        ///isi kembali cell dengan status play
        let data = {
            isiCell: props.customer + ",play," + props.regisId,
            registrasi_id: props.regisId,
        };

        await mutateUpdateStatusCheckinToPlayMatrixBay(["bay" + props.id, data]);
        ///END isi kembali cell dengan status play

        ///ubah status did transaksi driving ke 1, artinya sudah diproses
        await updateTimeRegistrasiDrivingOrder();


        ///tambahkan 10 menit pertama
        setCountdownTime(countdownTime + 600);
        setTimeLeft(timeLeft + 600);
        //END tambahkan 10 menit pertama 

        ///update jumlah jam di tbl_bay
        updateJumlahJamBay(props.regisId);


        setIsRunning(true);
        timerRef.current = setInterval(() => {

            setTimeLeft((prevTimeLeft) => {
                if (prevTimeLeft > 0) {

                    // //update countdown didatabase bay
                    // updateCountDownBayDiDatabase(prevTimeLeft);
                    // //end update countdown didatabase bay

                    props.onChange(prevTimeLeft); //kirim ke parent untuk diambil nilainya dari masing2 perulangan
                    return prevTimeLeft - 1;
                } else {
                    playSound();
                    stopCountdown();
                    props.onChange(0);

                    // Do something when countdown reaches zero
                    return 0;
                }
            });
        }, 1000); // Update every second
    };

    const startSyncTimerDariBaySebelumnya = async () => {
        ///isi kembali cell dengan status play
        let data = {
            isiCell: props.customer + ",play," + props.regisId,
            registrasi_id: props.regisId,
        };

        await mutateUpdateStatusCheckinToPlayMatrixBay(["bay" + props.id, data]);
        ///END isi kembali cell dengan status play

        ///ubah status did transaksi driving ke 1, artinya sudah diproses
        await updateTimeRegistrasiDrivingOrder();

        ///update jumlah jam di tbl_bay
        updateJumlahJamBay(props.regisId);

        setIsRunning(true);
        timerRef.current = setInterval(() => {

            setTimeLeft((prevTimeLeft) => {
                if (prevTimeLeft > 0) {

                    // //update countdown didatabase bay
                    // updateCountDownBayDiDatabase(prevTimeLeft);
                    // //end update countdown didatabase bay

                    props.onChange(prevTimeLeft); //kirim ke parent untuk diambil nilainya dari masing2 perulangan
                    return prevTimeLeft - 1;
                } else {
                    playSound();
                    stopCountdown();
                    props.onChange(0);

                    // Do something when countdown reaches zero
                    return 0;
                }
            });
        }, 1000); // Update every second
    };

    const pauseCountdown = () => {
        clearInterval(timerRef.current);
        setIsRunning(false);
    };

    // const resumeCountdown = () => {
    //     startCountdown();
    // };

    const stopCountdown = async () => {
        clearInterval(timerRef.current);
        setIsRunning(false);
        // setTimeLeft(countdownTime);
        setTimeLeft(0);

        ///update jumlah jam di tbl_bay
        updateJumlahJamBay(props.regisId);

        ///ubah status
        await mutateUpdateStatusBayData(props.regisId);

        ///isi kembali cell dengan status end
        let data = {
            isiCell: props.customer + ",end," + props.regisId,
            registrasi_id: props.regisId,
        };
        await mutateUpdateStatusPlayToFinishMatrixBay(["bay" + props.id, data]);
    };

    // const addOneHour = () => {
    //     setCountdownTime(countdownTime + (props.jmlJam)); // Add 1 hour (3600 seconds)
    //     setTimeLeft(timeLeft + (props.jmlJam)); // Update time left
    // };

    const addOneMinute = () => {
        setCountdownTime(countdownTime + jmlTambahanMenit * 60); // Add 1 minutes (36000 seconds)
        setTimeLeft(timeLeft + jmlTambahanMenit * 60); // Update time left
        setIsShowVoid(false);
    };

    const onClick = ({ key }) => {
        // console.log(key);
        setJmlTambahanMenit(key);
        setisShowConfirmasi(true);
    };

    const tampilkanVoid = () => {
        setIsShowVoid(true);
        setisShowConfirmasi(false);
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsLeft = seconds % 60;

        // return `${hours}:${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
        return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""
            }${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
    };

    const updateSebagianBayStatusPindahBay = async (registrasiNumber, nomorBay, jmlJam) => {
        ///kembalikan statusnya ke null
        let x = {
            status: "1",
            registrasi_id: registrasiNumber,
            jml_jam: jmlJam,
            status_pindah_bay:null,            
            // time_start: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
            // time_end: dayjs(dataWaktuServer?.waktuserver)
            //     .add(jmlJam, "hour")
            //     .format("HH:mm:ss"),
            // time_current: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
        };
        await mutateUpdateSebagianBayData([nomorBay, x]);
        // openNotificationDrivingOrder("topRight");
    };

    const copyValue = async () => {
        ///stop dulu countdownnya
        clearInterval(timerRef.current);
        setIsRunning(false);
        setCountdownTime(0);
        setTimeLeft(0);

        ///get bay awal dari tbl_bay_awal
        await axios
            .get(baseUrl + `/bayawal`)
            .then((res) => {
                let bayAwal = res.data.data[0].bay_awal;
                let waktuSebelumnya = props.valueBayLain[bayAwal];
                // alert(waktuSebelumnya);
                // console.log({bayAwal:bayAwal});
                // console.log(props.valueBayLain[bayAwal]);
                console.log({ bayAwal: bayAwal, timer: formatTime(waktuSebelumnya) });

                setCountdownTime(props.valueBayLain[bayAwal]); // [bayAwal] menandakan nomor bay
                setTimeLeft(props.valueBayLain[bayAwal]); // [bayAwal] menandakan nomor bay
                startSyncTimerDariBaySebelumnya();

                ///kembalikan statusnya ke null
                updateSebagianBayStatusPindahBay(props.regisId, props.id, 0);
            })
            .catch((err) => console.log(err));
    };

    const onClickMinus=()=>{
        setCountdownTime(countdownTime - 3600);
        setTimeLeft(timeLeft - 3600);
    }

    return (
        <div>
            <div className="mb-3600 text-2xl text-center">{formatTime(timeLeft)}</div>
            {!isRunning ? (
                // <Button onClick={startCountdown}>Start/Resume</Button>
                <Button
                    disabled={props.status === "1" ? isDisabled : true}
                    // type="primary"
                    // size="small"
                    // style={{ fontSize: "12px" }}
                    // shape="circle"
                    icon={<PlayCircleOutlined />}
                    onClick={startCountdown}
                    style={
                        props.status === "1"
                            ? { backgroundColor: "#118B19", color: "#ffffff" }
                            : { backgroundColor: "#C4C7C4", color: "#ffffff" }
                    }
                />
            ) : (
                <>
                    <Popconfirm
                        title="Stop Timer"
                        description="You sure pause timer?"
                        onConfirm={pauseCountdown}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            size="small"
                            style={{
                                backgroundColor: "#F79220",
                                fontSize: "12px",
                                marginRight: "5px",
                            }}
                        >
                            Pause
                        </Button>
                    </Popconfirm>

                    <Popconfirm
                        title="Stop Timer"
                        description="You sure stop timer?"
                        onConfirm={stopCountdown}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            size="small"
                            style={{
                                backgroundColor: "#850C0C",
                                fontSize: "12px",
                                marginRight: "5px",
                            }}
                        >
                            Stop
                        </Button>
                    </Popconfirm>
                    {/* <Button onClick={pauseCountdown}>Pause</Button>
                    <Button onClick={stopCountdown}>Stop</Button> */}
                </>
            )}
            {/* {!isRunning && timeLeft !== countdownTime && (
                <Button onClick={resumeCountdown}>Resume</Button>
            )} */}

            {/* <Button onClick={addOneHour}>+ One Hour</Button> */}
            <div className="mt-3 flex justify-between items-center">
                <div>
                    <Button size="small" onClick={copyValue}>
                        Sync timer
                    </Button>
                </div>
                
                <div>
                <Button size="small" style={{marginRight:"5px"}} onClick={onClickMinus}>-1 hour</Button>
                    <Dropdown
                        menu={{
                            items,
                            onClick,
                        }}
                        trigger={["click"]}
                    >
                        <Button size="small">+</Button>
                    </Dropdown>
                </div>
            </div>

            {/* SHOW Modal Confirmasi */}
            <Modal
                title={
                    <span>
                        <ExclamationCircleOutlined /> Confirm
                    </span>
                }
                open={isShowConfirmasi}
                onOk={tampilkanVoid}
                onCancel={() => setisShowConfirmasi(false)}
                okText="Yes"
                cancelText="No"
            >
                Adds {jmlTambahanMenit} minutes to the countdown ?
            </Modal>
            {/* END SHOW Modal Confirmasi */}

            {/* SHOW Modal Void */}
            <Modal
                title="Void"
                open={isShowVoid}
                onOk={addOneMinute}
                onCancel={() => setIsShowVoid(false)}
            >
                <div className="mb-3">
                    <Input placeholder="username" />
                </div>
                <div>
                    <Input.Password placeholder="password" />
                </div>
            </Modal>
            {/* END SHOW Modal Void */}
        </div>
    );
};

export default CountdownStart;
