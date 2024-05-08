import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import titleReducer from "../features/titleSlice";
import mydataselectedReducer from "../features/mydataselectedSlice";
import onepackagedrivingReducer from "../features/packagedriving/onepackagedrivingSlice";
import onepackagerestoReducer from "../features/packageresto/onepackagerestoSlice";
import mytotalbayarReducer from "../features/mytotalbayarSlice";
import mypaymentReducer from "../features/mypaymentSlice";
import billingdrivingorderReducer from "../features/billing/billingdrivingorderSlice";
import billingrestoorderReducer from "../features/billing/billingrestoorderSlice";
import mymatrixselectedReducer from "../features/mymatrixselectedSlice";
import usermenuReducer from "../features/users/usermenuSlice";
import oneregistrasiReducer from "../features/registrasi/oneregistrasiSlice";
import mybayawalReducer from "../features/mybayawalSlice";



export const store = configureStore({
    reducer: {
        auth: authReducer,
        title: titleReducer,
        mydataselected: mydataselectedReducer,
        onepackagedriving: onepackagedrivingReducer,
        onepackageresto: onepackagerestoReducer,
        mytotalbayar: mytotalbayarReducer,
        mypayment: mypaymentReducer,
        billingdrivingorder: billingdrivingorderReducer,
        billingrestoorder: billingrestoorderReducer,
        mymatrixselected: mymatrixselectedReducer,
        usermenu: usermenuReducer,
        oneregistrasi: oneregistrasiReducer,
        mybayawal: mybayawalReducer,
        
        
    },
});
