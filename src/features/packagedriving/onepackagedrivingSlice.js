import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../config";

const initialState = {
    loading: false,
    data: [],
    error: "",
};

export const getOnePackageDriving = createAsyncThunk(
    "package/getOnePackageDriving",
    async (id) => {
        const response = await axios.get(baseUrl + `/package-driving/orderbyid?id=${id}`);   
        return response.data.data;
    }
);

const onepackagedrivingSlice = createSlice({
    name: "onepackagedriving",
    initialState,

    extraReducers: (builder) => {
        builder.addCase(getOnePackageDriving.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getOnePackageDriving.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = "";
        });
        builder.addCase(getOnePackageDriving.rejected, (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = action.error.message;
        });
    },
});

export default onepackagedrivingSlice.reducer;
