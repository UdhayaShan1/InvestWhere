import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  RecommendationForm,
  RecommendationResponse,
  RecommendInitialState,
  RecommendationFeedback,
} from "../../types/recommend.types";

const initialState: RecommendInitialState = {
  assetAllocations: null,
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
  },
});

export const { actions: recommendAction } = recommendSlice;

export default recommendSlice.reducer;
