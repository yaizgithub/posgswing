import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useWaktuServerData } from "../../../hooks/useWaktuServer";
import { useOneRegistrasiData } from "../../../hooks/registrasi/useRegistrasiData";
import { Card, Flex, Input, InputNumber, Select, Skeleton, Space } from "antd";
import dayjs from "dayjs";
import { useTotalPaymentData } from "../../../hooks/usePaymentData";

///format currency
const formatter = (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const parser = (value) => value.replace(/\$\s?|(,*)/g, "");
///end format currency

const dataDisc = [
    { disc: 10 },
    { disc: 20 },
    { disc: 30 },
    { disc: 40 },
    { disc: 50 },
];

const PageInfoGrandTotal = () => {
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);

    const [totDriving, setTotDriving] = useState(0);
    const [totResto, setTotResto] = useState(0);
    const [total, setTotal] = useState(0);
    const [totCharged, setTotCharged] = useState(0);
    const [nilaiByr, setNilaiByr] = useState(0);
    const [kembalian, setKembalian] = useState(0);
    const [sisaBayar, setSisaBayar] = useState(0);
    const [selisih, setSelisih] = useState(0);

    ///HOOKs
    const {
        data: dataTotalPayment,
        isLoading,
        isError,
        error,
    } = useTotalPaymentData([matrixSelected.registrasi_id, matrixSelected.registrasi_id, matrixSelected.registrasi_id, true]);

    useEffect(() => {
        if (dataTotalPayment?.data !== undefined) {
            let totdriving = dataTotalPayment?.data[0].totalDriving;
            let totresto = dataTotalPayment?.data[0].totalResto;
            let total = dataTotalPayment?.data[0].total;
            let totCharged = dataTotalPayment?.data[0].totalCharged;
            let nbayar = dataTotalPayment?.data[0].nilaiBayar;
            let selisih = dataTotalPayment?.data[0].selisih;
            let sisabyr = dataTotalPayment?.data[0].sisaBayar;            

            setTotDriving(totdriving);
            setTotResto(totresto);
            setTotal(total);
            setTotCharged(totCharged);
            setNilaiByr(nbayar);
            setKembalian(kembalian);
            setSisaBayar(sisabyr);  
            setSelisih(selisih); 


        }
    }, [dataTotalPayment])
    

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

    return (
        <div>
            <Card
                title="Total"
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
                            <div>My Bill</div>
                            <div>
                                <InputNumber
                                    value={total}
                                    formatter={formatter}
                                    parser={parser}
                                    style={{ width: "120px" }}
                                />
                            </div>
                        </Flex>
                        <Flex justify="space-between">
                            <div>Bill Paid</div>
                            <div>
                                <InputNumber
                                    value={totCharged}
                                    formatter={formatter}
                                    parser={parser}
                                    style={{ width: "120px" }}
                                />
                            </div>
                        </Flex>
                        <Flex justify="space-between">
                            <div>Remain</div>
                            <div>
                                <InputNumber
                                     value={selisih >=0 ? 0 : selisih}
                                    formatter={formatter}
                                    parser={parser}
                                    style={{ width: "120px" }} 
                                    // style={selisih < 0 ? { width: "120px", color:"red" } : { width: "120px" }} 
                                />
                            </div>
                        </Flex>
                        <Flex justify="space-between">
                            <div>Payment</div>
                            <div className="font-bold">
                                <InputNumber
                                    value={nilaiByr}
                                    formatter={formatter}
                                    parser={parser}
                                    style={{ width: "120px" }}
                                />
                            </div>
                        </Flex>
                        <Flex justify="space-between">
                            <div>Change</div>
                            <div>
                                <InputNumber
                                    value={selisih >=0 ? selisih : 0}
                                    formatter={formatter}
                                    parser={parser}
                                    style={{ width: "120px" }}
                                />
                            </div>
                        </Flex>
                        
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PageInfoGrandTotal;
