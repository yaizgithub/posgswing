import axios from "axios";
import { useQuery } from "react-query";
import { baseUrl } from "../config";

const getRevenue = async ([date1, date2]) => {
    const response = await axios.get(baseUrl + `/revenue?date1=${date1}&date2=${date2}`);    
    return response.data;
};

const getRevenuePayment = async ([date1, date2]) => {
    const response = await axios.get(baseUrl + `/revenue/payment?date1=${date1}&date2=${date2}`);    
    return response.data;
};

const getDetailsRevenuePayment = async ([date1, date2, groupPayment]) => {
    const response = await axios.get(baseUrl + `/revenue/payment-details?date1=${date1}&date2=${date2}&group_payment=${groupPayment}`);    
    return response.data;
};


export const useRevenueData = ([date1, date2],click) => {
    return useQuery(["revenue", date1, date2], ()=>getRevenue([date1, date2]), {
        enabled:click,
    });
};

export const useRevenuePaymentData = ([date1, date2],click) => {
    return useQuery(["revenue-payment", date1, date2], ()=>getRevenuePayment([date1, date2]), {
        enabled:click,
    });
};

export const useDetailsRevenuePaymentData = ([date1, date2, groupPayment],click) => {
    return useQuery(["revenue-payment-details", date1, date2, groupPayment], ()=>getDetailsRevenuePayment([date1, date2, groupPayment]), {
        enabled:click,
    });
};
