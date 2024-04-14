// redux/weatherSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}

interface WeatherState {
  favorites: WeatherData[];
}

const initialState: WeatherState = {
  favorites: [],
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<WeatherData>) => {
      state.favorites.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites.splice(action.payload, 1);
    },
  },
});

export const { addFavorite, removeFavorite } = weatherSlice.actions;

export const selectFavorites = (state: RootState) => state.weather.favorites;

export default weatherSlice.reducer;
