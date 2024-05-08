import { createSlice } from "@reduxjs/toolkit";

const mypaymentSlice = createSlice({
    name: "mypayment",
    initialState: {
        drivingPrice:0,
        drivingDisc:0,        
        drivingPpn:0,        
        drivingSubTotal:0,        

        restoPrice:0,
        restoDisc:0,        
        restoSrvchg:0,
        restoPb1:0,        
        restoSubTotal:0,  
        
        totalOrder:0,
        totalDisc:0,
        discPersenTambahan:0,
        discTambahan:0,
        totalTagihan:0,
        sudahBayar:0,
    },
    reducers: {
        reduxUpdateTotalDriving: (state, action) => {
            state.drivingPrice = action.payload.drivingPrice;
            state.drivingDisc = action.payload.drivingDisc;            
            state.drivingPpn = action.payload.drivingPpn;            
            state.drivingSubTotal = action.payload.drivingSubTotal;     
        },

        reduxUpdateTotalResto: (state, action) => {
            state.restoPrice = action.payload.restoPrice;            
            state.restoDisc = action.payload.restoDisc;            
            state.srvchg = action.payload.srvchg;            
            state.restoPb1 = action.payload.restoPb1;            
            state.restoSubTotal = action.payload.restoSubTotal;            
        },

        reduxGetTotals:(state, action)=>{
            // state.totalOrder = action.payload.drivingSubTotal +action.payload.restoSubTotal;
            // let{total}=state.orderItems.reduce(
            //     (orderTotal, orderItem)=>{
            //     const {dTotal, rTotal} = orderItem;
            //     const tot = dTotal + rTotal;

            //     orderTotal.total = tot;
            //     return orderTotal;
            // },{
            //     total: 0,
            // })
            state.discPersenTambahan = action.payload.discPersenTambahan;
            state.sudahBayar = action.payload.sudahBayar;
            
            state.totalOrder = state.drivingSubTotal + state.restoSubTotal;
            state.totalDisc = 0;//state.drivingDisc + state.restoDisc;
            state.discTambahan = (state.totalOrder - state.totalDisc) * (state.discPersenTambahan/100);
            state.totalTagihan = state.totalOrder - state.totalDisc - state.discTambahan;
        }
    },
});

export const { reduxUpdateTotalDriving, reduxUpdateTotalResto, reduxGetTotals } = mypaymentSlice.actions;
export default mypaymentSlice.reducer;
