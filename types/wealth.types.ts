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
    Investments : {[key : string] : InvestmentItems};
    CPF : {[key : string] : CPFItems};
    Crypto : {[key : string] : InvestmentItems};
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
    [key: string]: number;
}

export interface InvestmentItems {
    amount:number;
    [key: string]: number;
}

export interface CPFItems {
  OA: number; 
  SA: number;
  MA: number;
}

export function isCustomSyfePortfolio(key : string) {
  return !SYFE_INTERFACE_KEYS.includes(key as keyof SyfeInterface);
}

export const SYFE_INTERFACE_KEYS: (keyof SyfeInterface)[] = [
  "core",
  "reitPlus",
  "incomePlus",
  "thematic",
  "downsideProtected",
  "cashManagement"
];
export interface SyfeInterface {
  core: {
    equity100?: number;
    growth?: number;
    balanced?: number;
    defensive?: number;
  };
  reitPlus: {
    standard?: number;
    withRiskManagement?: number;
  };
  incomePlus: {
    preserve?: number;
    enhance?: number;
  };
  thematic: {
    chinaGrowth?: number;
    esgCleanEnergy?: number;
    disruptiveTechnology?: number;
    healthcareInnovation?: number;
  };
  downsideProtected: {
    protectedSP500?: number;
  };
  cashManagement: {
    cashPlusFlexi?: number;
    cashPlusGuranteed?: number;
  };
  [key: string]: { [key: string]: number | undefined };
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
        cashPlusGuranteed : 0,
    }
};


export interface BankEditForm {
  [key: string]: number | string;
}

export interface SyfeSaveRequest {
  uid : string,
  syfeAllocation : SyfeInterface
}

export interface SyfeDeleteRequest {
  uid : string, 
  portfolioToDelete : string;
  syfeAllocation : SyfeInterface
}

export function CleanUpSyfeCustomFromEditForm(editForm : SyfeInterface) {
  const updatedForm : SyfeInterface = {...editForm}
  for (const portfolio in editForm) {
    Object.keys(editForm[portfolio]).forEach(account => {
      if (editForm[portfolio][account] === 0 && isCustomSyfePortfolio(portfolio)) {
        delete updatedForm[portfolio][account];
      }
    })
  }
  return updatedForm;
}

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

export const PORTFOLIO_COLORS = [
  "blue", // Bank (blue)
  "red", // Robos (red)
  "teal", // Investments (teal)
  "yellow", // CPF (yellow)
  "purple", // Crypto (purple)
  "green", // Others (green)
];


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
},

dropdownContainer: {
  position: 'relative',
  zIndex: 1000,
},
dropdownButton: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 15,
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
},
dropdownButtonText: {
  fontSize: 16,
  color: '#333',
},
dropdownMenu: {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  marginTop: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  maxHeight: 220, // This remains the total height for the dropdown
  // --- Add these two lines ---
  display: 'flex',
  flexDirection: 'column',
  // ---------------------------
},
dropdownItem: {
  paddingVertical: 12,
  paddingHorizontal: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
},
dropdownItemSelected: {
  backgroundColor: '#f0f5ff',
},
dropdownItemText: {
  fontSize: 16,
  color: '#333',
},
dropdownItemTextSelected: {
  color: '#4A6FA5',
  fontWeight: '500',
},
accountIndicator: {
  width: 12,
  height: 12,
  borderRadius: 6,
  marginRight: 8,
},
inputLabel: {
  fontSize: 16,
  fontWeight: '500',
  color: '#444',
},
inputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#d1d5db',
  height: 50,
  paddingHorizontal: 12,
},
currencySymbol: {
  fontSize: 16,
  fontWeight: '500',
  color: '#666',
  marginRight: 4,
},
formInput: {
  flex: 1,
  height: 46,
  fontSize: 16,
  color: '#333',
  paddingVertical: 8,
},
currentValueContainer: {
  flexDirection: 'row',
  marginTop: 6,
  alignItems: 'center',
},
currentValueLabel: {
  fontSize: 12,
  color: '#666',
  marginRight: 4,
},
currentValue: {
  fontSize: 12,
  color: '#888',
},
buttonRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
actionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  flex: 0.48,
},
deleteButton: {
  backgroundColor: '#e53e3e',
},
cancelButton: {
  backgroundColor: '#718096',
},
actionButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '500',
  marginLeft: 6,
},
compactModalView: {
  width: "92%",
  maxWidth: 500,
  paddingHorizontal: 18,
  paddingVertical: 20,
  paddingBottom: 15,
  alignItems: 'stretch',
},
modalScrollView: {
  maxHeight: '75%',  
  width: '100%',
},
scrollViewContent: {
  paddingBottom: 15, 
},
formContainer: {
  backgroundColor: '#f9fafc',
  borderRadius: 10,
  padding: 14,
  marginTop: 12,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: '#eaeef2',
},
profileInfo: {
  marginBottom: 12,
},
inputContainer: {
  marginBottom: 16,
},
formActions: {
  marginTop: 16,
},
selectedBankTitle: {
  fontSize: 17,
  fontWeight: '600',
  color: '#333',
  marginBottom: 12,
  paddingBottom: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#eaeef2',
  flexDirection: 'row',
  alignItems: 'center',
},
labelContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
},

sectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
},
addButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 6,
  paddingHorizontal: 10,
},
addButtonText: {
  color: '#4A6FA5',
  fontSize: 16,
  fontWeight: '500',
  marginLeft: 4,
},
newItemForm: {
  marginTop: 8,
  marginBottom: 16,
  backgroundColor: '#f0f4f8',
  borderRadius: 8,
  padding: 16,  // Increased from 12
  paddingBottom: 20, // Extra padding at bottom
  borderWidth: 1,
  borderColor: '#e0e5eb',
},
saveButton: {
  backgroundColor: '#4A6FA5',
},
accountHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 6,
},
deleteAccountButton: {
  padding: 4,
  marginLeft: 8,
  borderRadius: 12,
},
dropdownScrollView: {
  maxHeight: 180, // Adjusted: Reduced to allow space for the "Add New Bank" button
  flexGrow:0,
                  // (e.g., if button is ~40-50px, 200 - 50 = 150)
  // flexShrink: 1, // Optional: consider adding if using flex layout for dropdownMenu's children
},
bankModalContainer: {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
bankModalContent: {
  backgroundColor: '#fff',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingBottom: 20,
  maxHeight: '70%',
},
bankModalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#eaeef2',
},
bankModalTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#333',
},
bankModalCloseButton: {
  padding: 4,
},
bankModalList: {
  maxHeight: '80%',
},
bankModalItem: {
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
},
bankModalItemSelected: {
  backgroundColor: '#f0f5ff',
},
bankModalItemText: {
  fontSize: 16,
  color: '#333',
},
addNewBankButton: {
  padding: 16,
  borderTopWidth: 1,
  borderTopColor: '#eaeef2',
  backgroundColor: '#f9fafc',
},
addNewBankText: {
  fontSize: 16,
  color: '#4A6FA5',
  fontWeight: '500',
},

});