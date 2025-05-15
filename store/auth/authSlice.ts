import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FirebaseLoginProp, FirebaseLoginSuccess, InvestUser, UserProfile } from '../../types/auth.types';
import { UserCredential } from 'firebase/auth';

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
    signInWithEmailAndPassword : (state, actions:PayloadAction<FirebaseLoginProp>) => {
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
  }
})

export const { actions: authAction } = authSlice

export default authSlice.reducer
