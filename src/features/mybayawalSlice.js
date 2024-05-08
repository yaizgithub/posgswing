import { createSlice } from "@reduxjs/toolkit";

const mybayawalSlice = createSlice({
    name: "mybayawal",
    initialState: {
        bayAwal: "",
    },
    reducers: {
        reduxUpdateBayAwal: (state, action) => {
            state.bayAwal = action.payload.bayAwal;
        },
    },
});

export const {
    reduxUpdateBayAwal,
} = mybayawalSlice.actions;
export default mybayawalSlice.reducer;
