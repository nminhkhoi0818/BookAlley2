import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  voucher: [],
  error: null,
  success: false,
};

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

const voucherReducer = voucherSlice.reducer;

export default voucherReducer;
