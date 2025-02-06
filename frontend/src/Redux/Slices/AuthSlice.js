import {createSlice} from "@reduxjs/toolkit"
// import { data } from "react-router-dom"

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || "",
    data: localStorage.getItem('data') || {}
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
})

// export const {} = authSlice.actions;
export default authSlice.reducer;