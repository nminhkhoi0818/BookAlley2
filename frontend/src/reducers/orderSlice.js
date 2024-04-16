import { createSlice } from "@reduxjs/toolkit";
import { addOrder, getOrders } from "../actions/orderAction";

const initialState = {
  loading: false,
  orders: [],
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.orders = payload;
      })
      .addCase(getOrders.rejected, (state) => {
        state.loading = false;
        state.products = [];
      })
      .addCase(addOrder.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(addOrder.fulfilled, (state) => {
        (state.loading = false), (state.success = true);
      })
      .addCase(addOrder.rejected, (state, { payload }) => {
        (state.loading = false), (state.error = payload);
      });
  },
});

export default orderSlice.reducer;
