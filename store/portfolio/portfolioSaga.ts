import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { portfolioAction } from "./portfolioSlice";
import { AssetAllocations, NetWorthSummary } from "../../types/wealth.types";
import { getAssetAllocations, getNetWorthSummary } from "../../firebase/services/portfolioService";

export function* loadWealthProfileWorker(actions : PayloadAction<string>) {
    try {
        const uid = actions.payload;
        const netWorthSummary : NetWorthSummary = yield call(getNetWorthSummary, uid);
        const assetSummary : AssetAllocations = yield call(getAssetAllocations, uid);
        yield put(portfolioAction.loadWealthProfileSuccess({NetWorth : netWorthSummary, Allocations : assetSummary}));
    } catch (error) {
        console.log("Error loading wealth profile in saga");
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        yield put(portfolioAction.loadWealthProfileFail(errorMessage));
    }
}
export function* portfolioWatcher() {
    yield takeEvery(portfolioAction.loadWealthProfile, loadWealthProfileWorker);
}