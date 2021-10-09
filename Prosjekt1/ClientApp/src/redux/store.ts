import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import routeReducer from "./routeSlice";

const store = configureStore({
  reducer: {
    route: routeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV === "development"
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
