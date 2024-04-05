
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { hostName, appId } from "../config/config";

export const getCityData = createAsyncThunk("city", async ({ city, unit }) => {
  try {
    const { data } = await axios.get(
      `${hostName}/data/2.5/weather?q=${city}&units=${unit}&APPID=${appId}`
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.response.data.message };
  }
});

export const get5DaysForecast = createAsyncThunk("5days", async ({ lat, lon, unit }) => {
  try {
    const { data } = await axios.get(
      `${hostName}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&APPID=${appId}`
    );
    return data;
  } catch (error) {
    throw error;
  }
});

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    citySearchLoading: false,
    citySearchData: null,
    forecastLoading: false,
    forecastData: null,
    forecastError: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCityData.pending, (state) => {
        state.citySearchLoading = true;
        state.citySearchData = null;
      })
      .addCase(getCityData.fulfilled, (state, action) => {
        state.citySearchLoading = false;
        state.citySearchData = action.payload;
      })
      .addCase(get5DaysForecast.pending, (state) => {
        state.forecastLoading = true;
        state.forecastData = null;
        state.forecastError = null;
      })
      .addCase(get5DaysForecast.fulfilled, (state, action) => {
        state.forecastLoading = false;
        state.forecastData = action.payload;
        state.forecastError = null;
      })
      .addCase(get5DaysForecast.rejected, (state, action) => {
        state.forecastLoading = false;
        state.forecastData = null;
        state.forecastError = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
