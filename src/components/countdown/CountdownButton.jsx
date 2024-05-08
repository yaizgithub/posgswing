import { Button, Popconfirm, Space } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseUrl } from "../../config";
import moment from "moment";
import { useUpdateStatusCheckinToPlayMatrixBay, useUpdateStatusPlayToFinishMatrixBay } from "../../hooks/useMatrixbayData";
import { useWaktuServerData } from "../../hooks/useWaktuServer";
import { dayjs } from "dayjs";
import { useUpdateTimeRegistrasiDrivingData } from "../../hooks/registrasi/useRegistrasiDrivingData";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useUpdateStatusBayData } from "../../hooks/useBayData";
import beepSound from "../../assets/metallic_beeps.mp3";

const CountdownButton = (props) => {
    const [timer, setTimer] = useState("00:00:00");
    const [jam, setjam] = useState(0);
    const [angkaSatu, setAngkaSatu] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);

    ///HOOKs
    const { data: dataWaktuServer } = useWaktuServerData(true);
    const { mutateAsync: mutateUpdateStatusCheckinToPlayMatrixBay } =
        useUpdateStatusCheckinToPlayMatrixBay();
    const { mutateAsync: mutateUpdateStatusPlayToFinishMatrixBay } =
        useUpdateStatusPlayToFinishMatrixBay();
    const { mutateAsync: mutateUpdateTimeRegistrasiDrivingData } =
        useUpdateTimeRegistrasiDrivingData();
    const { mutateAsync: mutateUpdateStatusBayData } = useUpdateStatusBayData();
    

    const Ref = useRef();

    useEffect(() => {
        console.log("---cc---");
        console.log(props.jmlJam);
        console.log("---cc---");
        setjam(props.jmlJam * 3600);
    }, [props.jmlJam, props.status]);

    useEffect(() => {
        if (jam > 0 && timer === "00:00:01") {
            console.log("ulangi");
            onClickReset();
        }
    }, [jam, timer, angkaSatu]);

    const editDuration = async (duration) => {
        //save to database
        let data = {
            duration: duration,
        };
        await axios.put(baseUrl + `/bay/edit-duration/${props.id}`, data);
    };

    const getTimeRemaining = (e) => {
        let total = Date.parse(e) - Date.parse(new Date());
        let hour = Math.floor((total / (1000 * 60 * 60)) % 24);
        let seconds = Math.floor((total / 1000) % 60);
        let minute = Math.floor((total / 1000 / 60) % 60);

        return { total, hour, minute, seconds };
    };

    const startTimer = async (e) => {
        let { total, hour, minute, seconds } = getTimeRemaining(e);
        if (total >= 0) {
            let duration =
                (hour > 9 ? hour : "0" + hour) +
                ":" +
                (minute > 9 ? minute : "0" + minute) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds);
            setTimer(duration);

            // //save to database
            // await editDuration(duration);
            
        } else {            
            onClickStop();
            console.log("stop");
           
        }
    };

    const clearTime = (e) => {
        setTimer("00:00:00");

        if (Ref.current) clearInterval(Ref.current);

        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };

    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + jam);
        return deadline;
    };

    const onClickReset = async () => {
        clearTime(getDeadTime());

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

        setjam(0);

        ///disabled button play
        setIsDisabled(true);
    };

    const updateTimeRegistrasiDrivingOrder = async () => {
        let x = {
            time_start: null, //dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
            time_end: null, //dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"), //dayjs(dataWaktuServer?.waktuserver).add(qtyDriving, "hour").format("HH:mm:ss"),
        };
        await mutateUpdateTimeRegistrasiDrivingData([props.regisId, x]);
    };

    const onClickStop = async () => {
        playSound();
        setTimer("00:00:00");
        await editDuration("00:00:00");

        ///ubah status
        await mutateUpdateStatusBayData(props.regisId);

        if (Ref.current) clearInterval(Ref.current);
        setjam(0);
        setIsDisabled(false);

        ///isi kembali cell dengan status end
        let data = {
            isiCell: props.customer + ",end," + props.regisId,
            registrasi_id: props.regisId,
        };

        await mutateUpdateStatusPlayToFinishMatrixBay(["bay" + props.id, data]);
        ///END isi kembali cell dengan status end
    };

    const playSound = () => {
        new Audio(beepSound).play();
    };

    const onClickAdd = () => {
        setjam((a) => a + 1);
    };

    const updateJumlahJamBay= async(regisId)=>{
        let data= {
            jml_jam : "0"
        }
        await axios.put(baseUrl+`/bay/edit-tambahjam/${regisId}`, data)
        .then((res)=>{
            console.log("successupdate jumlah jam");
        }).catch((err)=>console.log(err));
    }

    return (
        <div>
            <div className="mb-3 text-2xl text-center">{timer}</div>
            <div className="flex flex-wrap justify-between items-center">
                <div>
                    <Space>
                        <Button
                            disabled={props.status === "1" ? isDisabled : true}
                            type="primary"
                            // size="small"
                            // style={{ fontSize: "12px" }}
                            // shape="circle"
                            icon={<PlayCircleOutlined />}
                            onClick={onClickReset}
                        />

                        <Popconfirm
                            title="Stop Timer"
                            description="You sure stop bay?"
                            onConfirm={onClickStop}
                            // onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="primary"
                                size="small"
                                style={{ backgroundColor: "#F79220", fontSize: "12px" }}
                            >
                                Stop
                            </Button>
                        </Popconfirm>

                        {/* <Button
                                type="primary"
                                size="small"
                                style={{ fontSize: "12px" }}
                                onClick={onClickAdd}
                            >
                                Add
                        </Button> */}
                    </Space>
                </div>
                <div>
                    {/* <Button onClick={onCLickAdd}>Extra time</Button> */}
                    <span className="ml-3">{jam / 3600} hour</span>
                </div>
            </div>
        </div>
    );
};

export default CountdownButton;
