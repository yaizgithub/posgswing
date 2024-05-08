import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../../config";

const fetcherOrderByRegistrasiId = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-resto/orderByRegistrasiId?registrasi_id=${reserId}`);
    return response.data;
};

const fetcherOrderByRegistrasiIdAndItem = async ([reserId, item]) => {
    const response = await axios.get(baseUrl + `/transaksi-resto/cari?registrasi_id=${reserId}&items_id=${item}`);
    return response.data;
};

const fetcherTotalRestoOrder = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-resto/total?registrasi_id=${reserId}`);
    return response.data;
};

const getTotalItemsTransaksiResto = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-resto/totalitems?registrasi_id=${reserId}`);
    return response.data;
};



const getDetailsTransaksiResto = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-resto/details-resto?registrasi_id=${reserId}`);
    return response.data;
};

const getDetailsTransaksiRestoPayerIsNull = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-resto/details-resto-payerisnull?registrasi_id=${reserId}`);
    return response.data;
};

const fetcherRekapByRegistrasiId = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-resto/rekapByRegistrasiId?registrasi_id=${reserId}`);
    console.log(response.data);
    return response.data;
};

const getRekapRegistrasiRestoOrderPayerIsNull = async (reserId) => {
    const response = await axios.get(baseUrl + `/transaksi-resto/rekap-payerisnull?registrasi_id=${reserId}`);
    console.log(response.data);
    return response.data;
};


const getSumTransaksiResto = async ([reserId, kategori]) => {
    const response = await axios.get(baseUrl + `/transaksi-resto/sumtransaksiresto?registrasi_id=${reserId}&kategori=${kategori}`);
    return response.data;
};


const postRegistrasiResto=async(data)=>{
    await axios.post(baseUrl+`/transaksi-resto`, data)
    .then((res)=>{
        console.log("success save Registrasi resto data");
    }).catch((err)=>console.log(err));
}

//update
const updateTransaksiResto=async([id, data])=>{
    await axios.put(baseUrl+`/transaksi-resto/edit/${id}`, data)
    .then((res)=>{
        console.log("success updated Registrasi resto data");
    }).catch((err)=>console.log(err));
}

const updateStatusWhereNullTransaksiResto=async([registrasiId, data])=>{
    await axios.put(baseUrl+`/transaksi-resto/status-null/${registrasiId}`, data)
    .then((res)=>{
        console.log("success updated status Registrasi resto data");
    }).catch((err)=>console.log(err));
}

const updateStatusWhereNolTransaksiResto=async([id, data])=>{
    await axios.put(baseUrl+`/transaksi-resto/status-nol/${id}`, data)
    .then((res)=>{
        console.log("success updated status Registrasi resto data");
    }).catch((err)=>console.log(err));
}

const updateStatusWhereSatuToDuaTransaksiResto=async([id, data])=>{
    await axios.put(baseUrl+`/transaksi-resto/status-satu/${id}`, data)
    .then((res)=>{
        console.log("success updated status Registrasi resto data");
    }).catch((err)=>console.log(err));
}

const updateStatusWhereDuaToTigaTransaksiResto=async([id, data])=>{
    await axios.put(baseUrl+`/transaksi-resto/status-dua/${id}`, data)
    .then((res)=>{
        console.log("success updated status Registrasi resto data");
    }).catch((err)=>console.log(err));
}

const updatePayerRegistrasiTransaksiResto=async([regisId, itemsId, data])=>{
    await axios.put(baseUrl+`/transaksi-resto/edit-payer/${regisId}/${itemsId}`, data)
    .then((res)=>{
        console.log("success updated asal Registrasi resto data");
    }).catch((err)=>console.log(err));
}

const updatePerhitunganTransaksiRestoByRegisId=async([regisId, items_id, data])=>{
    await axios.put(baseUrl+`/transaksi-resto/edittotalbyregisid/${regisId}/${items_id}`, data)
    .then((res)=>{
        console.log("success updated discont all items");
    }).catch((err)=>console.log(err));
}

//end update

