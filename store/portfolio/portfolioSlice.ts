import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthSuccessPayload, CredentialUserProfile, FirebaseLoginRegisterProp, InvestUser, InvestUserProfile } from '../../types/auth.types';
import { WealthProfile } from '../../types/wealth.types';

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
    loadWealthProfile : (state, actions:PayloadAction<string>) => {
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
    
  }
})

export const { actions: portfolioAction } = portfolioSlice

export default portfolioSlice.reducer
