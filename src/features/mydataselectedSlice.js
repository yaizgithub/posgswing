import { createSlice } from "@reduxjs/toolkit";

const mydataselectedSlice = createSlice({
    name: "mydataselected",
    initialState: {
        numberIdentifikasi: "",
        dataSelected: [],
        nomorBay: "",
        qtyDriving: 0,
    },
    reducers: {
        reduxUpdateSelected: (state, action) => {
            state.dataSelected = action.payload.dataSelected;
        },
        reduxUpdateNumberIdentifikasi: (state, action) => {
            state.numberIdentifikasi = action.payload.numberIdentifikasi;
        },
        reduxUpdateNomorBay: (state, action) => {
            state.nomorBay = action.payload.nomorBay;
        },
        reduxUpdateQtyDriving: (state, action) => {
            state.qtyDriving = action.payload.qtyDriving;
        },
    },
});

export const {
    reduxUpdateSelected,
    reduxUpdateNumberIdentifikasi,
    reduxUpdateNomorBay,
    reduxUpdateQtyDriving,
} = mydataselectedSlice.actions;
export default mydataselectedSlice.reducer;
