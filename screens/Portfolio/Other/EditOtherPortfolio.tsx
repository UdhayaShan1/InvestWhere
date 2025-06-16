import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  formatCurrency,
  PORTFOLIO_COLORS,
  portFolioStyles as styles,
  OtherAssetItem,
  OtherEditForm,
  EmptyEditForm,
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

interface EditOtherPortfolioProps {
  editModal: boolean;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMainOtherSelections: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
}

export function EditOtherPortfolio({
  editModal,
  setEditModal,
  setMainOtherSelections,
}: EditOtherPortfolioProps) {
  const dispatch = useAppDispatch();
  const saveLoading = useAppSelector(isLoadingSelector);
  const assetAllocation = useAppSelector(assetAllocationSelector);
  const uid = useAppSelector(currentUidSelector);

  const [availableAssets, setAvailableAssets] = useState<string[]>([]);
  const [assetSelected, setAssetSelected] = useState<string | null>(null);

  const [editForm, setEditForm] = useState<OtherEditForm>(EmptyEditForm);

  const [addNewAsset, setAddNewAsset] = useState(false);
  const [newAssetKey, setNewAssetKey] = useState("");
  const [newAssetLabel, setNewAssetLabel] = useState("");
  const [newAssetAmount, setNewAssetAmount] = useState(0);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [lastSavedAsset, setLastSavedAsset] = useState("");

  const [assetModalVisible, setAssetModalVisible] = useState(false);

  useEffect(() => {
    console.log(editForm, "WTF");
  }, [editForm]);

  useEffect(() => {
    if (editModal) {
      if (availableAssets.length > 0) {
        if (lastSavedAsset && availableAssets.includes(lastSavedAsset)) {
          setAssetSelected(lastSavedAsset);
        } else {
          setAssetSelected(availableAssets[0]);
        }
      } else {
        setAssetSelected(null);
      }

      if (!assetSelected || !availableAssets.includes(assetSelected || "")) {
        setEditForm(EmptyEditForm);
      }
    }
  }, [editModal]);

  useEffect(() => {
    if (addNewAsset) {
      setNewAssetKey("");
      setNewAssetLabel("");
      setNewAssetAmount(0);
    }
  }, [addNewAsset]);

  // Populate available assets for dropdown
  useEffect(() => {
    let availableAssetsList: string[] = [];
    Object.keys(assetAllocation?.Others || {}).forEach((assetKey) =>
      availableAssetsList.push(assetKey)
    );
    setAvailableAssets(availableAssetsList);
  }, [assetAllocation?.Others]);

  // Populate initial edit form with current other asset
  useEffect(() => {
    if (assetSelected && assetAllocation?.Others[assetSelected]) {
      const asset = assetAllocation.Others[assetSelected];
      setEditForm({
        AssetKey: assetSelected,
        amount: asset.amount,
        label: asset.label || "",
      });
    }
  }, [assetSelected, assetAllocation?.Others]);

  const handleAddNewAsset = () => {
    if (!newAssetKey || newAssetKey.trim() === "") {
      alert("Please enter an asset key");
      return;
    }

    if (availableAssets.includes(newAssetKey)) {
      alert("An asset with this key already exists");
      return;
    }

    if (!newAssetAmount || isNaN(Number(newAssetAmount))) {
      alert("Please enter a valid amount");
      return;
    }

    setAssetSelected(newAssetKey);
    setAddNewAsset(false);
    setEditForm({
      AssetKey: newAssetKey,
      amount: Number(newAssetAmount),
      label: newAssetLabel.trim() || "",
    });
  };

  const handleSave = () => {
    try {
      if (!assetSelected) {
        alert("Please select an asset");
        return;
      }

      if (!editForm.amount || isNaN(Number(editForm.amount))) {
        alert("Please enter a valid amount");
        return;
      }

      dispatch(portfolioAction.saveOtherAssetDetails(editForm));

      setTimeout(() => {
        setEditModal(false);
        setMainOtherSelections((prev) => {
          const allFalse: { [key: string]: boolean } = {};
          availableAssets.forEach((element) => {
            if (element === assetSelected) {
              allFalse[assetSelected] = true;
            } else {
              allFalse[element] = false;
            }
          });
          return allFalse;
        });
        setLastSavedAsset(assetSelected);
      }, 500);
    } catch (error) {
      console.error("Error saving other asset details", error);
      alert("Failed to save asset data. Please try again.");
    }
  };

  const handleDeleteAsset = () => {
    try {
      if (assetSelected) {
        dispatch(portfolioAction.deleteOtherAssetDetails(editForm));
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
            Update Other Assets Here
          </Text>

          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={portfolioStyles.profileInfo}>
              <Text style={portfolioStyles.label}>Select Asset:</Text>
              <View style={{ marginVertical: 10 }}>
                <TouchableOpacity
                  style={[
                    styles.dropdownButton,
                    assetSelected && { borderColor: "#4A6FA5" },
                  ]}
                  onPress={() => setAssetModalVisible(true)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {assetSelected && (
                      <View
                        style={[
                          styles.platformIcon,
                          {
                            backgroundColor: PORTFOLIO_COLORS[5], // Green for Others
                            width: 24,
                            height: 24,
                            marginRight: 10,
                          },
                        ]}
                      >
                        <Text style={styles.platformIconText}>
                          {(
                            assetAllocation?.Others[assetSelected]?.label ||
                            assetSelected
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={styles.assetInfo}>
                      <Text
                        style={[
                          styles.dropdownButtonText,
                          !assetSelected && { color: "#888" },
                        ]}
                      >
                        {assetSelected
                          ? assetAllocation?.Others[assetSelected]?.label ||
                            assetSelected
                          : "Choose an asset"}
                      </Text>
                      {assetSelected &&
                        assetAllocation?.Others[assetSelected]?.label &&
                        assetAllocation.Others[assetSelected].label !==
                          assetSelected && (
                          <Text style={styles.accountTypeLabel}>
                            Key: {assetSelected}
                          </Text>
                        )}
                    </View>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <Modal
              visible={assetModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setAssetModalVisible(false)}
            >
              <View style={styles.bankModalContainer}>
                <View style={styles.bankModalContent}>
                  <View style={styles.bankModalHeader}>
                    <Text style={styles.bankModalTitle}>Select Asset</Text>
                    <TouchableOpacity
                      onPress={() => setAssetModalVisible(false)}
                      style={styles.bankModalCloseButton}
                    >
                      <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>

                  {addNewAsset ? (
                    <View style={styles.newItemForm}>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={styles.formInput}
                          placeholder="Asset Key (unique identifier)"
                          value={newAssetKey}
                          onChangeText={setNewAssetKey}
                        />
                      </View>

                      <View style={{ height: 15 }} />

                      <View style={styles.inputWrapper}>
                        <TextInput
                          style={styles.formInput}
                          placeholder="Display Label (optional)"
                          value={newAssetLabel}
                          onChangeText={setNewAssetLabel}
                        />
                      </View>

                      <View style={{ height: 15 }} />

                      <View style={styles.inputWrapper}>
                        <Text style={styles.currencySymbol}>S$</Text>
                        <TextInput
                          style={styles.formInput}
                          placeholder="Amount"
                          value={String(newAssetAmount)}
                          onChangeText={(text) =>
                            setNewAssetAmount(Number(text))
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
                          onPress={() => {
                            handleAddNewAsset();
                            setAssetModalVisible(false);
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
                            setNewAssetKey("");
                            setNewAssetLabel("");
                            setNewAssetAmount(0);
                            setAddNewAsset(false);
                          }}
                        >
                          <Ionicons name="close" size={18} color="#fff" />
                          <Text style={styles.actionButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <ScrollView style={styles.bankModalList}>
                      {availableAssets.length > 0 ? (
                        availableAssets.map((item) => {
                          const asset = assetAllocation?.Others[item];
                          return (
                            <TouchableOpacity
                              key={item}
                              onPress={() => {
                                setAssetSelected(item);
                                setAssetModalVisible(false);
                              }}
                              style={[
                                styles.bankModalItem,
                                assetSelected === item &&
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
                                      backgroundColor: PORTFOLIO_COLORS[5],
                                      width: 24,
                                      height: 24,
                                      marginRight: 10,
                                    },
                                  ]}
                                >
                                  <Text style={styles.platformIconText}>
                                    {(asset?.label || item)
                                      .charAt(0)
                                      .toUpperCase()}
                                  </Text>
                                </View>
                                <View style={styles.assetInfo}>
                                  <Text
                                    style={[
                                      styles.bankModalItemText,
                                      assetSelected === item &&
                                        styles.dropdownItemTextSelected,
                                    ]}
                                  >
                                    {asset?.label || item}
                                  </Text>
                                  {asset?.label && asset.label !== item && (
                                    <Text style={styles.accountTypeLabel}>
                                      Key: {item}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            </TouchableOpacity>
                          );
                        })
                      ) : (
                        <Text
                          style={{
                            textAlign: "center",
                            padding: 20,
                            color: "#888",
                          }}
                        >
                          No assets available
                        </Text>
                      )}

                      <TouchableOpacity
                        style={styles.addNewBankButton}
                        onPress={() => setAddNewAsset(true)}
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
                            Add New Asset
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </ScrollView>
                  )}
                </View>
              </View>
            </Modal>

            {assetSelected && (
              <View style={styles.formContainer}>
                <Text style={styles.selectedBankTitle}>
                  <Ionicons
                    name="briefcase-outline"
                    size={18}
                    color="#4A6FA5"
                    style={{ marginRight: 6 }}
                  />
                  {assetAllocation?.Others[assetSelected]?.label ||
                    assetSelected}
                </Text>

                <View style={styles.inputContainer}>
                  <View style={styles.labelContainer}>
                    <View
                      style={[
                        styles.accountIndicator,
                        { backgroundColor: PORTFOLIO_COLORS[5] },
                      ]}
                    />
                    <Text style={styles.inputLabel}>Display Label</Text>
                  </View>

                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.formInput}
                      placeholder="Enter display label (optional)"
                      value={editForm.label ? String(editForm.label) : ""}
                      onChangeText={(text) => {
                        setEditForm((prev) => ({
                          ...prev,
                          label: text,
                        }));
                      }}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.labelContainer}>
                    <View
                      style={[
                        styles.accountIndicator,
                        { backgroundColor: PORTFOLIO_COLORS[5] },
                      ]}
                    />
                    <Text style={styles.inputLabel}>Amount</Text>
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.currencySymbol}>S$</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="Enter amount"
                      value={editForm.amount ? String(editForm.amount) : ""}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      onChangeText={(text) => {
                        setEditForm((prev) => ({
                          ...prev,
                          amount: Number(text),
                        }));
                      }}
                    />
                  </View>

                  <View style={styles.currentValueContainer}>
                    <Text style={styles.currentValueLabel}>Current:</Text>
                    <Text style={styles.currentValue}>
                      {formatCurrency(
                        assetAllocation?.Others[assetSelected]?.amount || 0
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.formActions}>
              <LoadingButton
                title="Save"
                onPress={handleSave}
                isLoading={saveLoading ?? false}
                color="#4A6FA5"
              />
              <View style={{ height: 15 }} />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.deleteButton,
                    !assetSelected && { backgroundColor: "#ccc" },
                  ]}
                  onPress={() => setConfirmDelete(true)}
                  disabled={!assetSelected}
                >
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                  <Text
                    style={[
                      styles.actionButtonText,
                      !assetSelected && { color: "#888" },
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
                        Delete this asset?
                      </Text>

                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            styles.cancelButton,
                            { backgroundColor: "#28a745" },
                          ]}
                          onPress={handleDeleteAsset}
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
