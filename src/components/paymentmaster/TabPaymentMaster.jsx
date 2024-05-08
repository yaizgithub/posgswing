import { Button, Card, Segmented, Space } from "antd";
import React, { useEffect, useState } from "react";
import {
    useGroupPaymentMasterData,    
    usePaymentMasterOrderByCategoriData,
} from "../../hooks/usePaymentMasterData";
import { usePostPaymentData, useTotalPaymentData, useTotalPaymentRestoData } from "../../hooks/usePaymentData";
import { useSelector } from "react-redux";
import { baseUrl } from "../../config";
import axios from "axios";

const TabPaymentMaster = () => {

    const {userid} = useSelector((state)=>state.auth);
    const {dataSelected} = useSelector((state)=>state.mydataselected);
    // const {sisaBayar, discKasir} = useSelector((state)=>state.mytotalbayar);

    const { drivingSubTotal, totalDisc, totalTagihan, discPersenTambahan, discTambahan } = useSelector(
        (state) => state.mypayment
    );

    const [categori, setCategori] = useState();

    // useEffect(() => {
    //     setCategori()
    // }, [discPersenTambahan])

    ///HOOKs
    const {mutateAsync: mutatePostPaymentData} = usePostPaymentData();
    const {data: dataTotalPayment} = useTotalPaymentData(dataSelected.id,true);
    const {data: dataTotalPaymentResto} = useTotalPaymentRestoData(dataSelected.id,true);
    const { data: dataPaymentMasterByCategori } =
        usePaymentMasterOrderByCategoriData(categori, true);
    const { data } = useGroupPaymentMasterData(true);
  


    const onChange = (v) => {        
        setCategori(v);
    };

    const onClickButton=async(paymentId)=>{
        // console.log({total:sisaBayar, disc:discKasir});

        //buat nomor urut
        await axios.get(baseUrl+`/payment/generate?registrasi_id=${dataSelected.id}`)
        .then(async(res)=>{
            let numberUrutPayment =res.data.data;
            console.log(numberUrutPayment);

            let nilaiBayar = 0;


            ///cek transaksi driving jika ada pakai dataTOtalPayment jika tdk ada pake dataTotalPaymentResto
            if (drivingSubTotal > 0) {
                // console.log("AAA");
                if (dataTotalPayment?.success) {
                    let sisaBayar = dataTotalPayment?.data[0].sisaBayar ?? 0;                
                    if (sisaBayar > totalTagihan) {
                        nilaiBayar = totalTagihan
                    } else {
                        nilaiBayar = sisaBayar;
                    }
                } else {
                    console.log("Data Payment tidak ditemukan");
                }                 
            } else {
                // console.log("BBB");
                if (dataTotalPaymentResto?.success) {
                    let sisaBayar = dataTotalPaymentResto?.data[0].sisaBayar ?? 0;                
                    if (sisaBayar > totalTagihan) {
                        nilaiBayar = totalTagihan
                    } else {
                        nilaiBayar = sisaBayar;
                    }
                } else {
                    console.log("Data Payment khusus resto tidak ditemukan");
                } 
            }





            ///simpan payment
            let x = {
                id: numberUrutPayment,
                registrasi_id: dataSelected.id,
                payment_id: paymentId,
                disc_rp: totalDisc,
                disc_persen_tambahan: discPersenTambahan,
                disc_tambahan: discTambahan,
                nilai_bayar: nilaiBayar,
                kembalian: 0,
                remark:null,
                user_id:userid,
                updated:userid
    
            }
            await mutatePostPaymentData(x);                    
        }).catch((err)=>console.log(err));
    }

    return (
        <div>
            <Card title="Payment Method" size="small">
                <Segmented
                    size="middle"
                    options={data?.data.map((e) => (
                        {
                            label:e.kategori.toUpperCase(),
                            value:e.kategori
                        }
                    ))}
                    onChange={onChange}
                />
            </Card>
            <div className="mt-3">
            {dataPaymentMasterByCategori?.data?.map((e, key) => (
                <Space key={key}>
                    <div className="p-1">
                        <Button onClick={()=>onClickButton(e.id)}>{e.name}</Button>
                    </div>
                </Space>
            ))}

            </div>
        </div>
    );
};

export default TabPaymentMaster;
