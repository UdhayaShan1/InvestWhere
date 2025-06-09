import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f4f6fb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 28,
    color: "#22223b",
    alignSelf: "center",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: "column",
    marginBottom: 18,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  label: {
    fontWeight: "bold",
    color: "#3a3a40",
    fontSize: 16,
    marginBottom: 8,
  },
  value: {
    color: "#4a4e69",
    fontSize: 16,
  },

  // Verification styles
  verificationContainer: {
    flex: 1,
  },
  verificationStatusText: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 16,
  },
  verificationStatus: {
    marginBottom: 12,
  },
  verificationButtons: {
    gap: 10,
  },
  verificationButtonsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: "#4A6FA5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#4A6FA5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4A6FA5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryButtonText: {
    color: "#4A6FA5",
    fontSize: 14,
    fontWeight: "600",
  },

  deleteContainer: {
    marginTop: 32,
    alignItems: "center",
  },

  // Fixed Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20, // Add padding to prevent edge touching
  },
  modalView: {
    width: "90%", // Reduced from 85% to be more responsive
    maxWidth: 400, // Add maximum width constraint
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24, // Reduced padding
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    // Remove alignItems: "center" to prevent stretching
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#22223b",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    marginBottom: 16,
    color: "#444",
    fontSize: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#d1d1d6",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    color: "#22223b",
    width: "100%", // Ensure full width within container
    minHeight: 48, // Set minimum height
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    gap: 12, // Add gap between buttons
  },
});
