import axios from "axios";
import { useQuery } from "react-query";
import { baseUrl } from "../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/list-order-resto-reservasi`);    
    return response.data;
};

const fetcherSatuAtauDua = async () => {
    const response = await axios.get(baseUrl + `/list-order-resto-reservasi/status-satuataudua`);    
    return response.data;
};

const fetcherOne = async (bayid) => {
    const response = await axios.get(baseUrl + `/list-order-resto-reservasi/orderbynomorbay/${bayid}`);    
    return response.data;
};


export const useListRestoOrderReservasiData = (click) => {
    return useQuery("list-order-resto-reservasi", fetcher, {
        enabled:click,
        refetchInterval:1000,
        refetchIntervalInBackground:true,
    });
};
export const useListRestoOrderReservasiStatusSatuAtauDuaData = (click) => {
    return useQuery("list-order-resto-reservasi-nulltosatu", fetcherSatuAtauDua, {
        enabled:click,
        refetchInterval:1000,
        refetchIntervalInBackground:true,
    });
};
export const useOneListRestoOrderReservasiData = (bayid, click) => {
    return useQuery(["list-order-resto-reservasi", bayid], ()=>fetcherOne(bayid), {
        enabled:click,
        refetchInterval:1000,
        refetchIntervalInBackground:true,
    });
};

