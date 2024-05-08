import { createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../config/index";
const baseurlSlice = createSlice({
  name: "baseurl",
  initialState: {
    baseUrl: baseUrl,
  },
  reducers: {
    apiUrl: (state) => {
      //   eslint-disable-next-line no-unused-expressions
      state.baseUrl;
    },
  },
});

export const { apiUrl } = baseurlSlice.actions;

export default baseurlSlice.reducer;
