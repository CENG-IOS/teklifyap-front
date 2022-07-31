import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
    authentication: localStorage.getItem("authentication")
        ? JSON.parse(localStorage.getItem("authentication"))
        : false,
};

const AuthSlice = createSlice({
    name: "Authentication",
    initialState,
    reducers: {
        login(state = initialState, action) {

            localStorage.setItem("user", JSON.stringify(action.payload));
            localStorage.setItem("authentication", "true");

            state.authentication = true;
            state.user = JSON.stringify(action.payload);

        },
        logout() {
            localStorage.removeItem("user");
            localStorage.setItem("authentication", "false");
        },
    },
});
export const AuthActions = AuthSlice.actions;
export default AuthSlice;
