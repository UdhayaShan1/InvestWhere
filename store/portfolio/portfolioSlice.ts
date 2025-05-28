import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthSuccessPayload, CredentialUserProfile, FirebaseLoginRegisterProp, InvestUser, InvestUserProfile } from '../../types/auth.types';
import { BankEditForm, SyfeInterface, SyfeSaveRequest, WealthProfile } from '../../types/wealth.types';

const initialState: WealthProfile = {
    isLoading : false,
    error : null,
    NetWorth : null,
    Allocations : null
}

// store logged in user information
export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    loadWealthProfile : (state, _actions:PayloadAction<string>) => {
        state.isLoading = true;
    },
    loadWealthProfileSuccess : (state, actions:PayloadAction<WealthProfile>) => {
        state.isLoading = false;
        state.NetWorth = actions.payload.NetWorth;
        state.Allocations = actions.payload.Allocations;
    },
    loadWealthProfileFail : (state, actions:PayloadAction<string>) => {
        state.isLoading = false;
        state.error = actions.payload;
        state.NetWorth = null;
        state.Allocations = null;
    },
    saveBankDetails : (state, _actions:PayloadAction<BankEditForm>) => {
      state.isLoading = true;
    },
    saveBankDetailsSuccess : (state, _actions:PayloadAction<BankEditForm>) => {
      state.isLoading = false;
    },
    saveBankDetailsFail : (state, actions:PayloadAction<string>) => {
      state.isLoading = false;
      state.error = actions.payload;
    },
    deleteBankDetails : (state, _actions: PayloadAction<BankEditForm>) => {
      state.isLoading = true;
    },
    deleteBankDetailsSuccess : (state, _actions: PayloadAction<BankEditForm>) => {
      state.isLoading = false;
    },
    deleteBankDetailsFail : (state, actions: PayloadAction<string>) => {
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
      state.isLoading = true;
      state.error = actions.payload;
    },
    
  }
})

export const { actions: portfolioAction } = portfolioSlice

export default portfolioSlice.reducer
