import React, { useState } from "react";
import ViewRegistrasi from "../../../components/registrasi/ViewRegistrasi";
import TableSelectedDetailsDrivingOrder from "../../../components/billing/TableSelectedDetailsDrivingOrder";
import TableSelectedDetailsRestoOrder from "../../../components/billing/TableSelectedDetailsRestoOrder";
import { Button, Card, Divider, Space, message } from "antd";
import { useSelector } from "react-redux";
import { useUpdatePayerRegistrasiData } from "../../../hooks/registrasi/useRegistrasiData";
import { useUpdatePayerRegistrasiTransaksiDrivingData } from "../../../hooks/registrasi/useRegistrasiDrivingData";
import { useUpdatePayerRegistrasiTransaksiRestoData } from "../../../hooks/registrasi/useRegistrasiRestoData";
import axios from "axios";
import { baseUrl } from "../../../config";
import { usePostPaymentData } from "../../../hooks/usePaymentData";

const PageMergeBill = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { userid } = useSelector((state) => state.auth);
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);
    const { numberIdentifikasi } = useSelector((state) => state.mydataselected);

    const [selectedDrivingData, setSelectedDrivingData] = useState([]);
    const [selectedRestoData, setSelectedRestoData] = useState([]);
    const [playerName, setPlayerName] = useState([]);
    const [totalDriving, setTotalDriving] = useState(0);
    const [totalResto, setTotalResto] = useState(0);

    ///HOOKs
    const { mutateAsync: mutateUpdatePayerRegistrasi } =
        useUpdatePayerRegistrasiData();
    const { mutateAsync: mutateUpdatePayerRegistrasiTransaksiDriving } =
        useUpdatePayerRegistrasiTransaksiDrivingData();
    const { mutateAsync: mutateUpdatePayerRegistrasiTransaksiResto } =
        useUpdatePayerRegistrasiTransaksiRestoData();
        const { mutateAsync: mutatePostPaymentData } = usePostPaymentData();

        const successMessage = (type, message) => {
            messageApi.open({
                type: type,
                content: message,
            });
        };

    const updatePayerRegistrasi = async () => {
        ///update  payer registrasi di tbl_registrasi
        ///maksudnya si numberIdentifikasi di bayarin sama matrixSelected.registrasi_id
        console.log({
            payer: matrixSelected.registrasi_id,
            regisid: numberIdentifikasi,
        });
        let dataReg = {
            payer: matrixSelected.registrasi_id,
            updator: userid,
        };
        await mutateUpdatePayerRegistrasi([numberIdentifikasi, dataReg]);
    };

    const updatePayerRegistrasiDriving = async () => {
        ///update asal registrasi ditbl_trasnaksi_driving
        ///maksudnya agar transaksi yg dibayarkan ketahuan siapa yg dibayarkan, karna
        ///registrasi_id di ubah ke registrasi_id si payer
        selectedDrivingData.forEach(async (item) => {
            let dataDrv = {
                payer: matrixSelected.registrasi_id,
                updator: userid,
            };
            await mutateUpdatePayerRegistrasiTransaksiDriving([
                numberIdentifikasi,
                item,
                dataDrv,
            ]);
        });
    };

    const updatePayerRegistrasiResto = async () => {
        ///update asal registrasi ditbl_trasnaksi_driving
        ///maksudnya agar transaksi yg dibayarkan ketahuan siapa yg dibayarkan, karna
        ///registrasi_id di ubah ke registrasi_id si payer
        selectedRestoData.forEach(async (item) => {
            let dataResto = {
                payer: matrixSelected.registrasi_id,
                updator: userid,
            };
            await mutateUpdatePayerRegistrasiTransaksiResto([
                numberIdentifikasi,
                item,
                dataResto,
            ]);
        });
    };

    const simpanPaymentChargeFolio = async () => {
        //buat nomor urut
        let totalTransaksi = totalDriving + totalResto;
        await axios
            .get(
                baseUrl +
                `/payment/generate?registrasi_id=${numberIdentifikasi}`
            )
            .then(async (res) => {
                let numberUrutPayment = res.data.data;
                console.log(numberUrutPayment);

                ///simpan payment
                let x = {
                    id: numberUrutPayment,
                    registrasi_id: numberIdentifikasi,
                    payment_id: 'CF', //di payment master CF adalah id charge folio
                    nilai_bayar: totalTransaksi,
                    kembalian: 0,
                    remark: `payer oleh ${matrixSelected.registrasi_id}`,
                    user_id: userid,
                    updated: userid,
                };
                await mutatePostPaymentData(x);
            })
            .catch((err) => console.log(err));
    };

    const handleClickMerge = async () => {
        // console.log('---x---');
        // // console.log({ driving: selectedDrivingData });
        // console.log({ resto: selectedRestoData });
        // console.log('---x---');

        await updatePayerRegistrasi();
        await updatePayerRegistrasiDriving();
        await updatePayerRegistrasiResto();

        //yang terpilih jadikan pembayaran di tbl_payment menjadi charge folio
        await simpanPaymentChargeFolio();
        successMessage('success', 'Join bill success');
    };

    const getPlayerName = (nama) => {
        setPlayerName(nama);
    };

    const getSelectedRowDrivingOrder = (data) => {
        setSelectedDrivingData(data);
    };

    const getSelectedRowRestoOrder = (data) => {
        setSelectedRestoData(data);
    };

    const getSelectedTotalDrivingOrder = (data) => {
        let sumTotal = 0;
        data.forEach((e) => {
            sumTotal = sumTotal + e.total;
        });
        setTotalDriving(sumTotal);
    };

    const getSelectedTotalRestoOrder = (data) => {
        let sumTotal = 0;
        data.forEach((e) => {
            sumTotal = sumTotal + e.total;
        });
        setTotalResto(sumTotal);
    };

    return (
        <div>
            {contextHolder}
            {/* list registrasi */}
            <ViewRegistrasi namaCustomer={getPlayerName} />

            <Card
                title={`${playerName} Transaction`}
                size="small"
                styles={{ header: { backgroundColor: "#7CACF8" } }}
            >
                <div className="mb-3">
                    {/* list transaksi driving */}
                    <TableSelectedDetailsDrivingOrder
                        selectedRowDrivingOrder={getSelectedRowDrivingOrder}
                        selectedRowTotalDrivingOrder={getSelectedTotalDrivingOrder}
                    />
                </div>
                <div>
                    {/* list transaksi order */}
                    <TableSelectedDetailsRestoOrder
                        selectedRowRestoOrder={getSelectedRowRestoOrder}
                        selectedRowTotalRestoOrder={getSelectedTotalRestoOrder}
                    />
                </div>
            </Card>

            <Divider />

            <div className="text-right">
                <Space>
                    <Button onClick={() => props.closeModal()}>Cancel</Button>
                    <Button onClick={handleClickMerge}>Join</Button>
                </Space>
            </div>
        </div>
    );
};

export default PageMergeBill;
