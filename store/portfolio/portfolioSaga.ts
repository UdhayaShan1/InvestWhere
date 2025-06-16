import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, take, takeEvery } from "redux-saga/effects";
import { portfolioAction } from "./portfolioSlice";
import {
  ApplyRecommendationCompostionRequest,
  ApplyRecommendationRequest,
  AssetAllocations,
  AssetAllocationsList,
  AssetComponents,
  BankEditForm,
  defaultSyfe,
  defaultEndowus,
  EndowusSaveRequest,
  EndowusDeleteRequest,
  InvestmentEditForm,
  NetWorthSummary,
  RecommendationDeleteRequest,
  SyfeDeleteRequest,
  SyfeInterface,
  SyfeSaveRequest,
  OtherEditForm,
  EmptyEditForm,
} from "../../types/wealth.types";
import {
  getAssetAllocations,
  getNetWorthSummary,
  saveAssetAllocations,
  saveNetWorthSummary,
  getAssetAllocationsList as getAssetAllocationsListService,
  saveAssetAllocationsListWithCurrentAllocation,
  saveAssetAllocationsList,
} from "../../firebase/services/portfolioService";
import {
  calculateCategoryTotalRecursively,
  recursiveMapper,
} from "../../constants/helper";
import { getCurrentDateString } from "../../constants/date_helper";
import { auth } from "../../firebase/firebase";

