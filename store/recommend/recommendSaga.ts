import { PayloadAction } from "@reduxjs/toolkit";
import {
  RecommendationForm,
  RecommendationResponse,
} from "../../types/recommend.types";
import { call, put, takeEvery } from "redux-saga/effects";
import { recommendAction } from "./recommendSlice";
import { auth } from "../../firebase/firebase";
import { getIdToken } from "firebase/auth";
import { saveRecommendedAllocation } from "../../firebase/services/portfolioService";
import { AssetAllocations } from "../../types/wealth.types";

export function* getRecommendationWorker(
  actions: PayloadAction<RecommendationForm>
): Generator<any, void, any> {
  try {
    const requestString = JSON.stringify(actions.payload);
    console.log(requestString, "Check req string");

    const authUser = auth.currentUser;
    const uid = authUser?.uid;
    if (!uid) {
      throw new Error("Firebase UID not found");
    }
    const jwtToken: string = yield call(() => getIdToken(authUser!, true));
    if (!jwtToken) {
      throw new Error("JWT token not retrievable.");
    }

    const response: Response = yield call(
      fetch,
      "https://4vwz0sp71i.execute-api.us-east-1.amazonaws.com/dev/recommendPortfolio",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: requestString,
      }
    );

    if (!response.ok) {
      const errorText = yield call([response, "text"]);
      console.error("API Error Response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status} - ${errorText}. Contact Dev with Screenshot`
      );
    }

    const data: RecommendationResponse = yield call([response, "json"]);
    console.log("Full API Response:", data);

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format: not an object");
    }

    if (!data.feedback || !data.recommendation) {
      console.error("Missing fields in response:", {
        hasFeedback: !!data.feedback,
        hasRecommendation: !!data.recommendation,
        actualData: data,
      });
      throw new Error(
        "AI response format is not valid - missing feedback or recommendation"
      );
    }

    console.log("Feedback is", data.feedback);
    console.log("Recommendation is", data.recommendation);

    const newRecommendedAssetAllocation: AssetAllocations = data.recommendation;
    newRecommendedAssetAllocation.uid = uid;
    newRecommendedAssetAllocation.portfolioStrategy =
      data.feedback.portfolioStrategy;
    newRecommendedAssetAllocation.projectedReturns =
      data.feedback.projectedReturns;
    newRecommendedAssetAllocation.analysedOn = data.feedback.searchDate;
    console.log("New Recommended is", newRecommendedAssetAllocation);
    yield call(saveRecommendedAllocation, uid, newRecommendedAssetAllocation);

    yield put(recommendAction.getRecommendationSuccess(data));
  } catch (error) {
    console.error("Error in getRecommendationWorker:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Error getting recommendation";
    yield put(recommendAction.getRecommendationFail(errorMsg));
  }
}

export function* recommendWatcher() {
  yield takeEvery(recommendAction.getRecommendation, getRecommendationWorker);
}
