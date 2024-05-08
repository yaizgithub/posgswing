import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/registrasi`);
    return response.data;
};

const fetcherAll = async () => {
    const response = await axios.get(baseUrl + `/registrasi/all`);
    return response.data;
};

const fetcherByStatus = async ([status, regisId]) => {
    const response = await axios.get(baseUrl + `/registrasi/status/${status}/${regisId}`);
    return response.data;
};

const fetcherOne = async (id) => {
    const response = await axios.get(baseUrl + `/registrasi/orderbyid?id=${id}`);
    return response.data;
};

const getCountPlayer = async () => {
    const response = await axios.get(baseUrl + `/registrasi/count-player`);
    return response.data;
};

const getChartDriving = async () => {
    const response = await axios.get(baseUrl + `/registrasi/chart-driving`);
    return response.data;
};

const getRegistrasiPayerNotNull = async (id) => {
    const response = await axios.get(baseUrl + `/registrasi/payernotnull?id=${id}`);
    return response.data;
};

const postRegistrasi=async(data)=>{
        await axios
            .post(baseUrl + `/registrasi`, data)
            .then((res) => {
                console.log("success saving Registrasi data");
            })
            .catch((err) => console.log(err));
}

const updateRegistrasi=async([id, data])=>{
    await axios
        .put(baseUrl + `/registrasi/edit/${id}`, data)
        .then((res) => {
            console.log("success updated Registrasi data");
        })
        .catch((err) => console.log(err));
}

const updateStatusRegistrasiById=async([id, data])=>{
    await axios.put(baseUrl+`/registrasi/statusbyid?id=${id}`, data)
    .then((res)=>{
        // console.log("update status registrasi berhasil");
    }).catch((err)=>console.log(err));
}

const updateStatusRegistrasiByMeja=async([noMeja, data])=>{
    await axios.put(baseUrl+`/registrasi/statusbymeja?no_meja=${noMeja}`, data)
    .then((res)=>{
        // console.log("update status registrasi berhasil");
    }).catch((err)=>console.log(err));
}

const updatePayerRegistrasi=async([regisId, data])=>{
    await axios.put(baseUrl+`/registrasi/edit-payer/${regisId}`, data)
    .then((res)=>{
        // console.log("update status registrasi berhasil");
    }).catch((err)=>console.log(err));
}

const deleteRegistrasi=async(id)=>{
    await axios
        .delete(baseUrl + `/registrasi/${id}`)
        .then((res) => {
            console.log("success deleted Registrasi data");
        })
        .catch((err) => console.log(err));
}


///export list
export const useRegistrasiData = (click) => {
    return useQuery("registrasi", fetcher, {
        refetchOnWindowFocus:false,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};
export const useAllRegistrasiData = (click) => {
    return useQuery("registrasi-all", fetcherAll, {
        refetchOnWindowFocus:false,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};
export const useRegistrasiByStatusData = ([status, regisId, click]) => {
    return useQuery(["registrasi-status", status, regisId], ()=>fetcherByStatus([status, regisId]), {
        refetchOnWindowFocus:false,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};
export const useOneRegistrasiData = (id,click) => {
    return useQuery(["registrasi", id], ()=>fetcherOne(id), {
        refetchOnWindowFocus:false,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};
export const useGetCountPlayerData = (click) => {
    return useQuery("count-player", getCountPlayer, {
        refetchOnWindowFocus:true,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};
export const useGetChartDrivingData = (click) => {
    return useQuery("chart-driving", getChartDriving, {
        refetchOnWindowFocus:true,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};
export const useRegistrasiPayerNotNullData = (id,click) => {
    return useQuery(["chart-driving", id], ()=>getRegistrasiPayerNotNull(id), {
        refetchOnWindowFocus:false,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};

///CRUD
export const usePostRegistrasiData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postRegistrasi,{
        onSuccess:(data)=>{
            queryClient.invalidateQueries("registrasi"); //utk refresh data                    
            // queryClient.setQueryData("registrasi", (oldQueryData)=>{
            //     return {
            //         // ...oldQueryData,
            //         // data:[...oldQueryData.data, data.data]                    
            //         success:true,
            //         message:console.log("registrasi berhasil guys")
            //     }
            // })    
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdateRegistrasiData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateRegistrasi,{
        onSuccess:()=>{
            queryClient.invalidateQueries("registrasi"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateStatusRegistrasiByIdData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusRegistrasiById,{
        onSuccess:()=>{
            queryClient.invalidateQueries("registrasi"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateStatusRegistrasiByMejaData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusRegistrasiByMeja,{
        onSuccess:()=>{
            queryClient.invalidateQueries("registrasi"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdatePayerRegistrasiData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updatePayerRegistrasi,{
        onSuccess:()=>{
            queryClient.invalidateQueries("registrasi"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useDeleteRegistrasiData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deleteRegistrasi,{
        onSuccess:()=>{
            queryClient.invalidateQueries("registrasi"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}