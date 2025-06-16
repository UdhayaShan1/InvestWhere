import { StyleSheet } from "react-native";
import { getCurrentDateString } from "../constants/date_helper";

export interface WealthProfile {
  isLoading?: boolean | null;
  error?: string | null;
  NetWorth?: NetWorthSummary | null;
  Allocations?: AssetAllocations | null;
  AllocationsList?: AssetAllocationsList | null;
}

export interface NetWorthSummary {
  uid: string;
  Total: number;
  History: { [month: string]: { [component: string]: number } };
  LastUpdated?: string;
}

export const AssetComponents = [
  "Bank",
  "Robos",
  "Investments",
  "CPF",
  "Crypto",
  "Others",
];

export interface AssetAllocations {
  uid: string;
  createdOn?: string;
  analysedOn?: string;
  portfolioStrategy?: string;
  projectedReturns?: string;
  Bank: { [key: string]: BankItems };
  Robos: {
    Syfe: SyfeInterface;
    Endowus: EndowusInterface;
  };
  Investments: { [key: string]: InvestmentItems };
  CPF: { [key: string]: CPFItems };
  Crypto: { [key: string]: InvestmentItems };
  Others: {
    [key: string]: OtherAssetItem;
  };
}

export interface AssetAllocationsList {
  uid?: string;
  recommended?: {
    [Id: string]: { assetAllocations: AssetAllocations; createdOn?: string };
  };
  current?: AssetAllocations;
}

export interface OtherAssetItem {
  amount: number;
  label: string;
}

export interface BankItems {
  [key: string]: number;
}

export interface InvestmentItems {
  [key: string]: number;
}

export interface CPFItems {
  OA: number;
  SA: number;
  MA: number;
}

export function isCustomSyfePortfolio(key: string) {
  return !SYFE_INTERFACE_KEYS.includes(key as keyof SyfeInterface);
}

export const SYFE_INTERFACE_KEYS: (keyof SyfeInterface)[] = [
  "core",
  "reitPlus",
  "incomePlus",
  "thematic",
  "downsideProtected",
  "cashManagement",
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
    cashPlusGuranteed: 0,
  },
};

export interface EndowusInterface {
  core: {
    flagshipTotal?: number;
    flagshipVeryConservative?: number;
    flagshipConservative?: number;
    flagshipMeasured?: number;
    flagshipBalanced?: number;
    flagshipAggressive?: number;
    flagshipVeryAggressive?: number;
    esgTotal?: number;
    esgVeryConservative?: number;
    esgConservative?: number;
    esgMeasured?: number;
    esgBalanced?: number;
    esgAggressive?: number;
    esgVeryAggressive?: number;
    factorsTotal?: number;
    factorsVeryConservative?: number;
    factorsConservative?: number;
    factorsMeasured?: number;
    factorsBalanced?: number;
    factorsAggressive?: number;
    factorsVeryAggressive?: number;
  };
  satellite: {
    technology?: number;
    chinaEquities?: number;
    realAssets?: number;
    megatrends?: number;
  };
  cashSmart: {
    secure?: number;
    enhanced?: number;
    ultra?: number;
  };
  income: {
    stableIncome?: number;
    higherIncome?: number;
    futureIncome?: number;
  };
  [key: string]: { [key: string]: number | undefined };
}

export const defaultEndowus: EndowusInterface = {
  core: {
    flagshipTotal: 0,
    flagshipVeryConservative: 0,
    flagshipConservative: 0,
    flagshipMeasured: 0,
    flagshipBalanced: 0,
    flagshipAggressive: 0,
    flagshipVeryAggressive: 0,
    esgTotal: 0,
    esgVeryConservative: 0,
    esgConservative: 0,
    esgMeasured: 0,
    esgBalanced: 0,
    esgAggressive: 0,
    esgVeryAggressive: 0,
    factorsTotal: 0,
    factorsVeryConservative: 0,
    factorsConservative: 0,
    factorsMeasured: 0,
    factorsBalanced: 0,
    factorsAggressive: 0,
    factorsVeryAggressive: 0,
  },
  satellite: {
    technology: 0,
    chinaEquities: 0,
    realAssets: 0,
    megatrends: 0,
  },
  cashSmart: {
    secure: 0,
    enhanced: 0,
    ultra: 0,
  },
  income: {
    stableIncome: 0,
    higherIncome: 0,
    futureIncome: 0,
  },
};

export const ENDOWUS_INTERFACE_KEYS: (keyof EndowusInterface)[] = [
  "core",
  "satellite",
  "cashSmart",
  "income",
];

