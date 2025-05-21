import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthSuccessPayload, CredentialUserProfile, FirebaseLoginRegisterProp, InvestUser, InvestUserProfile } from '../../types/auth.types';

const initialState: InvestUser = {
    isLoading : false,
    error : null,
    CredProfile : null,
    UserProfile : null,
    WealthProfile : null
}

// store logged in user information
export const authSlice = createSlice({
  name: 'slice',
  initialState,
  reducers: {
    signInWithEmailAndPassword : (state, actions:PayloadAction<FirebaseLoginRegisterProp>) => {
        state.isLoading = true;
        state.error = initialState.error;
        state.CredProfile = initialState.CredProfile;
        state.UserProfile = initialState.UserProfile;
    },
    signInWithEmailAndPasswordSuccess : (state, actions:PayloadAction<AuthSuccessPayload>) => {
        state.isLoading = false;
        state.error = null;
        state.CredProfile = actions.payload.CredProfile;
        state.UserProfile = actions.payload.UserProfile;
    },
    signInWithEmailAndPasswordFail : (state, actions:PayloadAction<string>) => {
        state.isLoading = false;
        state.error = actions.payload;
    },
    registerUser : (state, actions:PayloadAction<FirebaseLoginRegisterProp>) => {
        state.isLoading = true;
        state.error = initialState.error;
        state.CredProfile = initialState.CredProfile;
        state.UserProfile = initialState.UserProfile;
    },
    registerUserSuccess : (state, actions:PayloadAction<AuthSuccessPayload>) => {
        state.isLoading = false;
        state.CredProfile = actions.payload.CredProfile;
        state.UserProfile = actions.payload.UserProfile;
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
        state.CredProfile = initialState.CredProfile;
        state.UserProfile = initialState.UserProfile;
    },
    logoutUserFail : (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
    },
    deleteUser: (state) => {
        state.isLoading = true;
    },
    deleteUserSuccess: (state) => {
        state.isLoading = false;
        state.error = null;
        state.CredProfile = initialState.CredProfile;
        state.UserProfile = initialState.UserProfile;
    },
    deleteUserProfileFail: (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
    },
    editUserProfile: (state, action: PayloadAction<InvestUserProfile>) => {
        state.isLoading = true;
    },
    editUserProfileSuccess: (state, action: PayloadAction<InvestUserProfile>) => {
        state.isLoading = false;
        state.error = initialState.error;
        state.UserProfile = action.payload;
    },
    editUserProfileFail: (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
    },
  }
})

export const { actions: authAction } = authSlice

export default authSlice.reducer
