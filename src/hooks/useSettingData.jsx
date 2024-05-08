import axios from "axios";
import { useQuery } from "react-query";
import { baseUrl } from "../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/setting`);    
    return response.data;
};

export const useSettingData = (click) => {
    return useQuery("setting", fetcher, {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};

