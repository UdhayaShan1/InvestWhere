import { RootState } from "../rootTypes"

const loggedInUserSelector = (state : RootState) => {
    return state.auth.user;
}

export {
    loggedInUserSelector
}