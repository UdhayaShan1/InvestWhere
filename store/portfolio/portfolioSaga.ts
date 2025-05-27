import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { portfolioAction } from "./portfolioSlice";
import { AssetAllocations, BankEditForm, NetWorthSummary } from "../../types/wealth.types";
import { getAssetAllocations, getNetWorthSummary, saveAssetAllocations, saveNetWorthSummary } from "../../firebase/services/portfolioService";
import { calculateCategoryTotalRecursively } from "../../constants/helper";
import { getCurrentDateString } from "../../constants/date_helper";

export function* loadWealthProfileWorker(actions : PayloadAction<string>) {
    try {
        const uid = actions.payload;
        const netWorthSummary : NetWorthSummary = yield call(getNetWorthSummary, uid);
        const assetSummary : AssetAllocations = yield call(getAssetAllocations, uid);
        console.log("test", assetSummary, assetSummary.Robos.Syfe.cashManagement);
        yield put(portfolioAction.loadWealthProfileSuccess({NetWorth : netWorthSummary, Allocations : assetSummary}));
    } catch (error) {
        console.log("Error loading wealth profile in saga");
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        yield put(portfolioAction.loadWealthProfileFail(errorMessage));
    }
}

export function* saveNewBankDetailsWorker(actions : PayloadAction<BankEditForm>) {
    try {
        console.log("saga", actions.payload);
        const bankDetail = actions.payload;
        const uid = bankDetail['uid'] as string;
        if (!uid) {
            throw new Error("User ID is missing");
        }

        const currentAssetAllocations: AssetAllocations = yield call(getAssetAllocations, uid);
        if (!currentAssetAllocations) {
            throw new Error("Failed to retrieve current asset allocations");
        }
        const updatedAllocations = {...currentAssetAllocations};
        const bankName = bankDetail['Bank'] as string;

        delete bankDetail['Bank']
        delete bankDetail["uid"]
        if (!updatedAllocations.Bank) {
            updatedAllocations.Bank = {};
        }
        updatedAllocations.Bank[bankName] = {};
    
        Object.keys(bankDetail).forEach((key) => {
            updatedAllocations.Bank[bankName][key] = Number(bankDetail[key]);
        });


        console.log("saga updated", updatedAllocations);
        
        yield call(saveAssetAllocations, updatedAllocations);

        const netWorthSummary: NetWorthSummary = yield call(getNetWorthSummary, uid);
        if (netWorthSummary) {
        const newTotal = calculateCategoryTotalRecursively(updatedAllocations);
        netWorthSummary.Total = newTotal;
        
        const today = getCurrentDateString();
        netWorthSummary.LastUpdated = today;
        netWorthSummary.History[today] = newTotal;

        yield call(saveNetWorthSummary, netWorthSummary);
        yield put(portfolioAction.saveBankDetailsSuccess(bankDetail));

        //load everything for ui
        yield put(portfolioAction.loadWealthProfile(uid));
    }
    } catch (error) {
        console.log("Error saving bank details in saga", error);
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        yield put(portfolioAction.saveBankDetailsFail(errorMessage));
    }
}

export function* deleteBankWorker(actions : PayloadAction<BankEditForm>) {
    try {
        const bankDetail = actions.payload;
        const uid = bankDetail['uid'] as string;
        if (!uid) {
            throw new Error("User ID is missing");
        }

        const currentAssetAllocations: AssetAllocations = yield call(getAssetAllocations, uid);
        if (!currentAssetAllocations) {
            throw new Error("Failed to retrieve current asset allocations");
        }
        const updatedAllocations = {...currentAssetAllocations};
        const bankName = bankDetail['Bank'] as string;

        delete bankDetail['Bank']
        delete bankDetail["uid"]
        if (!updatedAllocations.Bank) {
            updatedAllocations.Bank = {};
        }

        delete updatedAllocations.Bank[bankName];
        
        yield call(saveAssetAllocations, updatedAllocations);

        const netWorthSummary: NetWorthSummary = yield call(getNetWorthSummary, uid);
        if (netWorthSummary) {
        const newTotal = calculateCategoryTotalRecursively(updatedAllocations);
        netWorthSummary.Total = newTotal;
        
        const today = getCurrentDateString();
        netWorthSummary.LastUpdated = today;
        netWorthSummary.History[today] = newTotal;

        yield call(saveNetWorthSummary, netWorthSummary);
        yield put(portfolioAction.saveBankDetailsSuccess(bankDetail));

        //load everything for ui
        yield put(portfolioAction.loadWealthProfile(uid));
    }
    } catch (error) {
        console.log("Error deleting bank in saga", error);
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        yield put(portfolioAction.saveBankDetailsFail(errorMessage));
    }
}




export function* portfolioWatcher() {
    yield takeEvery(portfolioAction.loadWealthProfile, loadWealthProfileWorker);
    yield takeEvery(portfolioAction.saveBankDetails, saveNewBankDetailsWorker);
    yield takeEvery(portfolioAction.deleteBankDetails, deleteBankWorker);
}