import { RootState } from "../rootTypes";

export const recommendFeedbackSelector = (state: RootState) => {
  return state.recommend.feedback;
};

export const recommendAssetAllocationSelector = (state: RootState) => {
  return state.recommend.assetAllocations;
};

export const isLoadingSelector = (state: RootState) => {
  return state.recommend.isLoading;
};