export function isCustomEndowusPortfolio(key: string) {
  return !ENDOWUS_INTERFACE_KEYS.includes(key as keyof EndowusInterface);
}

export interface BankEditForm {
  [key: string]: number | string;
}

export interface InvestmentEditForm {
  [key: string]: number | string;
}

export interface OtherEditForm {
  AssetKey: string;
  amount: number;
  label: string;
}

export const EmptyEditForm: OtherEditForm = {
  AssetKey: "",
  amount: 0,
  label: "",
};


export interface SyfeSaveRequest {
  uid: string;
  syfeAllocation: SyfeInterface;
}

export interface SyfeDeleteRequest {
  uid: string;
  portfolioToDelete: string;
  syfeAllocation: SyfeInterface;
}

export interface EndowusSaveRequest {
  uid: string;
  endowusAllocation: EndowusInterface;
}

export interface EndowusDeleteRequest {
  uid: string;
  portfolioToDelete: string;
  endowusAllocation: EndowusInterface;
}

export interface RecommendationDeleteRequest {
  id: string;
  assetAllocationList: AssetAllocationsList;
}

export interface ApplyRecommendationRequest {
  assetAllocationList: AssetAllocationsList;
  recommendationId: string;
}

export interface ApplyRecommendationCompostionRequest {
  assetAllocationList: AssetAllocationsList;
  recommendationId: string;
}

export function CleanUpSyfeCustomFromEditForm(editForm: SyfeInterface) {
  const updatedForm: SyfeInterface = { ...editForm };
  for (const portfolio in editForm) {
    Object.keys(editForm[portfolio]).forEach((account) => {
      if (
        editForm[portfolio][account] === 0 &&
        isCustomSyfePortfolio(portfolio)
      ) {
        delete updatedForm[portfolio][account];
      }
    });
  }
  return updatedForm;
}

export function CleanUpEndowusCustomFromEditForm(editForm: EndowusInterface) {
  const updatedForm: EndowusInterface = { ...editForm };
  for (const portfolio in editForm) {
    Object.keys(editForm[portfolio]).forEach((account) => {
      if (
        editForm[portfolio][account] === 0 &&
        isCustomEndowusPortfolio(portfolio)
      ) {
        delete updatedForm[portfolio][account];
      }
    });
  }
  return updatedForm;
}

export function defaultAssetAllocations(uid: string): AssetAllocations {
  return {
    uid,
    Bank: {},
    Robos: {
      Syfe: { ...defaultSyfe },
      Endowus: { ...defaultEndowus },
    },
    Investments: {},
    CPF: {},
    Crypto: {},
    Others: {},
  };
}

