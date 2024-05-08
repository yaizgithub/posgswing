import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/meja`);    
    return response.data;
};

const fetcherKhususRestoran = async () => {
    const response = await axios.get(baseUrl + `/meja`);    
    return response.data;
};

const fetcherOrderByStatus = async (status) => {
    const response = await axios.get(baseUrl + `/meja/orderbystatus?status=${status}`);    
    return response.data;
};

const updateStatusMeja =async([id, data])=>{
    await axios.put(baseUrl+`/meja/edit/${id}`, data).then((res)=>{
        console.log("berhasil merubah status meja");
    }).catch((err)=>console.log(err));
}


///export
export const useMeja = (click) => {
    return useQuery("meja-status", fetcher, {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};

export const useMejaRestoran = (click) => {
    return useQuery("meja-status", fetcherKhususRestoran, {
        enabled:click,
        refetchInterval:2000,
        refetchIntervalInBackground:true,
    });
};

export const useMejaOrderByStatusData = (status,click) => {
    return useQuery(["meja-status", status], ()=>fetcherOrderByStatus(status), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};


///crud export
export const useUpdateStatusMejaData =()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusMeja,{
        onSuccess:()=>{
            queryClient.invalidateQueries("meja-status"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

