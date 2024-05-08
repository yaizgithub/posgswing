import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";

const fetcher = async (id) => {
    const response = await axios.get(baseUrl + `/usermenu/${id}`);
    // console.log(response.data);
    return response.data;
};

const postUserMenu = async (data) => {
    await axios.post(baseUrl + `/usermenu`, data).then((res)=>{
        console.log("berhasil menambah usermenu");
    }).catch((err)=>console.log(err));    
};

const deleteUserMenu = async (id) => {
    await axios.delete(baseUrl + `/usermenu/${id}`).then((res)=>{
        console.log("berhasil menghapus usermenu");
    }).catch((err)=>console.log(err));    
};


///Export
export const useOneUserMenu = (id, click) => {
    return useQuery(["one-usermenu", id], ()=>fetcher(id), {
        refetchOnWindowFocus:false,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};


///CRUD
export const usePostUserMenuData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postUserMenu,{
        onSuccess:()=>{
            queryClient.invalidateQueries("one-usermenu"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useDeleteUserMenuData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deleteUserMenu,{
        onSuccess:()=>{
            queryClient.invalidateQueries("one-usermenu"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}