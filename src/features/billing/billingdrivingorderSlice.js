import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../config";

const initialState = {
    loading: false,
    data: [],
    error: "",
};

export const getBillingDrivingOrder = createAsyncThunk(
    "driving/getBillingDrivingOrder",
    async (reserId) => {
        const response = await axios.get(baseUrl + `/transaksi-driving/total?registrasi_id=${reserId}`);           
        return response.data.data;
    }
);

const billingdrivingorderSlice = createSlice({
    name: "billingdrivingorder",
    initialState,

    extraReducers: (builder) => {
        builder.addCase(getBillingDrivingOrder.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getBillingDrivingOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = "";
        });
        builder.addCase(getBillingDrivingOrder.rejected, (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = action.error.message;
        });
    },
});

export default billingdrivingorderSlice.reducer;
