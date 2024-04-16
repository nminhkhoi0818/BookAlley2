import { createSlice } from "@reduxjs/toolkit";
import {
  getOrdersForSeller,
  getProductsForSeller,
} from "../actions/sellerAction";

const initialState = {
  loading: false,
  infos: {},
  orders: {},
  error: null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProductsForSeller.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProductsForSeller.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.infos = payload;
    });
    builder.addCase(getProductsForSeller.rejected, (state) => {
      state.loading = false;
      state.infos = {};
    });
    builder.addCase(getOrdersForSeller.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOrdersForSeller.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = payload;
    });
    builder.addCase(getOrdersForSeller.rejected, (state) => {
      state.loading = false;
      state.orders = {};
    });
  },
});

export default sellerSlice.reducer;
