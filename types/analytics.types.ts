import { StyleSheet } from "react-native";

export const tabDescriptions: { [key: string]: string } = {
  networth: "Track your complete financial journey here!",
  component: "Dive deep into individual components here!",
};

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
});
