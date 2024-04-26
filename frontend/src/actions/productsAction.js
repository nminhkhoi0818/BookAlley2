import { axiosInstance, axiosPublicInstance } from "../utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCategories = createAsyncThunk("categories", async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let { data } = await axiosPublicInstance.get(`api/book/tags`, config);
    return data;
  } catch (error) {
    return error;
  }
});

export const getProducts = createAsyncThunk("products", async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let { data } = await axiosPublicInstance.get(
      `api/book/list-books?limit=30`,
      config
    );
    return data;
  } catch (error) {
    return error;
  }
});

export const addProduct = createAsyncThunk(
  "products/add",
  async (
    {
      name,
      author,
      description,
      price,
      translator,
      publisher,
      year_published,
      weight,
      size,
      pages,
      binding_method,
      instock,
      language,
      tags,
      image,
    },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      let { data } = await axiosInstance.post(
        `api/book`,
        {
          name,
          author,
          description,
          price,
          translator,
          publisher,
          year_published,
          weight,
          size,
          pages,
          binding_method,
          instock,
          language,
          tags,
          image,
        },
        config
      );
      return data;
    } catch (error) {
      console.log(error);
      rejectWithValue(error.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "seller/order/delete",
  async ({ product_id }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let { data } = await axiosInstance.delete(
        `/api/book/${product_id}`,
        config
      );
      console.log(data);
      return { product_id };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
