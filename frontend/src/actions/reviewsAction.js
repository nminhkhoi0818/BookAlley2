import { axiosInstance, axiosPublicInstance } from "../utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addNewReview = createAsyncThunk(
  "review/add",
  async ({ product_id, content, rating, images }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const formData = new FormData();
      for (var i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
      formData.append("content", content);
      formData.append("rating", rating);
      const { data } = await axiosInstance.post(
        `/api/review/${product_id}`,
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductReview = createAsyncThunk(
  "review/get",
  async ({ product_id }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let { data } = await axiosPublicInstance.get(
        `/api/review/${product_id}`,
        config
      );
      // data.created_at = await Date.parse(date.created_at);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
