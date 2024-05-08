import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../../config";

// const fetcher = async () => {
//     const response = await axios.get(baseUrl + `/restoran?orderbydate`);
//     return response.data;
// };

// const fetcherOne = async (id) => {
//     const response = await axios.get(baseUrl + `/restoran?orderbyid=${id}`);
//     return response.data;
// };

// const postRestoranData =async(data)=>{
//     await axios.post(baseUrl+`/restoran`, data).then((res)=>{
//         console.log("berhasil menambah data restoran");
//     }).catch((err)=>console.log(err));
// }

// const updateRestoranData =async([id, data])=>{
//     await axios.put(baseUrl+`/restoran/edit/${id}`, data).then((res)=>{
//         console.log("berhasil merubah data restoran");
//     }).catch((err)=>console.log(err));
// }

// const deleteRestoranData =async(id)=>{
//     await axios.post(baseUrl+`/restoran/${id}`).then((res)=>{
//         console.log("berhasil menghapus data restoran");
//     }).catch((err)=>console.log(err));
// }





///Export
// export const useRestoranData = (click) => {
//     return useQuery("restoran", fetcher, {
//         refetchOnWindowFocus: false,
//         enabled: click,
//     });
// };

// export const useOneRestoranData = (id, click) => {
//     return useQuery(["restoran-one", id], () => fetcherOne(id), {
//         refetchOnWindowFocus: false,
//         enabled: click,
//     });
// };



// ///crud export
// export const usePostRestoranData=()=>{
//     const queryClient = useQueryClient();
//     return useMutation(postRestoranData,{
//         onSuccess:()=>{
//             queryClient.invalidateQueries("restoran"); //utk refresh data            
//         },
//         onError:(err)=>{console.log(err);}
//     });
// }

// export const useUpdateRestoranData=()=>{
//     const queryClient = useQueryClient();
//     return useMutation(updateRestoranData,{
//         onSuccess:()=>{
//             queryClient.invalidateQueries("restoran"); //utk refresh data            
//         },
//         onError:(err)=>{console.log(err);}
//     });
// }

// export const useDeleteRestoranData=()=>{
//     const queryClient = useQueryClient();
//     return useMutation(deleteRestoranData,{
//         onSuccess:()=>{
//             queryClient.invalidateQueries("restoran"); //utk refresh data            
//         },
//         onError:(err)=>{console.log(err);}
//     });
// }

