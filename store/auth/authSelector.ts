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

export {
    loggedInUserSelector,
    isLoadingSelector,
    errorSelector,
    currentUidSelector
}