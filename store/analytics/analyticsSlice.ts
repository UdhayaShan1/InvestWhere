import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnalyticsLLMResult, NetWorthLLMRequest } from "../../types/analytics.types";

const initialState: AnalyticsLLMResult = {
  netWorthFeedback: null,
  componentFeedback: null,
  isLoading: false,
  error: null,
};

// store logged in user information
export const analyticsSlice = createSlice({
  name: "slice",
  initialState,
  reducers: {
    getNetWorthLLM(state, _actions: PayloadAction<NetWorthLLMRequest>) {
      state.isLoading = true;
    },
    getNetWorthLLMSuccess(state, actions: PayloadAction<string>) {
      state.isLoading = false;
      state.netWorthFeedback = actions.payload;
    },
    getNetWorthLLMFail(state, actions: PayloadAction<string>) {
      state.isLoading = false;
      state.error = actions.payload;
      state.netWorthFeedback = "";
    },
  },
});

export const { actions: analyticsAction } = analyticsSlice;

export default analyticsSlice.reducer;
