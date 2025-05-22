import {
  Button,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BankEditForm,
  BankItems,
  formatCurrency,
  PORTFOLIO_COLORS,
  portFolioStyles as styles,
} from "../../types/wealth.types";
import { styles as portfolioStyles } from "../Profile/styles";
import { useAppSelector } from "../../store/rootTypes";
import { assetAllocationSelector } from "../../store/portfolio/portfolioSelector";
import { useEffect, useState } from "react";
import {
  calculateCategoryTotalRecursively,
  calculatePercentage,
  toggleSection,
} from "../../constants/helper";
import { Ionicons } from "@expo/vector-icons";
import LoadingButton from "../../component/LoadingButton";

interface BankPortfolioProps {
  bankTotal: number;
  totalNetWorth: number;
  expandedSections: {
    [key: string]: boolean;
  };
  setExpandedSections: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
}

export function BankPortfolio({
  expandedSections,
  bankTotal,
  totalNetWorth,
  setExpandedSections,
}: BankPortfolioProps) {
  const assetAllocation = useAppSelector(assetAllocationSelector);
  const [availBanks, setAvailBanks] = useState<string[]>([]);
  const [bankSelected, setBankSelected] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState<BankEditForm>({});

  const [addingBankAccount, setAddingBankAccount] = useState(false);
  const [newBankAccountName, setNewBankAccountName] = useState("");
  const [newBankAccountAmount, setNewBankAccountAmount] = useState(0);

  useEffect(() => {
    let availBanksList: string[] = [];
    Object.keys(assetAllocation?.Bank || {}).forEach((bankName) =>
      availBanksList.push(bankName)
    );
    setAvailBanks(availBanksList as string[]);
  }, [assetAllocation?.Bank]);

  useEffect(() => {
    if (bankSelected && assetAllocation?.Bank[bankSelected]) {
      const newFormValues: BankEditForm = { Bank: bankSelected };

      Object.keys(assetAllocation.Bank[bankSelected]).forEach((key) => {
        newFormValues[key] = assetAllocation.Bank[bankSelected][key];
      });

      setEditForm(newFormValues);
    }
    console.log(editForm);
  }, [bankSelected, assetAllocation?.Bank]); // Only depend on bankSelected and Bank data

  useEffect(() => {
    console.log(editForm);
  }, [editForm]);

  const [bankSelections, setBankSelections] = useState<{
    [key: string]: boolean;
  }>({ dropdownOpen: false });

  useEffect(() => {
    if (assetAllocation?.Bank) {
      const initialSelections: { [key: string]: boolean } = {};
      Object.keys(assetAllocation.Bank).forEach((bank) => {
        initialSelections[bank] = false;
      });
      setBankSelections(initialSelections);
    }
  }, [assetAllocation?.Bank]);

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

  const renderBankDetails = (bank: BankItems) => {
    if (!bank) {
      return null;
    }

    return (
      <View style={styles.bankDetailsContainer}>
        {bank.savings !== undefined && (
          <View style={styles.assetItem}>
            <View style={styles.assetInfoRow}>
              <View
                style={[
                  styles.accountTypeIndicator,
                  { backgroundColor: "#4A90E2" },
                ]}
              />
              <View>
                <Text style={styles.assetName}>Savings Account</Text>
              </View>
            </View>
            <Text style={styles.assetValue}>
              {formatCurrency(bank.savings)}
            </Text>
          </View>
        )}

        {bank.fixed_deposit !== undefined && (
          <View style={styles.assetItem}>
            <View style={styles.assetInfoRow}>
              <View
                style={[
                  styles.accountTypeIndicator,
                  { backgroundColor: "#F5A623" },
                ]}
              />
              <View>
                <Text style={styles.assetName}>Fixed Deposit</Text>
              </View>
            </View>
            <Text style={styles.assetValue}>
              {formatCurrency(bank.fixed_deposit)}
            </Text>
          </View>
        )}

        {Object.keys(bank).map((key) => {
          const standardBankKeys = ["savings", "fixed_deposit"];
          if (standardBankKeys.includes(key) || bank[key] === undefined) {
            return null;
          }
          return (
            <View key={key} style={styles.assetItem}>
              <View style={styles.assetInfoRow}>
                <View
                  style={[
                    styles.accountTypeIndicator,
                    { backgroundColor: "#ff0066" },
                  ]}
                />
                <View>
                  <Text style={styles.assetName}>{key}</Text>
                </View>
              </View>
              <Text style={styles.assetValue}>
                {formatCurrency(Number(bank[key]))}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderBank = () => {
    const expanded = expandedSections["Bank"];
    const percentage = calculatePercentage(bankTotal, totalNetWorth);
    if (!assetAllocation?.Bank || bankTotal === 0) {
      return null;
    }

    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryHeader,
            { borderLeftColor: PORTFOLIO_COLORS[0], borderLeftWidth: 5 },
          ]}
          onPress={() => toggleSection("Bank", setExpandedSections)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.categoryTitle}>Bank</Text>
            <Text style={styles.categoryPercentage}>
              {percentage.toFixed(1)}% of portfolio
            </Text>
          </View>
          <Text style={styles.categoryValue}>{formatCurrency(bankTotal)}</Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#555"
            style={styles.expandIcon}
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.categoryDetails}>
            {Object.keys(assetAllocation.Bank).map((bank) => (
              <View key={bank} style={styles.platformContainer}>
                <TouchableOpacity
                  style={styles.platformHeader}
                  onPress={() => toggleSection(bank, setBankSelections)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={[
                        styles.platformIcon,
                        { backgroundColor: PORTFOLIO_COLORS[0] },
                      ]}
                    >
                      <Text style={styles.platformIconText}>
                        {bank.charAt(0)}
                      </Text>
                    </View>
                    <Text style={styles.platformName}>{bank}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.platformValue}>
                      {formatCurrency(
                        calculateCategoryTotalRecursively(
                          assetAllocation.Bank[bank]
                        )
                      )}
                    </Text>
                    <Ionicons
                      name={
                        bankSelections[bank] ? "chevron-up" : "chevron-down"
                      }
                      size={20}
                      color="#555"
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                </TouchableOpacity>
                {bankSelections[bank] && (
                  <View style={styles.nestedDetails}>
                    {renderBankDetails(assetAllocation.Bank[bank])}
                  </View>
                )}
              </View>
            ))}
            <Button
              color="green"
              title="Edit"
              onPress={() => setEditModal(true)}
            ></Button>
            <Modal visible={editModal} transparent={true} animationType="fade">
              <View style={portfolioStyles.modalContainer}>
                <View
                  style={[portfolioStyles.modalView, styles.compactModalView]}
                >
                  <Text style={portfolioStyles.modalTitle}>
                    Update Bank Portfolio Here
                  </Text>

                  <ScrollView
                    style={styles.modalScrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollViewContent}
                  >
                    <View style={portfolioStyles.profileInfo}>
                      <Text style={portfolioStyles.label}>Select Bank:</Text>
                      <View style={{ marginVertical: 10 }}>
                        <View
                          style={[styles.dropdownContainer, { zIndex: 1000 }]}
                        >
                          <TouchableOpacity
                            style={[
                              styles.dropdownButton,
                              bankSelected && { borderColor: "#4A6FA5" },
                            ]}
                            onPress={() =>
                              setBankSelections((prev) => ({
                                ...prev,
                                dropdownOpen: !prev.dropdownOpen,
                              }))
                            }
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
                            <Ionicons
                              name={
                                bankSelections.dropdownOpen
                                  ? "chevron-up"
                                  : "chevron-down"
                              }
                              size={20}
                              color="#666"
                            />
                          </TouchableOpacity>

                          {bankSelections.dropdownOpen && (
                            <View
                              style={[
                                styles.dropdownMenu,
                                availBanks.length === 0 && {
                                  padding: 15,
                                  alignItems: "center",
                                },
                              ]}
                            >
                              {availBanks.length > 0 ? (
                                availBanks.map((bank) => (
                                  <TouchableOpacity
                                    key={bank}
                                    onPress={() => {
                                      setBankSelected(bank);
                                      setBankSelections((prev) => ({
                                        ...prev,
                                        dropdownOpen: false,
                                      }));
                                    }}
                                    style={[
                                      styles.dropdownItem,
                                      bankSelected === bank &&
                                        styles.dropdownItemSelected,
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
                                            backgroundColor:
                                              PORTFOLIO_COLORS[0],
                                            width: 24,
                                            height: 24,
                                            marginRight: 10,
                                          },
                                        ]}
                                      >
                                        <Text style={styles.platformIconText}>
                                          {bank.charAt(0)}
                                        </Text>
                                      </View>
                                      <Text
                                        style={[
                                          styles.dropdownItemText,
                                          bankSelected === bank &&
                                            styles.dropdownItemTextSelected,
                                        ]}
                                      >
                                        {bank}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                ))
                              ) : (
                                <Text style={{ color: "#888" }}>
                                  No banks available
                                </Text>
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

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
                            
                            const allAccountKeys = new Set([
                              ...Object.keys(
                                assetAllocation.Bank[bankSelected]
                              ),
                              ...Object.keys(editForm).filter(
                                (key) => key !== "Bank"
                              ),
                            ]);

                            return allAccountKeys.size > 0 ? (
                              Array.from(allAccountKeys).map((key: string) => {
                                const isStandardAccount =
                                  key === "savings" || key === "fixed_deposit";
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
                                  assetAllocation.Bank[bankSelected][key] !==
                                  undefined
                                    ? Number(
                                        assetAllocation.Bank[bankSelected][key]
                                      )
                                    : 0;

                                return (
                                  <View key={key} style={styles.inputContainer}>
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

                                    <View style={styles.inputWrapper}>
                                      <Text style={styles.currencySymbol}>
                                        S$
                                      </Text>
                                      <TextInput
                                        style={styles.formInput}
                                        placeholder={formatCurrency(
                                          currentValue
                                        )
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
                              <Ionicons
                                name="add-circle"
                                size={20}
                                color="#4A6FA5"
                              />
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
                                  <Ionicons
                                    name="checkmark"
                                    size={18}
                                    color="#fff"
                                  />
                                  <Text style={styles.actionButtonText}>
                                    Add
                                  </Text>
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
                                  <Ionicons
                                    name="close"
                                    size={18}
                                    color="#fff"
                                  />
                                  <Text style={styles.actionButtonText}>
                                    Cancel
                                  </Text>
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
                        onPress={() => {}}
                        isLoading={false}
                        color="#4A6FA5"
                      />
                      <View style={{ height: 15 }} />
                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.deleteButton]}
                          onPress={() => setEditModal(false)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="#fff"
                          />
                          <Text style={styles.actionButtonText}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.cancelButton]}
                          onPress={() => setEditModal(false)}
                        >
                          <Ionicons
                            name="close-outline"
                            size={18}
                            color="#fff"
                          />
                          <Text style={styles.actionButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  };

  return renderBank();
}
