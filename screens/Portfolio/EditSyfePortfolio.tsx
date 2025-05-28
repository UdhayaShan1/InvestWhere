import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  BankEditForm,
  formatCurrency,
  PORTFOLIO_COLORS,
  portFolioStyles as styles,
  SyfeInterface,
  SyfeSaveRequest,
} from "../../types/wealth.types";
import { styles as portfolioStyles } from "../Profile/styles";
import { Ionicons } from "@expo/vector-icons";
import LoadingButton from "../../component/LoadingButton";
import {
  calculateCategoryTotalRecursively,
  calculateSpecificCategoryTotalRecursively,
} from "../../constants/helper";
import { TextInput } from "react-native";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import { portfolioAction } from "../../store/portfolio/portfolioSlice";
import {
  currentUidSelector,
  isLoadingSelector,
} from "../../store/auth/authSelector";

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
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(isLoadingSelector);
  const [editForm, setEditForm] = useState<SyfeInterface>(syfeAllocation);
  const [componentSelected, setComponentSelected] = useState<string>("");
  const [componentModalVisible, setComponentModalVisible] = useState(false);
  const uid = useAppSelector(currentUidSelector);

  const [availComponents, setAvailComponents] = useState<string[]>(
    "Core, Cash Management, Income Plus, Thematic, REIT+, Downside Protection".split(
      ", "
    )
  );

  useEffect(() => {
    console.log(editForm, "@@@");
  }, [editForm]);

  useEffect(() => {
    if (editModal) {
      setEditForm(syfeAllocation);
    }
    console.log(editModal, "##");
  }, [editModal]);

  const handleSave = () => {
    const saveRequest: SyfeSaveRequest = {
      uid: uid ?? "",
      syfeAllocation: editForm,
    };
    console.log("Saving Syfe Portfolio:", saveRequest);

    Object.keys(editForm).forEach((portfolio) => {
      const portfolioData = editForm[portfolio as keyof SyfeInterface];
      if (portfolioData && typeof portfolioData === "object") {
        console.log(`Portfolio ${portfolio} contains:`, portfolioData);
      }
    });

    dispatch(portfolioAction.saveSyfePortfolio(saveRequest));
    setTimeout(() => {
      setEditModal(false);
    }, 500);
  };

  const renderSyfeEditDetails = () => {
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
      portfolio: "",
      accountKeys: [],
    };
    if (componentSelected === "Core") {
      accountKeys = {
        portfolio: "core",
        accountKeys: ["equity100", "growth", "balanced", "defensive"],
      };
    } else if (componentSelected === "Cash Management") {
      accountKeys = {
        portfolio: "cashManagement",
        accountKeys: ["cashPlusFlexi", "cashPlusGuranteed"],
      };
    } else if (componentSelected === "REIT+") {
      accountKeys = {
        portfolio: "reitPlus",
        accountKeys: ["standard", "withRiskManagement"],
      };
    } else if (componentSelected === "Income Plus") {
      accountKeys = {
        portfolio: "incomePlus",
        accountKeys: ["preserve", "enhance"],
      };
    } else if (componentSelected === "Thematic") {
      accountKeys = {
        portfolio: "thematic",
        accountKeys: [
          "chinaGrowth",
          "esgCleanEnergy",
          "disruptiveTechnology",
          "healthcareInnovation",
        ],
      };
    } else if (componentSelected === "Downside Protection") {
      accountKeys = {
        portfolio: "downsideProtected",
        accountKeys: ["protectedSP500"],
      };
    }
    const secondComponent =
      accountKeys.accountKeys.length > 0 &&
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
                  accountKeys.portfolio as keyof SyfeInterface;
                const portfolioAllocation = syfeAllocation[portfolioKey];
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
                  portfolioAllocation[key as keyof typeof portfolioAllocation];
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
      ));

    return (
      <>
        <View style={styles.formContainer}>
          {firstComponent}
          {secondComponent}
        </View>
      </>
    );
  };

  // Add this function to get consistent colors for each component type
  const getComponentColor = (component: string): string => {
    switch (component) {
      case "Core":
        return PORTFOLIO_COLORS[0]; // blue
      case "Cash Management":
        return PORTFOLIO_COLORS[1]; // red
      case "REIT+":
        return PORTFOLIO_COLORS[2]; // teal
      case "Income Plus":
        return PORTFOLIO_COLORS[3]; // yellow
      case "Thematic":
        return PORTFOLIO_COLORS[4]; // purple
      case "Downside Protection":
        return PORTFOLIO_COLORS[5]; // green
      default:
        return PORTFOLIO_COLORS[0];
    }
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

            {renderSyfeEditDetails()}

            <View style={styles.formActions}>
              <LoadingButton
                title="Save"
                onPress={() => handleSave()}
                isLoading={isLoading ?? false}
                color="#4A6FA5"
              />
              <View style={{ height: 15 }} />
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
