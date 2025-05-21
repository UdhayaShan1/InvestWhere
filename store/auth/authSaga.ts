import { takeEvery, call, put } from "redux-saga/effects";
import { authAction } from "./authSlice";
import { signInWithEmailAndPassword, signOut, UserCredential, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { PayloadAction } from "@reduxjs/toolkit";
import { CredentialUserProfile, FirebaseLoginRegisterProp, InvestUserProfile } from "../../types/auth.types";
import { auth } from "../../firebase/firebase";
import { createDefaultProfile, deleteUserProfile, getUserProfile, saveUserProfile } from "../../firebase/services/profileService";
import { portfolioAction } from "../portfolio/portfolioSlice";
import { deleteWealthProfile } from "../../firebase/services/portfolioService";

export function* signInWithEmailAndPasswordWorker(action : PayloadAction<FirebaseLoginRegisterProp>) : Generator<any, void, any> {
    const {email, password} = action.payload;
    try {
        const credentials : UserCredential = yield call(signInWithEmailAndPassword, auth, email, password);
        const serializableCredUser : CredentialUserProfile = {
            uid: credentials.user.uid,
            email: credentials.user.email,
            displayName: credentials.user.displayName,
            photoURL: credentials.user.photoURL,
            emailVerified: credentials.user.emailVerified,
        };

        const retrievedProfile : InvestUserProfile = yield call(getUserProfile, credentials.user.uid, credentials.user.email || "");
        yield put(authAction.signInWithEmailAndPasswordSuccess({
          CredProfile: serializableCredUser,
          UserProfile: retrievedProfile
        }))
    } catch (error: any) {
      console.log(error);
        yield put(authAction.signInWithEmailAndPasswordFail(error.message));
    }
}

export function* logoutUserWorker(): Generator<any, void, any> {
  try {
    yield call(signOut, auth);
    yield put(authAction.logoutUserSuccess());
  } catch (error: any) {
    yield put(authAction.logoutUserFail(error.message));
  }
}

export function* createUserWithEmailAndPasswordWorker(action : PayloadAction<FirebaseLoginRegisterProp>) {
    const {email, password} = action.payload;
    try {
        const credentials : UserCredential = yield call(createUserWithEmailAndPassword, auth, email, password);
        const serializableUser : CredentialUserProfile = {
            uid: credentials.user.uid,
            email: credentials.user.email,
            displayName: credentials.user.displayName,
            photoURL: credentials.user.photoURL,
            emailVerified: credentials.user.emailVerified,
        };

        const defaultProfile: InvestUserProfile = yield call(createDefaultProfile, serializableUser.uid, serializableUser.email);
        yield call(saveUserProfile, defaultProfile);

        yield put(portfolioAction.loadWealthProfile(serializableUser.uid));
        
        yield put(authAction.registerUserSuccess({CredProfile : serializableUser, UserProfile : defaultProfile}));
    } catch (error: any) {
        yield put(authAction.registerUserFail(error.message));
    }
}

export function* deleteUserWorker() {
  try {
    const currentUser = auth.currentUser;
    const uid = currentUser?.uid;
    if (!currentUser) {
      throw new Error("No user is currently logged in")
    }
    if (currentUser && uid) {
      yield call(deleteWealthProfile, currentUser.uid)
      yield call(deleteUserProfile, uid);
      yield call(deleteUser, currentUser);
    }
    yield put(authAction.deleteUserSuccess());

  } catch (error: any) {
    console.error(error);
    yield put(authAction.deleteUserProfileFail(error.message));
  }
}

export function* editUserProfileWorker(action: PayloadAction<InvestUserProfile>): Generator<any, void, any> {
  try {
    const editResult : boolean = yield call(saveUserProfile, action.payload);
    if (!editResult) {
      throw new Error("Failed to save profile");
    }
    yield put(authAction.editUserProfileSuccess(action.payload));

  } catch (error: any) {
    console.error(error);
    yield put(authAction.editUserProfileFail(error.message));
  }
}


export function* authWatcher() {
  yield takeEvery(authAction.signInWithEmailAndPassword, signInWithEmailAndPasswordWorker);
  yield takeEvery(authAction.logoutUser, logoutUserWorker);
  yield takeEvery(authAction.registerUser, createUserWithEmailAndPasswordWorker)
  yield takeEvery(authAction.deleteUser, deleteUserWorker)
  yield takeEvery(authAction.editUserProfile, editUserProfileWorker)
}