import { createSlice } from "@reduxjs/toolkit";

const mytotalbayarSlice = createSlice({
    name: "mytotalbayar",
    initialState: {
        sisaBayar:0,
        discKasir:0,        
    },
    reducers: {
        reduxUpdateTtotalBayar: (state, action) => {
            state.sisaBayar = action.payload.sisaBayar;
            state.discKasir = action.payload.discKasir;            
        },
    },
});

export const { reduxUpdateTtotalBayar } = mytotalbayarSlice.actions;
export default mytotalbayarSlice.reducer;
