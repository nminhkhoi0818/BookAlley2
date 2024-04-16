import { axiosInstance, axiosPublicInstance } from "../utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axiosInstance.post(
        `api/auth/register`,
        { username, email, password },
        config
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axiosInstance.post(
        `/api/auth/login`,
        { email, password },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosPublicInstance.post(`/api/auth/refresh`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userForgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async ({ email }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axiosPublicInstance.post(
        `/api/auth/forgot-password`,
        { email },
        config
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userResetPassword = createAsyncThunk(
  "auth/reset-password",
  async ({ id, token, new_password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axiosPublicInstance.post(
        `/api/auth/reset-password`,
        { id, token, new_password },
        config
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axiosPublicInstance.post(
        `/api/auth/logout`,
        config
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
