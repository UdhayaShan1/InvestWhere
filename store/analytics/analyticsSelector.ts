import { RootState } from "../rootTypes";

const netWorthFeedbackSelector = (state: RootState) => {
  return state.analytics.netWorthFeedback;
};

const componentFeedbackSelector = (state: RootState) => {
  return state.analytics.componentFeedback;
};

const isLoadingSelector = (state: RootState) => {
  return state.analytics.isLoading;
};

export {
  netWorthFeedbackSelector,
  componentFeedbackSelector,
  isLoadingSelector,
};
