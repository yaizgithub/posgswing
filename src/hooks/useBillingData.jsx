import axios from "axios";
import { useQuery } from "react-query";
import { baseUrl } from "../config";



const fetcher = async ([date, regisId]) => {
    const response = await axios.get(baseUrl + `/billing?date=${date}&registrasi_id=${regisId}`);    
    return response.data;
};

const fetcherAllBilling = async (regisId) => {
    const response = await axios.get(baseUrl + `/billing/all?registrasi_id=${regisId}`);    
    return response.data;
};

const fetcherTotal = async (regisId) => {
    const response = await axios.get(baseUrl + `/billing/total?registrasi_id=${regisId}`);    
    return response.data;
};

const fetcherTotalResto = async (regisId) => {
    const response = await axios.get(baseUrl + `/billing/total-resto?registrasi_id=${regisId}`);    
    return response.data;
};


///all Export
export const useBillingData = ([date,regisId],click) => {
    return useQuery(["billing-nota",date,regisId], ()=>fetcher([date,regisId]), {
        enabled:click,
    });
};

export const useAllBillingData = (regisId,click) => {
    return useQuery(["billing-nota", regisId], ()=>fetcherAllBilling(regisId), {
        enabled:click,
    });
};

export const useTotalBillingData = (regisId,click) => {
    return useQuery(["billing-nota",regisId], ()=>fetcherTotal(regisId), {
        enabled:click,
    });
};

export const useTotalBillingRestoData = (regisId,click) => {
    return useQuery(["billing-nota-resto",regisId], ()=>fetcherTotalResto(regisId), {
        enabled:click,
    });
};
