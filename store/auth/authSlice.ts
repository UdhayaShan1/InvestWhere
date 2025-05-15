import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FirebaseLoginRegisterProp, InvestUser, UserProfile } from '../../types/auth.types';

const initialState: InvestUser = {
    isLoading : false,
    error : null,
    user : null
}

// store logged in user information
export const authSlice = createSlice({
  name: 'slice',
  initialState,
  reducers: {
    signInWithEmailAndPassword : (state, actions:PayloadAction<FirebaseLoginRegisterProp>) => {
        state.isLoading = true;
        state.error = initialState.error;
        state.user = initialState.user;
    },
    signInWithEmailAndPasswordSuccess : (state, actions:PayloadAction<UserProfile>) => {
        state.isLoading = false;
        state.error = null;
        state.user = actions.payload;
    },
    signInWithEmailAndPasswordFail : (state, actions:PayloadAction<string>) => {
        state.isLoading = false;
        state.error = actions.payload;
    },
    registerUser : (state, actions:PayloadAction<FirebaseLoginRegisterProp>) => {
        state.isLoading = true;
        state.error = null;
        state.user = null;
    },
    registerUserSuccess : (state, actions:PayloadAction<UserProfile>) => {
        state.isLoading = false;
        state.user = actions.payload;
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
        state.user = null;
    },
    logoutUserFail : (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
    },
  }
})

export const { actions: authAction } = authSlice

export default authSlice.reducer
