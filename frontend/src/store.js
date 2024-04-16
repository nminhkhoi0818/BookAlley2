import { configureStore, createSlice } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice.js";
import productSlice from "./reducers/productSlice.js";
import reviewSlice from "./reducers/reviewSlice.js";
import shopSlice from "./reducers/sellerSlice.js";
import cartSlice from "./reducers/cart/cartSlice.js";
import voucherReducer from "./reducers/voucherSlice.js";
import orderReducer from "./reducers/orderSlice.js";
import userReducer from "./reducers/userSlice.js";
import sellerSlice from "./reducers/sellerSlice.js";

export default configureStore({
  reducer: {
    auth: authReducer,
    products: productSlice,
    reviews: reviewSlice,
    seller: sellerSlice,
    cart: cartSlice,
    voucher: voucherReducer,
    orders: orderReducer,
    user: userReducer,
  },
});
