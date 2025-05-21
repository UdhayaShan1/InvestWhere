import { getCurrentDateString } from "../constants/date_helper";

export interface WealthProfile {
    isLoading?: boolean | null
    error?: string | null
    NetWorth?: NetWorthSummary | null;
    Allocations?: AssetAllocations | null;
}

export interface NetWorthSummary {
    uid: string;
    Total : number;
    History : {[month : string] : number};
    LastUpdated?: string;
}

export interface AssetAllocations {
    uid: string;
    Bank : {[key : string] : number};
    Robos : {
        Syfe : SyfeInterface
    };
    Investments : {[key : string] : number};
    CPF : {[key : string] : number};
    Crypto : {[key : string] : number};
    Others: {
    [key: string]: {
        amount: number;
        label?: string;
        notes?: string;
    }
    };
}

export interface SyfeInterface {
  core?: {
    equity100?: number;
    growth?: number;
    balanced?: number;
    defensive?: number;
  };
  reitPlus?: {
    standard?: number;
    withRiskManagement?: number;
  };
  incomePlus?: {
    preserve?: number;
    enhance?: number;
  };
  thematic?: {
    chinaGrowth?: number;
    esgCleanEnergy?: number;
    disruptiveTechnology?: number;
    healthcareInnovation?: number;
  };
  downsideProtected?: {
    protectedSP500: number;
  };
  cashManagement?: {
    cashPlusFlexi?: number;
  };
}

export const defaultSyfe: SyfeInterface = { 
    core: {
        equity100: 0,
        growth: 0,
        balanced: 0,
        defensive: 0,
    },
    reitPlus: {
        standard: 0,
        withRiskManagement: 0,
    },
    incomePlus: {
        preserve: 0,
        enhance: 0,
    },
    thematic: {
        chinaGrowth: 0,
        esgCleanEnergy: 0,
        disruptiveTechnology: 0,
        healthcareInnovation: 0,
    },
    downsideProtected: {
        protectedSP500: 0,
    },
    cashManagement: {
        cashPlusFlexi: 0,
    }
};

export function defaultAssetAllocations(uid: string): AssetAllocations {
    return {
        uid,
        Bank: {},
        Robos: {
            Syfe: { ...defaultSyfe }
        },
        Investments: {},
        CPF: {},
        Crypto: {},
        Others: {}
    };
}

export function defaultNetWorthSummary(uid: string): NetWorthSummary {
    const today = getCurrentDateString();
    return {
        uid,
        Total: 0,
        History: { [today]: 0 },
        LastUpdated: today
    };
}
