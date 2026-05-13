import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";           // ++ thêm
import profileReducer from "./profileSlice";
import forgotPasswordReducer from "./forgotPasswordSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,                           // ++ thêm
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
  },
});

export default store;