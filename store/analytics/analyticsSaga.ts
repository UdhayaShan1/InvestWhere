import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { analyticsAction } from "./analyticsSlice";
import {
  LLMSummaryRecord,
  NetWorthLLMRequest,
} from "../../types/analytics.types";
import { auth } from "../../firebase/firebase";
import { getIdToken } from "firebase/auth";
import {
  findNetWorthSummaryByUid,
  saveNetWorthSummaryByUid,
} from "../../firebase/services/analyticsService";
import { saveNetWorthSummary } from "../../firebase/services/portfolioService";
import { getCurrentDateString } from "../../constants/date_helper";

export function* getNetWorthLLMWorker(
  actions: PayloadAction<NetWorthLLMRequest>
): Generator<any, void, any> {
  try {
    console.log(JSON.stringify(actions.payload), "Check");
    const authUser = auth.currentUser;
    const jwtToken: string = yield call(() => getIdToken(authUser!, true));
    const response = yield fetch(
      "https://4vwz0sp71i.execute-api.us-east-1.amazonaws.com/dev/analyseNetWorth",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(actions.payload),
      }
    );

    const data = yield response.json();

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} Contact Dev with Screenshot`
      );
    }

    if (data["response"] === undefined) {
      throw new Error(
        "LLM response in wrong format. Contact Dev with Screenshot"
      );
    }
    const uid = authUser?.uid;

    if (!uid) {
      throw new Error("User not authenticated");
    }
    const updatedSummary: LLMSummaryRecord = {
      uid: authUser?.uid ?? "default",
      netWorthFeedback: data["response"],
      createdOn: getCurrentDateString(),
    };

    const saveResult: boolean = yield call(
      saveNetWorthSummaryByUid,
      uid,
      updatedSummary
    );

    if (!saveResult) {
      throw new Error("Failed to save analysis to database");
    }

    yield put(analyticsAction.getNetWorthLLMSuccess(updatedSummary));
  } catch (error) {
    console.log(error);
    const errMsg =
      error instanceof Error
        ? error.message
        : "Error getting net worth feedback from Lambda. Check Lambda logs.";
    alert(errMsg);
    yield put(analyticsAction.getNetWorthLLMFail(errMsg));
  }
}

export function* getSavedNetWorthFeedbackWorker(
  actions: PayloadAction<string>
) {
  try {
    const uid = actions.payload;
    const savedNetWorthFeedback: LLMSummaryRecord = yield call(
      findNetWorthSummaryByUid,
      uid
    );
    if (savedNetWorthFeedback) {
      yield put(
        analyticsAction.getSavedNetWorthFeedbackSuccess(savedNetWorthFeedback)
      );
    } else {
      yield put(
        analyticsAction.getSavedNetWorthFeedbackSuccess({
          uid: uid,
          createdOn: "",
          netWorthFeedback: "",
        })
      );
    }
  } catch (error) {
    console.log(error);
    const errMsg =
      error instanceof Error
        ? error.message
        : "Error getting saved net worth feedback from Firestore.";
    alert(errMsg);
    yield put(analyticsAction.getSavedNetWorthFeedbackFail(errMsg));
  }
}

export function* analyticsWatcher() {
  yield takeEvery(analyticsAction.getNetWorthLLM, getNetWorthLLMWorker);
  yield takeEvery(
    analyticsAction.getSavedNetWorthFeedback,
    getSavedNetWorthFeedbackWorker
  );
}
