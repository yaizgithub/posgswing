import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";

const getSplitBillByNama = async (nama) => {
    const response = await axios.get(baseUrl + `/splitbill/${nama}`);    
    return response.data;
};

const getTotalSplitBillByNama = async (nama) => {
    const response = await axios.get(baseUrl + `/splitbill/total/${nama}`);    
    return response.data;
};

const postSplitBill=async(data)=>{
    await axios
        .post(baseUrl + `/splitbill`, data)
        .then((res) => {
            console.log("success saving splitbill data");
        })
        .catch((err) => console.log(err));
}

///export
export const useSplitBillByNamaData = (nama, click) => {
    return useQuery(["splitbill", nama], ()=>getSplitBillByNama(nama), {
        // refetchOnWindowFocus: false,
        enabled: click,
    });
};

export const useTotalSplitBillByNamaData = (nama, click) => {
    return useQuery(["total-splitbill", nama], ()=>getTotalSplitBillByNama(nama), {
        // refetchOnWindowFocus: false,
        enabled: click,
    });
};

///CRUD
export const usePostSplitBillData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postSplitBill,{
        onSuccess:()=>{
            queryClient.invalidateQueries("splitbill"); //utk refresh data    
            queryClient.invalidateQueries("total-splitbill"); //utk refresh data                
        },
        onError:(err)=>{console.log(err);}
    });
}
