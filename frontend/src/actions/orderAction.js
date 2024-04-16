import { axiosInstance } from "../utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getOrders = createAsyncThunk("order/get", async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let { data } = await axiosInstance.get(`api/order/user`, config);
    return data;
  } catch (error) {
    return error;
  }
});

export const addOrder = createAsyncThunk(
  "order/add",
  async (
    { voucher, items, shipping_info, shipping_method, payment_method },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let { data } = await axiosInstance.post(
        `/api/order`,
        { voucher, items, shipping_info, shipping_method, payment_method },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
