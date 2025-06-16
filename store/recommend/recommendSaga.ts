import { PayloadAction } from "@reduxjs/toolkit";
import {
  AnalysisResponse,
  RecommendationForm,
  RecommendationResponse,
} from "../../types/recommend.types";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { recommendAction } from "./recommendSlice";
import { auth } from "../../firebase/firebase";
import { getIdToken } from "firebase/auth";
import {
  getAssetAllocations,
  saveAssetAllocations,
  saveRecommendedAllocation,
} from "../../firebase/services/portfolioService";
import { AssetAllocations } from "../../types/wealth.types";
import { portfolioAction } from "../portfolio/portfolioSlice";
import { getCurrentDateString } from "../../constants/date_helper";
import { decreaseApiQuota, InvestUserProfile } from "../../types/auth.types";
import {
  getUserProfile,
  saveUserProfile,
} from "../../firebase/services/profileService";
import { authAction } from "../auth/authSlice";
import { RootState } from "../rootTypes";
import { apiQuotaSelector } from "./recommendSelector";

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

    //load everything for ui
    yield put(portfolioAction.loadWealthProfile(uid));

    alert("Successfully generated! Check it under 'View Portfolios'");
  } catch (error) {
    console.error("Error in getRecommendationWorker:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Error getting recommendation";
    alert(errorMsg);
    yield put(recommendAction.getRecommendationFail(errorMsg));
  }
}

export function* getAnalysisWorker(
  actions: PayloadAction<AssetAllocations>
): Generator<any, void, any> {
  try {
    const state: RootState = yield select();
    const dailyQuota = apiQuotaSelector(state);

    const checkPayload: AssetAllocations = JSON.parse(
      JSON.stringify(actions.payload)
    );
    delete checkPayload.projectedReturns;
    delete checkPayload.portfolioStrategy;
    const requestString = JSON.stringify(checkPayload);
    console.log(requestString, "Check req string for analysis");

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
      "https://4vwz0sp71i.execute-api.us-east-1.amazonaws.com/dev/analysePortfolio",
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

    const data: AnalysisResponse = yield call([response, "json"]);
    console.log("Analysis Data Received:", data);

    if (!data || !data.feedback) {
      throw new Error("Invalid analysis response format - missing feedback");
    }

    const assetAllocation: AssetAllocations = yield call(
      getAssetAllocations,
      uid
    );

    if (!assetAllocation) {
      throw new Error("Failed to retrieve current asset allocations");
    }

    assetAllocation.analysedOn =
      data.feedback.searchDate || getCurrentDateString();
    assetAllocation.portfolioStrategy = data.feedback.portfolioStrategy || "";
    assetAllocation.projectedReturns = data.feedback.projectedReturns || "";

    console.log("Updated asset allocation with analysis:", assetAllocation);

    // Save updated asset allocation
    yield call(saveAssetAllocations, assetAllocation);

    //update quota
    const currentUserProfile: InvestUserProfile = yield call(
      getUserProfile,
      uid,
      auth.currentUser?.email || ""
    );
    if (currentUserProfile) {
      const updatedUserProfile: InvestUserProfile = decreaseApiQuota(
        currentUserProfile,
        dailyQuota ?? 0
      );
      yield call(saveUserProfile, updatedUserProfile);
      yield put(authAction.decreaseApiQuotaSuccess(updatedUserProfile));
    }

    // Dispatch success action first
    yield put(recommendAction.getAnalysisSuccess(data));

    // Load everything for UI
    yield put(portfolioAction.loadWealthProfile(uid));
  } catch (error) {
    console.error("Error in getAnalysisWorker:", error);
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Error getting portfolio analysis";
    yield put(recommendAction.getAnalysisFail(errorMsg));
  }
}

export function* getApiQuotaWorker(): Generator<any, void, any> {
  try {
    const authUser = auth.currentUser;
    const jwtToken: string = yield call(() => getIdToken(authUser!, true));
    if (!jwtToken) {
      throw new Error("JWT token not retrievable.");
    }

    const response: Response = yield call(
      fetch,
      "https://4vwz0sp71i.execute-api.us-east-1.amazonaws.com/dev/getApiQuota",
      {
        method: "GET",
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    if (!response.ok) {
      const errorText = yield call([response, "text"]);
      console.error("API Error Response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status} - ${errorText}. Contact Dev with Screenshot`
      );
    }

    const data = yield call([response, "json"]);
    console.log("Quota Data Received:", data);

    if (!data || !data.quota) {
      throw new Error("Invalid quota response format - missing quota");
    }

    yield put(recommendAction.getApiQuotaSuccess(data.quota));
  } catch (error) {
    console.error("Error in getApiQuotaWorker:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Error getting api quota";
    yield put(recommendAction.getApiQuotaFail(errorMsg));
  }
}

export function* recommendWatcher() {
  yield takeEvery(recommendAction.getRecommendation, getRecommendationWorker);
  yield takeEvery(recommendAction.getAnalysis, getAnalysisWorker);
  yield takeEvery(recommendAction.getApiQuota, getApiQuotaWorker);
}
