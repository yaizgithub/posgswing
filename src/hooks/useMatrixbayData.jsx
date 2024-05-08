import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";

const fetcherOrderByDate = async (date) => {
    const response = await axios.get(baseUrl + `/matrix/orderbydate?date=${date}`);    
    return response.data;
};

const updateMatrixbayData=async([id, namaBay, data])=>{
    await axios.put(baseUrl+`/matrix/edit/${id}/${namaBay}`, data)
    .then((res)=>{
        console.log("Alhamdulillah success update matrix")
    }).catch((err)=>console.log(err));
}

const updatePindahBayMatrixbayData=async([namaBay, data])=>{
    await axios.put(baseUrl+`/matrix/pindah/${namaBay}`, data)
    .then((res)=>{
        console.log("Alhamdulillah success update matrix")
    }).catch((err)=>console.log(err));
}

const updateStatusCheckinToPlayMatrixBay=async([namaBay, data])=>{
    await axios.put(baseUrl+`/matrix/edit-toplay/${namaBay}`, data)
    .then((res)=>{
        console.log("status Check-in success to Play ")
    }).catch((err)=>console.log(err));
}

const updateStatusPlayToFinishMatrixBay=async([namaBay, data])=>{
    await axios.put(baseUrl+`/matrix/edit-tofinish/${namaBay}`, data)
    .then((res)=>{
        console.log("status Check-in success to Play ")
    }).catch((err)=>console.log(err));
}

const updateStatusFinishToPaidMatrixBay=async([namaBay, data])=>{
    await axios.put(baseUrl+`/matrix/edit-topaid/${namaBay}`, data)
    .then((res)=>{
        console.log("status Play success to Paid ")
    }).catch((err)=>console.log(err));
}

const updateClearCellMatrixbayData=async([id, namaBay, statusBay])=>{
    await axios.put(baseUrl+`/matrix/edit/clear/${id}/${namaBay}?status_bay=${statusBay}`)
    .then((res)=>{
        console.log(res);
        // console.log("Alhamdulillah success update data")
    }).catch((err)=>console.log(err));
}




///Export
export const useMatrixbayDataOrderByDate = (date, click) => {
    return useQuery(["matrix", date], ()=>fetcherOrderByDate(date), {
        enabled:click,
        refetchInterval:2000,
        refetchIntervalInBackground:true
    });
};



///CRUD
export const useUpdateMatrixbayData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateMatrixbayData,{
        onSuccess:()=>{
            queryClient.invalidateQueries("matrix"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdatePindahBayMatrixbayData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updatePindahBayMatrixbayData,{
        onSuccess:()=>{
            queryClient.invalidateQueries("matrix"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdateStatusCheckinToPlayMatrixBay=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusCheckinToPlayMatrixBay,{
        onSuccess:()=>{
            queryClient.invalidateQueries("matrix"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdateStatusPlayToFinishMatrixBay=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusPlayToFinishMatrixBay,{
        onSuccess:()=>{
            queryClient.invalidateQueries("matrix"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdateStatusFinishToPaidMatrixBay=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusFinishToPaidMatrixBay,{
        onSuccess:()=>{
            queryClient.invalidateQueries("matrix"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdateClearCellMatrixbayData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateClearCellMatrixbayData,{
        onSuccess:()=>{
            queryClient.invalidateQueries("matrix"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

