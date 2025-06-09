import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  RecommendationForm,
  RecommendationResponse,
  RecommendInitialState,
  LLMFeedback,
  AnalysisResponse,
} from "../../types/recommend.types";
import { AssetAllocations } from "../../types/wealth.types";

const initialState: RecommendInitialState = {
  assetAllocations: null,
  currentAssetFeedback: null,
  feedback: null,
  error: "",
  isLoading: false,
};

// store logged in user information
export const recommendSlice = createSlice({
  name: "slice",
  initialState,
  reducers: {
    getRecommendation(state, actions: PayloadAction<RecommendationForm>) {
      state.isLoading = true;
    },
    getRecommendationSuccess(
      state,
      actions: PayloadAction<RecommendationResponse>
    ) {
      state.isLoading = false;
      state.assetAllocations = actions.payload.recommendation;
      state.feedback = actions.payload.feedback;
    },
    getRecommendationFail(state, actions: PayloadAction<string>) {
      state.error = actions.payload;
      state.isLoading = false;
      state.assetAllocations = null;
      state.feedback = null;
    },
    getAnalysis(state, actions: PayloadAction<AssetAllocations>) {
      state.isLoading = true;
    },
    getAnalysisSuccess(state, actions: PayloadAction<AnalysisResponse>) {
      state.isLoading = false;
      state.currentAssetFeedback = actions.payload.feedback;
    },
    getAnalysisFail(state, actions: PayloadAction<string>) {
      state.isLoading = false;
      state.currentAssetFeedback = null;
      state.error = actions.payload;
    }
  },
});

export const { actions: recommendAction } = recommendSlice;

export default recommendSlice.reducer;
