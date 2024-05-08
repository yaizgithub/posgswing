import React, { useEffect, useState } from "react";
import { Card, Divider } from "antd";
import {
    useBayData,
    useUpdateStatusBayData,
    useUpdateTimeCurrentBayData,
} from "../../../hooks/useBayData";
import CountdownButton from "../../../components/countdown/CountdownButton";
import CountdownContoh from "../../../components/countdown/CountdownContoh";
import CountDownTimer from "../../../components/countdown/CountDownTimer";
import CountdownStart from "../../../components/countdown/CountdownStart";
import { useSelector } from "react-redux";

const PageDisplayDrivingOrder = () => {
    const [counter, setCounter] = useState();
    const [values, setValues] = useState(['', '', '']);

    ///HOOKs
    const { mutate: mutateUpdateTimeCurrentBay } = useUpdateTimeCurrentBayData();
    const { mutate: mutateUpdateStatusBay } = useUpdateStatusBayData();
    const { data } = useBayData([1, 44], true);



    const handleChange = (index, value) => {
        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);
        // console.log("---newvalue---");
        // console.log(newValues);
        // console.log("---newvalue---");
      };

    return (
        <div>
            <div className="flex flex-wrap justify-center items-start gap-7 ">
                {data?.data.map((e, key) => {
                    return (
                        <div key={key}>
                            <Card
                                title={`${e.name}`}
                                size="small"
                                style={{ width: "250px" }}
                                styles={{
                                    header: {
                                        backgroundColor: e.status === "1" ? "#607274" : "#D7DADA",
                                        color: e.status === "1" ? "#FFFFFF" : "#A1A1A1",
                                        fontSize: "16px",
                                    },
                                    body: {
                                        backgroundColor: e.status === "1" ? "#ffffff" : "#E2E1E1",
                                        color: e.status === "1" ? "#4F6F52" : "#CECECC",
                                        fontWeight: "bold",
                                    },
                                }}
                                extra={<div className="text-slate-100">{e.customer}</div>}
                            >
                                
                                {/* <CountdownButton
                                    id={e.id}
                                    regisId={e.registrasi_id}
                                    customer={e.customer}
                                    jmlJam={e.jml_jam}
                                    status={e.status}
                                /> */}
                                <CountdownStart
                                    id={e.id}
                                    regisId={e.registrasi_id}
                                    customer={e.customer}
                                    jmlJam={e.jml_jam}
                                    status={e.status}                                    
                                    onChange={(newValue) => handleChange(key+1, newValue)}
                                    valueBayLain={values}
                                    statusPindahBay={e.status_pindah_bay}
                                />
                            </Card>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PageDisplayDrivingOrder;
