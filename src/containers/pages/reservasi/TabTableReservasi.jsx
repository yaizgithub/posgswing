import React, { useState } from "react";
import { Button, Card, Modal, Space, Tabs } from "antd";
import TableReservasiDriving from "../../../components/reservasidrivingorder/TableReservasiDriving";
import TableReservasiResto from "../../../components/reservasirestoorder/TableReservasiResto";
import AddFormDrivingOrder from "../../../components/reservasidrivingorder/AddFormDrivingOrder";
import AddFormRestoOrder from "../../../components/reservasirestoorder/AddFormRestoOrder";

const TabTableReservasi = () => {
    const [isShowModalDriving, setIsShowModalDriving] = useState(false);
    const [isShowModalRestoOrder, setIsShowModalRestoOrder] = useState(false);
    const [acttiveTab, setActtiveTab] = useState();

    const items = [
        {
            key: "1",
            label: "Driving Order",
            children: <TableReservasiDriving />,
        },
        {
            key: "2",
            label: "Resto Order",
            children: <TableReservasiResto />,
        },
    ];

    const onChangeTab=(e)=>{
        setActtiveTab(e)
    }

    return (
        <div>
            <Space>
                <Button
                    // disabled={isDisabled}
                    onClick={() => {setIsShowModalDriving(true);setActtiveTab("1");}}
                >
                    Driving Order
                </Button>
                <Button
                    // disabled={isDisabled}
                    onClick={() => {setIsShowModalRestoOrder(true);setActtiveTab("2");}}
                >
                    Resto Order
                </Button>
            </Space>

            <Tabs defaultActiveKey="1" items={items} activeKey={acttiveTab} onChange={onChangeTab}/>

            {/* Modal Reservasi Driving Order */}
            <Modal
                open={isShowModalDriving}
                onCancel={() => setIsShowModalDriving(false)}
                footer={false}
            >
                <Card title="Reservasi - Driving Order Entry" size="small">
                    <AddFormDrivingOrder
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
                <Card title="Reservasi - Resto Order Entry" size="small">
                    <AddFormRestoOrder
                        closeModal={() => setIsShowModalRestoOrder(false)}
                    />
                </Card>
            </Modal>
        </div>
    );
};

export default TabTableReservasi;
