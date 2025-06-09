import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../../store/rootTypes";
import { assetAllocationSelector } from "../../../store/portfolio/portfolioSelector";
import { calculateCategoryTotalRecursively } from "../../../constants/helper";
import { formatCurrency } from "../../../types/wealth.types";
import { useEffect, useState } from "react";
import {
  incomeLevels,
  investmentHorizons,
  preferredRobos,
  RecommendationForm,
  riskLabels,
} from "../../../types/recommend.types";
import {
  isVerifiedSelector,
  loggedInUserSelector,
} from "../../../store/auth/authSelector";
import {
  getCurrentDateString,
  yearDifference,
} from "../../../constants/date_helper";
import Slider from "@react-native-community/slider";
import { recommendStyles as styles } from "../../../types/recommend.types";
import { recommendAction } from "../../../store/recommend/recommendSlice";
import { isLoadingSelector } from "../../../store/recommend/recommendSelector";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "../../../navigation/BottomTabNavigator";
import { getApiQuota } from "../../../types/auth.types";

type UserPortfolioNavigationProp = BottomTabNavigationProp<BottomTabParamList>;

export default function RecommendPortfolioTab() {
  const navigation = useNavigation<UserPortfolioNavigationProp>();
  const [showIncomeDropdown, setShowIncomeDropdown] = useState(false);
  const isGenerating = useAppSelector(isLoadingSelector);
  const assetAllocation = useAppSelector(assetAllocationSelector);
  const userProfile = useAppSelector(loggedInUserSelector).UserProfile;
  const isVerified = useAppSelector(isVerifiedSelector);
  const assetAllocationTotal =
    calculateCategoryTotalRecursively(assetAllocation);
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<RecommendationForm>({
    currentNetWorth: 0,
    age: 0,
    incomeLevel: "",
    investmentHorizon: "",
    riskProfile: 1,
    riskProfileString: riskLabels[1],
    preferredRobos: {
      syfe: false,
      endowus: false,
    },
    customRobos: "",
    preferredBrokers: {
      tiger: false,
      moomoo: false,
      noInvestmentReference: false,
    },
    customBroker: "",
    additionalComments: "",
  });

  useEffect(() => {
    console.log("@@", form);
    if (
      form.preferredRobos.noRobosReference &&
      (form.preferredRobos.syfe ||
        form.preferredRobos.endowus ||
        form.customRobos)
    ) {
      alert(
        "Please unselect 'No Preference' or custom robos if you do not want to use robo advisors."
      );
    }

    if (
      form.preferredBrokers.noInvestmentReference &&
      (form.preferredBrokers.tiger ||
        form.preferredBrokers.moomoo ||
        form.customBroker)
    ) {
      alert(
        "Please unselect 'No Preference' or custom brokers if you do not want to use investment brokers."
      );
    }
  }, [form]);

  useEffect(() => {
    const total = calculateCategoryTotalRecursively(assetAllocation);
    const userAge = userProfile?.birthday
      ? yearDifference(userProfile.birthday)
      : -1;

    setForm((prev) => ({
      ...prev,
      currentNetWorth: total,
      age: userAge,
    }));
  }, [assetAllocation, userProfile?.birthday]);

  const netWorthSection = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Current Portfolio Value</Text>
        <View style={styles.netWorthCard}>
          <Ionicons name="wallet-outline" size={24} color="#4A6FA5" />
          <View style={styles.netWorthContent}>
            <Text style={styles.netWorthLabel}>Total Net Worth</Text>
            <View style={styles.netWorthInputContainer}>
              <TextInput
                style={styles.netWorthInput}
                value={String(Math.round(form.currentNetWorth))}
                keyboardType="numeric"
                placeholder="Enter your net worth"
                placeholderTextColor="#999"
                onChangeText={(text) =>
                  setForm((prev) => {
                    return {
                      ...prev,
                      currentNetWorth: Number(text) || 0,
                    };
                  })
                }
              />
              <TouchableOpacity
                style={styles.useCurrentButton}
                onPress={() =>
                  setForm((prev) => {
                    return { ...prev, currentNetWorth: assetAllocationTotal };
                  })
                }
              >
                <Ionicons name="refresh-outline" size={16} color="#4A6FA5" />
                <Text style={styles.useCurrentButtonText}>Use Current</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.currentPortfolioText}>
              Current Portfolio: {formatCurrency(assetAllocationTotal)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPersonalInfoSection = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Age *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your age"
              value={String(form.age)}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, age: Number(text) || 0 }))
              }
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>
    );
  };

  const renderIncomeLevelSection = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Income Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Annual Income Level</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowIncomeDropdown(true)}
          >
            <Ionicons
              name="cash-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <Text
              style={[
                styles.dropdownButtonText,
                !form.incomeLevel && { color: "#999" },
              ]}
            >
              {form.incomeLevel || "Select your income range"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHorizonSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Investment Preferences</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Investment Horizon *</Text>
        <View style={styles.horizonContainer}>
          {investmentHorizons.map((horizon) => (
            <TouchableOpacity
              key={horizon.value}
              style={[
                styles.horizonButton,
                form.investmentHorizon === horizon.value &&
                  styles.horizonButtonActive,
              ]}
              onPress={() =>
                setForm((prev) => ({
                  ...prev,
                  investmentHorizon: horizon.value,
                }))
              }
            >
              <Text
                style={[
                  styles.horizonButtonText,
                  form.investmentHorizon === horizon.value &&
                    styles.horizonButtonTextActive,
                ]}
              >
                {horizon.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderRiskSection = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Risk Profile</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Select your risk tolerance</Text>
          <View style={styles.riskContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={3}
              step={1}
              value={form.riskProfile}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  riskProfile: value,
                  riskProfileString: riskLabels[value],
                }))
              }
              minimumTrackTintColor="#4A6FA5"
              maximumTrackTintColor="#E0E0E0"
              thumbStyle={styles.sliderThumb}
            />
            <View style={styles.riskLabelsContainer}>
              <Text
                style={[
                  styles.riskLabel,
                  form.riskProfile === 0 && styles.riskLabelActive,
                ]}
              >
                Low
              </Text>
              <Text
                style={[
                  styles.riskLabel,
                  form.riskProfile === 1 && styles.riskLabelActive,
                ]}
              >
                Medium
              </Text>
              <Text
                style={[
                  styles.riskLabel,
                  form.riskProfile === 2 && styles.riskLabelActive,
                ]}
              >
                High
              </Text>
              <Text
                style={[
                  styles.riskLabel,
                  form.riskProfile === 3 && styles.riskLabelActive,
                ]}
              >
                AI Decide!
              </Text>
            </View>
          </View>

          {/* Risk description */}
          <View style={styles.riskDescription}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#4A6FA5"
            />
            <Text style={styles.riskDescriptionText}>
              {form.riskProfile === 0 &&
                "Conservative approach with stable, low-volatility investments"}
              {form.riskProfile === 1 &&
                "Balanced mix of growth and stability with moderate risk"}
              {form.riskProfile === 2 &&
                "Aggressive growth strategy with higher potential returns and risk"}
              {form.riskProfile === 3 &&
                "Let AI analyze your profile and determine the optimal risk level"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderRoboSection = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>RoboAdvisors Preferences</Text>
        {Object.entries(form.preferredRobos).map(([key, value]) => {
          return (
            <View key={key} style={styles.checkboxContainer}>
              <Switch
                value={value}
                onValueChange={(newValue) =>
                  setForm((prev) => ({
                    ...prev,
                    preferredRobos: {
                      ...prev.preferredRobos,
                      [key]: newValue,
                    },
                  }))
                }
                trackColor={{ false: "#E0E0E0", true: "#4A6FA5" }}
                thumbColor={value ? "#fff" : "#f4f3f4"}
              />
              <Text style={styles.checkboxLabel}>
                {key === "syfe"
                  ? "Syfe"
                  : key === "endowus"
                    ? "Endowus"
                    : "No Preference"}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderInvestmentSection = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Investment Broker Preferences</Text>
        {Object.entries(form.preferredBrokers).map(([key, value]) => {
          return (
            <View key={key} style={styles.checkboxContainer}>
              <Switch
                value={value}
                onValueChange={(newValue) =>
                  setForm((prev) => ({
                    ...prev,
                    preferredBrokers: {
                      ...prev.preferredBrokers,
                      [key]: newValue,
                    },
                  }))
                }
                trackColor={{ false: "#E0E0E0", true: "#4A6FA5" }}
                thumbColor={value ? "#fff" : "#f4f3f4"}
              />
              <Text style={styles.checkboxLabel}>
                {key === "tiger"
                  ? "Tiger"
                  : key === "moomoo"
                    ? "Moomoo"
                    : "No Preference"}{" "}
                {/* Fixed typo: was "Invesment" */}
              </Text>
            </View>
          );
        })}

        <View style={styles.customInputContainer}>
          <Text style={styles.customInputLabel}>Other Brokers</Text>
          <View style={styles.customInputWrapper}>
            <Ionicons
              name="add-circle-outline"
              size={20}
              color="#4A6FA5"
              style={styles.customInputIcon}
            />
            <TextInput
              style={styles.customTextInput}
              value={form.customBroker}
              placeholder="Input another Broker (e.g., Interactive Brokers)"
              placeholderTextColor="#999"
              onChangeText={(e) =>
                setForm((prev) => {
                  return { ...prev, customBroker: e };
                })
              }
            />
          </View>
        </View>
      </View>
    );
  };

  const renderAdditionalCommentsSection = () => {
    const [showTips, setShowTips] = useState(false);

    const tips = [
      "💰 Specify preferred allocation percentages if you have preferences",
      "🌍 Mention geographic or sector preferences (e.g., 'Focus on Singapore REITs')",
      "⚠️ Include any restrictions (e.g., 'No crypto', 'I want to use Tiger only')",
      "📊 Describe your experience level ('Beginner investor' vs 'Experienced trader')",
      "🎯 Set specific targets ('Generate $500 monthly passive income')",
    ];

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.commentsHeader}>
          <Text style={styles.sectionTitle}>Additional Instructions</Text>
          <TouchableOpacity
            style={styles.tipsButton}
            onPress={() => setShowTips(!showTips)}
          >
            <Ionicons
              name={showTips ? "bulb" : "bulb-outline"}
              size={20}
              color="#4A6FA5"
            />
            <Text style={styles.tipsButtonText}>Tips</Text>
          </TouchableOpacity>
        </View>

        {showTips && (
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>
              💡 How to write effective instructions:
            </Text>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
            <View style={styles.tipHighlight}>
              <Ionicons name="information-circle" size={16} color="#4A6FA5" />
              <Text style={styles.tipHighlightText}>
                Be specific! The more context you provide, the better your
                personalized recommendation will be.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Tell us more about your investment goals
          </Text>
          <View style={styles.textAreaWrapper}>
            <View style={styles.textAreaHeader}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color="#4A6FA5"
              />
              <Text style={styles.textAreaHeaderText}>Custom Instructions</Text>
              <View style={styles.characterCount}>
                <Text style={styles.characterCountText}>
                  {form.additionalComments.length}/500
                </Text>
              </View>
            </View>
            <TextInput
              style={styles.textArea}
              placeholder="Example: I'm 28 years old, planning to buy a house in 5 years, and prefer low-risk investments with steady growth. I'm interested in Singapore REITs and would like to avoid individual stocks..."
              value={form.additionalComments}
              onChangeText={(text) => {
                if (text.length <= 500) {
                  setForm((prev) => ({ ...prev, additionalComments: text }));
                }
              }}
              multiline
              numberOfLines={6}
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
          </View>
        </View>
      </View>
    );
  };

  const renderRecommendButton = () => {
    let currentQuota = 0;
    if (userProfile) {
      currentQuota = getApiQuota(userProfile, getCurrentDateString());
    }

    if (isVerified) {
      return (
        <View style={styles.submitContainer}>
          {/* Improved Quota Display */}
          {userProfile && (
            <View style={styles.quotaDisplayContainer}>
              <View style={styles.quotaIconContainer}>
                <Ionicons
                  name="flash"
                  size={20}
                  color={
                    currentQuota > 2
                      ? "#28a745"
                      : currentQuota > 0
                        ? "#ffc107"
                        : "#dc3545"
                  }
                />
              </View>
              <View style={styles.quotaTextContainer}>
                <Text style={styles.quotaLabel}>Daily AI Recommendations</Text>
                <View style={styles.quotaValueContainer}>
                  <Text
                    style={[
                      styles.quotaValue,
                      {
                        color:
                          currentQuota > 2
                            ? "#28a745"
                            : currentQuota > 0
                              ? "#ffc107"
                              : "#dc3545",
                      },
                    ]}
                  >
                    {currentQuota}
                  </Text>
                  <Text style={styles.quotaTotal}> / 5 remaining</Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              (isGenerating || currentQuota === 0) &&
                styles.submitButtonDisabled,
            ]}
            disabled={isGenerating || currentQuota === 0}
            onPress={() => {
              console.log("Generating AI recommendation with form:", form);
              dispatch(recommendAction.getRecommendation(form));
            }}
          >
            {currentQuota === 0 ? (
              <>
                <Ionicons
                  name="ban-outline"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.submitButtonText}>
                  Daily Quota Exceeded
                </Text>
              </>
            ) : isGenerating ? (
              <>
                <Ionicons
                  name="sync-outline"
                  size={20}
                  color="#fff"
                  style={[styles.spinning, { marginRight: 8 }]}
                />
                <Text style={styles.submitButtonText}>Generating...</Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="rocket-outline"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.submitButtonText}>
                  Generate Recommendation
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[styles.submitButton, styles.submitButtonDisabled]}
          onPress={() => navigation.navigate("ProfileTab")}
        >
          <Ionicons
            name="person-circle-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.submitButtonText}>Verify Email to Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <Ionicons name="bulb-outline" size={28} color="#4A6FA5" />
        <Text style={styles.headerTitle}>Get AI Portfolio Recommendation</Text>
        <Text style={styles.headerSubtitle}>
          Answer a few questions to get a personalized investment portfolio
          recommendation
        </Text>
      </View>

      {netWorthSection()}
      {renderPersonalInfoSection()}
      {renderIncomeLevelSection()}
      {renderHorizonSection()}
      {renderRiskSection()}
      {renderRoboSection()}
      {renderInvestmentSection()}
      {renderAdditionalCommentsSection()}

      <View style={styles.submitContainer}>{renderRecommendButton()}</View>

      {/* Income Level Modal */}
      <Modal
        visible={showIncomeDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowIncomeDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowIncomeDropdown(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Income Level</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowIncomeDropdown(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              {incomeLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.modalOption,
                    form.incomeLevel === level && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setForm((prev) => ({ ...prev, incomeLevel: level }));
                    setShowIncomeDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      form.incomeLevel === level &&
                        styles.modalOptionTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                  {form.incomeLevel === level && (
                    <Ionicons name="checkmark" size={20} color="#4A6FA5" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}