export function defaultNetWorthSummary(uid: string): NetWorthSummary {
  const today = getCurrentDateString();
  return {
    uid,
    Total: 0,
    History: {
      [today]: {
        Bank: 0,
        Robos: 0,
        Investments: 0,
        CPF: 0,
        Crypto: 0,
        Others: 0,
      },
    },
    LastUpdated: today,
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
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  platformHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  platformIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  platformIconText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  platformName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  platformValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  nestedDetails: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  bankDetailsContainer: {
    marginTop: 4,
  },
  assetInfoRow: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#888",
    marginTop: 2,
  },

  dropdownContainer: {
    position: "relative",
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 220, // This remains the total height for the dropdown
    // --- Add these two lines ---
    display: "flex",
    flexDirection: "column",
    // ---------------------------
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemSelected: {
    backgroundColor: "#f0f5ff",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownItemTextSelected: {
    color: "#4A6FA5",
    fontWeight: "500",
  },
  accountIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    height: 50,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginRight: 4,
  },
  formInput: {
    flex: 1,
    height: 46,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  currentValueContainer: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
  },
  currentValueLabel: {
    fontSize: 12,
    color: "#666",
    marginRight: 4,
  },
  currentValue: {
    fontSize: 12,
    color: "#888",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
  },
  deleteButton: {
    backgroundColor: "#e53e3e",
  },
  cancelButton: {
    backgroundColor: "#718096",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  compactModalView: {
    width: "92%",
    maxWidth: 500,
    paddingHorizontal: 18,
    paddingVertical: 20,
    paddingBottom: 15,
    alignItems: "stretch",
  },
  modalScrollView: {
    maxHeight: "75%",
    width: "100%",
  },
  scrollViewContent: {
    paddingBottom: 15,
  },
  formContainer: {
    backgroundColor: "#f9fafc",
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eaeef2",
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
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeef2",
    flexDirection: "row",
    alignItems: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A6FA5",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#4A6FA5",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  addButtonText: {
    color: "#4A6FA5",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 4,
  },
  newItemForm: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: "#f0f4f8",
    borderRadius: 8,
    padding: 16, // Increased from 12
    paddingBottom: 20, // Extra padding at bottom
    borderWidth: 1,
    borderColor: "#e0e5eb",
  },
  saveButton: {
    backgroundColor: "#4A6FA5",
  },
  accountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  deleteAccountButton: {
    padding: 4,
    marginLeft: 8,
    borderRadius: 12,
  },
  dropdownScrollView: {
    maxHeight: 180, // Adjusted: Reduced to allow space for the "Add New Bank" button
    flexGrow: 0,
    // (e.g., if button is ~40-50px, 200 - 50 = 150)
    // flexShrink: 1, // Optional: consider adding if using flex layout for dropdownMenu's children
  },
  bankModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bankModalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: "70%",
  },
  bankModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeef2",
  },
  bankModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  bankModalCloseButton: {
    padding: 4,
  },
  bankModalList: {
    maxHeight: "80%",
  },
  bankModalItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  bankModalItemSelected: {
    backgroundColor: "#f0f5ff",
  },
  bankModalItemText: {
    fontSize: 16,
    color: "#333",
  },
  addNewBankButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eaeef2",
    backgroundColor: "#f9fafc",
  },
  addNewBankText: {
    fontSize: 16,
    color: "#4A6FA5",
    fontWeight: "500",
  },
  closeButton: {
    padding: 8,
  },
  modalDetailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  // Add these new styles
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  applyEntireButton: {
    backgroundColor: "#28a745",
    flex: 1,
  },
  applyCompositionButton: {
    backgroundColor: "#4A6FA5",
    flex: 1,
  },

  // Feedback Styles
  feedbackContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  feedbackToggleButton: {
    padding: 18,
    paddingBottom: 16,
  },
  feedbackToggleContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedbackToggleText: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  feedbackToggleTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 3,
  },
  feedbackToggleSubtitle: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    backgroundColor: "#f8fafe",
    borderBottomWidth: 1,
    borderBottomColor: "#e8f2ff",
  },
  feedbackHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedbackHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
    marginLeft: 12,
  },
  feedbackCloseButton: {
    padding: 4,
  },
  feedbackContent: {
    padding: 20,
  },
  feedbackSection: {
    marginBottom: 24,
  },
  feedbackSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#e8f2ff",
  },
  feedbackSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginLeft: 12,
  },
  feedbackMarkdownContainer: {
    backgroundColor: "#fafbfc",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4A6FA5",
  },
  feedbackDivider: {
    height: 1,
    backgroundColor: "#e8f2ff",
    marginVertical: 8,
  },
  feedbackFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e8f2ff",
  },
  feedbackAnalysisDate: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    fontStyle: "italic",
  },

  // Generate Analysis Button Styles
  generateAnalysisButton: {
    padding: 20,
    backgroundColor: "#f8fafe",
    borderWidth: 2,
    borderColor: "#4A6FA5",
    borderStyle: "dashed",
    borderRadius: 16,
  },
  generateAnalysisContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  generateAnalysisText: {
    flex: 1,
    marginLeft: 16,
    marginRight: 12,
  },
  generateAnalysisTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 6,
  },
  generateAnalysisSubtitle: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
  },

  // Generate Again Button Styles - Improved
  generateAgainContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fafbfc",
  },
  generateAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  generateAgainContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  generateAgainText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#4A6FA5",
    marginLeft: 6,
  },
  getVerifiedButton: {
    borderWidth: 2,
    borderColor: "#4A6FA5",
    borderStyle: "dashed",
  },
  quotaDisplayContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafe",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e8f2ff",
  },
  quotaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quotaTextContainer: {
    flex: 1,
  },
  quotaLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 2,
  },
  quotaValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  quotaValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  quotaTotal: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  quotaBadgeContainer: {
    marginLeft: 8,
  },
  quotaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quotaBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },

  // Quota Exhausted Styles
  quotaExhaustedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  quotaExhaustedIcon: {
    marginRight: 12,
  },
  quotaExhaustedContent: {
    flex: 1,
  },
  quotaExhaustedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 4,
  },
  quotaExhaustedSubtitle: {
    fontSize: 13,
    color: "#7f1d1d",
    lineHeight: 18,
  },

  // Compact Quota Styles
  compactQuotaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  compactQuotaText: {
    fontSize: 13,
    color: "#4A6FA5",
    fontWeight: "500",
    marginLeft: 6,
  },
});
