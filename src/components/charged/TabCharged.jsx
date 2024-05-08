import React, { useState } from "react";
import TableDetailsChargedDrivingOrder from "./TableDetailsChargedDrivingOrder";
import TableDetailsChargedRestoOrder from "./TableDetailsChargedRestoOrder";
import TableCharged from "./TableCharged";
import { Card } from "antd";
import { useSelector } from "react-redux";

const TabCharged = () => {
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);
    const [regisId, setRegisId] = useState("");

    const getSelectedRow=(regisid)=>{
        setRegisId(regisid);
        console.log({regisId :regisid, payer : matrixSelected.registrasi_id});
    }

    return (
        <div>
            <div className="mt-3">
                <Card
                    // title="Player"
                    size="small"
                    styles={{ header: { backgroundColor: "#7CACF8" } }}
                    style={{width:'90%'}}
                >
                    <TableCharged rowSelectedRegistrasiId={getSelectedRow}/>
                </Card>
            </div>
            <div className="mt-3">
                <Card
                    // title="Details Transaction Driving"
                    size="small"
                    styles={{ header: { backgroundColor: "#7CACF8" } }}
                    style={{width:'90%'}}
                >
                    <TableDetailsChargedDrivingOrder regisId={regisId} />
                </Card>
            </div>
            <div>
                <Card
                    // title="Details Transaction F&B"
                    size="small"
                    styles={{ header: { backgroundColor: "#7CACF8" } }}
                    style={{width:'90%'}}
                >
                    <TableDetailsChargedRestoOrder regisId={regisId} />
                </Card>
            </div>
        </div>
    );
};

export default TabCharged;
