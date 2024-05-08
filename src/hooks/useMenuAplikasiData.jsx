import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";

const getMenuAplikasi = async () => {
    const response = await axios.get(baseUrl + `/menuaplikasi`);
    return response.data;
};

const getNestedMenu = async () => {
    const response = await axios.get(baseUrl + `/menuaplikasi/nestedmenu`);
    return response.data;
};

///export
export const useMenuAplikasiData = (click) => {
    return useQuery("menuaplikasi", getMenuAplikasi, {
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};

export const useNestedMenuData = (click) => {
    return useQuery("nestedmenu", getNestedMenu, {
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};
