import { RootState } from "../rootTypes"

const loggedInUserSelector = (state : RootState) => {
    return state.auth.user;
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
    errorSelector
}