// src/redux/slices/topicSlice.js
import { createSlice } from "@reduxjs/toolkit";

const topicSlice = createSlice({
  name: "topic",
  initialState: {
    currentTopic: null,
  },
  reducers: {
    setCurrentTopic: (state, action) => {
      state.currentTopic = action.payload;
    },
    clearCurrentTopic: (state) => {
      state.currentTopic = null;
    },
  },
});

export const { setCurrentTopic, clearCurrentTopic } = topicSlice.actions;
export default topicSlice.reducer;
