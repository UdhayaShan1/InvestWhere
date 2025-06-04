import { RootState } from "../rootTypes";

const netWorthFeedbackSelector = (state: RootState) => {
  return state.analytics.netWorthSummary;
};

const isLoadingSelector = (state: RootState) => {
  return state.analytics.isLoading;
};

export {
  netWorthFeedbackSelector,
  isLoadingSelector,
};
