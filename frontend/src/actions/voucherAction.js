import { axiosInstance } from "../utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getVoucher = createAsyncThunk(
  "voucher/get",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let { data } = await axiosInstance.get(`/api/voucher`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
