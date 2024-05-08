import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from "@reduxjs/toolkit";
import { baseUrl } from "../../config/index";
import axios from "axios";

export const getPersens = createAsyncThunk("persens/getPersens", async () => {
    const response = await axios.get(baseUrl + `/persens`);
    // console.log(response.data);
    return response.data;
});

const persensEntity = createEntityAdapter({
    selectId: (persens) => persens.id,
});

const persenSlice = createSlice({
    name: "persens",
    initialState: persensEntity.getInitialState(),
    extraReducers: {
        // get
        [getPersens.pending]: (state, action) => {
            state.getStatus = "loading";
        },
        [getPersens.fulfilled]: (state, action) => {
            persensEntity.setAll(state, action.payload);
            state.getStatus = "success";
        },
        [getPersens.rejected]: (state, action) => {
            state.getStatus = "rejected";
            state.error = action.error.message;
        },
        // end get
    },
});

export const persensSelectors = persensEntity.getSelectors(
    (state) => state.persens
);
export default persenSlice.reducer;
