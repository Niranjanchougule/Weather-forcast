// redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import weatherReducer from "./weatherSlice";

const favoritesPersistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(favoritesPersistConfig, weatherReducer);

export const store = configureStore({
  reducer: {
    weather: persistedReducer,
  },
});

// persistStore will allow us to persist the store to localStorage so that the state is not lost on page refresh
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
