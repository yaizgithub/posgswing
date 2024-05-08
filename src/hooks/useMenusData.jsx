import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "../config";

const getMenus = async () => {
    const response = await axios.get(baseUrl + `/usermenu/menus`);
    return response.data;
};

///export
export const useMenusData = (click) => {
    return useQuery("menus", getMenus, {
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};
