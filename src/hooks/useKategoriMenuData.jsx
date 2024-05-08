import axios from "axios";
import { useQuery } from "react-query";
import { baseUrl } from "../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/kategori`);    
    return response.data;
};

///all Export
export const useKategoriMenuData = (click) => {
    return useQuery("kategori", fetcher, {
        refetchOnWindowFocus:false,                
        enabled:click,
    });
};