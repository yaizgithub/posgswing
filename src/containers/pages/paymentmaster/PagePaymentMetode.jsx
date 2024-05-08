import React, { useEffect, useState } from "react";
import PagePaymentMaster from "./PagePaymentMaster";
import { Button, Divider, Flex, Skeleton, Space, message } from "antd";
import PageMetodePaymentByKategori from "./PageMetodePaymentByKategori";
import TablePayment from "../../../components/payment/TablePayment";
import { useTotalPaymentData } from "../../../hooks/usePaymentData";
import { useSelector } from "react-redux";
import { useUpdateStatusFinishToPaidMatrixBay } from "../../../hooks/useMatrixbayData";
import {
    useUpdateStatusRegistrasiByIdData,
    useUpdateStatusRegistrasiByMejaData,
} from "../../../hooks/registrasi/useRegistrasiData";
import { useUpdateStatusMejaData } from "../../../hooks/useMejaData";

const PagePaymentMetode = (props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);

    const [categori, setCategori] = useState("");
    const [grandTot, setGrandTot] = useState(0);
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
    } = useTotalPaymentData([
        matrixSelected.registrasi_id,
        matrixSelected.registrasi_id,
        matrixSelected.registrasi_id,
        true,
    ]);

    const { mutateAsync: mutateUpdateStatusFinishToPaidMatrixBay } =
        useUpdateStatusFinishToPaidMatrixBay();
    const { mutateAsync: mutateUpdateStatusRegistrasiById } =
        useUpdateStatusRegistrasiByIdData();
    const { mutateAsync: mutateUpdateStatusRegistrasiByMeja } =
        useUpdateStatusRegistrasiByMejaData();
    const { mutateAsync: mutateUpdateStatusMeja } = useUpdateStatusMejaData();

    useEffect(() => {
        if (dataTotalPayment?.data !== undefined) {
            let grandtot = dataTotalPayment?.data[0].grandTotal;
            let nbayar = dataTotalPayment?.data[0].nilaiBayar;
            let kembalian = dataTotalPayment?.data[0].kembalian;
            let sisabyr = dataTotalPayment?.data[0].sisaBayar;
            let selisih = dataTotalPayment?.data[0].selisih;

            setGrandTot(grandtot);
            setNilaiByr(nbayar);
            setKembalian(kembalian);
            setSisaBayar(sisabyr);
            setSelisih(selisih);
        }
    }, [dataTotalPayment]);

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

    const successMessage = (type, message) => {
        messageApi.open({
            type: type,
            content: message,
        });
    };

    const getKategori = (v) => {
        setCategori(v);
    };

    const onClickPost = async () => {
        ///isi kembali cell dengan status paid
        let data = {
            isiCell:
                matrixSelected.namaCustomer + ",paid," + matrixSelected.registrasi_id,
            registrasi_id: matrixSelected.registrasi_id,
        };
        await mutateUpdateStatusFinishToPaidMatrixBay([
            matrixSelected.namaBay,
            data,
        ]);

        if (matrixSelected.no_meja) {
            ///update status registrasi by no meja
            let dt = { status: "1" };
            await mutateUpdateStatusRegistrasiByMeja([matrixSelected.no_meja, dt]);

            ///ubah status meja di tbl_meja
            let a = {
                status: "0",
            };
            await mutateUpdateStatusMeja([matrixSelected.no_meja, a]);
        } else {
            ///update status registrasi by id
            let x = { status: "1" };
            await mutateUpdateStatusRegistrasiById([matrixSelected.registrasi_id, x]);
        }

        successMessage("success", "Posting data success");
        props.closeModal();
    };

    return (
        <div>
            {contextHolder}
            <div className="mt-5">
                <div className="bg-orange-900 px-5 py-3 rounded-md text-white">
                    <Flex justify="space-between">
                        <Flex justify="end" gap={3}>
                            <div className="text-3xl">
                                <span className="text-[14px]">Rp. </span>
                                {grandTot.toLocaleString("id") ?? 0}
                            </div>
                            <div>Total</div>
                        </Flex>
                        <Flex justify="end" gap={3}>
                            <div className="flex flex-col items-end">
                                <div className="text-3xl">
                                    <span className="text-[14px]">Rp. </span>
                                    {nilaiByr.toLocaleString("id") ?? 0}
                                </div>
                                {selisih < 0 ? (
                                    <div className="text-red-700 bg-white rounded-sm px-5 font-semibold">
                                        Rp. {selisih.toLocaleString("id") ?? 0}
                                    </div>
                                ) : null}
                            </div>
                            <div>Payment</div>
                        </Flex>
                        <Flex justify="end" gap={3}>
                            {selisih >= 0 ? (
                                <div className="text-3xl ">
                                    <span className="text-[14px]">Rp. </span>
                                    {selisih.toLocaleString("id") ?? 0}
                                </div>
                            ) : (
                                <div className="text-3xl">
                                    <span className="text-[14px]">Rp. </span>
                                    {0}
                                </div>
                            )}
                            <div>Change</div>
                        </Flex>
                    </Flex>
                </div>

                {/* <Divider style={{margin:"0", padding:"0"}}/> */}

                <div className="flex justify-start items-start gap-7 mt-3">
                    <div>
                        <PagePaymentMaster setKategori={getKategori} />
                    </div>
                    <div>
                        <div>
                            <PageMetodePaymentByKategori categori={categori} />
                        </div>
                        <div>
                            <TablePayment />
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
            <div className="text-right">
            <Space>
                <Button onClick={()=>props.closeModal()}>Close</Button>
                <Button type="primary" onClick={onClickPost}>Post</Button>
            </Space>
            </div>
        </div>
    );
};

export default PagePaymentMetode;
