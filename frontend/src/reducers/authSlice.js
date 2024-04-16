import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  userLogin,
  userForgotPassword,
  userResetPassword,
  refreshToken,
} from "../actions/authAction";

const initialState = {
  loading: false,
  userInfo: null,
  access_token: null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = false;
      state.userInfo = null;
      state.access_token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(registerUser.fulfilled, (state) => {
        (state.loading = false), (state.success = true);
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        (state.loading = false), (state.error = payload);
      })
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.access_token = payload.access_token;
      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(userForgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userForgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(userForgotPassword.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(userResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userResetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(userResetPassword.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.access_token = payload.access_token;
      })
      .addCase(refreshToken.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
