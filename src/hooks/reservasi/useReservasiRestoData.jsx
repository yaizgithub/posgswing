import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../../config";

const fetcherOrderByReservasiId = async (reserId) => {
    const response = await axios.get(baseUrl + `/reservasi-resto/orderByReservasiId?reservasi_id=${reserId}`);
    return response.data;
};

const postReservasiResto=async(data)=>{
    await axios.post(baseUrl+`/reservasi-resto`, data)
    .then((res)=>{
        console.log("success save reservasi resto data");
    }).catch((err)=>console.log(err));
}

const updateReservasiResto=async([id, data])=>{
    await axios.put(baseUrl+`/reservasi-resto/edit/${id}`, data)
    .then((res)=>{
        console.log("success updated reservasi resto data");
    }).catch((err)=>console.log(err));
}

const updateStatusWhereNullToSatuReservasiResto=async([id, data])=>{
    await axios.put(baseUrl+`/reservasi-resto/status-null-satu/${id}`, data)
    .then((res)=>{
        console.log("success updated status reservasi resto data");
    }).catch((err)=>console.log(err));
}

const updateStatusWhereSatuToDuaReservasiResto=async([id, data])=>{
    await axios.put(baseUrl+`/reservasi-resto/status-satu-dua/${id}`, data)
    .then((res)=>{
        console.log("success updated status reservasi resto data");
    }).catch((err)=>console.log(err));
}

const deleteReservasiResto=async(id)=>{
    await axios.delete(baseUrl+`/reservasi-resto/${id}`)
    .then((res)=>{
        console.log("success deleted reservasi resto data");
    }).catch((err)=>console.log(err));
}


///export list
export const useReservasiRestoOrderByReservasiIdData = (reserId,click) => {
    return useQuery(["reservasi-resto", reserId], ()=>fetcherOrderByReservasiId(reserId), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};

///POST
export const usePostReservasiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postReservasiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("reservasi-resto"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

///PUT
export const useUpdateReservasiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateReservasiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("reservasi-resto"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateStatusWhereNullToSatuReservasiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusWhereNullToSatuReservasiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("reservasi-resto"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateStatusWhereSatuToDuaReservasiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusWhereSatuToDuaReservasiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("reservasi-resto"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

///DELETE
export const useDeleteReservasiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deleteReservasiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("reservasi-resto"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

