import { createSlice } from "@reduxjs/toolkit";
import {
  getOrdersForSeller,
  getProductsForSeller,
} from "../actions/sellerAction";
import { deleteProduct } from "../actions/productsAction";

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
    builder.addCase(deleteProduct.fulfilled, (state, { payload }) => {
      state.infos.listings.map((product) => product._id !== payload.product_id);
    });
  },
});

export default sellerSlice.reducer;
