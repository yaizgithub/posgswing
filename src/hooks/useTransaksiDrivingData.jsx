import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";

const fetcherOrderByRegistrasiId = async (regisId) => {
    const response = await axios.get(baseUrl + `/transaksi-driving/orderByRegistrasiId?registrasi_id=${regisId}`);
    return response.data;
};

// const postReservasi=async(data)=>{
//         await axios
//             .post(baseUrl + `/reservasi`, data)
//             .then((res) => {
//                 console.log("success saving reservasi data");
//             })
//             .catch((err) => console.log(err));
// }

// const deleteReservasi=async(id)=>{
//     await axios
//         .delete(baseUrl + `/reservasi/${id}`)
//         .then((res) => {
//             console.log("success deleted reservasi data");
//         })
//         .catch((err) => console.log(err));
// }


///export list
export const useTransaksiDrivingOrderByRegistrasiIdData = (regisId,click) => {
    return useQuery(["transaksi-driving-byregisid", regisId], ()=>fetcherOrderByRegistrasiId(regisId), {
        enabled:click,
    });
};

// export const usePostReservasiData=()=>{
//     const queryClient = useQueryClient();
//     return useMutation(postReservasi,{
//         onSuccess:()=>{
//             queryClient.invalidateQueries("reservasi"); //utk refresh data            
//         },
//         onError:(err)=>{console.log(err);}
//     });
// }

// export const useDeleteReservasiData=()=>{
//     const queryClient = useQueryClient();
//     return useMutation(deleteReservasi,{
//         onSuccess:()=>{
//             queryClient.invalidateQueries("reservasi"); //utk refresh data            
//         },
//         onError:(err)=>{console.log(err);}
//     });
// }