import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../config";

const initialState = {
    loading: false,
    data: [],
    error: "",
};

export const getOnePackageResto = createAsyncThunk(
    "package/getOnePackageResto",
    async (id) => {
        const response = await axios.get(baseUrl + `/package-resto/orderbyid?id=${id}`);   
        return response.data.data;
    }
);

const onepackagerestoSlice = createSlice({
    name: "onepackageresto",
    initialState,

    extraReducers: (builder) => {
        builder.addCase(getOnePackageResto.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getOnePackageResto.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = "";
        });
        builder.addCase(getOnePackageResto.rejected, (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = action.error.message;
        });
    },
});

export default onepackagerestoSlice.reducer;
