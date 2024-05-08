import React from "react";
import { usePaymentMasterOrderByCategoriData } from "../../../hooks/usePaymentMasterData";
import { Radio, Skeleton } from "antd";
import {
    usePostPaymentData,
    useTotalPaymentData,
} from "../../../hooks/usePaymentData";
import axios from "axios";
import { baseUrl } from "../../../config";
import { useSelector } from "react-redux";

const PageMetodePaymentByKategori = ({ categori }) => {
    const { userid } = useSelector((state) => state.auth);
    const { matrixSelected } = useSelector((state) => state.mymatrixselected);

    ///HOOKs
    const { data, isLoading, isError, error } =
        usePaymentMasterOrderByCategoriData(categori, true);
    const { mutateAsync: mutatePostPaymentData } = usePostPaymentData();
    const { data: dataTotalPayment } = useTotalPaymentData([
        matrixSelected.registrasi_id,
        matrixSelected.registrasi_id,
        matrixSelected.registrasi_id,
        true,
    ]);

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

    const onChange = async (e) => {
        // console.log('Clicked:', e.target.value);
        // console.log({total:sisaBayar, disc:discKasir});
        let paymentId = e.target.value;

        //buat nomor urut
        await axios
            .get(
                baseUrl +
                `/payment/generate?registrasi_id=${matrixSelected.registrasi_id}`
            )
            .then(async (res) => {
                let numberUrutPayment = res.data.data;
                console.log(numberUrutPayment);



                ///simpan payment
                let x = {
                    id: numberUrutPayment,
                    registrasi_id: matrixSelected.registrasi_id,
                    payment_id: paymentId,
                    nilai_bayar: dataTotalPayment?.data[0].sisaBayar,
                    kembalian: 0,
                    remark: null,
                    user_id: userid,
                    updated: userid,
                };
                await mutatePostPaymentData(x);
            })
            .catch((err) => console.log(err));
    };

    return (
        <div>
            <Radio.Group buttonStyle="solid" onChange={onChange}>
                {data?.data?.map((e, key) => {
                    return (
                        // <div key={key} className="border-none">
                        <Radio.Button
                            key={key}
                            value={e.id}
                            style={{ width: "120px", textAlign: "justify", height: "50px" }}
                        >
                            {e.name}
                        </Radio.Button>

                        // </div>
                    );
                })}
            </Radio.Group>
        </div>
    );
};

export default PageMetodePaymentByKategori;
