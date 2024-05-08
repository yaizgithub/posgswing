import axios from "axios";
import { useQuery } from "react-query";
import { baseUrl } from "../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/class`);    
    return response.data;
};

///all Export
export const useClassMenuData = (click) => {
    return useQuery("class", fetcher, {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};