const deleteRegistrasiResto=async(id)=>{
    await axios.delete(baseUrl+`/transaksi-resto/${id}`)
    .then((res)=>{
        console.log("success deleted Registrasi resto data");
    }).catch((err)=>console.log(err));
}


///export list
export const useRegistrasiRestoOrderByRegistrasiIdData = (reserId,click) => {
    return useQuery(["transaksi-resto", reserId], ()=>fetcherOrderByRegistrasiId(reserId), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};
export const useRegistrasiRestoOrderByRegistrasiIdAndItemData = ([reserId, item, click]) => {
    return useQuery(["transaksi-resto", reserId, item], ()=>fetcherOrderByRegistrasiIdAndItem([reserId, item]), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};

export const useTotalRestoOrder = (reserId,click) => {
    return useQuery(["resto-total", reserId], ()=>fetcherTotalRestoOrder(reserId), {        
        enabled:click,
        refetchOnMount:false,
        refetchOnWindowFocus:false,        
    });
};

export const useGetTotalItemsTransaksiRestoData = (reserId,click) => {
    return useQuery(["resto-total-items", reserId], ()=>getTotalItemsTransaksiResto(reserId), {        
        enabled:click,
        refetchOnMount:false,
        refetchOnWindowFocus:false,        
    });
};

export const useGetDetailsTransaksiRestoData = (reserId,click) => {
    return useQuery(["details-resto", reserId], ()=>getDetailsTransaksiResto(reserId), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};
export const useDetailsTransaksiRestoPayerIsNullData = (reserId,click) => {
    return useQuery(["details-resto-payerisnull", reserId], ()=>getDetailsTransaksiRestoPayerIsNull(reserId), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};

export const useRekapRegistrasiRestoOrderByRegistrasiIdData = (reserId,click) => {
    return useQuery(["transaksi-resto-rekap", reserId], ()=>fetcherRekapByRegistrasiId(reserId), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};
export const useRekapRegistrasiRestoOrderPayerIsNullData = (reserId,click) => {
    return useQuery(["transaksi-resto-rekap-payerisnull", reserId], ()=>getRekapRegistrasiRestoOrderPayerIsNull(reserId), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};

export const useGetSumTransaksiRestoData = ([reserId, kategori,click]) => {
    return useQuery(["sumtransaksiresto", reserId, kategori], ()=>getSumTransaksiResto([reserId, kategori]), {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};



///POST
export const usePostRegistrasiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postRegistrasiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-resto"); //utk refresh data            
            queryClient.invalidateQueries("resto-total-items"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}




///PUT
export const useUpdateRegistrasiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateTransaksiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-resto"); //utk refresh data            
            queryClient.invalidateQueries("details-resto"); //utk refresh data            
            queryClient.invalidateQueries("resto-total-items"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateStatusWhereNullRegistrasiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusWhereNullTransaksiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-resto"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateStatusWhereNolRegistrasiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusWhereNolTransaksiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-resto"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateStatusWhereSatuToDuaTransaksiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusWhereSatuToDuaTransaksiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-resto"); //utk refresh data                                             
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateStatusWhereDuaToTigaTransaksiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateStatusWhereDuaToTigaTransaksiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-resto"); //utk refresh data     
            // queryClient.invalidateQueries("list-order-resto-ready"); //utk refresh data 
            // queryClient.invalidateQueries("list-order-resto-satuataudua"); //utk refresh data         
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdatePayerRegistrasiTransaksiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updatePayerRegistrasiTransaksiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-resto"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}



export const useUpdatePerhitunganTransaksiRestoByRegisIdData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updatePerhitunganTransaksiRestoByRegisId,{
        onSuccess:()=>{
            queryClient.invalidateQueries("details-resto"); //utk refresh data            
            queryClient.invalidateQueries("transaksi-resto-rekap"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}


///end PUT

///DELETE
export const useDeleteRegistrasiRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deleteRegistrasiResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("transaksi-resto"); //utk refresh data            
            queryClient.invalidateQueries("details-resto"); //utk refresh data            
            queryClient.invalidateQueries("resto-total-items"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

