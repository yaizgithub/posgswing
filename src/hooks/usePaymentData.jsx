import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";


const fetcher = async (regisId) => {
    const response = await axios.get(baseUrl + `/payment/orderbyRegistrasiId?registrasi_id=${regisId}`);    
    return response.data;
};

const fetcherTotal = async ([regisId, payer, id]) => {
    ///parameter regisId dan id isinya sama saja yaitu registarsi_id
    const response = await axios.get(baseUrl + `/payment/total?registrasi_id=${regisId}&payer=${payer}&id=${id}`);    
    return response.data;
};

const fetcherTotalResto = async (regisId) => {
    const response = await axios.get(baseUrl + `/payment/total-resto?registrasi_id=${regisId}`);    
    return response.data;
};

const postPayment=async(data)=>{
    await axios
        .post(baseUrl + `/payment`, data)
        .then((res) => {
            console.log("success saving payment data");
        })
        .catch((err) => console.log(err));
}

const updatePayment=async([id, data])=>{
    await axios
        .put(baseUrl + `/payment/edit/${id}`, data)
        .then((res) => {
            console.log("success updated payment data");
        })
        .catch((err) => console.log(err));
}
const updateSebagianPayment=async([id, data])=>{
    await axios
        .put(baseUrl + `/payment/edit-nilai/${id}`, data)
        .then((res) => {
            console.log("success updated nilai bayar payment data");
        })
        .catch((err) => console.log(err));
}

const deletePayment=async(id)=>{
    await axios
        .delete(baseUrl + `/payment/${id}`)
        .then((res) => {
            console.log("success deleted payment data");
        })
        .catch((err) => console.log(err));
}


///export

export const usePaymentOrderByRegistrasiIdData = (regisId,click) => {
    return useQuery(["payment-one",regisId], ()=>fetcher(regisId), {
        enabled:click,
    });
};

export const useTotalPaymentData = ([regisId, payer, id,click]) => {
    ///parameter regisId dan id isinya sama saja yaitu registarsi_id
    return useQuery(["payment-total",regisId, payer, id], ()=>fetcherTotal([regisId, payer, id]), {
        enabled:click,
    });
};

export const useTotalPaymentRestoData = (regisId,click) => {
    return useQuery(["payment-total-resto",regisId], ()=>fetcherTotalResto(regisId), {
        enabled:click,
    });
};

///CRUD
export const usePostPaymentData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postPayment,{
        onSuccess:()=>{
            queryClient.invalidateQueries("payment-one"); //utk refresh data    
            queryClient.invalidateQueries("payment-total"); //utk refresh data    
            queryClient.invalidateQueries("payment-total-resto"); //utk refresh data    

        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdatePaymentData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updatePayment,{
        onSuccess:()=>{
            queryClient.invalidateQueries("payment-one"); //utk refresh data    
            queryClient.invalidateQueries("payment-total"); //utk refresh data  
            queryClient.invalidateQueries("payment-total-resto"); //utk refresh data     

        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateSebagianPaymentData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateSebagianPayment,{
        onSuccess:()=>{
            queryClient.invalidateQueries("payment-one"); //utk refresh data    
            queryClient.invalidateQueries("payment-total"); //utk refresh data    
            queryClient.invalidateQueries("payment-total-resto"); //utk refresh data   

        },
        onError:(err)=>{console.log(err);}
    });
}


export const useDeletePaymentData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deletePayment,{
        onSuccess:()=>{
            queryClient.invalidateQueries("payment-one"); //utk refresh data    
            queryClient.invalidateQueries("payment-total"); //utk refresh data    
            queryClient.invalidateQueries("payment-total-resto"); //utk refresh data   

        },
        onError:(err)=>{console.log(err);}
    });
}
