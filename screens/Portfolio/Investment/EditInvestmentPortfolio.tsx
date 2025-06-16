import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  InvestmentEditForm, // Need to create this interface
  formatCurrency,
  PORTFOLIO_COLORS,
  portFolioStyles as styles,
} from "../../../types/wealth.types";
import { styles as portfolioStyles } from "../../Profile/styles";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/rootTypes";
import {
  assetAllocationSelector,
  isLoadingSelector,
} from "../../../store/portfolio/portfolioSelector";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import LoadingButton from "../../../component/LoadingButton";
import { portfolioAction } from "../../../store/portfolio/portfolioSlice";
import { currentUidSelector } from "../../../store/auth/authSelector";

interface EditInvestmentPortfolioProps {
  editModal: boolean;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMainInvestmentSelections: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
}

export function EditInvestmentPortfolio({
  editModal,
  setEditModal,
  setMainInvestmentSelections,
}: EditInvestmentPortfolioProps) {
  const dispatch = useAppDispatch();
  const saveLoading = useAppSelector(isLoadingSelector);
  const assetAllocation = useAppSelector(assetAllocationSelector);
  const uid = useAppSelector(currentUidSelector);

  const [availBrokers, setAvailBrokers] = useState<string[]>([]);
  const [brokerSelected, setBrokerSelected] = useState<string | null>(null);

  const [editForm, setEditForm] = useState<InvestmentEditForm>({});
  const [investmentSelections, setInvestmentSelections] = useState<{
    [key: string]: boolean;
  }>({ dropdownOpen: false });

  const [addNewBroker, setAddNewBroker] = useState(false);
  const [newBrokerName, setNewBrokerName] = useState("");

  const [addingInvestment, setAddingInvestment] = useState(false);
  const [newInvestmentName, setNewInvestmentName] = useState("");
  const [newInvestmentAmount, setNewInvestmentAmount] = useState(0);
  const [allInvestmentKeys, setAllInvestmentKeys] = useState<string[]>([]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [lastSavedBroker, setLastSavedBroker] = useState("");

  const [brokerModalVisible, setBrokerModalVisible] = useState(false);

  useEffect(() => {
    if (editModal) {
      if (availBrokers.length > 0) {
        if (lastSavedBroker && availBrokers.includes(lastSavedBroker)) {
          setBrokerSelected(lastSavedBroker);
        } else {
          setBrokerSelected(availBrokers[0]);
        }
      } else {
        setBrokerSelected(null);
      }

      if (!brokerSelected || !availBrokers.includes(brokerSelected || "")) {
        setEditForm({});
      }
    }
  }, [editModal]);

  useEffect(() => {
    if (addNewBroker) {
      setNewBrokerName("");
    }
  }, [addNewBroker]);

  //populate available brokers for droplist
  useEffect(() => {
    let availBrokersList: string[] = [];
    Object.keys(assetAllocation?.Investments || {}).forEach((brokerName) =>
      availBrokersList.push(brokerName)
    );
    setAvailBrokers(availBrokersList as string[]);
  }, [assetAllocation?.Investments]);

  //populate initial edit form with current investments
  useEffect(() => {
    if (brokerSelected && assetAllocation?.Investments[brokerSelected]) {
      const newFormValues: InvestmentEditForm = { Broker: brokerSelected };

      Object.keys(assetAllocation.Investments[brokerSelected]).forEach(
        (key) => {
          newFormValues[key] = assetAllocation.Investments[brokerSelected][key];
        }
      );

      setEditForm(newFormValues);
    }
  }, [brokerSelected, assetAllocation?.Investments]);

  //Get all investment names
  useEffect(() => {
    if (assetAllocation && brokerSelected) {
      const editFormKeys = Object.keys(editForm).filter(
        (key) => key !== "Broker"
      );
      setAllInvestmentKeys(Array.from(editFormKeys));
    }
  }, [editForm, brokerSelected, assetAllocation]);

  const handleAddNewBroker = () => {
    if (!newBrokerName || newBrokerName.trim() === "") {
      alert("Please enter a broker name");
      return;
    }

    if (availBrokers.includes(newBrokerName)) {
      alert("A broker with this name already exists");
      return;
    }
    setBrokerSelected(newBrokerName);
    setAddNewBroker(false);
    setEditForm({ Broker: newBrokerName });
  };

  const handleAddNewInvestment = () => {
    // Validation
    if (!newInvestmentName || newInvestmentName.trim() === "") {
      alert("Please enter an investment name");
      return;
    }

    if (!newInvestmentAmount || isNaN(Number(newInvestmentAmount))) {
      alert("Please enter a valid amount");
      return;
    }

    if (
      brokerSelected &&
      assetAllocation &&
      assetAllocation.Investments &&
      assetAllocation.Investments[brokerSelected] &&
      assetAllocation.Investments[brokerSelected][newInvestmentName] !==
        undefined
    ) {
      alert("An investment with this name already exists");
      return;
    }

    setEditForm((prev) => ({
      ...prev,
      [newInvestmentName]: Number(newInvestmentAmount),
    }));

    setNewInvestmentName("");
    setNewInvestmentAmount(0);
    setAddingInvestment(false);
  };

  const handleDeleteInvestment = (key: string) => {
    setEditForm((prev) => {
      const updatedForm = { ...prev };
      delete updatedForm[key];
      return updatedForm;
    });
  };

  const handleSave = () => {
    try {
      if (uid) {
        const investmentPayload = {
          ...editForm,
          uid: uid,
        };
        dispatch(portfolioAction.saveInvestmentDetails(investmentPayload));
      } else {
        alert("Authentication issue, try again");
      }

      setTimeout(() => {
        setEditModal(false);
        setMainInvestmentSelections((prev) => {
          const allFalse: { [key: string]: boolean } = {};
          availBrokers.forEach((element) => {
            if (element === brokerSelected) {
              allFalse[brokerSelected] = true;
            } else {
              allFalse[element] = false;
            }
          });
          return allFalse;
        });
      }, 500);
    } catch (error) {
      console.error("Error saving investment details", error);
      alert("Failed to save investment data. Please try again.");
    }
  };

  const handleDeleteBroker = () => {
    try {
      if (uid) {
        const brokerPayload = {
          ...editForm,
          uid: uid,
        };
        dispatch(portfolioAction.deleteInvestmentDetails(brokerPayload));
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
            Update Investment Portfolio Here
          </Text>

          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            scrollEnabled={!investmentSelections.dropdownOpen}
          >
            <View style={portfolioStyles.profileInfo}>
              <Text style={portfolioStyles.label}>Select Broker:</Text>
              <View style={{ marginVertical: 10 }}>
                <TouchableOpacity
                  style={[
                    styles.dropdownButton,
                    brokerSelected && { borderColor: "#4A6FA5" },
                  ]}
                  onPress={() => setBrokerModalVisible(true)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {brokerSelected && (
                      <View
                        style={[
                          styles.platformIcon,
                          {
                            backgroundColor: PORTFOLIO_COLORS[2], // Use a different color for investments
                            width: 24,
                            height: 24,
                            marginRight: 10,
                          },
                        ]}
                      >
                        <Text style={styles.platformIconText}>
                          {brokerSelected.charAt(0)}
                        </Text>
                      </View>
                    )}
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        !brokerSelected && { color: "#888" },
                      ]}
                    >
                      {brokerSelected || "Choose a broker"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <Modal
              visible={brokerModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setBrokerModalVisible(false)}
            >
              <View style={styles.bankModalContainer}>
                <View style={styles.bankModalContent}>
                  <View style={styles.bankModalHeader}>
                    <Text style={styles.bankModalTitle}>Select Broker</Text>
                    <TouchableOpacity
                      onPress={() => setBrokerModalVisible(false)}
                      style={styles.bankModalCloseButton}
                    >
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>

                  {addNewBroker ? (
                    <View style={styles.newItemForm}>
                      <TextInput
                        placeholder="Broker Name"
                        value={newBrokerName}
                        onChangeText={setNewBrokerName}
                      />

                      <View style={{ height: 20 }} />

                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#28a745" },
                          ]}
                          onPress={() => {
                            handleAddNewBroker();
                            setBrokerModalVisible(false);
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
                            setNewBrokerName("");
                            setAddNewBroker(false);
                          }}
                        >
                          <Ionicons name="close" size={18} color="#fff" />
                          <Text style={styles.actionButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <ScrollView style={styles.bankModalList}>
                      {availBrokers.length > 0 ? (
                        availBrokers.map((item) => (
                          <TouchableOpacity
                            key={item}
                            onPress={() => {
                              setBrokerSelected(item);
                              setBrokerModalVisible(false);
                            }}
                            style={[
                              styles.bankModalItem,
                              brokerSelected === item &&
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
                                    backgroundColor: PORTFOLIO_COLORS[2],
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
                                  brokerSelected === item &&
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
                          No brokers available
                        </Text>
                      )}

                      <TouchableOpacity
                        style={styles.addNewBankButton}
                        onPress={() => setAddNewBroker(true)}
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
                            Add New Broker
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </ScrollView>
                  )}
                </View>
              </View>
            </Modal>

            {brokerSelected && (
              <>
                <View style={styles.formContainer}>
                  <Text style={styles.selectedBankTitle}>
                    <Ionicons
                      name="trending-up-outline" // Changed to investment icon
                      size={18}
                      color="#4A6FA5"
                      style={{ marginRight: 6 }}
                    />
                    {brokerSelected}
                  </Text>

                  {(() => {
                    return allInvestmentKeys.length > 0 ? (
                      Array.from(allInvestmentKeys).map((key: string) => {
                        // For investments we won't have standard account types like savings
                        const investmentLabel = key;

                        // Use a consistent color for investments or create a color map
                        const investmentColor = "#4A90E2";

                        // Get current value
                        const currentValue =
                          assetAllocation &&
                          assetAllocation.Investments &&
                          assetAllocation.Investments[brokerSelected] &&
                          assetAllocation.Investments[brokerSelected][key] !==
                            undefined
                            ? Number(
                                assetAllocation.Investments[brokerSelected][key]
                              )
                            : 0;

                        return (
                          <View key={key} style={styles.inputContainer}>
                            <View style={styles.accountHeader}>
                              <View style={styles.labelContainer}>
                                <View
                                  style={[
                                    styles.accountIndicator,
                                    { backgroundColor: investmentColor },
                                  ]}
                                />
                                <Text style={styles.inputLabel}>
                                  {investmentLabel}
                                </Text>
                              </View>

                              <TouchableOpacity
                                style={styles.deleteAccountButton}
                                onPress={() => handleDeleteInvestment(key)}
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
                                    Broker: brokerSelected,
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
                      <Text>No Investments Here</Text>
                    );
                  })()}
                </View>

                <View style={styles.formActions}>
                  {!addingInvestment ? (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => setAddingInvestment(true)}
                    >
                      <Ionicons name="add-circle" size={20} color="#4A6FA5" />
                      <Text style={styles.addButtonText}>
                        Add a new investment
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.newItemForm}>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={styles.formInput}
                          placeholder="Enter Investment Name"
                          value={newInvestmentName}
                          onChangeText={setNewInvestmentName}
                        />
                      </View>
                      <View style={{ height: 20 }} />
                      <View style={styles.inputWrapper}>
                        <Text style={styles.currencySymbol}>S$</Text>
                        <TextInput
                          style={styles.formInput}
                          placeholder="Enter Amount"
                          value={String(newInvestmentAmount)}
                          onChangeText={(text) =>
                            setNewInvestmentAmount(Number(text))
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
                          onPress={handleAddNewInvestment}
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
                            setNewInvestmentName("");
                            setNewInvestmentAmount(0);
                            setAddingInvestment(false);
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
                    !brokerSelected && { backgroundColor: "#ccc" },
                  ]}
                  onPress={() => setConfirmDelete(true)}
                  disabled={!brokerSelected}
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                  <Text
                    style={[
                      styles.actionButtonText,
                      !brokerSelected && { color: "#888" },
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
                        Delete this broker?
                      </Text>

                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            styles.cancelButton,
                            { backgroundColor: "#28a745" },
                          ]}
                          onPress={() => handleDeleteBroker()}
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
