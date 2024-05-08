import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    dataPO: [],
    error: "",
};

export const getPoByTanggal = createAsyncThunk(
    "pobytanggal/getPoByTanggal",
    async (i) => {
        const response = await axios.get(
            `https://webservice.sinargalesong.net/public/api/purchaseOrderByCompany?company=5&date1=2023-05-01&date2=2023-09-01`,
            {
                headers: {
                    Authentication:
                        "7sVhhlxEISqD9kjV05cGdE4a67I7E2yzxIydlUf0f1rQafAQffyJUj8xxzD5",
                },
            }
        );
        return response.data.data;
    }
);

const pobytanggalSlice = createSlice({
    name: "pobytanggal",
    initialState,

    extraReducers: (builder) => {
        builder.addCase(getPoByTanggal.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getPoByTanggal.fulfilled, (state, action) => {
            state.loading = false;
            state.dataPO = action.payload;
            state.error = "";
        });
        builder.addCase(getPoByTanggal.rejected, (state, action) => {
            state.loading = false;
            state.dataPO = [];
            state.error = action.error.message;
        });
    },
});

export default pobytanggalSlice.reducer;
