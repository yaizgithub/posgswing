import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../../config";

const fetcherOrderByReservasiId = async (reserId) => {
    const response = await axios.get(baseUrl + `/reservasi-driving/orderByReservasiId?reservasi_id=${reserId}`);
    return response.data;
};

const fetcherTotalJamByRegisID = async (reserId) => {
    const response = await axios.get(baseUrl + `/reservasi-driving/totaljam?reservasi_id=${reserId}`);
    return response.data;
};

const postReservasiDriving=async(data)=>{
    await axios.post(baseUrl+`/reservasi-driving`, data)
    .then((res)=>{
        console.log("success save reservasi driving data");
    }).catch((err)=>console.log(err));
}

const updateReservasiDriving=async([id, data])=>{
    await axios.put(baseUrl+`/reservasi-driving/edit/${id}`, data)
    .then((res)=>{
        console.log("success updated reservasi driving data");
    }).catch((err)=>console.log(err));
}

const deleteReservasiDriving=async(id)=>{
    await axios.delete(baseUrl+`/reservasi-driving/${id}`)
    .then((res)=>{
        console.log("success deleted reservasi driving data");
    }).catch((err)=>console.log(err));
}


///export list
export const useReservasiDrivingOrderByReservasiIdData = (reserId,click) => {
    return useQuery(["reservasi-driving", reserId], ()=>fetcherOrderByReservasiId(reserId), {
        enabled:click,
    });
};
export const useTotalJamReservasiDrivingOrderByReservasiIdData = (reserId,click) => {
    return useQuery(["reservasi-driving-totaljam", reserId], ()=>fetcherTotalJamByRegisID(reserId), {
        enabled:click,
    });
};

///POST
export const usePostReservasiDrivingData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postReservasiDriving,{
        onSuccess:()=>{
            queryClient.invalidateQueries("reservasi-driving"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

///PUT
export const useUpdateReservasiDrivingData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateReservasiDriving,{
        onSuccess:()=>{
            queryClient.invalidateQueries("reservasi-driving"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

///DELETE
export const useDeleteReservasiDrivingData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deleteReservasiDriving,{
        onSuccess:()=>{
            queryClient.invalidateQueries("reservasi-driving"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

