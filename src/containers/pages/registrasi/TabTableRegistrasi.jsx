import React, { useState } from "react";
import {
    Button,
    Card,
    Modal,
    Popconfirm,
    Space,
    Tabs,
    notification,
} from "antd";
import TableRegistrasiDriving from "../../../components/registrasidrivingorder/TableRegistrasiDriving";
import TableRegistrasiResto from "../../../components/registrasirestoorder/TableRegistrasiResto";
import AddRegisFormDrivingOrder from "../../../components/registrasidrivingorder/AddRegisFormDrivingOrder";
import AddRegisFormRestoOrder from "../../../components/registrasirestoorder/AddRegisFormRestoOrder";
import { useUpdateStatusWhereNullRegistrasiRestoData } from "../../../hooks/registrasi/useRegistrasiRestoData";
import { useSelector } from "react-redux";
import { BorderTopOutlined } from "@ant-design/icons";
import { useUpdateSebagianBayData } from "../../../hooks/useBayData";
import dayjs from "dayjs";
import { useWaktuServerData } from "../../../hooks/useWaktuServer";
import { useUpdateTimeRegistrasiDrivingData } from "../../../hooks/registrasi/useRegistrasiDrivingData";
import {
    useOneRegistrasiData,
    useRegistrasiData,
} from "../../../hooks/registrasi/useRegistrasiData";

const TabTableRegistrasi = () => {
    const [api, contextHolder] = notification.useNotification();
    const { numberIdentifikasi, nomorBay, qtyDriving } = useSelector(
        (state) => state.mydataselected
    );
    const { userid } = useSelector((state) => state.auth);

    const [isShowModalDriving, setIsShowModalDriving] = useState(false);
    const [isShowModalRestoOrder, setIsShowModalRestoOrder] = useState(false);
    const [acttiveTab, setActtiveTab] = useState();

    ///HOOKs
    const { data: dataWaktuServer } = useWaktuServerData(true);
    const { data: dataOneRegistrasi } = useOneRegistrasiData(
        numberIdentifikasi,
        true
    );
    const { mutateAsync: mutateUpdateStatusWhereNullRegistrasiRestoData } =
        useUpdateStatusWhereNullRegistrasiRestoData();
    const { mutateAsync: mutateUpdateSebagianBayData } =
        useUpdateSebagianBayData();
    const { mutateAsync: mutateUpdateTimeRegistrasiDrivingData } =
        useUpdateTimeRegistrasiDrivingData();

    const openNotification = (placement) => {
        api.success({
            message: `F & B Success `,
            description: "Pesanan diteruskan ke Kitchen",
            placement,
        });
    };

    const openNotificationDrivingOrder = (placement) => {
        api.success({
            message: `Driving Success `,
            description: "Waktu main sudah dimulai",
            placement,
        });
    };

    const openNotificationWarningDrivingOrder = (placement) => {
        api.warning({
            message: `Warning`,
            description:
                "Maaf, anda belum memilih bay, pilih bay lalu tekan tombol update",
            placement,
        });
    };

    const items = [
        {
            key: "1",
            label: "Driving Order",
            children: <TableRegistrasiDriving />,
        },
        {
            key: "2",
            label: "Resto Order",
            children: <TableRegistrasiResto />,
        },
    ];

    const onChangeTab = (e) => {
        setActtiveTab(e);
    };

    const updateBay = async () => {
        // console.log({Bay:nomorBay, regisId:numberIdentifikasi});
        //    let timeStart= dayjs(dataWaktuServer?.waktuserver);
        //    let timeEnd = dayjs(dataWaktuServer?.waktuserver).add(qtyDriving, "hour").format("HH:mm:ss")
        // let currentTime = dayjs(dataWaktuServer?.waktuserver).add(2, "minute").format("HH:mm:ss");
        let x = {
            status: "1",
            registrasi_id: numberIdentifikasi,
            time_start: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
            time_end: dayjs(dataWaktuServer?.waktuserver)
                .add(qtyDriving, "hour")
                .format("HH:mm:ss"),
            time_current: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
        };
        await mutateUpdateSebagianBayData([nomorBay, x]);
        openNotificationDrivingOrder("topRight");
    };

    const updateTimeRegistrasiDrivingOrder = async () => {
        let x = {
            time_start: dayjs(dataWaktuServer?.waktuserver).format("HH:mm:ss"),
            time_end: dayjs(dataWaktuServer?.waktuserver)
                .add(qtyDriving, "hour")
                .format("HH:mm:ss"),
        };
        await mutateUpdateTimeRegistrasiDrivingData([numberIdentifikasi, x]);
    };

    // const onClickProses = async () => {
    //     let data = {
    //         status_order: "0",
    //         updator: userid,
    //     };
    //     await mutateUpdateStatusWhereNullRegistrasiRestoData([
    //         numberIdentifikasi,
    //         data,
    //     ]);
    //     openNotification("topRight");

    //     ///update bay time
    //     await updateBay();

    //     ///update registari driving order time
    //     await updateTimeRegistrasiDrivingOrder();
    // };

    return (
        <div>
            {contextHolder}
            <div className="flex flex-wrap justify-between">
                <div>
                    <Space>
                        <Button
                            // disabled={isDisabled}
                            onClick={() => {                                
                                if (!dataOneRegistrasi?.data[0]?.bay) {
                                    openNotificationWarningDrivingOrder("bottomRight");
                                    // console.log("nomor bay tidak ada");
                                } else {
                                    setIsShowModalDriving(true);
                                    setActtiveTab("1");
                                }
                            }}
                        >
                            Add Driving Order
                        </Button>
                        <Button
                            // disabled={isDisabled}
                            onClick={() => {
                                ///cek nomor bay, jika nomor bay diisi lanjutkan utk mengorder driving
                                setIsShowModalRestoOrder(true);
                                setActtiveTab("2");
                            }}
                        >
                            Add F & B Order
                        </Button>
                    </Space>
                </div>
                <div>
                    {/* <Popconfirm
                        title="Proses Data"
                        description={`Yakin data akan diproses?`}
                        onConfirm={onClickProses}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<BorderTopOutlined />}>
                        Proses now
                    </Button>
                    </Popconfirm>                     */}
                </div>
            </div>

            <Tabs
                defaultActiveKey="1"
                items={items}
                activeKey={acttiveTab}
                onChange={onChangeTab}
            />

            {/* Modal Reservasi Driving Order */}
            <Modal
                open={isShowModalDriving}
                onCancel={() => setIsShowModalDriving(false)}
                footer={false}                
            >
                <Card title="Driving Order Entry" size="small" >
                    <AddRegisFormDrivingOrder
                        closeModal={() => setIsShowModalDriving(false)}
                    />
                </Card>
            </Modal>

            {/* Modal Reservasi Resto Order */}
            <Modal
                open={isShowModalRestoOrder}
                onCancel={() => setIsShowModalRestoOrder(false)}
                footer={false}
            >
                <Card title="Resto Order Entry" size="small">
                    <AddRegisFormRestoOrder
                        closeModal={() => setIsShowModalRestoOrder(false)}
                    />
                </Card>
            </Modal>
        </div>
    );
};

export default TabTableRegistrasi;
