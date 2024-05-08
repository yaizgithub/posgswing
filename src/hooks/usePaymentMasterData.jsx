import axios from "axios";
import { useQuery } from "react-query";
import { baseUrl } from "../config";

const fetcherGroup = async () => {
    const response = await axios.get(baseUrl + `/payment-master/group`);    
    return response.data;
};
const fetcherOrderByCategori = async (kategori) => {
    const response = await axios.get(baseUrl + `/payment-master/orderbycategori?kategori=${kategori}`);    
    return response.data;
};


export const useGroupPaymentMasterData = (click) => {
    return useQuery("payment-master", fetcherGroup, {
        enabled:click,
    });
};

export const usePaymentMasterOrderByCategoriData = (kategori,click) => {
    return useQuery(["payment-master", kategori], ()=>fetcherOrderByCategori(kategori), {
        enabled:click,
    });
};

