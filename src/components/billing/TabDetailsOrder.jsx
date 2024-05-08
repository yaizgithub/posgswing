import { Tabs } from "antd";
import React from "react";
import TableDetailsDrivingOrder from "./TableDetailsDrivingOrder";
import TableDetailsRestoOrder from "./TableDetailsRestoOrder";
import TabCharged from "../charged/TabCharged";
import TablePayer from "../payer/TablePayer";
import { useRegistrasiPayerNotNullData } from "../../hooks/registrasi/useRegistrasiData";
import { useSelector } from "react-redux";
import { useChargedByPayerData } from "../../hooks/useCharged";


const TabDetailsOrder = () => {
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);

    ///HOOKs
    const { data: dataCharged } = useChargedByPayerData(
        matrixSelected.registrasi_id,
        true
    );
    const { data: dataPayer } = useRegistrasiPayerNotNullData(
        matrixSelected.registrasi_id,
        true
    );

    const items = [
        {
            key: "1",
            label: "Driving Order",
            children: <TableDetailsDrivingOrder />,
        },
        {
            key: "2",
            label: "F & B Order",
            children: <TableDetailsRestoOrder />,
        },
        {
            key: "3",
            label: "Charged",
            children: <TabCharged />,
            disabled: dataCharged?.data === undefined ? true : false

        },
        {
            key: "4",
            label: "Payer",
            children: <TablePayer />,
            disabled: dataPayer?.data === undefined ? true : false

        },
    ];
    return (
        <div>
            <Tabs
                defaultActiveKey="1"
                items={items}
            // activeKey={acttiveTab}
            // onChange={onChangeTab}
            />
        </div>
    );
};

export default TabDetailsOrder;
