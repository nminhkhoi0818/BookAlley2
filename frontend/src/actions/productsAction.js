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
      `api/book/list?limit=30`,
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
