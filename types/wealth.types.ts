import { StyleSheet } from "react-native";
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
    Bank : {[key: string]: BankItems};
    Robos : {
        Syfe : SyfeInterface
    };
    Investments : {[key : string] : number};
    CPF : {[key : string] : number};
    Crypto : {[key : string] : number};
    Others: {
    [key: string]: OtherAssetItem
    };
}

export interface OtherAssetItem {
  amount: number;
  label?: string;
  notes?: string;
}

export interface BankItems {
    savings: number;
    fixed_deposit: number;
    [key: string]: number;
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

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
  }).format(amount);
};

export const calculatePercentage = (value: number, total: number) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export function isJsonObject(value : any) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}


export const portFolioStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  netWorthContainer: {
    backgroundColor: "#4A6FA5",
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  netWorthLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    letterSpacing: 1.2,
  },
  netWorthValue: {
    color: "#ffffff",
    fontSize: 42,
    fontWeight: "bold",
    marginVertical: 8,
  },
  lastUpdated: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  categoryContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomColor: "#f0f0f0",
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  categoryPercentage: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  categoryValue: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginRight: 12,
  },
  expandIcon: {
    marginLeft: 5,
  },
  categoryDetails: {
    padding: 12,
  },
  assetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 15,
    color: "#444",
  },
  assetNote: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  assetValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  syfeGroup: {
    marginBottom: 16,
  },
  syfeGroupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginVertical: 24,
  },
  actionButton: {
    backgroundColor: "#4A6FA5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 6,
  },
  platformContainer: {
  borderRadius: 8,
  overflow: 'hidden',
  marginBottom: 8,
  backgroundColor: '#f9f9f9',
},
platformHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 12,
  backgroundColor: '#f9f9f9',
},
platformIcon: {
  width: 28,
  height: 28,
  borderRadius: 14,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
},
platformIconText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 16,
},
platformName: {
  fontSize: 16,
  fontWeight: '500',
  color: '#333',
},
platformValue: {
  fontSize: 16,
  fontWeight: '500',
  color: '#333',
},
nestedDetails: {
  paddingHorizontal: 12,
  paddingBottom: 12,
  backgroundColor: '#fff',
},
bankDetailsContainer: {
  marginTop: 4,
},
assetInfoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},
accountTypeIndicator: {
  width: 4,
  height: 24,
  borderRadius: 2,
  marginRight: 12,
},
accountTypeLabel: {
  fontSize: 12,
  color: '#888',
  marginTop: 2,
}
});