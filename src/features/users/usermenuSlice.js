import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../config";

const initialState = {
    loading: false,
    data: [],
    error: "",
};

export const getOneUserMenu = createAsyncThunk(
    "usermenu",
    async (userid) => {
        const response = await axios.get(baseUrl + `/usermenu/${userid}`);   
        return response.data.data;
    }
);

const usermenuSlice = createSlice({
    name: "usermenu",
    initialState,

    extraReducers: (builder) => {
        builder.addCase(getOneUserMenu.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getOneUserMenu.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = "";
        });
        builder.addCase(getOneUserMenu.rejected, (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = action.error.message;
        });
    },
});

export default usermenuSlice.reducer;
