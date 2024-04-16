import { axiosInstance } from "../utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getProductsForSeller = createAsyncThunk(
  "seller/products",
  async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let { data } = await axiosInstance.get(`/api/shop/get-detail`, config);
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const getOrdersForSeller = createAsyncThunk(
  "seller/orders",
  async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let { data } = await axiosInstance.get(`/api/order/shop`, config);
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const processOrderSeller = createAsyncThunk(
  "seller/order/process",
  async ({ order_id, status }, { rejectWithValue }) => {
    console.log(order_id);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let { data } = await axiosInstance.patch(
        `/api/order/${order_id}`,
        { status },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
