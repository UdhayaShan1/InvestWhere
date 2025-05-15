import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CredentialUserProfile, FirebaseLoginRegisterProp, InvestUser } from '../../types/auth.types';

const initialState: InvestUser = {
    isLoading : false,
    error : null,
    credProfile : null,
    userProfile : null
}

// store logged in user information
export const authSlice = createSlice({
  name: 'slice',
  initialState,
  reducers: {
    signInWithEmailAndPassword : (state, actions:PayloadAction<FirebaseLoginRegisterProp>) => {
        state.isLoading = true;
        state.error = initialState.error;
        state.credProfile = initialState.credProfile;
        state.userProfile = initialState.userProfile;
    },
    signInWithEmailAndPasswordSuccess : (state, actions:PayloadAction<CredentialUserProfile>) => {
        state.isLoading = false;
        state.error = null;
        state.credProfile = actions.payload;
    },
    signInWithEmailAndPasswordFail : (state, actions:PayloadAction<string>) => {
        state.isLoading = false;
        state.error = actions.payload;
    },
    registerUser : (state, actions:PayloadAction<FirebaseLoginRegisterProp>) => {
        state.isLoading = true;
        state.error = initialState.error;
        state.credProfile = initialState.credProfile;
        state.userProfile = initialState.userProfile;
    },
    registerUserSuccess : (state, actions:PayloadAction<CredentialUserProfile>) => {
        state.isLoading = false;
        state.credProfile = actions.payload;
    },
    registerUserFail : (state, action:PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
    },
    logoutUser : (state) => {
        state.isLoading = true;
    },
    logoutUserSuccess : (state) => {
        state.isLoading = false;
        state.error = null;
        state.credProfile = initialState.credProfile;
        state.userProfile = initialState.userProfile;
    },
    logoutUserFail : (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
    },
  }
})

export const { actions: authAction } = authSlice

export default authSlice.reducer
