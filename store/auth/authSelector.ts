import { auth } from "../../firebase/firebase";
import { RootState } from "../rootTypes"

const loggedInUserSelector = (state : RootState) => {
    return state.auth;
}

const currentUidSelector = (state : RootState) => {
    return state.auth.CredProfile?.uid;
}

const errorSelector = (state : RootState) => {
    return state.auth.error;
}

const isLoadingSelector = (state : RootState) => {
    return state.auth.isLoading;
}

const isVerifiedSelector = (state : RootState) => {
    return state.auth.CredProfile?.emailVerified;
}

export {
    loggedInUserSelector,
    isLoadingSelector,
    errorSelector,
    currentUidSelector,
    isVerifiedSelector
}