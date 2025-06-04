import { StyleSheet } from "react-native";
import { stringToDate } from "../constants/date_helper";
import { NetWorthSummary } from "./wealth.types";
import { PrivateUserProfileForLLM } from "./auth.types";

export const tabDescriptions: { [key: string]: string } = {
  networth: "Track your complete financial journey here!",
  component: "Dive deep into individual components here!",
};

export const formatDateLabel = (dateString: string) => {
  const date = stringToDate(dateString);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${month}/${day}`;
};

export const getPastDate = (months: number): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
};

export type DateRangeOption = "all" | "1m" | "3m" | "6m" | "1y";

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
  legend?: string[];
}

export const initialChartData: ChartData = {
  labels: [],
  datasets: [{ data: [] }],
};

export interface AnalyticsLLMResult {
  isLoading?: boolean;
  error?: string | null;
  netWorthSummary?: LLMSummaryRecord | null;
}

export interface NetWorthLLMRequest {
  uid?: string;
  NetWorthHistory: { [month: string]: { [component: string]: number } };
  UserProfile?: PrivateUserProfileForLLM;
}

export interface LLMSummaryRecord {
  uid: string;
  createdOn: string;
  netWorthFeedback?: string;
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },

  // Header Styles
  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    fontWeight: "300",
  },

  // Tab Navigation Styles
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 15,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  tabButtonActive: {
    backgroundColor: "#4A6FA5",
    shadowColor: "#4A6FA5",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabIcon: {
    marginRight: 8,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A6FA5",
  },
  tabButtonTextActive: {
    color: "#fff",
  },

  // Content Styles
  contentContainer: {
    flex: 1,
  },
  contentWrapper: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  // Chart and Analytics Styles
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginVertical: 20,
    marginTop: 10,
  },
  rangeSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  rangeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 50,
    alignItems: "center",
  },
  rangeButtonSelected: {
    backgroundColor: "#4A6FA5",
    shadowColor: "#4A6FA5",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  rangeButtonText: {
    color: "#4A6FA5",
    fontWeight: "600",
    fontSize: 14,
  },
  rangeButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 15,
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },

  // New Selector Card Styles
  selectorCard: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  selectorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginLeft: 8,
  },
  selectorSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 16,
    lineHeight: 20,
  },

  // Modern Dropdown Styles
  modernDropdown: {
    borderWidth: 1,
    borderColor: "#e1e8ed",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
  },
  modernDropdownActive: {
    borderColor: "#4A6FA5",
    backgroundColor: "#f0f4f8",
    borderWidth: 2,
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  componentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  componentIconText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  componentInfo: {
    flex: 1,
  },
  componentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 2,
  },
  componentType: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  placeholderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  placeholderText: {
    fontSize: 16,
    color: "#bbb",
    marginLeft: 12,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    paddingHorizontal: 20,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
  },
  modalItemSelected: {
    backgroundColor: "#e6f3ff",
    borderWidth: 1,
    borderColor: "#4A6FA5",
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 2,
  },
  modalItemTextSelected: {
    color: "#4A6FA5",
  },
  modalItemSubtext: {
    fontSize: 12,
    color: "#7f8c8d",
  },

  // Empty State Styles
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7f8c8d",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#bbb",
    textAlign: "center",
    lineHeight: 20,
  },
});
