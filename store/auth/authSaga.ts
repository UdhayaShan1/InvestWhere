import { takeEvery, call, put } from "redux-saga/effects";
import { authAction } from "./authSlice";
import { signInWithEmailAndPassword, signOut, UserCredential, createUserWithEmailAndPassword } from "firebase/auth";
import { PayloadAction } from "@reduxjs/toolkit";
import { FirebaseLoginRegisterProp, UserProfile } from "../../types/auth.types";
import { auth } from "../../firebase/firebase";

export function* signInWithEmailAndPasswordWorker(action : PayloadAction<FirebaseLoginRegisterProp>) : Generator<any, void, any> {
    const {email, password} = action.payload;
    try {
        const credentials : UserCredential = yield call(signInWithEmailAndPassword, auth, email, password);
        console.log(credentials);
        console.log("success");
        const serializableUser : UserProfile = {
            uid: credentials.user.uid,
            email: credentials.user.email,
            displayName: credentials.user.displayName,
            photoURL: credentials.user.photoURL,
            emailVerified: credentials.user.emailVerified
        };
        yield put(authAction.signInWithEmailAndPasswordSuccess(serializableUser))
    } catch (error: any) {
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
        const serializableUser : UserProfile = {
            uid: credentials.user.uid,
            email: credentials.user.email,
            displayName: credentials.user.displayName,
            photoURL: credentials.user.photoURL,
            emailVerified: credentials.user.emailVerified
        };
        yield put(authAction.registerUserSuccess(serializableUser))
    } catch (error: any) {
        yield put(authAction.registerUserFail(error.message));
    }
}


export function* authWatcher() {
  yield takeEvery(authAction.signInWithEmailAndPassword, signInWithEmailAndPasswordWorker);
  yield takeEvery(authAction.logoutUser, logoutUserWorker);
  yield takeEvery(authAction.registerUser, createUserWithEmailAndPasswordWorker)
}