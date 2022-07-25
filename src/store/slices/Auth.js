import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : undefined,
    userID: localStorage.getItem("userID")
        ? JSON.parse(localStorage.getItem("userID"))
        : undefined,
    authentication: localStorage.getItem("authentication")
        ? JSON.parse(localStorage.getItem("authentication"))
        : undefined,
};

const AuthSlice = createSlice({
    name: "Authentication",
    initialState,
    reducers: {
        login(state = initialState, action) {
            state.authentication = true;

            localStorage.setItem("token", JSON.stringify(action.payload.token));
            localStorage.setItem("userID", JSON.stringify(action.payload.userID));
            localStorage.setItem("authentication", true);

        },
        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("userID");
            localStorage.removeItem("authentication");
        },
    },
});
export const AuthActions = AuthSlice.actions;
export default AuthSlice;
