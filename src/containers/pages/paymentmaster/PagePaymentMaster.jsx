import React, { useState } from "react";
import { useGroupPaymentMasterData } from "../../../hooks/usePaymentMasterData";
import { Flex, Radio, Skeleton } from "antd";
import PageMetodePaymentByKategori from "./PageMetodePaymentByKategori";
import TablePayment from "../../../components/payment/TablePayment";

const PagePaymentMaster = (props) => {    

    ///HOOKs
    const { data, isLoading, isError, error } = useGroupPaymentMasterData();

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

    const onChange = (e) => {
        // console.log(e.target.value);
        props.setKategori(e.target.value);
    };

    return (
        <div>
            <Radio.Group buttonStyle="solid" onChange={onChange}>
                {data?.data.map((e, key) => {
                    return (
                        <div key={key} className="border-none">
                            <Radio.Button
                                value={e.kategori}
                                style={{ width: "120px", textAlign: "justify", height: "50px" }}
                            >
                                {e.kategori.toUpperCase()}
                            </Radio.Button>
                        </div>
                    );
                })}
            </Radio.Group>
        </div>
    );
};

export default PagePaymentMaster;
