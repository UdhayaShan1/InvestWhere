import { RootState } from "../rootTypes"

export const netWorthSelector = (state : RootState) => {
    return state.portfolio.NetWorth;
}

export const assetAllocationSelector = (state : RootState) => {
    return state.portfolio.Allocations;
}