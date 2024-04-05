import weatherReducer from "./weatherSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        weather: weatherReducer,
    },
});

export default store;