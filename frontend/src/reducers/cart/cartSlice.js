import { createSlice } from "@reduxjs/toolkit";
import { addCart, getCart, removeItems } from "../../actions/cartAction";

const initialState = {
  loading: false,
  cart: [],
  error: null,
  success: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.loading = false;
      state.cart = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCart.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(addCart.fulfilled, (state) => {
        (state.loading = false), (state.success = true);
      })
      .addCase(addCart.rejected, (state, { payload }) => {
        (state.loading = false), (state.error = payload);
      })
      .addCase(getCart.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(getCart.fulfilled, (state, { payload }) => {
        (state.loading = false), (state.cart = payload), (state.success = true);
      })
      .addCase(getCart.rejected, (state, { payload }) => {
        (state.loading = false), (state.error = payload);
      })
      .addCase(removeItems.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(removeItems.fulfilled, (state) => {
        (state.loading = false), (state.success = true);
      })
      .addCase(removeItems.rejected, (state, { payload }) => {
        (state.loading = false), (state.error = payload);
      });
  },
});

export const { clearCart } = cartSlice.actions;
const cartReducer = cartSlice.reducer;

export default cartReducer;
