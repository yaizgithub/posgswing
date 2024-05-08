import axios from "axios";
import { useQuery } from "react-query";
import { baseUrl } from "../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/list-order-resto/rekap`);        
    return response.data;
};


export const useRekapListRestoOrderData = (click) => {
    return useQuery("list-orderrekap-resto", fetcher, {
        enabled:click,
        refetchInterval:2000,
        refetchIntervalInBackground:true,
    });
};

