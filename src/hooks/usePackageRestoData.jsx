import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/package-resto`);    
    // console.log(response.data);
    return response.data;
};

const getPackageRestoGroupByKategori = async () => {
    const response = await axios.get(baseUrl + `/package-resto/groupbykategori`);    
    // console.log(response.data);
    return response.data;
};

const getPackageRestoGroupByKategoriAndClass = async (kategMenu) => {
    const response = await axios.get(baseUrl + `/package-resto/groupbykategori-class?categori_menu=${kategMenu}`);    
    // console.log(response.data);
    return response.data;
};

const getPackageRestoOrderByKategori = async (kategMenu) => {
    const response = await axios.get(baseUrl + `/package-resto/orderbykategori?categori_menu=${kategMenu}`);    
    // console.log(response.data);
    return response.data;
};

const getPackageRestoOrderByKategoriAndClass = async ([kategMenu, klasMenu]) => {
    const response = await axios.get(baseUrl + `/package-resto/orderbykategori-class?categori_menu=${kategMenu}&class_menu=${klasMenu}`);    
    // console.log(response.data);
    return response.data;
};

const postPackageResto=async(data)=>{
    await axios
        .post(baseUrl + `/package-resto`, data)
        .then((res) => {
            // console.log("success saving package resto data");
        })
        .catch((err) => console.log(err));
}

const updatePackageResto=async([id, data])=>{
    await axios
        .put(baseUrl + `/package-resto/edit/${id}`, data)
        .then((res) => {
            // console.log("success updated package resto data");
        })
        .catch((err) => console.log(err));
}
const updateImagePackageResto=async([id, data])=>{
    await axios
        .put(baseUrl + `/package-resto/upload/${id}`, data)
        .then((res) => {
            // console.log("success updated package resto data");
        })
        .catch((err) => console.log(err));
}

const deletePackageResto=async(id)=>{
    await axios
        .delete(baseUrl + `/package-resto/${id}`)
        .then((res) => {
            console.log("success updated package resto data");
        })
        .catch((err) => console.log(err));
}


///EXPORT
export const usePackageRestoData = (click) => {
    return useQuery("package-resto", fetcher, {
        refetchOnWindowFocus:false,
        enabled:click,
    });
};

export const usePackageRestoGroupByKategoriData = (click) => {
    return useQuery("package-resto-kategori-group", getPackageRestoGroupByKategori, {        
        enabled:click,
    });
};

export const usePackageRestoGroupByKategoriAndClassData = (kategMenu,click) => {
    return useQuery(["package-resto-kategori-class", kategMenu], ()=>getPackageRestoGroupByKategoriAndClass(kategMenu), {
        enabled:click,
    });
};

export const usePackageRestoOrderByKategoriData = (kategMenu,click) => {
    return useQuery(["package-resto-kategori", kategMenu], ()=>getPackageRestoOrderByKategori(kategMenu), {
        enabled:click,
    });
};

export const usePackageRestoOrderByKategoriAndClassData = ([kategMenu, klasMenu ,click]) => {
    return useQuery(["package-resto-kategoriclass", kategMenu, klasMenu], ()=>getPackageRestoOrderByKategoriAndClass([kategMenu, klasMenu]), {
        enabled:click,
    });
};


///CRUD
export const usePostPackageRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(postPackageResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("package-resto"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdatePackageRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updatePackageResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("package-resto"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useUpdateImagePackageRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(updateImagePackageResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("package-resto"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

export const useDeletePackageRestoData=()=>{
    const queryClient = useQueryClient();
    return useMutation(deletePackageResto,{
        onSuccess:()=>{
            queryClient.invalidateQueries("package-resto"); //utk refresh data            
        },
        onError:(err)=>{console.log(err);}
    });
}

