import { takeEvery, call, put } from "redux-saga/effects";
import { authAction } from "./authSlice";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { PayloadAction } from "@reduxjs/toolkit";
import { FirebaseLoginProp, UserProfile } from "../../types/auth.types";
import { auth } from "../../firebase/firebase";

export function* signInWithEmailAndPasswordWorker(action : PayloadAction<FirebaseLoginProp>) : Generator<any, void, any> {
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

export function* authWatcher() {
  yield takeEvery(authAction.signInWithEmailAndPassword, signInWithEmailAndPasswordWorker);
}