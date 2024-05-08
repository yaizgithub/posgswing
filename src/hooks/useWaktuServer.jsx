import axios from "axios";
import { useQuery } from "react-query";
import { baseUrl } from "../config";

const fetcher = async () => {
    const response = await axios.get(baseUrl + `/waktu-server`);
    return response.data;
};

export const useWaktuServerData = (click) => {
    return useQuery("waktu-server", fetcher, {
        refetchOnWindowFocus:false,
        enabled:click,
        // refetchOnMount: "always",
        // refetchOnWindowFocus: "always",
    });
};

