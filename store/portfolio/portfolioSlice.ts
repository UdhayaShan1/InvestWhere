import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthSuccessPayload,
  CredentialUserProfile,
  FirebaseLoginRegisterProp,
  InvestUser,
  InvestUserProfile,
} from "../../types/auth.types";
import {
  ApplyRecommendationCompostionRequest,
  ApplyRecommendationRequest,
  AssetAllocationsList,
  BankEditForm,
  EndowusDeleteRequest,
  EndowusSaveRequest,
  InvestmentEditForm,
  OtherEditForm,
  RecommendationDeleteRequest,
  SyfeDeleteRequest,
  SyfeInterface,
  SyfeSaveRequest,
  WealthProfile,
} from "../../types/wealth.types";

const initialState: WealthProfile = {
  isLoading: false,
  error: null,
  NetWorth: null,
  Allocations: null,
  AllocationsList: null,
};

// store logged in user information
export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    loadWealthProfile: (state, _actions: PayloadAction<string>) => {
      state.isLoading = true;
    },
    loadWealthProfileSuccess: (
      state,
      actions: PayloadAction<WealthProfile>
    ) => {
      state.isLoading = false;
      state.NetWorth = actions.payload.NetWorth;
      state.Allocations = actions.payload.Allocations;
      state.AllocationsList = actions.payload.AllocationsList;
    },
    loadWealthProfileFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
      state.NetWorth = null;
      state.Allocations = null;
    },
    saveBankDetails: (state, _actions: PayloadAction<BankEditForm>) => {
      state.isLoading = true;
    },
    saveBankDetailsSuccess: (state, _actions: PayloadAction<BankEditForm>) => {
      state.isLoading = false;
    },
    saveBankDetailsFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    deleteBankDetails: (state, _actions: PayloadAction<BankEditForm>) => {
      state.isLoading = true;
    },
    deleteBankDetailsSuccess: (
      state,
      _actions: PayloadAction<BankEditForm>
    ) => {
      state.isLoading = false;
    },
    deleteBankDetailsFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    saveSyfePortfolio: (state, actions: PayloadAction<SyfeSaveRequest>) => {
      state.isLoading = true;
    },
    saveSyfePortfolioSuccess: (state) => {
      state.isLoading = false;
    },
    saveSyfePortfolioFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    deleteSyfePortfolio: (state, actions: PayloadAction<SyfeDeleteRequest>) => {
      state.isLoading = true;
    },
    deleteSyfePortfolioSuccess: (state) => {
      state.isLoading = false;
    },
    deleteSyfePortfolioFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    saveInvestmentDetails: (
      state,
      actions: PayloadAction<InvestmentEditForm>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    saveInvestmentDetailsSuccess: (state) => {
      state.isLoading = false;
    },
    saveInvestmentDetailsFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    saveOtherAssetDetails: (state, actions: PayloadAction<OtherEditForm>) => {
      state.isLoading = true;
      state.error = null;
    },
    saveOtherAssetDetailsSuccess: (state) => {
      state.isLoading = false;
    },
    saveOtherAssetDetailsFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    deleteOtherAssetDetails: (state, actions: PayloadAction<OtherEditForm>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteOtherAssetDetailsSuccess: (state) => {
      state.isLoading = false;
    },
    deleteOtherAssetDetailsFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    deleteInvestmentDetails: (
      state,
      actions: PayloadAction<InvestmentEditForm>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteInvestmentDetailsSuccess: (state) => {
      state.isLoading = false;
    },
    deleteInvestmentDetailsFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    loadAssetAllocationList: (state, _actions: PayloadAction<string>) => {
      state.isLoading = true;
    },
    loadAssetAllocationListSuccess: (
      state,
      actions: PayloadAction<AssetAllocationsList>
    ) => {
      state.isLoading = false;
      state.AllocationsList = actions.payload;
    },
    loadAssetAllocationListFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
      state.AllocationsList = null;
    },
    deleteRecommendation: (
      state,
      actions: PayloadAction<RecommendationDeleteRequest>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteRecommendationSuccess: (state) => {
      state.isLoading = false;
    },
    deleteRecommendationFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    applyRecommendation: (
      state,
      actions: PayloadAction<ApplyRecommendationRequest>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    applyRecommendationSuccess: (state) => {
      state.isLoading = false;
    },
    applyRecommendationFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    applyRecommendationComposition: (
      state,
      actions: PayloadAction<ApplyRecommendationCompostionRequest>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    applyRecommendationCompositionSuccess: (state) => {
      state.isLoading = false;
    },
    applyRecommendationCompositionFail: (
      state,
      actions: PayloadAction<string>
    ) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    saveEndowusPortfolio: (
      state,
      actions: PayloadAction<EndowusSaveRequest>
    ) => {
      state.isLoading = true;
    },
    saveEndowusPortfolioSuccess: (state) => {
      state.isLoading = false;
    },
    saveEndowusPortfolioFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    deleteEndowusPortfolio: (
      state,
      actions: PayloadAction<EndowusDeleteRequest>
    ) => {
      state.isLoading = true;
    },
    deleteEndowusPortfolioSuccess: (state) => {
      state.isLoading = false;
    },
    deleteEndowusPortfolioFail: (state, actions: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
  },
});

export const { actions: portfolioAction } = portfolioSlice;

export default portfolioSlice.reducer;
