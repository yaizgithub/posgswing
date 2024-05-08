import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../../config";

const fetcherOrderByRegistrasiId = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-driving/orderByRegistrasiId?registrasi_id=${reserId}`);
    return response.data;
};



const fetcherTotalJamByRegisID = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-driving/totaljam?registrasi_id=${reserId}`);
    return response.data;
};

const fetcherTotalJamTerpakaiByRegisID = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-driving/totaljam-terpakai?registrasi_id=${reserId}`);
    return response.data;
};

const fetcherTotalDrivingOrder = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-driving/total?registrasi_id=${reserId}`);
    return response.data;
};

///utk add hours
const getNomorBayAktif = async () => {
    const response = await axios.get(baseUrl + `/transaksi-driving/nomorbayaktif`);
    return response.data;
};
///end add hours

const getDetailsTransaksiDriving = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-driving/details-driving?registrasi_id=${reserId}`);
    return response.data;
};
const getDetailsTransaksiDrivingPayerIsNull = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-driving/details-driving-payerisnull?registrasi_id=${reserId}`);
    return response.data;
};



const fetcherRekapByRegistrasiId = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-driving/rekapByRegistrasiId?registrasi_id=${reserId}`);
    return response.data;
};
const getRekapRegistrasiDrivingOrderPayerIsNull = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-driving/rekap-payerisnull?registrasi_id=${reserId}`);
    return response.data;
};

const getSumTransaksiDriving = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-driving/sumtransaksidriving?registrasi_id=${reserId}`);
    return response.data;
};

const postRegistrasiDriving=async(data)=>{
    await axios.post(baseUrl+`/transaksi-driving`, data)
    .then((res)=>{
        console.log("success save Registrasi driving data");
    }).catch((err)=>console.log(err));
}

const updateRegistrasiDriving=async([id, data])=>{
    await axios.put(baseUrl+`/transaksi-driving/edit/${id}`, data)
    .then((res)=>{
        console.log("success updated Registrasi driving data");
    }).catch((err)=>console.log(err));
}
const updateTimeRegistrasiDriving=async([regisId, data])=>{
    await axios.put(baseUrl+`/transaksi-driving/edit-time/${regisId}`, data)
    .then((res)=>{
        console.log("success updated Registrasi driving data");
    }).catch((err)=>console.log(err));
}
// const updateStatusRegistrasiDriving=async([regisId])=>{
//     await axios.put(baseUrl+`/transaksi-driving/edit-time/${regisId}`)
//     .then((res)=>{
//         console.log("success updated status Registrasi driving data");
//     }).catch((err)=>console.log(err));
// }

const updatePayerRegistrasiTransaksiDriving=async([regisId, itemsId, data])=>{
    await axios.put(baseUrl+`/transaksi-driving/edit-payer/${regisId}/${itemsId}`, data)
    .then((res)=>{
        console.log("success updated payer Registrasi driving data");
    }).catch((err)=>console.log(err));
}


const updatePerhitunganTransaksiDrivingById=async([regisId, data])=>{
    await axios.put(baseUrl+`/transaksi-driving/edittotalbyid/${regisId}`, data)
    .then((res)=>{
        console.log("success updated discont one items");
    }).catch((err)=>console.log(err));
}

const updatePerhitunganTransaksiDrivingByRegisId=async([regisId, data])=>{
    await axios.put(baseUrl+`/transaksi-driving/edittotalbyregisid/${regisId}`, data)
    .then((res)=>{
        console.log("success updated discont all items");
    }).catch((err)=>console.log(err));
}


const deleteRegistrasiDriving=async(id)=>{
    await axios.delete(baseUrl+`/transaksi-driving/${id}`)
    .then((res)=>{
        console.log("success deleted Registrasi driving data");
    }).catch((err)=>console.log(err));
}


///export list
export const useRegistrasiDrivingOrderByRegistrasiIdData = (reserId,click) => {
    return useQuery(["transaksi-driving", reserId], ()=>fetcherOrderByRegistrasiId(reserId), {
        enabled:click,
    });
};




export const useTotalJamRegistrasiDrivinRegisIdData = (reserId,click) => {
    return useQuery(["driving-totaljam", reserId], ()=>fetcherTotalJamByRegisID(reserId), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};

export const useTotalJamTerpakaiRegistrasiDrivinRegisIdData = (reserId,click) => {
    return useQuery(["driving-totaljam-terpakai", reserId], ()=>fetcherTotalJamTerpakaiByRegisID(reserId), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};

export const useTotalDrivingOrder = (reserId,click) => {
    return useQuery(["driving-total", reserId], ()=>fetcherTotalDrivingOrder(reserId), {
        enabled:click,
    });
};

export const useGetNomorBayAktif = (click) => {
    return useQuery("nomorbayaktif", ()=>getNomorBayAktif(), {
        refetchInterval:2000,
        refetchIntervalInBackground:true,
        enabled:click,
    });
};

export const useGetDetailsTransaksiDrivingData = (reserId,click) => {
    return useQuery(["details-driving", reserId], ()=>getDetailsTransaksiDriving(reserId), {
        enabled:click,
    });
};
export const useDetailsTransaksiDrivingPayerIsNullData = (reserId,click) => {
    return useQuery(["details-driving-payerisnull", reserId], ()=>getDetailsTransaksiDrivingPayerIsNull(reserId), {
        enabled:click,
    });
};

export const useRekapRegistrasiDrivingOrderByRegistrasiIdData = (reserId,click) => {
    return useQuery(["transaksi-driving-rekap", reserId], ()=>fetcherRekapByRegistrasiId(reserId), {
        enabled:click,
    });
};
export const useRekapRegistrasiDrivingOrderPayerIsNullData = (reserId,click) => {
    return useQuery(["transaksi-driving-rekap", reserId], ()=>getRekapRegistrasiDrivingOrderPayerIsNull(reserId), {
        enabled:click,
    });
};

export const useGetSumTransaksiDrivingData = (reserId,click) => {
    return useQuery(["sumtransaksidriving", reserId], ()=>getSumTransaksiDriving(reserId), {
        enabled:click,
    });
};



///POST
export const usePostRegistrasiDrivingData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postRegistrasiDriving,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-driving"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

///PUT
export const useUpdateRegistrasiDrivingData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateRegistrasiDriving,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-driving"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateTimeRegistrasiDrivingData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateTimeRegistrasiDriving,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-driving"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}
// export const useUpdateStatusRegistrasiDrivingData=()=>{
//     const queryClient = useQueryClient();
//     return useMutation(updateStatusRegistrasiDriving,{
//         onSuccess:()=>{
//             queryClient.invalidateQueries("transaksi-driving"); //utk refresh data            
//         },
//         onError:(err)=>{console.log(err);}
//     });
// }

export const useUpdatePayerRegistrasiTransaksiDrivingData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updatePayerRegistrasiTransaksiDriving,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-driving"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdatePerhitunganTransaksiDrivingByIdData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updatePerhitunganTransaksiDrivingById,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-driving-rekap"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdatePerhitunganTransaksiDrivingByRegisIdData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updatePerhitunganTransaksiDrivingByRegisId,{
        onSuccess:()=>{
            queryClient.invalidateQueries("details-driving"); //utk refresh data            
            queryClient.invalidateQueries("transaksi-driving-rekap"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}


///DELETE
export const useDeleteRegistrasiDrivingData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deleteRegistrasiDriving,{
        onSuccess:()=>{
            queryClient.invalidateQueries("details-driving"); //utk refresh data            
            queryClient.invalidateQueries("transaksi-driving"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

