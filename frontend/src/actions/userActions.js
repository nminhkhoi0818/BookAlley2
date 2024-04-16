import { axiosInstance, axiosPublicInstance } from "../utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUser = createAsyncThunk(
  "user/get",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let { data } = await axiosInstance.get(`api/user`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "user/add-address",
  async (
    { fullname, phone, city, district, ward, address, alias, type },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axiosInstance.post(
        `api/user/address`,
        { fullname, phone, city, district, ward, address, alias, type },
        config
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAddress = createAsyncThunk(
  "user/get-address",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/api/user/address`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
