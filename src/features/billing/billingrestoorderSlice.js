import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../config";

const initialState = {
    loading: false,
    data: [],
    error: "",
};

export const getBillingRestoOrder = createAsyncThunk(
    "resto/getBillingRestoOrder",
    async (reserId) => {
        const response = await axios.get(baseUrl + `/transaksi-resto/total?registrasi_id=${reserId}`);           
        return response.data.data;
    }
);

const billingrestoorderSlice = createSlice({
    name: "billingrestoorder",
    initialState,

    extraReducers: (builder) => {
        builder.addCase(getBillingRestoOrder.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getBillingRestoOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = "";
        });
        builder.addCase(getBillingRestoOrder.rejected, (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = action.error.message;
        });
    },
});

export default billingrestoorderSlice.reducer;
