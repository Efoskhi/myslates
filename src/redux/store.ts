import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Import your slice reducer
import topicReducer from "./slices/topicSlice";

const store = configureStore({
  reducer: {
    user: userReducer, // Add reducers here
    topic: topicReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
