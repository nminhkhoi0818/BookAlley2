import { createSlice } from "@reduxjs/toolkit";
import { getCategories, getProducts } from "../actions/productsAction";

const initialState = {
  loading: false,
  tags: [],
  products: [],
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.products = payload;
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.loading = false;
      state.products = [];
    });
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCategories.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.tags = payload;
    });
    builder.addCase(getCategories.rejected, (state) => {
      state.loading = false;
      state.products = [];
    });
  },
});

export default productSlice.reducer;
