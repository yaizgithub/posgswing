import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        userid: 32, //localStorage.getItem("userid"), 
        username: "default", //localStorage.getItem("username"),
        name: "null",//localStorage.getItem("name") ?? "name",
        token: "",
        role: "", //localStorage.getItem("role"),
    },
    reducers: {
        update: (state, action) => {
            state.userid = action.payload.userid;
            state.username = action.payload.username;
            state.token = action.payload.token;
            state.role = action.payload.role;
        },
    },
});

export const { update } = authSlice.actions;
export default authSlice.reducer;
