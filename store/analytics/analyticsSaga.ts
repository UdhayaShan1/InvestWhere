import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { analyticsAction } from "./analyticsSlice";
import { NetWorthLLMRequest } from "../../types/analytics.types";
import { auth } from "../../firebase/firebase";
import { getIdToken } from "firebase/auth";

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

    console.log(data["response"]);
    yield put(analyticsAction.getNetWorthLLMSuccess(data["response"]));
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

export function* analyticsWatcher() {
  yield takeEvery(analyticsAction.getNetWorthLLM, getNetWorthLLMWorker);
}
