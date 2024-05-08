import axios from "axios";
import { useQuery } from "react-query";
import { baseUrl } from "../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/list-order-resto`);    
    return response.data;
};

const getListRestoOrderGroupBayAndMeja = async () => {
    const response = await axios.get(baseUrl + `/list-order-resto/groupbayandmeja`);    
    return response.data;
};

const getListRestoOrderStatusReady = async () => {
    const response = await axios.get(baseUrl + `/list-order-resto/status-dua`);    
    return response.data;
};

const fetcherSatuAtauDua = async () => {
    const response = await axios.get(baseUrl + `/list-order-resto/orderbystatus-satuataudua`);    
    return response.data;
};

const fetcherOne = async (bayid) => {
    const response = await axios.get(baseUrl + `/list-order-resto/orderbynomorbay/${bayid}`);    
    return response.data;
};

const fetcherOneNoMeja = async (nomeja) => {
    const response = await axios.get(baseUrl + `/list-order-resto/orderbynomormeja/${nomeja}`);    
    return response.data;
};


///EXPORT
export const useListRestoOrderData = (click) => {
    return useQuery("list-order-resto", fetcher, {
        enabled:click,
        refetchInterval:2000,
        refetchIntervalInBackground:true,
    });
};
export const useListRestoOrderGroupBayAndMejaData = (click) => {
    return useQuery("groupbayandmeja", getListRestoOrderGroupBayAndMeja, {
        enabled:click,
        refetchInterval:2000,
        refetchIntervalInBackground:true,
    });
};

export const useGetListRestoOrderStatusReadyData = (click) => {
    return useQuery("list-order-resto-ready", getListRestoOrderStatusReady, {
        enabled:click,        
        refetchInterval:2000,
        refetchIntervalInBackground:true,
    });
};

export const useListRestoOrderStatusSatuAtauDuaData = (click) => {
    return useQuery("list-order-resto-satuataudua", fetcherSatuAtauDua, {
        enabled:click,
        refetchInterval:2000,
        refetchIntervalInBackground:true,
    });
};

export const useOneListRestoOrderData = (bayid, click) => {
    return useQuery(["list-order-resto", bayid], ()=>fetcherOne(bayid), {
        enabled:click,
        refetchInterval:1000,
        refetchIntervalInBackground:true,
    });
};
export const useOneListRestoranOrderByNoMejaData = (nomeja, click) => {
    return useQuery(["list-order-resto", nomeja], ()=>fetcherOneNoMeja(nomeja), {
        enabled:click,
        refetchInterval:1000,
        refetchIntervalInBackground:true,
    });
};


