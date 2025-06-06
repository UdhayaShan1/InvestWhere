import { RootState } from "../rootTypes"

export const netWorthSelector = (state : RootState) => {
    return state.portfolio.NetWorth;
}

export const assetAllocationSelector = (state : RootState) => {
    return state.portfolio.Allocations;
}

export const assetAllocationListSelector = (state : RootState) => {
    return state.portfolio.AllocationsList;
}

export const isLoadingSelector = (state : RootState) => {
    return state.portfolio.isLoading;
}