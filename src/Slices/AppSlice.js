import { createSlice } from "@reduxjs/toolkit";

const AppSlice = createSlice({
    name: "app",
    initialState: {
        city: null,
        country: null,
        lat: null,
        long: null,
        submission: false,
        windowWidth: 0,
        windowHeight: 0
    },
    reducers: {
        setCity: (state, action) => {
            state.city = action.payload;
        },
        setCountry: (state, action) => {
            state.country = action.payload;
        },
        setLat: (state, action) => {
            state.lat = action.payload;
        },
        setLong: (state, action) => {
            state.long = action.payload;
        },
        setFormSubmission: (state, action) => {
            state.submission = action.payload;
        },
        setWindowWidth: (state, action) => {
            state.windowWidth = action.payload;
        },
        setWindowHeight: (state, action) => {
            state.windowHeight = action.payload;
        }
    },
});

export const {
    setCity,
    setCountry,
    setLat,
    setLong,
    setFormSubmission,
    setWindowWidth,
    setWindowHeight
} = AppSlice.actions;

export default AppSlice;
