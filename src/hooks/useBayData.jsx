import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";



const fetcher = async ([start, end]) => {
    const response = await axios.get(baseUrl + `/bay?start=${start}&end=${end}`);    
    return response.data;
};

const fetcherOrderByStatus = async (status) => {
    const response = await axios.get(baseUrl + `/bay/orderbystatus?status=${status}`);
    // console.log(response.data);
    return response.data;
};

// const getAllBay = async () => {
//     const response = await axios.get(baseUrl + `/bay/all`);    
//     return response.data;
// };

///post
const postBay=async(data)=>{
    await axios.post(baseUrl+`/bay`, data).then((res)=>{
        console.log("berhasil menambah data bay");
    }).catch((err)=>console.log(err));
}

///update
const updateBay=async([id,data])=>{
    await axios.put(baseUrl+`/bay/edit/${id}`, data).then((res)=>{
        console.log("berhasil merubah data bay");
    }).catch((err)=>console.log(err));
}
const updateSebagianBay=async([id,data])=>{
    await axios.put(baseUrl+`/bay/edit-sebagian/${id}`, data).then((res)=>{        
        // console.log("berhasil merubah sebagian data bay");
    }).catch((err)=>console.log(err));
}
const updateTimeCurrentBay=async()=>{
    await axios.put(baseUrl+`/bay/edit-timecurrent`).then((res)=>{
        // console.log("berhasil merubah data bay");
    }).catch((err)=>console.log(err));
}
const updateStatusBay=async(regisId)=>{
    await axios.put(baseUrl+`/bay/edit-status?registrasi_id=${regisId}`).then((res)=>{
        // console.log("berhasil merubah data bay");        
    }).catch((err)=>console.log(err));
}

///delete
const deleteBay=async(id)=>{
    await axios.post(baseUrl+`/bay/${id}`).then((res)=>{
        console.log("berhasil menghapus data bay");
    }).catch((err)=>console.log(err));
}





///all Export
export const useBayData = ([start,end],click) => {
    return useQuery(["bay",start,end], ()=>fetcher([start,end]), {
        enabled:click,
        refetchInterval:3000,
        refetchIntervalInBackground: true,
    });
};

export const useBayOrderByStatusData = (status,click) => {
    return useQuery(["bay-status", status], ()=>fetcherOrderByStatus(status), {
        enabled:click,
    });
};

// export const useGetAllBayData = (click) => {
//     return useQuery("bay", getAllBay, {
//         enabled:click,        
//     });
// };


///crud export
export const usePostBayData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postBay,{
        onSuccess:()=>{
            queryClient.invalidateQueries("bay"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdateBayData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateBay,{
        onSuccess:()=>{
            queryClient.invalidateQueries("bay"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateSebagianBayData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateSebagianBay,{        
        onSuccess:()=>{              
            queryClient.invalidateQueries("bay"); //utk refresh data          
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateTimeCurrentBayData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateTimeCurrentBay,{
        onSuccess:()=>{
            queryClient.invalidateQueries("bay"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateStatusBayData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusBay,{
        onSuccess:()=>{
            queryClient.invalidateQueries("bay"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useDeleteBayData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deleteBay,{
        onSuccess:()=>{
            queryClient.invalidateQueries("bay"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}


