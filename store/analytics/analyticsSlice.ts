import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AnalyticsLLMResult,
  LLMSummaryRecord,
  NetWorthLLMRequest,
} from "../../types/analytics.types";

const initialState: AnalyticsLLMResult = {
  isLoading: false,
  error: null,
  netWorthSummary: null,
};

// store logged in user information
export const analyticsSlice = createSlice({
  name: "slice",
  initialState,
  reducers: {
    getNetWorthLLM(state, _actions: PayloadAction<NetWorthLLMRequest>) {
      state.isLoading = true;
    },
    getNetWorthLLMSuccess(state, actions: PayloadAction<LLMSummaryRecord>) {
      state.isLoading = false;
      state.netWorthSummary = actions.payload;
    },
    getNetWorthLLMFail(state, actions: PayloadAction<string>) {
      state.isLoading = false;
      state.error = actions.payload;
      state.netWorthSummary = null;
    },
    getSavedNetWorthFeedback(state, actions: PayloadAction<string>) {
      state.isLoading = true;
    },
    getSavedNetWorthFeedbackSuccess(
      state,
      actions: PayloadAction<LLMSummaryRecord>
    ) {
      console.log(actions.payload, "Sure?")
      state.isLoading = false;
      state.netWorthSummary = actions.payload;
    },
    getSavedNetWorthFeedbackFail(state, actions: PayloadAction<string>) {
      state.isLoading = false;
      state.error = actions.payload;
      state.netWorthSummary = null;
    },
  },
});

export const { actions: analyticsAction } = analyticsSlice;

export default analyticsSlice.reducer;
