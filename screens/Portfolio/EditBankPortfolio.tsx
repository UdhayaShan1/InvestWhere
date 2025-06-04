import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BankEditForm,
  formatCurrency,
  PORTFOLIO_COLORS,
  portFolioStyles as styles,
} from "../../types/wealth.types";
import { styles as portfolioStyles } from "../Profile/styles";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import {
  assetAllocationSelector,
  isLoadingSelector,
} from "../../store/portfolio/portfolioSelector";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import LoadingButton from "../../component/LoadingButton";
import { portfolioAction } from "../../store/portfolio/portfolioSlice";
import { currentUidSelector } from "../../store/auth/authSelector";

interface EditBankPortfolioProps {
  editModal: boolean;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMainBankSelections: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
}

export function EditBankPortfolio({
  editModal,
  setEditModal,
  setMainBankSelections,
}: EditBankPortfolioProps) {
  const dispatch = useAppDispatch();
  const saveLoading = useAppSelector(isLoadingSelector);
  const assetAllocation = useAppSelector(assetAllocationSelector);
  const uid = useAppSelector(currentUidSelector);

  const [availBanks, setAvailBanks] = useState<string[]>([]);
  const [bankSelected, setBankSelected] = useState<string | null>(null);

  const [editForm, setEditForm] = useState<BankEditForm>({});
  const [bankSelections, setBankSelections] = useState<{
    [key: string]: boolean;
  }>({ dropdownOpen: false });

  const [addNewBank, setAddNewBank] = useState(false);
  const [newBankName, setNewBankName] = useState("");

  const [addingBankAccount, setAddingBankAccount] = useState(false);
  const [newBankAccountName, setNewBankAccountName] = useState("");
  const [newBankAccountAmount, setNewBankAccountAmount] = useState(0);
  const [allAccountKeys, setAllAccountKeys] = useState<string[]>([]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [lastSavedBank, setLastSavedBank] = useState("");

  const [bankModalVisible, setBankModalVisible] = useState(false);

  useEffect(() => {
    if (editModal) {
      if (availBanks.length > 0) {
        if (lastSavedBank && availBanks.includes(lastSavedBank)) {
          setBankSelected(lastSavedBank);
        } else {
          setBankSelected(availBanks[0]);
        }
      } else {
        setBankSelected(null);
      }

      if (!bankSelected || !availBanks.includes(bankSelected || "")) {
        setEditForm({});
      }
    }
  }, [editModal]);

  useEffect(() => {
    if (addNewBank) {
      setNewBankName("");
    }
  }, [addNewBank]);

  //populate avail banks for droplist
  useEffect(() => {
    let availBanksList: string[] = [];
    Object.keys(assetAllocation?.Bank || {}).forEach((bankName) =>
      availBanksList.push(bankName)
    );
    setAvailBanks(availBanksList as string[]);
  }, [assetAllocation?.Bank]);

  //populate initial edit form with current bank accounts
  useEffect(() => {
    if (bankSelected && assetAllocation?.Bank[bankSelected]) {
      const newFormValues: BankEditForm = { Bank: bankSelected };

      Object.keys(assetAllocation.Bank[bankSelected]).forEach((key) => {
        newFormValues[key] = assetAllocation.Bank[bankSelected][key];
      });

      setEditForm(newFormValues);
    }
  }, [bankSelected, assetAllocation?.Bank]);

  //Get all bank account names
  useEffect(() => {
    if (assetAllocation && bankSelected) {
      const editFormKeys = Object.keys(editForm).filter(
        (key) => key !== "Bank"
      );
      setAllAccountKeys(Array.from(editFormKeys));
    }
  }, [editForm, bankSelected, assetAllocation]);

  const handleAddNewBank = () => {
    if (!newBankName || newBankName.trim() === "") {
      alert("Please enter a bank name");
      return;
    }

    if (availBanks.includes(newBankName)) {
      alert("A bank with this name already exists");
      return;
    }
    setBankSelected(newBankName);
    setAddNewBank(false);
    setEditForm({ Bank: newBankName });
  };

  const handleAddNewBankAccount = () => {
    // Validation
    if (!newBankAccountName || newBankAccountName.trim() === "") {
      alert("Please enter an account name");
      return;
    }

    if (!newBankAccountAmount || isNaN(Number(newBankAccountAmount))) {
      alert("Please enter a valid amount");
      return;
    }

    if (
      bankSelected &&
      assetAllocation &&
      assetAllocation.Bank &&
      assetAllocation.Bank[bankSelected] &&
      assetAllocation.Bank[bankSelected][newBankAccountName] !== undefined
    ) {
      alert("An account with this name already exists");
      return;
    }

    setEditForm((prev) => ({
      ...prev,
      [newBankAccountName]: Number(newBankAccountAmount),
    }));

    setNewBankAccountName("");
    setNewBankAccountAmount(0);
    setAddingBankAccount(false);
  };

  const handleDeleteAccount = (key: string) => {
    setEditForm((prev) => {
      const updatedForm = { ...prev };
      delete updatedForm[key];
      return updatedForm;
    });
  };

  const handleSave = () => {
    try {
      if (uid) {
        const bankPayload = {
          ...editForm,
          uid: uid,
        };
        dispatch(portfolioAction.saveBankDetails(bankPayload));
      } else {
        alert("Authentication issue, try again");
      }

      setTimeout(() => {
        setEditModal(false);
        setMainBankSelections((prev) => {
          const allFalse: { [key: string]: boolean } = {};
          availBanks.forEach((element) => {
            if (element === bankSelected) {
              allFalse[bankSelected] = true;
            } else {
              allFalse[element] = false;
            }
          });
          return allFalse;
        });
      }, 500);
    } catch (error) {
      console.error("Error saving bank details", error);
      alert("Failed to save bank data. Please try again.");
    }
  };

  const handleDeleteBank = () => {
    try {
      if (uid) {
        const bankPayload = {
          ...editForm,
          uid: uid,
        };
        dispatch(portfolioAction.deleteBankDetails(bankPayload));
      }

      setTimeout(() => {
        setConfirmDelete(false);
        setEditModal(false);
      }, 500);
    } catch (error) {
      console.error("Error deleting", error);
      alert("Failed to delete. Please try again later");
    }
  };

  return (
    <Modal visible={editModal} transparent={true} animationType="fade">
      <View style={portfolioStyles.modalContainer}>
        <View style={[portfolioStyles.modalView, styles.compactModalView]}>
          <Text style={portfolioStyles.modalTitle}>
            Update Bank Portfolio Here
          </Text>

          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            scrollEnabled={!bankSelections.dropdownOpen}
          >
            <View style={portfolioStyles.profileInfo}>
              <Text style={portfolioStyles.label}>Select Bank:</Text>
              <View style={{ marginVertical: 10 }}>
                <TouchableOpacity
                  style={[
                    styles.dropdownButton,
                    bankSelected && { borderColor: "#4A6FA5" },
                  ]}
                  onPress={() => setBankModalVisible(true)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {bankSelected && (
                      <View
                        style={[
                          styles.platformIcon,
                          {
                            backgroundColor: PORTFOLIO_COLORS[0],
                            width: 24,
                            height: 24,
                            marginRight: 10,
                          },
                        ]}
                      >
                        <Text style={styles.platformIconText}>
                          {bankSelected.charAt(0)}
                        </Text>
                      </View>
                    )}
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        !bankSelected && { color: "#888" },
                      ]}
                    >
                      {bankSelected || "Choose a bank"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <Modal
              visible={bankModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setBankModalVisible(false)}
            >
              <View style={styles.bankModalContainer}>
                <View style={styles.bankModalContent}>
                  <View style={styles.bankModalHeader}>
                    <Text style={styles.bankModalTitle}>Select Bank</Text>
                    <TouchableOpacity
                      onPress={() => setBankModalVisible(false)}
                      style={styles.bankModalCloseButton}
                    >
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>

                  {addNewBank ? (
                    <View style={styles.newItemForm}>
                      <TextInput
                        
                        placeholder="Bank Name"
                        value={newBankName}
                        onChangeText={setNewBankName}
                      />

                      {/* Add space between input and buttons */}
                      <View style={{ height: 20 }} />

                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#28a745" },
                          ]}
                          onPress={() => {
                            handleAddNewBank();
                            setBankModalVisible(false);
                          }}
                        >
                          <Ionicons name="checkmark" size={18} color="#fff" />

                          <Text style={styles.actionButtonText}>Add</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#b0aca5" },
                          ]}
                          onPress={() => {
                            setNewBankName("");
                            setAddNewBank(false);
                          }}
                        >
                          <Ionicons name="close" size={18} color="#fff" />

                          <Text style={styles.actionButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <ScrollView style={styles.bankModalList}>
                      {availBanks.length > 0 ? (
                        availBanks.map((item) => (
                          <TouchableOpacity
                            key={item}
                            onPress={() => {
                              setBankSelected(item);
                              setBankModalVisible(false);
                            }}
                            style={[
                              styles.bankModalItem,
                              bankSelected === item &&
                                styles.bankModalItemSelected,
                            ]}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={[
                                  styles.platformIcon,
                                  {
                                    backgroundColor: PORTFOLIO_COLORS[0],
                                    width: 24,
                                    height: 24,
                                    marginRight: 10,
                                  },
                                ]}
                              >
                                <Text style={styles.platformIconText}>
                                  {item.charAt(0)}
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.bankModalItemText,
                                  bankSelected === item &&
                                    styles.dropdownItemTextSelected,
                                ]}
                              >
                                {item}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <Text
                          style={{
                            textAlign: "center",
                            padding: 20,
                            color: "#888",
                          }}
                        >
                          No banks available
                        </Text>
                      )}

                      {/* Add New Bank button */}
                      <TouchableOpacity
                        style={styles.addNewBankButton}
                        onPress={() => setAddNewBank(true)}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <View
                            style={[
                              styles.platformIcon,
                              {
                                backgroundColor: "#4A6FA5",
                                width: 24,
                                height: 24,
                                marginRight: 10,
                              },
                            ]}
                          >
                            <Ionicons name="add" size={16} color="#fff" />
                          </View>
                          <Text style={styles.addNewBankText}>
                            Add New Bank
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </ScrollView>
                  )}
                </View>
              </View>
            </Modal>

            {bankSelected && (
              <>
                <View style={styles.formContainer}>
                  <Text style={styles.selectedBankTitle}>
                    <Ionicons
                      name="briefcase-outline"
                      size={18}
                      color="#4A6FA5"
                      style={{ marginRight: 6 }}
                    />
                    {bankSelected}
                  </Text>

                  {(() => {
                    return allAccountKeys.length > 0 ? (
                      Array.from(allAccountKeys).map((key: string) => {
                        const accountLabel =
                          key === "savings"
                            ? "Savings Account"
                            : key === "fixed_deposit"
                              ? "Fixed Deposit"
                              : key;

                        const accountColor =
                          key === "savings"
                            ? "#4A90E2"
                            : key === "fixed_deposit"
                              ? "#F5A623"
                              : "#ff0066";

                        // Get current value - either from assetAllocation or defaulting to 0 if it's new
                        const currentValue =
                          assetAllocation &&
                          assetAllocation.Bank &&
                          assetAllocation.Bank[bankSelected] &&
                          assetAllocation.Bank[bankSelected][key] !== undefined
                            ? Number(assetAllocation.Bank[bankSelected][key])
                            : 0;

                        return (
                          <View key={key} style={styles.inputContainer}>
                            <View style={styles.accountHeader}>
                              <View style={styles.labelContainer}>
                                <View
                                  style={[
                                    styles.accountIndicator,
                                    { backgroundColor: accountColor },
                                  ]}
                                />
                                <Text style={styles.inputLabel}>
                                  {accountLabel}
                                </Text>
                              </View>

                              <TouchableOpacity
                                style={styles.deleteAccountButton}
                                onPress={() => handleDeleteAccount(key)}
                              >
                                <Ionicons
                                  name="close-circle"
                                  size={22}
                                  color="#e53e3e"
                                />
                              </TouchableOpacity>
                            </View>

                            <View style={styles.inputWrapper}>
                              <Text style={styles.currencySymbol}>S$</Text>
                              <TextInput
                                style={styles.formInput}
                                placeholder={formatCurrency(currentValue)
                                  .replace("SGD", "")
                                  .trim()}
                                value={
                                  editForm[key] !== undefined
                                    ? String(editForm[key])
                                    : ""
                                }
                                keyboardType="numeric"
                                placeholderTextColor="#999"
                                onChangeText={(text) => {
                                  setEditForm((prev) => ({
                                    ...prev,
                                    Bank: bankSelected,
                                    [key]: Number(text),
                                  }));
                                }}
                              />
                            </View>

                            <View style={styles.currentValueContainer}>
                              <Text style={styles.currentValueLabel}>
                                Current:
                              </Text>
                              <Text style={styles.currentValue}>
                                {formatCurrency(currentValue)}
                              </Text>
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <Text>No Portfolios Here</Text>
                    );
                  })()}
                </View>

                <View style={styles.formActions}>
                  {!addingBankAccount ? (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => setAddingBankAccount(true)}
                    >
                      <Ionicons name="add-circle" size={20} color="#4A6FA5" />
                      <Text style={styles.addButtonText}>
                        Add a new account
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.newItemForm}>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={styles.formInput}
                          placeholder="Enter Bank Account Name"
                          value={newBankAccountName}
                          onChangeText={setNewBankAccountName}
                        />
                      </View>
                      <View style={{ height: 20 }} />
                      <View style={styles.inputWrapper}>
                        <Text style={styles.currencySymbol}>S$</Text>
                        <TextInput
                          style={styles.formInput}
                          placeholder="Enter Amount"
                          value={String(newBankAccountAmount)}
                          onChangeText={(text) =>
                            setNewBankAccountAmount(Number(text))
                          }
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={{ height: 20 }} />
                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#28a745" },
                          ]}
                          onPress={handleAddNewBankAccount}
                        >
                          <Ionicons name="checkmark" size={18} color="#fff" />
                          <Text style={styles.actionButtonText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#b0aca5" },
                          ]}
                          onPress={() => {
                            setNewBankAccountName("");
                            setNewBankAccountAmount(0);
                            setAddingBankAccount(false);
                          }}
                        >
                          <Ionicons name="close" size={18} color="#fff" />
                          <Text style={styles.actionButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}

            <View style={styles.formActions}>
              <LoadingButton
                title="Save"
                onPress={() => handleSave()}
                isLoading={saveLoading ?? false}
                color="#4A6FA5"
              />
              <View style={{ height: 15 }} />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.deleteButton,
                    !bankSelected && { backgroundColor: "#ccc" },
                  ]}
                  onPress={() => setConfirmDelete(true)}
                  disabled={!bankSelected}
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                  <Text
                    style={[
                      styles.actionButtonText,
                      !bankSelected && { color: "#888" },
                    ]}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.cancelButton,
                    { backgroundColor: "#D5451B" },
                  ]}
                  onPress={() => setEditModal(false)}
                >
                  <Ionicons name="close-outline" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>

              {confirmDelete && (
                <Modal
                  visible={confirmDelete}
                  transparent={true}
                  animationType="fade"
                >
                  <View style={portfolioStyles.modalContainer}>
                    <View
                      style={[
                        portfolioStyles.modalView,
                        styles.compactModalView,
                      ]}
                    >
                      <Text style={portfolioStyles.modalTitle}>
                        Are you sure?
                      </Text>

                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            styles.cancelButton,
                            { backgroundColor: "#28a745" },
                          ]}
                          onPress={() => handleDeleteBank()}
                        >
                          <Ionicons name="checkmark" size={18} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            styles.cancelButton,
                            { backgroundColor: "red" },
                          ]}
                          onPress={() => setConfirmDelete(false)}
                        >
                          <Ionicons name="close" size={18} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
