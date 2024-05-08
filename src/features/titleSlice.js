import { createSlice } from "@reduxjs/toolkit";

const titleSlice = createSlice({
    name: "title",
    initialState: {
        rTitle: "xxx",
    },
    reducers: {
        reduxUpdateTitle: (state, action) => {
            state.rTitle = action.payload.rTitle;
        },
    },
});

export const { reduxUpdateTitle } = titleSlice.actions;
export default titleSlice.reducer;
