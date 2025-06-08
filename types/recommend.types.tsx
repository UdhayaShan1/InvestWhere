import { StyleSheet } from "react-native";
import { AssetAllocations } from "./wealth.types";

export interface RecommendationForm {
  currentNetWorth: number;
  age: number;
  incomeLevel: string;
  investmentHorizon: string;
  riskProfile: number;
  riskProfileString?: string;
  preferredRobos: {
    [key: string]: boolean;
  };
  customRobos?: string;
  preferredBrokers: {
    [key: string]: boolean;
  };
  customBroker?: string;
  additionalComments: string;
}

export const preferredRobos = [
  "Not Applicable",
  "Syfe",
  "Endowus",
  "StashAway",
];
export const preferredBrokers = [
  "Not Applicable",
  "Tiger",
  "Moomoo",
  "Interactive Brokers",
  "Saxo",
];

export const incomeLevels = [
  "Student",
  "Not Applicable",
  "Below $30,000",
  "$30,000 - $50,000",
  "$50,000 - $80,000",
  "$80,000 - $120,000",
  "$120,000 - $200,000",
  "Above $200,000",
];

export const investmentHorizons = [
  { label: "Short (<5 years)", value: "short" },
  { label: "Medium (5-10 years)", value: "medium" },
  { label: "Long (>10 years)", value: "long" },
];

export const riskLabels = ["Low", "Medium", "High", "AI Decide"];

export interface RecommendInitialState {
  assetAllocations: AssetAllocations | null;
  currentAssetFeedback: LLMFeedback | null;
  feedback: LLMFeedback | null;
  error: string;
  isLoading: boolean;
}

export interface LLMFeedback {
  marketInsights: string;
  searchDate: string;
  sources: string[];
  portfolioStrategy: string;
  projectedReturns: string;
}

export interface RecommendationResponse {
  feedback: LLMFeedback;
  recommendation: AssetAllocations;
}

export interface AnalysisResponse {
  feedback: LLMFeedback;
}

export const recommendStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 8, // Reduced from 24
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 8, // Reduced from 16
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c3e50",
    marginTop: 12,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 8, // Reduced from 16
    marginBottom: 12, // Reduced from 16
    borderRadius: 12,
    padding: 16, // Reduced from 20
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12, // Reduced from 16
    borderBottomWidth: 2,
    borderBottomColor: "#4A6FA5",
    paddingBottom: 6, // Reduced from 8
  },
  netWorthCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4A6FA5",
  },
  netWorthContent: {
    marginLeft: 12,
    flex: 1,
  },
  netWorthLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  netWorthValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4A6FA5",
  },
  inputContainer: {
    marginBottom: 16, // Reduced from 20
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    paddingVertical: 16,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
  },
  horizonContainer: {
    gap: 8, // Reduced from 12
  },
  horizonButton: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 14, // Reduced from 16
    paddingHorizontal: 16, // Reduced from 20
    alignItems: "center",
  },
  horizonButtonActive: {
    backgroundColor: "#4A6FA5",
    borderColor: "#4A6FA5",
  },
  horizonButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  horizonButtonTextActive: {
    color: "#fff",
  },
  riskContainer: {
    paddingVertical: 20,
    paddingHorizontal: 0,
  },
  slider: {
    width: "100%",
    height: 50,
    marginBottom: 20, // Increased spacing
  },
  sliderThumb: {
    backgroundColor: "#4A6FA5",
    width: 24,
    height: 24,
  },
  riskLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15, // Balanced padding for 4 items
  },
  riskLabel: {
    fontSize: 13, // Slightly smaller font for 4 items
    color: "#7f8c8d",
    fontWeight: "500",
    textAlign: "center",
    flex: 1, // Equal distribution
    flexWrap: "wrap", // Allow text wrapping if needed
  },
  riskLabelActive: {
    color: "#4A6FA5",
    fontWeight: "700",
    fontSize: 14, // Slightly larger when active
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12, // Reduced from 16
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 14, // Reduced from 16
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
    fontWeight: "500",
  },
  // New styles for custom input section
  customInputContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  customInputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  customInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4A6FA5",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  customInputIcon: {
    marginRight: 12,
  },
  customTextInput: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    paddingVertical: 12,
  },
  textAreaWrapper: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  textAreaHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  textAreaHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A6FA5",
    marginLeft: 8,
    flex: 1,
  },
  characterCount: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  characterCountText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  textArea: {
    fontSize: 16,
    color: "#374151",
    padding: 16,
    minHeight: 120,
    lineHeight: 22,
  },
  aiPoweredBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f2937",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: "center",
  },
  aiPoweredText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  submitContainer: {
    padding: 20,
    paddingHorizontal: 8,
  },
  submitButton: {
    backgroundColor: "#4A6FA5",
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4A6FA5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  spinning: {
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#374151",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalOptionSelected: {
    backgroundColor: "#f0f8ff",
    borderLeftWidth: 3,
    borderLeftColor: "#4A6FA5",
  },
  modalOptionTextSelected: {
    color: "#4A6FA5",
    fontWeight: "600",
  },
  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tipsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4A6FA5",
  },
  tipsButtonText: {
    fontSize: 14,
    color: "#4A6FA5",
    fontWeight: "600",
    marginLeft: 4,
  },
  tipsContainer: {
    backgroundColor: "#f8fcff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4A6FA5",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 12,
  },
  tipItem: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  tipHighlight: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#e8f4fd",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  tipHighlightText: {
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  riskDescription: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#4A6FA5",
  },
  riskDescriptionText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
    fontStyle: "italic",
  },
  netWorthInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  netWorthInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#4A6FA5",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  useCurrentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    borderWidth: 1,
    borderColor: "#4A6FA5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  useCurrentButtonText: {
    fontSize: 14,
    color: "#4A6FA5",
    fontWeight: "600",
  },
  currentPortfolioText: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 8,
    fontStyle: "italic",
  },
  selectedIncomeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#28a745",
  },
  selectedIncomeText: {
    fontSize: 14,
    color: "#065f46",
    fontWeight: "600",
    marginLeft: 8,
  },
});