export function* loadWealthProfileWorker(actions: PayloadAction<string>) {
  try {
    const uid = actions.payload;
    const netWorthSummary: NetWorthSummary = yield call(
      getNetWorthSummary,
      uid
    );
    const assetSummary: AssetAllocations = yield call(getAssetAllocations, uid);

    // Add null checking and ensure Robos structure exists
    if (assetSummary && !assetSummary.Robos) {
      assetSummary.Robos = { Syfe: defaultSyfe, Endowus: defaultEndowus };
    }

    // Ensure Syfe exists within Robos
    if (assetSummary && assetSummary.Robos && !assetSummary.Robos.Syfe) {
      assetSummary.Robos.Syfe = defaultSyfe;
    }

    // Ensure Endowus exists within Robos
    if (assetSummary && assetSummary.Robos && !assetSummary.Robos.Endowus) {
      assetSummary.Robos.Endowus = defaultEndowus;
    }

    const allocationList: AssetAllocationsList = yield call(
      getAssetAllocationsListService,
      uid
    );
    yield put(
      portfolioAction.loadWealthProfileSuccess({
        NetWorth: netWorthSummary,
        Allocations: assetSummary,
        AllocationsList: allocationList,
      })
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Error loading wealth profile in saga", errorMessage);
    yield put(portfolioAction.loadWealthProfileFail(errorMessage));
  }
}

export function* saveNewBankDetailsWorker(
  actions: PayloadAction<BankEditForm>
) {
  try {
    console.log("saga", actions.payload);
    const bankDetail = actions.payload;
    const uid = bankDetail["uid"] as string;
    if (!uid) {
      throw new Error("User ID is missing");
    }

    const currentAssetAllocations: AssetAllocations = yield call(
      getAssetAllocations,
      uid
    );
    if (!currentAssetAllocations) {
      throw new Error("Failed to retrieve current asset allocations");
    }
    const updatedAllocations = { ...currentAssetAllocations };
    const bankName = bankDetail["Bank"] as string;

    delete bankDetail["Bank"];
    delete bankDetail["uid"];
    if (!updatedAllocations.Bank) {
      updatedAllocations.Bank = {};
    }
    updatedAllocations.Bank[bankName] = {};

    Object.keys(bankDetail).forEach((key) => {
      updatedAllocations.Bank[bankName][key] = Number(bankDetail[key]);
    });

    console.log("saga updated", updatedAllocations);

    yield call(saveAssetAllocations, updatedAllocations);

    const netWorthSummary: NetWorthSummary = yield call(
      getNetWorthSummary,
      uid
    );

    if (netWorthSummary) {
      const today = getCurrentDateString();

      if (!netWorthSummary.History[today]) {
        netWorthSummary.History[today] = {};
      }
      for (const Component of AssetComponents) {
        const key = Component as keyof typeof updatedAllocations;
        const componentTotal = calculateCategoryTotalRecursively(
          updatedAllocations[key]
        );
        const today = getCurrentDateString();
        netWorthSummary.History[today][key] = componentTotal;
      }

      const newTotal = calculateCategoryTotalRecursively(updatedAllocations);
      netWorthSummary.History[today]["Total"] = newTotal;

      netWorthSummary.LastUpdated = today;

      yield call(saveNetWorthSummary, netWorthSummary);
      yield put(portfolioAction.saveBankDetailsSuccess(bankDetail));

      //update asset allocation list's current
      yield call(
        saveAssetAllocationsListWithCurrentAllocation,
        updatedAllocations
      );

      //load everything for ui
      yield put(portfolioAction.loadWealthProfile(uid));
    }
  } catch (error) {
    console.log("Error saving bank details in saga", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(portfolioAction.saveBankDetailsFail(errorMessage));
  }
}

export function* deleteBankWorker(actions: PayloadAction<BankEditForm>) {
  try {
    const bankDetail = actions.payload;
    const uid = bankDetail["uid"] as string;
    if (!uid) {
      throw new Error("User ID is missing");
    }

    const currentAssetAllocations: AssetAllocations = yield call(
      getAssetAllocations,
      uid
    );
    if (!currentAssetAllocations) {
      throw new Error("Failed to retrieve current asset allocations");
    }
    const updatedAllocations = { ...currentAssetAllocations };
    const bankName = bankDetail["Bank"] as string;

    delete bankDetail["Bank"];
    delete bankDetail["uid"];
    if (!updatedAllocations.Bank) {
      updatedAllocations.Bank = {};
    }

    delete updatedAllocations.Bank[bankName];

    yield call(saveAssetAllocations, updatedAllocations);

    const netWorthSummary: NetWorthSummary = yield call(
      getNetWorthSummary,
      uid
    );
    if (netWorthSummary) {
      const today = getCurrentDateString();
      if (!netWorthSummary.History[today]) {
        netWorthSummary.History[today] = {};
      }
      for (const Component of AssetComponents) {
        const key = Component as keyof typeof updatedAllocations;
        const componentTotal = calculateCategoryTotalRecursively(
          updatedAllocations[key]
        );
        const today = getCurrentDateString();
        netWorthSummary.History[today][key] = componentTotal;
      }
      const newTotal = calculateCategoryTotalRecursively(updatedAllocations);
      netWorthSummary.History[today]["Total"] = newTotal;

      yield call(saveNetWorthSummary, netWorthSummary);
      yield put(portfolioAction.saveSyfePortfolioSuccess());

      //update asset allocation list's current
      yield call(
        saveAssetAllocationsListWithCurrentAllocation,
        updatedAllocations
      );

      //load everything for ui
      yield put(portfolioAction.loadWealthProfile(uid));
    }
  } catch (error) {
    console.log("Error deleting bank in saga", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(portfolioAction.deleteBankDetailsFail(errorMessage));
  }
}

export function* saveNewSyfePortfolioWorker(
  actions: PayloadAction<SyfeSaveRequest>
) {
  try {
    console.log("saga SYFE", actions.payload);
    const syfeDetail = actions.payload;
    const uid = syfeDetail["uid"] as string;
    if (!uid) {
      throw new Error("User ID is missing");
    }

    const currentAssetAllocations: AssetAllocations = yield call(
      getAssetAllocations,
      uid
    );
    if (!currentAssetAllocations) {
      throw new Error("Failed to retrieve current asset allocations");
    }
    const updatedAllocations = { ...currentAssetAllocations };
    const syfeAllocation: SyfeInterface = syfeDetail.syfeAllocation;

    if (!updatedAllocations.Robos) {
      updatedAllocations.Robos = { Syfe: defaultSyfe, Endowus: defaultEndowus };
    }

    updatedAllocations.Robos.Syfe = syfeAllocation;
    console.log("saga updated", updatedAllocations);

    yield call(saveAssetAllocations, updatedAllocations);

    const netWorthSummary: NetWorthSummary = yield call(
      getNetWorthSummary,
      uid
    );
    if (netWorthSummary) {
      const today = getCurrentDateString();
      if (!netWorthSummary.History[today]) {
        netWorthSummary.History[today] = {};
      }
      for (const Component of AssetComponents) {
        const key = Component as keyof typeof updatedAllocations;
        const componentTotal = calculateCategoryTotalRecursively(
          updatedAllocations[key]
        );
        const today = getCurrentDateString();
        netWorthSummary.History[today][key] = componentTotal;
      }
      const newTotal = calculateCategoryTotalRecursively(updatedAllocations);
      netWorthSummary.History[today]["Total"] = newTotal;

      yield call(saveNetWorthSummary, netWorthSummary);
      yield put(portfolioAction.saveSyfePortfolioSuccess());

      //update asset allocation list's current
      yield call(
        saveAssetAllocationsListWithCurrentAllocation,
        updatedAllocations
      );

      //load everything for ui
      yield put(portfolioAction.loadWealthProfile(uid));
    }
  } catch (error) {
    console.log("Error saving Syfe portfolio in saga", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(portfolioAction.saveSyfePortfolioFail(errorMessage));
  }
}

export function* deleteSyfePortfolioWorker(
  actions: PayloadAction<SyfeDeleteRequest>
) {
  try {
    const syfeDeleteRequest = actions.payload;
    const uid = syfeDeleteRequest["uid"] as string;
    if (!uid) {
      throw new Error("User ID is missing");
    }

    const currentAssetAllocations: AssetAllocations = yield call(
      getAssetAllocations,
      uid
    );
    if (!currentAssetAllocations) {
      throw new Error("Failed to retrieve current asset allocations");
    }
    const updatedAllocations = { ...currentAssetAllocations };
    const portfolioName = syfeDeleteRequest.portfolioToDelete as string;

    if (!updatedAllocations.Robos) {
      updatedAllocations.Robos = { Syfe: defaultSyfe, Endowus: defaultEndowus };
    }

    delete updatedAllocations.Robos.Syfe[portfolioName];

    yield call(saveAssetAllocations, updatedAllocations);

    const netWorthSummary: NetWorthSummary = yield call(
      getNetWorthSummary,
      uid
    );
    if (netWorthSummary) {
      const today = getCurrentDateString();
      if (!netWorthSummary.History[today]) {
        netWorthSummary.History[today] = {};
      }
      for (const Component of AssetComponents) {
        const key = Component as keyof typeof updatedAllocations;
        const componentTotal = calculateCategoryTotalRecursively(
          updatedAllocations[key]
        );
        const today = getCurrentDateString();
        netWorthSummary.History[today][key] = componentTotal;
      }
      const newTotal = calculateCategoryTotalRecursively(updatedAllocations);
      netWorthSummary.History[today]["Total"] = newTotal;

      yield call(saveNetWorthSummary, netWorthSummary);
      yield put(portfolioAction.saveSyfePortfolioSuccess());

      //update asset allocation list's current
      yield call(
        saveAssetAllocationsListWithCurrentAllocation,
        updatedAllocations
      );

      //load everything for ui
      yield put(portfolioAction.loadWealthProfile(uid));
    }
  } catch (error) {
    console.log("Error deleting syfe portfolio in saga", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(portfolioAction.deleteSyfePortfolioFail(errorMessage));
  }
}

export function* saveNewEndowusPortfolioWorker(
  actions: PayloadAction<EndowusSaveRequest>
) {
  try {
    console.log("saga ENDOWUS", actions.payload);
    const endowusDetail = actions.payload;
    const uid = endowusDetail["uid"] as string;
    if (!uid) {
      throw new Error("User ID is missing");
    }

    const currentAssetAllocations: AssetAllocations = yield call(
      getAssetAllocations,
      uid
    );
    if (!currentAssetAllocations) {
      throw new Error("Failed to retrieve current asset allocations");
    }
    const updatedAllocations = { ...currentAssetAllocations };
    const endowusAllocation = endowusDetail.endowusAllocation;

    if (!updatedAllocations.Robos) {
      updatedAllocations.Robos = { Syfe: defaultSyfe, Endowus: defaultEndowus };
    }

    updatedAllocations.Robos.Endowus = endowusAllocation;
    console.log("saga updated", updatedAllocations);

    yield call(saveAssetAllocations, updatedAllocations);

    const netWorthSummary: NetWorthSummary = yield call(
      getNetWorthSummary,
      uid
    );
    if (netWorthSummary) {
      const today = getCurrentDateString();
      if (!netWorthSummary.History[today]) {
        netWorthSummary.History[today] = {};
      }
      for (const Component of AssetComponents) {
        const key = Component as keyof typeof updatedAllocations;
        const componentTotal = calculateCategoryTotalRecursively(
          updatedAllocations[key]
        );
        netWorthSummary.History[today][key] = componentTotal;
      }
      const newTotal = calculateCategoryTotalRecursively(updatedAllocations);
      netWorthSummary.History[today]["Total"] = newTotal;

      yield call(saveNetWorthSummary, netWorthSummary);
      yield put(portfolioAction.saveEndowusPortfolioSuccess());

      //update asset allocation list's current
      yield call(
        saveAssetAllocationsListWithCurrentAllocation,
        updatedAllocations
      );
      //load everything for ui
      yield put(portfolioAction.loadWealthProfile(uid));
    }
  } catch (error) {
    console.log("Error saving Endowus portfolio in saga", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(portfolioAction.saveEndowusPortfolioFail(errorMessage));
  }
}

export function* deleteEndowusPortfolioWorker(
  actions: PayloadAction<EndowusDeleteRequest>
) {
  try {
    const endowusDeleteRequest = actions.payload;
    const uid = endowusDeleteRequest["uid"] as string;
    if (!uid) {
      throw new Error("User ID is missing");
    }

    const currentAssetAllocations: AssetAllocations = yield call(
      getAssetAllocations,
      uid
    );
    if (!currentAssetAllocations) {
      throw new Error("Failed to retrieve current asset allocations");
    }
    const updatedAllocations = { ...currentAssetAllocations };
    const portfolioName = endowusDeleteRequest.portfolioToDelete as string;

    if (!updatedAllocations.Robos) {
      updatedAllocations.Robos = { Syfe: defaultSyfe, Endowus: defaultEndowus };
    }

    delete updatedAllocations.Robos.Endowus[portfolioName];

    yield call(saveAssetAllocations, updatedAllocations);

    const netWorthSummary: NetWorthSummary = yield call(
      getNetWorthSummary,
      uid
    );
    if (netWorthSummary) {
      const today = getCurrentDateString();
      if (!netWorthSummary.History[today]) {
        netWorthSummary.History[today] = {};
      }
      for (const Component of AssetComponents) {
        const key = Component as keyof typeof updatedAllocations;
        const componentTotal = calculateCategoryTotalRecursively(
          updatedAllocations[key]
        );
        netWorthSummary.History[today][key] = componentTotal;
      }
      const newTotal = calculateCategoryTotalRecursively(updatedAllocations);
      netWorthSummary.History[today]["Total"] = newTotal;

      yield call(saveNetWorthSummary, netWorthSummary);
      yield put(portfolioAction.deleteEndowusPortfolioSuccess());

      //update asset allocation list's current
      yield call(
        saveAssetAllocationsListWithCurrentAllocation,
        updatedAllocations
      );

      //load everything for ui
      yield put(portfolioAction.loadWealthProfile(uid));
    }
  } catch (error) {
    console.log("Error deleting endowus portfolio in saga", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(portfolioAction.deleteEndowusPortfolioFail(errorMessage));
  }
}

export function* saveNewInvestmentDetailsWorker(
  actions: PayloadAction<InvestmentEditForm>
) {
  try {
    console.log("saga", actions.payload);
    const investmentDetail = actions.payload;
    const uid = investmentDetail["uid"] as string;
    if (!uid) {
      throw new Error("User ID is missing");
    }

    const currentAssetAllocations: AssetAllocations = yield call(
      getAssetAllocations,
      uid
    );
    if (!currentAssetAllocations) {
      throw new Error("Failed to retrieve current asset allocations");
    }
    const updatedAllocations = { ...currentAssetAllocations };
    const investmentName = investmentDetail["Broker"] as string;

    delete investmentDetail["Broker"];
    delete investmentDetail["uid"];
    if (!updatedAllocations.Investments) {
      updatedAllocations.Investments = {};
    }
    updatedAllocations.Investments[investmentName] = {};

    Object.keys(investmentDetail).forEach((key) => {
      updatedAllocations.Investments[investmentName][key] = Number(
        investmentDetail[key]
      );
    });

    console.log("investment saga updated", updatedAllocations);

    yield call(saveAssetAllocations, updatedAllocations);

    const netWorthSummary: NetWorthSummary = yield call(
      getNetWorthSummary,
      uid
    );
    if (netWorthSummary) {
      const today = getCurrentDateString();
      if (!netWorthSummary.History[today]) {
        netWorthSummary.History[today] = {};
      }
      for (const Component of AssetComponents) {
        const key = Component as keyof typeof updatedAllocations;
        const componentTotal = calculateCategoryTotalRecursively(
          updatedAllocations[key]
        );
        const today = getCurrentDateString();
        netWorthSummary.History[today][key] = componentTotal;
      }
      const newTotal = calculateCategoryTotalRecursively(updatedAllocations);
      netWorthSummary.History[today]["Total"] = newTotal;

      yield call(saveNetWorthSummary, netWorthSummary);
      yield put(portfolioAction.saveSyfePortfolioSuccess());

      //update asset allocation list's current
      yield call(
        saveAssetAllocationsListWithCurrentAllocation,
        updatedAllocations
      );
      //load everything for ui
      yield put(portfolioAction.loadWealthProfile(uid));
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(portfolioAction.saveInvestmentDetailsFail(errorMessage));
  }
}

export function* deleteInvestmentWorker(
  actions: PayloadAction<InvestmentEditForm>
) {
  try {
    const investmentDetail = actions.payload;
    const uid = investmentDetail["uid"] as string;
    if (!uid) {
      throw new Error("User ID is missing");
    }

    const currentAssetAllocations: AssetAllocations = yield call(
      getAssetAllocations,
      uid
    );
    if (!currentAssetAllocations) {
      throw new Error("Failed to retrieve current asset allocations");
    }
    const updatedAllocations = { ...currentAssetAllocations };
    const investmentName = investmentDetail["Broker"] as string;

    delete investmentDetail["Broker"];
    delete investmentDetail["uid"];
    if (!updatedAllocations.Investments) {
      updatedAllocations.Investments = {};
    }

    delete updatedAllocations.Investments[investmentName];

    yield call(saveAssetAllocations, updatedAllocations);

    const netWorthSummary: NetWorthSummary = yield call(
      getNetWorthSummary,
      uid
    );
    if (netWorthSummary) {
      const today = getCurrentDateString();
      if (!netWorthSummary.History[today]) {
        netWorthSummary.History[today] = {};
      }
      for (const Component of AssetComponents) {
        const key = Component as keyof typeof updatedAllocations;
        const componentTotal = calculateCategoryTotalRecursively(
          updatedAllocations[key]
        );
        const today = getCurrentDateString();
        netWorthSummary.History[today][key] = componentTotal;
      }
      const newTotal = calculateCategoryTotalRecursively(updatedAllocations);
      netWorthSummary.History[today]["Total"] = newTotal;

      yield call(saveNetWorthSummary, netWorthSummary);
      yield put(portfolioAction.saveSyfePortfolioSuccess());

      //update asset allocation list's current
      yield call(
        saveAssetAllocationsListWithCurrentAllocation,
        updatedAllocations
      );
      //load everything for ui
      yield put(portfolioAction.loadWealthProfile(uid));
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(portfolioAction.deleteInvestmentDetailsFail(errorMessage));
  }
}

export function* getAssetAllocationsListWorker(
  actions: PayloadAction<string>
): Generator<any, void, any> {
  try {
    const uid = actions.payload;
    const assetAllocationsList = yield call(
      getAssetAllocationsListService,
      uid
    );
    if (!assetAllocationsList) {
      throw new Error("Error getting list of asset allocations");
    }
    yield put(
      portfolioAction.loadAssetAllocationListSuccess(assetAllocationsList)
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Error getting list of asset allocations";
    alert(errorMsg);
    yield put(portfolioAction.loadAssetAllocationListFail(errorMsg));
  }
}

export function* saveNewOtherAssetWorker(
  actions: PayloadAction<OtherEditForm>
) {
  try {
    console.log("other saga", actions.payload);
    const otherAssetDetail: OtherEditForm = actions.payload;
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error("User ID is missing");
    }

    const currentAssetAllocations: AssetAllocations = yield call(
      getAssetAllocations,
      uid
    );
    if (!currentAssetAllocations) {
      throw new Error("Failed to retrieve current asset allocations");
    }
    const updatedAllocations = { ...currentAssetAllocations };
    const assetName = otherAssetDetail.AssetKey as string;

    if (!updatedAllocations.Others) {
      updatedAllocations.Others = {};
    }
    const { AssetKey, ...otherAssetData } = EmptyEditForm;
    updatedAllocations.Others[assetName] = otherAssetData;
    updatedAllocations.Others[assetName].amount = otherAssetDetail.amount;
    updatedAllocations.Others[assetName].label = otherAssetDetail.label;

    console.log("others alloc saga updated", updatedAllocations);

    yield call(saveAssetAllocations, updatedAllocations);

    const netWorthSummary: NetWorthSummary = yield call(
      getNetWorthSummary,
      uid
    );
    if (netWorthSummary) {
      const today = getCurrentDateString();
      if (!netWorthSummary.History[today]) {
        netWorthSummary.History[today] = {};
      }
      for (const Component of AssetComponents) {
        const key = Component as keyof typeof updatedAllocations;
        const componentTotal = calculateCategoryTotalRecursively(
          updatedAllocations[key]
        );
        const today = getCurrentDateString();
        netWorthSummary.History[today][key] = componentTotal;
      }
      const newTotal = calculateCategoryTotalRecursively(updatedAllocations);
      netWorthSummary.History[today]["Total"] = newTotal;

      yield call(saveNetWorthSummary, netWorthSummary);
      yield put(portfolioAction.saveOtherAssetDetailsSuccess());

      //update asset allocation list's current
      yield call(
        saveAssetAllocationsListWithCurrentAllocation,
        updatedAllocations
      );
      //load everything for ui
      yield put(portfolioAction.loadWealthProfile(uid));
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(portfolioAction.saveOtherAssetDetailsFail(errorMessage));
  }
}

export function* deleteOtherAssetWorker(actions: PayloadAction<OtherEditForm>) {
  try {
    const otherAssetDetail: OtherEditForm = actions.payload;
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error("User ID is missing");
    }

    const currentAssetAllocations: AssetAllocations = yield call(
      getAssetAllocations,
      uid
    );
    if (!currentAssetAllocations) {
      throw new Error("Failed to retrieve current asset allocations");
    }
    const updatedAllocations = { ...currentAssetAllocations };
    const otherAssetName = otherAssetDetail.AssetKey as string;

    if (!updatedAllocations.Others) {
      updatedAllocations.Others = {};
    }

    delete updatedAllocations.Others[otherAssetName];

    yield call(saveAssetAllocations, updatedAllocations);

    const netWorthSummary: NetWorthSummary = yield call(
      getNetWorthSummary,
      uid
    );
    if (netWorthSummary) {
      const today = getCurrentDateString();
      if (!netWorthSummary.History[today]) {
        netWorthSummary.History[today] = {};
      }
      for (const Component of AssetComponents) {
        const key = Component as keyof typeof updatedAllocations;
        const componentTotal = calculateCategoryTotalRecursively(
          updatedAllocations[key]
        );
        const today = getCurrentDateString();
        netWorthSummary.History[today][key] = componentTotal;
      }
      const newTotal = calculateCategoryTotalRecursively(updatedAllocations);
      netWorthSummary.History[today]["Total"] = newTotal;

      yield call(saveNetWorthSummary, netWorthSummary);
      yield put(portfolioAction.saveSyfePortfolioSuccess());

      //update asset allocation list's current
      yield call(
        saveAssetAllocationsListWithCurrentAllocation,
        updatedAllocations
      );
      //load everything for ui
      yield put(portfolioAction.loadWealthProfile(uid));
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    yield put(portfolioAction.deleteInvestmentDetailsFail(errorMessage));
  }
}

export function* deleteRecommendationWorker(
  actions: PayloadAction<RecommendationDeleteRequest>
) {
  try {
    console.log("At delete saga");
    const idToDelete = actions.payload.id;

    const assetAllocationList = JSON.parse(
      JSON.stringify(actions.payload.assetAllocationList)
    );

    if (assetAllocationList && assetAllocationList.recommended) {
      const { [idToDelete]: deletedItem, ...remainingRecommendations } =
        assetAllocationList.recommended;
      assetAllocationList.recommended = remainingRecommendations;
    }

    console.log("Updated list:", assetAllocationList);

    yield call(saveAssetAllocationsList, assetAllocationList);

    yield put(portfolioAction.deleteRecommendationSuccess());

    if (assetAllocationList.uid) {
      yield put(portfolioAction.loadWealthProfile(assetAllocationList.uid));
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Error deleting recommendation";
    alert(errorMsg);
    yield put(portfolioAction.deleteRecommendationFail(errorMsg));
  }
}

export function* applyRecommendationWorker(
  actions: PayloadAction<ApplyRecommendationRequest>
) {
  try {
    const uid = actions.payload.assetAllocationList.uid;
    if (!uid) {
      throw new Error("No uid in asset allocations list set");
    }
    const updatedAssetAllocationsList: AssetAllocationsList = JSON.parse(
      JSON.stringify(actions.payload.assetAllocationList)
    );

    let recommendedAssetAllocations = undefined;
    if (
      actions.payload.assetAllocationList.recommended &&
      actions.payload.assetAllocationList.recommended[
        actions.payload.recommendationId
      ]
    ) {
      const recommendedData =
        actions.payload.assetAllocationList.recommended[
          actions.payload.recommendationId
        ];

      recommendedAssetAllocations = JSON.parse(
        JSON.stringify(recommendedData.assetAllocations)
      );

      updatedAssetAllocationsList.current = recommendedAssetAllocations;
      console.log("Updated", updatedAssetAllocationsList);
      yield call(saveAssetAllocationsList, updatedAssetAllocationsList);

      recommendedAssetAllocations["uid"] = uid;
      console.log("Update other", recommendedAssetAllocations);
      yield call(saveAssetAllocations, recommendedAssetAllocations);

      const netWorthSummary: NetWorthSummary = yield call(
        getNetWorthSummary,
        uid
      );

      if (netWorthSummary) {
        const today = getCurrentDateString();

        if (!netWorthSummary.History[today]) {
          netWorthSummary.History[today] = {};
        }
        for (const Component of AssetComponents) {
          const key = Component as keyof typeof recommendedAssetAllocations;
          const componentTotal = calculateCategoryTotalRecursively(
            recommendedAssetAllocations[key]
          );
          const today = getCurrentDateString();
          netWorthSummary.History[today][String(key)] = componentTotal;
        }

        const newTotal = calculateCategoryTotalRecursively(
          recommendedAssetAllocations
        );
        netWorthSummary.History[today]["Total"] = newTotal;

        netWorthSummary.LastUpdated = today;

        yield call(saveNetWorthSummary, netWorthSummary);
        yield put(portfolioAction.applyRecommendationSuccess());

        if (updatedAssetAllocationsList.uid) {
          yield put(
            portfolioAction.loadWealthProfile(updatedAssetAllocationsList.uid)
          );
        }
      } else {
        throw new Error("NetWorth not found.");
      }
    } else {
      throw new Error("Recommended asset allocation not found.");
    }
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "Error applying recommendation";
    alert(errMsg);
    yield put(portfolioAction.applyRecommendationFail(errMsg));
  }
}

export function* applyRecommendationCompositionWorker(
  actions: PayloadAction<ApplyRecommendationCompostionRequest>
) {
  try {
    const uid = actions.payload.assetAllocationList.uid;
    if (!uid) {
      throw new Error("No uid in asset allocations list set");
    }
    const updatedAssetAllocationsList: AssetAllocationsList = JSON.parse(
      JSON.stringify(actions.payload.assetAllocationList)
    );

    let recommendedAssetAllocations = undefined;
    if (
      actions.payload.assetAllocationList.recommended &&
      actions.payload.assetAllocationList.recommended[
        actions.payload.recommendationId
      ]
    ) {
      const recommendedData =
        actions.payload.assetAllocationList.recommended[
          actions.payload.recommendationId
        ];

      recommendedAssetAllocations = JSON.parse(
        JSON.stringify(recommendedData.assetAllocations)
      );

      const currentTotal = calculateCategoryTotalRecursively(
        actions.payload.assetAllocationList.current
      );
      const newTotal = calculateCategoryTotalRecursively(
        recommendedAssetAllocations
      );
      const factor = currentTotal / newTotal;
      console.log(factor);
      recursiveMapper(recommendedAssetAllocations, factor);
      console.log("new recommendation", recommendedAssetAllocations);

      updatedAssetAllocationsList.current = recommendedAssetAllocations;
      console.log("Updated", updatedAssetAllocationsList);
      yield call(saveAssetAllocationsList, updatedAssetAllocationsList);

      recommendedAssetAllocations["uid"] = uid;
      console.log("Update other", recommendedAssetAllocations);
      yield call(saveAssetAllocations, recommendedAssetAllocations);

      const netWorthSummary: NetWorthSummary = yield call(
        getNetWorthSummary,
        uid
      );

      if (netWorthSummary) {
        const today = getCurrentDateString();

        if (!netWorthSummary.History[today]) {
          netWorthSummary.History[today] = {};
        }
        for (const Component of AssetComponents) {
          const key = Component as keyof typeof recommendedAssetAllocations;
          const componentTotal = calculateCategoryTotalRecursively(
            recommendedAssetAllocations[key]
          );
          const today = getCurrentDateString();
          netWorthSummary.History[today][String(key)] = componentTotal;
        }

        const newTotal = calculateCategoryTotalRecursively(
          recommendedAssetAllocations
        );
        netWorthSummary.History[today]["Total"] = newTotal;

        netWorthSummary.LastUpdated = today;

        yield call(saveNetWorthSummary, netWorthSummary);
        yield put(portfolioAction.applyRecommendationSuccess());

        if (updatedAssetAllocationsList.uid) {
          yield put(
            portfolioAction.loadWealthProfile(updatedAssetAllocationsList.uid)
          );
        }
      } else {
        throw new Error("NetWorth not found.");
      }
    } else {
      throw new Error("Recommended asset allocation not found.");
    }
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "Error applying recommendation";
    alert(errMsg);
    yield put(portfolioAction.applyRecommendationFail(errMsg));
  }
}

export function* portfolioWatcher() {
  yield takeEvery(portfolioAction.loadWealthProfile, loadWealthProfileWorker);
  yield takeEvery(portfolioAction.saveBankDetails, saveNewBankDetailsWorker);
  yield takeEvery(portfolioAction.deleteBankDetails, deleteBankWorker);
  yield takeEvery(
    portfolioAction.saveSyfePortfolio,
    saveNewSyfePortfolioWorker
  );
  yield takeEvery(
    portfolioAction.deleteSyfePortfolio,
    deleteSyfePortfolioWorker
  );
  yield takeEvery(
    portfolioAction.saveEndowusPortfolio,
    saveNewEndowusPortfolioWorker
  );
  yield takeEvery(
    portfolioAction.deleteEndowusPortfolio,
    deleteEndowusPortfolioWorker
  );
  yield takeEvery(
    portfolioAction.saveInvestmentDetails,
    saveNewInvestmentDetailsWorker
  );
  yield takeEvery(
    portfolioAction.deleteInvestmentDetails,
    deleteInvestmentWorker
  );
  yield takeEvery(
    portfolioAction.loadAssetAllocationList,
    getAssetAllocationsListWorker
  );
  yield takeEvery(
    portfolioAction.deleteRecommendation,
    deleteRecommendationWorker
  );
  yield takeEvery(
    portfolioAction.applyRecommendation,
    applyRecommendationWorker
  );
  yield takeEvery(
    portfolioAction.applyRecommendationComposition,
    applyRecommendationCompositionWorker
  );
  yield takeEvery(
    portfolioAction.saveOtherAssetDetails,
    saveNewOtherAssetWorker
  );
  yield takeEvery(
    portfolioAction.deleteOtherAssetDetails,
    deleteOtherAssetWorker
  );
}
