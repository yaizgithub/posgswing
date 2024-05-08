import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/package-driving`);    
    return response.data;
};

const fetcherFree = async () => {
    const response = await axios.get(baseUrl + `/package-driving/free`);    
    return response.data;
};

const fetcherNotFree = async () => {
    const response = await axios.get(baseUrl + `/package-driving/notfree`);    
    return response.data;
};

const postPackageDriving=async(data)=>{
    await axios
        .post(baseUrl + `/package-driving`, data)
        .then((res) => {
            console.log("success saving package driving data");
        })
        .catch((err) => console.log(err));
}

const updatePackageDriving=async([id, data])=>{
    await axios
        .put(baseUrl + `/package-driving/edit/${id}`, data)
        .then((res) => {
            console.log("success updated package driving data");
        })
        .catch((err) => console.log(err));
}

const deletePackageDriving=async(id)=>{
    await axios
        .delete(baseUrl + `/package-driving/${id}`)
        .then((res) => {
            console.log("success updated package driving data");
        })
        .catch((err) => console.log(err));
}

///EXPORT
export const usePackageDrivingData = (click) => {
    return useQuery("package-driving", fetcher, {
        enabled:click,
    });
};
export const usePackageDrivingFreeData = (click) => {
    return useQuery("package-driving-free", fetcherFree, {
        enabled:click,
    });
};
export const usePackageDrivingNotFreeData = (click) => {
    return useQuery("package-driving-notfree", fetcherNotFree, {
        enabled:click,
    });
};


///CRUD
export const usePostPackageDrivingData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postPackageDriving,{
        onSuccess:()=>{
            queryClient.invalidateQueries("package-driving"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdatePackageDrivingData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updatePackageDriving,{
        onSuccess:()=>{
            queryClient.invalidateQueries("package-driving"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useDeletePackageDrivingData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deletePackageDriving,{
        onSuccess:()=>{
            queryClient.invalidateQueries("package-driving"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}


