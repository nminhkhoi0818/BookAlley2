import { axiosInstance, axiosPublicInstance } from "../utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addCart = createAsyncThunk(
  "cart/add",
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let { data } = await axiosInstance.post(
        `/api/cart`,
        { product_id, quantity },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCart = createAsyncThunk(
  "cart/get",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let { data } = await axiosInstance.get(`/api/cart`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const modifyItems = createAsyncThunk(
  "cart/modify-item",
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let { data } = await axiosInstance.post(
        `/api/cart`,
        { product_id, quantity },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeItems = createAsyncThunk(
  "cart/remove-item",
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let { data } = await axiosInstance.delete(
        `/api/cart`,
        { data: { product_id, quantity } },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
