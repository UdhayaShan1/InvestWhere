import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  BankEditForm,
  formatCurrency,
  PORTFOLIO_COLORS,
  portFolioStyles as styles,
  SyfeInterface,
} from "../../types/wealth.types";
import { styles as portfolioStyles } from "../Profile/styles";
import { Ionicons } from "@expo/vector-icons";
import LoadingButton from "../../component/LoadingButton";
import { calculateCategoryTotalRecursively } from "../../constants/helper";
import { TextInput } from "react-native";
import { useEffect, useState } from "react";

interface EditSyfePortfolioProps {
  editModal: boolean;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  syfeAllocation: SyfeInterface;
}

export function EditSyfePortfolio({
  editModal,
  setEditModal,
  syfeAllocation,
}: EditSyfePortfolioProps) {
  const [editForm, setEditForm] = useState<SyfeInterface>(syfeAllocation);
  const [componentSelected, setComponentSelected] = useState("");
  const [componentModalVisible, setComponentModalVisible] = useState(false);

  // Add missing state variables
  const [availComponents, setAvailComponents] = useState<string[]>(
    "Core, Cash Management, Income Plus, Thematic".split(", ")
  );
  const [bankSelected, setBankSelected] = useState<string | null>(null);
  const [bankModalVisible, setBankModalVisible] = useState(false);

  useEffect(() => {
    console.log(editForm.core, "@@@");
  }, [editForm]);

  useEffect(() => {
    if (editModal) {
      setEditForm(syfeAllocation);
    }
    console.log(editModal, "##");
  }, [editModal]);
  const renderSyfeEditDetails = (syfe: SyfeInterface) => {
    if (!syfe) return null;

    return (
      <>
        {syfe.core && calculateCategoryTotalRecursively(syfe.core) > 0 && (
          <View style={styles.syfeGroup}>
            <Text style={styles.syfeGroupTitle}>Core</Text>
            {typeof syfe.core.equity100 === "number" &&
              syfe.core.equity100 > 0 && (
                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <View style={styles.accountHeader}>
                      <View style={styles.labelContainer}>
                        <View style={[styles.accountIndicator]} />
                        <Text style={styles.inputLabel}>Test</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Equity100</Text>
                    <TextInput
                      value={
                        editForm.core?.equity100 !== undefined
                          ? String(editForm.core.equity100)
                          : ""
                      }
                      placeholder="Enter Amount"
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        const value = text === "" ? 0 : Number(text);
                        setEditForm((prev) => ({
                          ...prev,
                          core: {
                            ...prev.core,
                            equity100: isNaN(value) ? 0 : value,
                          },
                        }));
                      }}
                    />
                  </View>
                </View>
              )}
            {typeof syfe.core.growth === "number" && syfe.core.growth > 0 && (
              <View style={styles.assetItem}>
                <Text style={styles.assetName}>Growth</Text>
                <TextInput
                  value={
                    editForm.core?.growth !== undefined
                      ? String(editForm.core.growth)
                      : ""
                  }
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const value = text === "" ? 0 : Number(text);
                    setEditForm((prev) => ({
                      ...prev,
                      core: {
                        ...prev.core,
                        growth: isNaN(value) ? 0 : value,
                      },
                    }));
                  }}
                />
              </View>
            )}

            {typeof syfe.core.balanced === "number" &&
              syfe.core.balanced > 0 && (
                <View style={styles.assetItem}>
                  <Text style={styles.assetName}>Balanced</Text>
                  <TextInput
                    value={
                      editForm.core?.balanced !== undefined
                        ? String(editForm.core.balanced)
                        : ""
                    }
                    placeholder="Enter Amount"
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const value = text === "" ? 0 : Number(text);
                      setEditForm((prev) => ({
                        ...prev,
                        core: {
                          ...prev.core,
                          balanced: isNaN(value) ? 0 : value,
                        },
                      }));
                    }}
                  />
                </View>
              )}

            {typeof syfe.core.defensive === "number" &&
              syfe.core.defensive > 0 && (
                <View style={styles.assetItem}>
                  <Text style={styles.assetName}>Defensive</Text>
                  <TextInput
                    value={
                      editForm.core?.defensive !== undefined
                        ? String(editForm.core.defensive)
                        : ""
                    }
                    placeholder="Enter Amount"
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const value = text === "" ? 0 : Number(text);
                      setEditForm((prev) => ({
                        ...prev,
                        core: {
                          ...prev.core,
                          defensive: isNaN(value) ? 0 : value,
                        },
                      }));
                    }}
                  />
                </View>
              )}
          </View>
        )}
      </>
    );
  };

  return (
    <Modal visible={editModal} transparent={true} animationType="fade">
      <View style={portfolioStyles.modalContainer}>
        <View style={[portfolioStyles.modalView, styles.compactModalView]}>
          <Text style={portfolioStyles.modalTitle}>
            Update Syfe Portfolio Here
          </Text>

          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={portfolioStyles.profileInfo}>
              <Text style={portfolioStyles.label}>Select Component:</Text>
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
                            backgroundColor: PORTFOLIO_COLORS[0],
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

                  <ScrollView style={styles.bankModalList}>
                    {availComponents.length > 0 ? (
                      availComponents.map((item: string) => (
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
                                componentSelected === item &&
                                  styles.dropdownItemTextSelected,
                              ]}
                            >
                              {item}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text>No components available</Text>
                    )}
                  </ScrollView>
                </View>
              </View>
            </Modal>

            {renderSyfeEditDetails(syfeAllocation)}

            <View style={styles.formActions}>
              <LoadingButton
                title="Save"
                onPress={() => true}
                isLoading={false}
                color="#4A6FA5"
              />
              <View style={{ height: 15 }} />
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
