import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../config/index";

export const getAccount = createAsyncThunk("account/getaccount", async () => {
  return await axios
    .get(baseUrl + "/account")
    .then((res) => res.data)
    .catch((err) => console.log(err));
});

const accountEntity = createEntityAdapter({
  selectId: (account) => account.id,
});

const accountSlice = createSlice({
  name: "account",
  initialState: accountEntity.getInitialState(),
  extraReducers: {
    [getAccount.fulfilled]: (state, action) => {
      accountEntity.setAll(state, action.payload);
    },
  },
});

export const accountSelectors = accountEntity.getSelectors(
  (state) => state.account
);
export default accountSlice.reducer;
