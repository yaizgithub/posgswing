import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../../config";

const getRegistrasiVoucher = async () => {
    const response = await axios.get(baseUrl + `/voucher`);
    return response.data;
};
const getOneRegistrasiVoucher = async (id) => {
    const response = await axios.get(baseUrl + `/voucher/one/${id}`);
    return response.data;
};

const postRegistrasiVoucher=async(data)=>{
    await axios
        .post(baseUrl + `/voucher`, data)
        .then((res) => {
            console.log("success saving Registrasi voucher data");
        })
        .catch((err) => console.log(err));
}

const updateRegistrasiVoucher=async([id, data])=>{
    await axios
        .put(baseUrl + `/voucher/edit/${id}`, data)
        .then((res) => {
            console.log("success updated Registrasi voucher data");
        })
        .catch((err) => console.log(err));
}

const updateImageRegistrasiVoucher=async([id, data])=>{
    await axios
        .put(baseUrl + `/voucher/edit-image/${id}`, data)
        .then((res) => {
            console.log("success updated Registrasi voucher data");
        })
        .catch((err) => console.log(err));
}

const deleteRegistrasiVoucher=async(id)=>{
    await axios
        .delete(baseUrl + `/voucher/${id}`)
        .then((res) => {
            console.log("success deleted Registrasi voucher data");
        })
        .catch((err) => console.log(err));
}

///export list
export const useRegistrasiVoucherData = (click) => {
    return useQuery("voucher-registrasi", getRegistrasiVoucher, {
        refetchOnWindowFocus:false,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};

export const useOneRegistrasiVoucherData = (id, click) => {
    return useQuery(["one-voucher-registrasi", id], ()=> getOneRegistrasiVoucher(id), {
        refetchOnWindowFocus:false,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};

///CRUD
export const usePostRegistrasiVoucherData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postRegistrasiVoucher,{
        onSuccess:(data)=>{
            queryClient.invalidateQueries("voucher-registrasi"); //utk refresh data                    
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

export const useUpdateRegistrasiVoucherData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateRegistrasiVoucher,{
        onSuccess:(data)=>{
            queryClient.invalidateQueries("voucher-registrasi"); //utk refresh data                    
        },
        onError:(err)=>{console.log(err);}
    });
}
export const useUpdateImageRegistrasiVoucherData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateImageRegistrasiVoucher,{
        onSuccess:(data)=>{
            queryClient.invalidateQueries("voucher-registrasi"); //utk refresh data                    
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useDeleteRegistrasiVoucherData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deleteRegistrasiVoucher,{
        onSuccess:(data)=>{
            queryClient.invalidateQueries("voucher-registrasi"); //utk refresh data                    
        },
        onError:(err)=>{console.log(err);}
    });
}
