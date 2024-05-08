import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/reservasi`);
    return response.data;
};

const fetcherOneReservasi = async (id) => {
    const response = await axios.get(baseUrl + `/reservasi/orderbyid?id=${id}`);
    return response.data;
};

const postReservasi=async(data)=>{
        await axios
            .post(baseUrl + `/reservasi`, data)
            .then((res) => {
                console.log("success saving reservasi data");
            })
            .catch((err) => console.log(err));
}

const updateReservasi=async([id, data])=>{
    await axios
        .put(baseUrl + `/reservasi/edit/${id}`, data)
        .then((res) => {
            console.log("success updated reservasi data");
        })
        .catch((err) => console.log(err));
}

const deleteReservasi=async(id)=>{
    await axios
        .delete(baseUrl + `/reservasi/${id}`)
        .then((res) => {
            console.log("success deleted reservasi data");
        })
        .catch((err) => console.log(err));
}


///export list
export const useReservasiData = (click) => {
    return useQuery("reservasi", fetcher, {
        refetchOnWindowFocus:false,
        enabled:click,        
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};

export const useOneReservasiData = (id, click) => {
    return useQuery(["reservasi", id], ()=>fetcherOneReservasi(id), {
        refetchOnWindowFocus:false,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};

export const usePostReservasiData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postReservasi,{
        onSuccess:()=>{
            queryClient.invalidateQueries("reservasi"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdateReservasiData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateReservasi,{
        onSuccess:()=>{
            queryClient.invalidateQueries("reservasi"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useDeleteReservasiData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deleteReservasi,{
        onSuccess:()=>{
            queryClient.invalidateQueries("reservasi"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}