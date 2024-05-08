import { createSlice } from "@reduxjs/toolkit";

const mymatrixselectedSlice = createSlice({
    name: "mymatrixselected",
    initialState: {
        matrixSelected: [],
    },
    reducers: {
        reduxUpdateMatrixSelected: (state, action) => {
            state.matrixSelected = action.payload.matrixSelected;
        },
    },
});

export const {
    reduxUpdateMatrixSelected,
} = mymatrixselectedSlice.actions;
export default mymatrixselectedSlice.reducer;
