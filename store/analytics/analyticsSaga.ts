import { PayloadAction } from "@reduxjs/toolkit";
import { NetWorthSummary } from "../../types/wealth.types";
import { put, takeEvery } from "redux-saga/effects";
import { analyticsAction } from "./analyticsSlice";
import { authAction } from "../auth/authSlice";

export function* getNetWorthLLMWorker(
  actions: PayloadAction<NetWorthSummary>
): Generator<any, void, any> {
  try {
    console.log(JSON.stringify(actions.payload.History), "Check");
    const response = yield fetch(
      "https://4vwz0sp71i.execute-api.us-east-1.amazonaws.com/dev/analyseNetWorth",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(actions.payload.History),
      }
    );

    const data = yield response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (data["response"] === undefined) {
      throw new Error("LLM response in wrong format. Contact dev");
    }

    console.log(data);
    yield put(analyticsAction.getNetWorthLLMSuccess(data["response"]));
  } catch (error) {
    console.log(error);
    const errMsg =
      error instanceof Error
        ? error.message
        : "Error getting net worth feedback from Lambda. Check Lambda logs.";
    yield put(analyticsAction.getNetWorthLLMFail(errMsg));
  }
}

export function* analyticsWatcher() {
  yield takeEvery(analyticsAction.getNetWorthLLM, getNetWorthLLMWorker);
}
