import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    dataPoDetails: [],
    error: "",
};

export const getPoDetail = createAsyncThunk(
    "podetail/getPoDetail",
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
        // console.log(response.data.data[1]);
        return response.data.data[i].details;
    }
);

const podetailSlice = createSlice({
    name: "podetail",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getPoDetail.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getPoDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.dataPoDetails = action.payload;
            state.error = "";
        });
        builder.addCase(getPoDetail.rejected, (state, action) => {
            state.loading = false;
            state.dataPoDetails = [];
            state.error = action.error.message;
        });
    },
});

export default podetailSlice.reducer;
