import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../config";

const initialState = {
    loading: false,
    data: [],
    error: "",
};

export const getOneRegistrasi = createAsyncThunk(
    "registrasi/getOneRegistrasi",
    async (id) => {
        const response = await axios.get(baseUrl + `/registrasi/orderbyid?id=${id}`);  
        // console.log(response.data.data); 
        return response.data.data;
    }
);

const oneregistrasiSlice = createSlice({
    name: "oneregistrasi",
    initialState,

    extraReducers: (builder) => {
        builder.addCase(getOneRegistrasi.pending, (state) => {
            state.loading = true;            
        });
        builder.addCase(getOneRegistrasi.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = "";
        });
        builder.addCase(getOneRegistrasi.rejected, (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = action.error.message;
        });
    },
});

export default oneregistrasiSlice.reducer;
