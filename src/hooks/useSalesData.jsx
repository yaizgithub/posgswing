import axios from "axios";
import { useQuery } from "react-query";
import { baseUrl } from "../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/sales`);    
    return response.data;
};

export const useSalesData = (click) => {
    return useQuery("sales", fetcher, {
        enabled:click,
    });
};

