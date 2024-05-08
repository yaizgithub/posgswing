import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";

const fetcher = async (iduser) => {
  const response = await axios.get(baseUrl + `/usermenuaplikasi/nestedmenuoneuser?id_user=${iduser}`);
  // console.log(response.data);
  return response.data;
};

const postUserMenuAplikasi = async (data) => {
  await axios.post(baseUrl + `/usermenuaplikasi`, data).then((res)=>{
      console.log("berhasil menambah usermenuaplikasi");
  }).catch((err)=>console.log(err));    
};

const deleteUserMenuAplikasi = async (id) => {
  await axios.delete(baseUrl + `/usermenuaplikasi/${id}`).then((res)=>{
      console.log("berhasil menghapus usermenuaplikasi");
  }).catch((err)=>console.log(err));    
};



///Export
export const useOneUserMenuAplikasi = (iduser, click) => {
  return useQuery(["nested-menu", iduser], () => fetcher(iduser), {
    refetchOnWindowFocus: false,
    enabled: click,
    // refetchOnMount: "always",
    // refetchOnWindowFocus: "always",
  });
};

///CRUD
export const usePostUserMenuAplikasiData=()=>{
  const queryClient = useQueryClient();
  return useMutation(postUserMenuAplikasi,{
      onSuccess:()=>{
          queryClient.invalidateQueries("nested-menu"); //utk refresh data            
      },
      onError:(err)=>{console.log(err);}
  });
}

export const useDeleteUserMenuAplikasiData=()=>{
  const queryClient = useQueryClient();
  return useMutation(deleteUserMenuAplikasi,{
      onSuccess:()=>{
          queryClient.invalidateQueries("nested-menu"); //utk refresh data            
      },
      onError:(err)=>{console.log(err);}
  });
}

