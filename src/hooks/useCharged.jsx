import axios from "axios";
import { useQuery } from "react-query";
import { baseUrl } from "../config";

const getChargedByPayer = async (payer) => {
    const response = await axios.get(baseUrl + `/charged?payer=${payer}`);    
    return response.data;
};

const getDetailsChargedTransaksiDriving = async ([regisId, payer]) => {
    const response = await axios.get(baseUrl + `/charged/driving?registrasi_id=${regisId}&payer=${payer}`);
    return response.data;
};

const getDetailsChargedTransaksiResto = async ([regisId, payer]) => {
    const response = await axios.get(baseUrl + `/charged/resto?registrasi_id=${regisId}&payer=${payer}`);
    return response.data;
};

const getRekapChargedRegistrasiResto = async ([regisId, payer]) => {
    const response = await axios.get(baseUrl + `/charged/rekap?registrasi_id=${regisId}&payer=${payer}`);
    console.log(response.data);
    return response.data;
};

///export
export const useChargedByPayerData = (payer, click) => {
    return useQuery(["charged", payer], ()=>getChargedByPayer(payer), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};

export const useGetDetailsChargedTransaksiDrivingData = ([regisId, payer,click]) => {
    return useQuery(["charged-driving", regisId, payer], ()=>getDetailsChargedTransaksiDriving([regisId, payer]), {
        enabled:click,
    });
};

export const useGetDetailsChargedTransaksiRestoData = ([regisId, payer,click]) => {
    return useQuery(["charged-resto", regisId, payer], ()=>getDetailsChargedTransaksiResto([regisId, payer]), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};

export const useRekapChargedRegistrasiRestoData = ([regisId, payer,click]) => {
    return useQuery(["charged-rekap", regisId, payer], ()=>getRekapChargedRegistrasiResto([regisId, payer]), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};