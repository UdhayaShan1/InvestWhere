import {
  Button,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CleanUpEndowusCustomFromEditForm,
  formatCurrency,
  isCustomEndowusPortfolio,
  PORTFOLIO_COLORS,
  portFolioStyles as styles,
  EndowusDeleteRequest,
  EndowusInterface,
  EndowusSaveRequest,
} from "../../../types/wealth.types";
import { styles as portfolioStyles } from "../../Profile/styles";
import { Ionicons } from "@expo/vector-icons";
import LoadingButton from "../../../component/LoadingButton";
import { TextInput } from "react-native";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/rootTypes";
import { portfolioAction } from "../../../store/portfolio/portfolioSlice";
import {
  currentUidSelector,
  isLoadingSelector,
} from "../../../store/auth/authSelector";

interface EditEndowusPortfolioProps {
  editModal: boolean;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  endowusAllocation: EndowusInterface;
}

export function EditEndowusPortfolio({
  editModal,
  setEditModal,
  endowusAllocation,
}: EditEndowusPortfolioProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(isLoadingSelector);
  const [editForm, setEditForm] = useState<EndowusInterface>(endowusAllocation);
  const [componentSelected, setComponentSelected] = useState<string>("");
  const [componentModalVisible, setComponentModalVisible] = useState(false);
  const [addNewPortfolio, setAddNewPortfolio] = useState<boolean>(false);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const uid = useAppSelector(currentUidSelector);

  const [availComponents, setAvailComponents] = useState<string[]>([]);
  const [availAccounts, setAvailAccounts] = useState<string[]>([]);
  const [addingCustomAccount, setAddingCustomAccount] =
    useState<boolean>(false);
  const [newCustomAccountName, setNewCustomAccountName] = useState<string>("");
  const [newCustomAccountAmount, setNewCustomAccountAmount] = useState(0);

  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [customAccounts, setCustomAccounts] = useState<string[]>([]);
  const [defaultAccounts, setDefaultAccounts] = useState<string[]>([]);

  useEffect(() => {
    let newComponents: string[] = [];
    let customComponents: string[] = [];
    let defaultComponents: string[] = [];
    Object.keys(endowusAllocation).forEach((key) => {
      if (isCustomEndowusPortfolio(key)) {
        customComponents.push(key);
      } else {
        defaultComponents.push(key);
      }
      newComponents.push(key);
    });
    setCustomAccounts(customComponents);
    setDefaultAccounts(defaultComponents);
    setAvailComponents(newComponents);
  }, [endowusAllocation]);

  useEffect(() => {
    let accountKeys: string[] = [];
    if (componentSelected && editForm[componentSelected]) {
      Object.keys(editForm[componentSelected]).forEach((key) => {
        accountKeys.push(key);
      });
    }
    setAvailAccounts(accountKeys);
    console.log(editForm, "@@@");
    console.log(componentSelected, "Component Selected");
  }, [editForm, componentSelected]);

  useEffect(() => {
    if (editModal) {
      setEditForm(endowusAllocation);
    }
  }, [editModal]);

  const handleSave = () => {
    const cleanedForm = CleanUpEndowusCustomFromEditForm(editForm);
    const saveRequest: EndowusSaveRequest = {
      uid: uid ?? "",
      endowusAllocation: cleanedForm,
    };
    console.log("Saving Endowus Portfolio:", saveRequest);

    Object.keys(editForm).forEach((portfolio) => {
      const portfolioData = editForm[portfolio as keyof EndowusInterface];
      if (portfolioData && typeof portfolioData === "object") {
        console.log(`Portfolio ${portfolio} contains:`, portfolioData);
      }
    });

    dispatch(portfolioAction.saveEndowusPortfolio(saveRequest));
    setTimeout(() => {
      setEditModal(false);
    }, 500);
  };

  const handleAddNewPortfolio = () => {
    console.log("Adding new profile");

    setEditForm((prev) => ({
      ...prev,
      [newPortfolioName]: {},
    }));
    setComponentSelected(newPortfolioName);
    setAvailComponents((prev) => {
      return [...prev, newPortfolioName];
    });
  };

  const handleDeletePortfolio = () => {
    const deleteRequest: EndowusDeleteRequest = {
      uid: uid ?? "",
      portfolioToDelete: componentSelected,
      endowusAllocation: editForm,
    };

    dispatch(portfolioAction.deleteEndowusPortfolio(deleteRequest));
    setTimeout(() => {
      setDeleteConfirm(false);
    }, 500);

    setComponentSelected("");
    setComponentModalVisible(false);
  };

  const handleAddNewAccount = () => {
    if (!newCustomAccountName || newCustomAccountName.trim() === "") {
      alert("Please enter an account name");
      return;
    }

    if (!newCustomAccountAmount || isNaN(Number(newCustomAccountAmount))) {
      alert("Please enter a valid amount");
      return;
    }

    if (
      editForm[componentSelected] &&
      editForm[componentSelected][newCustomAccountName] !== undefined
    ) {
      alert("An account with this name already exists");
      return;
    }

    setEditForm((prev) => {
      return {
        ...prev,
        [componentSelected]: {
          ...((prev[componentSelected] as object) || {}),
          [newCustomAccountName]: newCustomAccountAmount,
        },
      };
    });

    setNewCustomAccountName("");
    setNewCustomAccountAmount(0);
    setAddingCustomAccount(false);
  };

  const renderEndowusEditDetails = () => {
    if (!componentSelected) {
      return null;
    }
    const firstComponent = (
      <Text style={styles.selectedBankTitle}>
        <Ionicons
          name="briefcase-outline"
          size={18}
          color="#4A6FA5"
          style={{ marginRight: 6 }}
        />
        {componentSelected}
      </Text>
    );
    let accountKeys: { portfolio: string; accountKeys: string[] } = {
      portfolio: componentSelected,
      accountKeys: availAccounts,
    };

    const secondComponent =
      accountKeys.accountKeys.length > 0 ? (
        accountKeys.accountKeys.map((key) => (
          <View key={key} style={styles.inputContainer}>
            <View style={styles.accountHeader}>
              <View style={styles.labelContainer}>
                <View
                  style={[
                    styles.accountIndicator,
                    { backgroundColor: getComponentColor(componentSelected) },
                  ]}
                />
                <Text style={styles.inputLabel}>{key}</Text>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.currencySymbol}>S$</Text>
              <TextInput
                style={styles.formInput}
                placeholderTextColor="#999"
                placeholder={(() => {
                  const portfolioKey =
                    accountKeys.portfolio as keyof EndowusInterface;
                  const portfolioAllocation = endowusAllocation[portfolioKey];
                  const value =
                    portfolioAllocation?.[
                      key as keyof typeof portfolioAllocation
                    ];
                  return formatCurrency(value !== undefined ? value : 0)
                    .replace("SGD", "")
                    .trim();
                })()}
                value={(() => {
                  const portfolioKey =
                    accountKeys.portfolio as keyof typeof editForm;
                  const portfolioAllocation = editForm[portfolioKey] || {};
                  const value =
                    portfolioAllocation[
                      key as keyof typeof portfolioAllocation
                    ];
                  return value !== undefined ? String(value) : "";
                })()}
                keyboardType="numeric"
                onChangeText={(text) => {
                  setEditForm((prev) => {
                    const portfolioKey =
                      accountKeys.portfolio as keyof typeof prev;
                    let newValue = text ? Number(text) : undefined;
                    if (!text) {
                      newValue = 0;
                    }
                    return {
                      ...prev,
                      [portfolioKey]: {
                        ...((prev[portfolioKey] as object) || {}),
                        [key]: newValue,
                      },
                    };
                  });
                }}
              />
            </View>
          </View>
        ))
      ) : (
        <Text>Start by adding accounts!</Text>
      );

    return (
      <>
        <View style={styles.formContainer}>
          {firstComponent}
          {secondComponent}
        </View>

        {isCustomEndowusPortfolio(componentSelected) && (
          <View style={styles.formActions}>
            {!addingCustomAccount ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setAddingCustomAccount(true)}
              >
                <Ionicons name="add-circle" size={20} color="#4A6FA5" />
                <Text style={styles.addButtonText}>Add a new account</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.newItemForm}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter Portfolio Account Name"
                    value={newCustomAccountName}
                    onChangeText={setNewCustomAccountName}
                  />
                </View>
                <View style={{ height: 20 }} />
                <View style={styles.inputWrapper}>
                  <Text style={styles.currencySymbol}>S$</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter Amount"
                    value={String(newCustomAccountAmount)}
                    onChangeText={(text) =>
                      setNewCustomAccountAmount(Number(text))
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
                    onPress={handleAddNewAccount}
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
                      setNewCustomAccountName("");
                      setNewCustomAccountAmount(0);
                      setAddingCustomAccount(false);
                    }}
                  >
                    <Ionicons name="close" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => setDeleteConfirm(true)}
              disabled={false}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={[styles.actionButtonText]}>Delete</Text>
            </TouchableOpacity>

            {deleteConfirm && (
              <Modal
                visible={deleteConfirm}
                transparent={true}
                animationType="fade"
              >
                <View style={portfolioStyles.modalContainer}>
                  <View
                    style={[portfolioStyles.modalView, styles.compactModalView]}
                  >
                    <Text style={portfolioStyles.modalTitle}>
                      Are you sure?{"\n\n"}This will delete the entire custom
                      portfolio.
                    </Text>

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          styles.cancelButton,
                          { backgroundColor: "#28a745" },
                        ]}
                        onPress={() => handleDeletePortfolio()}
                      >
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          styles.cancelButton,
                          { backgroundColor: "red" },
                        ]}
                        onPress={() => setDeleteConfirm(false)}
                      >
                        <Ionicons name="close" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}
          </View>
        )}
      </>
    );
  };

  const getComponentColor = (component: string): string => {
    switch (component) {
      case "core":
        return PORTFOLIO_COLORS[0]; // blue
      case "satellite":
        return PORTFOLIO_COLORS[1]; // red
      case "cashSmart":
        return PORTFOLIO_COLORS[2]; // teal
      case "income":
        return PORTFOLIO_COLORS[3]; // yellow
      default:
        return PORTFOLIO_COLORS[0];
    }
  };

  return (
    <Modal visible={editModal} transparent={true} animationType="fade">
      <View style={portfolioStyles.modalContainer}>
        <View style={[portfolioStyles.modalView, styles.compactModalView]}>
          <Text style={portfolioStyles.modalTitle}>
            Update Endowus Portfolio Here
          </Text>

          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={portfolioStyles.profileInfo}>
              <Text style={portfolioStyles.label}>Select Portfolio:</Text>
              <View style={{ marginVertical: 10 }}>
                <TouchableOpacity
                  style={[
                    styles.dropdownButton,
                    componentSelected && { borderColor: "#4A6FA5" },
                  ]}
                  onPress={() => setComponentModalVisible(true)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {componentSelected && (
                      <View
                        style={[
                          styles.platformIcon,
                          {
                            backgroundColor: PORTFOLIO_COLORS[1], // Different color for Endowus
                            width: 24,
                            height: 24,
                            marginRight: 10,
                          },
                        ]}
                      >
                        <Text style={styles.platformIconText}>
                          {componentSelected.charAt(0)}
                        </Text>
                      </View>
                    )}
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        !componentSelected && { color: "#888" },
                      ]}
                    >
                      {componentSelected || "Choose a portfolio"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <Modal
              visible={componentModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setComponentModalVisible(false)}
            >
              <View style={styles.bankModalContainer}>
                <View style={styles.bankModalContent}>
                  <View style={styles.bankModalHeader}>
                    <Text style={styles.bankModalTitle}>Select Portfolio</Text>
                    <TouchableOpacity
                      onPress={() => setComponentModalVisible(false)}
                      style={styles.bankModalCloseButton}
                    >
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                  {addNewPortfolio ? (
                    <View style={styles.newItemForm}>
                      <TextInput
                        placeholder="Portfolio Name"
                        value={newPortfolioName}
                        onChangeText={setNewPortfolioName}
                      />

                      <View style={{ height: 20 }} />

                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#28a745" },
                          ]}
                          onPress={() => {
                            handleAddNewPortfolio();
                            setComponentModalVisible(false);
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
                            setNewPortfolioName("");
                            setAddNewPortfolio(false);
                          }}
                        >
                          <Ionicons name="close" size={18} color="#fff" />
                          <Text style={styles.actionButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <ScrollView style={styles.bankModalList}>
                      {availComponents.length > 0 ? (
                        <>
                          <Text style={styles.sectionHeader}>
                            Main Portfolios
                          </Text>
                          {defaultAccounts.map((item: string) => (
                            <TouchableOpacity
                              key={item}
                              onPress={() => {
                                setComponentSelected(item);
                                setComponentModalVisible(false);
                              }}
                              style={[
                                styles.bankModalItem,
                                componentSelected === item &&
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
                                      backgroundColor: PORTFOLIO_COLORS[1],
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
                                    componentSelected === item &&
                                      styles.dropdownItemTextSelected,
                                  ]}
                                >
                                  {item}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                          <Text style={styles.sectionHeader}>
                            Custom Portfolios
                          </Text>
                          {customAccounts.map((item: string) => (
                            <TouchableOpacity
                              key={item}
                              onPress={() => {
                                setComponentSelected(item);
                                setComponentModalVisible(false);
                              }}
                              style={[
                                styles.bankModalItem,
                                componentSelected === item &&
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
                                      backgroundColor: PORTFOLIO_COLORS[1],
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
                                    componentSelected === item &&
                                      styles.dropdownItemTextSelected,
                                  ]}
                                >
                                  {item}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </>
                      ) : (
                        <Text>No portfolios available</Text>
                      )}

                      <TouchableOpacity
                        style={styles.addNewBankButton}
                        onPress={() => setAddNewPortfolio(true)}
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
                            Add Custom Portfolio
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </ScrollView>
                  )}
                </View>
              </View>
            </Modal>

            {renderEndowusEditDetails()}

            <View style={styles.formActions}>
              {componentSelected && (
                <>
                  <LoadingButton
                    title="Save"
                    onPress={() => handleSave()}
                    isLoading={isLoading ?? false}
                    color="#4A6FA5"
                  />
                  <View style={{ height: 15 }} />
                </>
              )}

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.cancelButton,
                  { backgroundColor: "#D5451B" },
                ]}
                onPress={() => {
                  setEditModal(false);
                }}
              >
                <Ionicons name="close-outline" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
