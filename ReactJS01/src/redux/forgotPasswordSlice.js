import {
    createSlice
} from "@reduxjs/toolkit";

const initialState = {

    loading: false,

    message: ""
};

const forgotPasswordSlice =
createSlice({

    name: "forgotPassword",

    initialState,

    reducers: {

        setLoading: (
            state,
            action
        ) => {

            state.loading =
                action.payload;
        },

        setMessage: (
            state,
            action
        ) => {

            state.message =
                action.payload;
        }
    }
});

export const {

    setLoading,
    setMessage

} = forgotPasswordSlice.actions;

export default
forgotPasswordSlice.reducer;