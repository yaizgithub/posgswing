import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";

const fetcher = async (token) => {    
    const config = {
        headers: {
          'Authorization': `Bearer ${token}`, // Tambahkan header Authorization dengan token bearer
          'Content-Type': 'application/json' // Atur tipe konten sesuai kebutuhan
        }
      };

    const response = await axios.get(baseUrl + `/users`, config);
    return response.data;
};
const fetcherVoid = async () => {
    const response = await axios.get(baseUrl + `/users/role`);
    return response.data;
};

const postUserRegistrasi = async (data) => {
    await axios.post(baseUrl + `/users/register`, data).then((res)=>{
        console.log("berhasil menambah user");
    }).catch((err)=>console.log(err));    
};

const updateUserRegistrasi = async ([id,data]) => {
    await axios.put(baseUrl + `/users/edit/${id}`, data).then((res)=>{
        console.log("berhasil merubah user");
    }).catch((err)=>console.log(err));    
};

const deleteUserRegistrasi = async (id) => {
    await axios.delete(baseUrl + `/users/${id}`).then((res)=>{
        console.log("berhasil menghapus user");
    }).catch((err)=>console.log(err));    
};


///Export
export const useUserRegistrasiData = (token, click) => {
    return useQuery("users", ()=>fetcher(token), {
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};
export const useUserVoidRegistrasiData = (click) => {
    return useQuery("users-role", fetcherVoid, {
        refetchOnWindowFocus:false,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};


///CRUD
export const usePostUserRegistrasiData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postUserRegistrasi,{
        onSuccess:()=>{
            queryClient.invalidateQueries("users"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdateUserRegistrasiData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateUserRegistrasi,{
        onSuccess:()=>{
            queryClient.invalidateQueries("users"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useDeleteUserRegistrasiData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deleteUserRegistrasi,{
        onSuccess:()=>{
            queryClient.invalidateQueries("users"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

