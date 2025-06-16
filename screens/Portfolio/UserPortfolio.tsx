import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import {
  assetAllocationSelector,
  netWorthSelector,
} from "../../store/portfolio/portfolioSelector";
import { portfolioAction } from "../../store/portfolio/portfolioSlice";
import { Dimensions } from "react-native";
import { PORTFOLIO_COLORS } from "../../types/wealth.types";
import {
  isVerifiedSelector,
  loggedInUserSelector,
} from "../../store/auth/authSelector";
import { portFolioStyles as styles } from "../../types/wealth.types";
import { calculateCategoryTotalRecursively } from "../../constants/helper";
import { SummaryPortfolio } from "./SummaryPortfolio";
import { RoboPortfolio } from "./Robos/RoboPortfolio";
import { InvestmentPortfolio } from "./Investment/InvestmentPortfolio";
import { MarkdownFormattedText } from "../../component/MarkdownFormattedText";
import { Ionicons } from "@expo/vector-icons";
import {
  apiQuotaSelector,
  isLoadingSelector,
} from "../../store/recommend/recommendSelector";
import { recommendAction } from "../../store/recommend/recommendSlice";
import { BankPortfolio } from "./Bank/BankPortfolio";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "../../navigation/BottomTabNavigator";
import { getApiQuota } from "../../types/auth.types";
import {
  getCurrentDateString,
  stringToDate,
} from "../../constants/date_helper";
import { OtherPortfolio } from "./Other/OtherPortfolio";

type UserPortfolioNavigationProp = BottomTabNavigationProp<BottomTabParamList>;

const screenWidth = Dimensions.get("window").width;

export function UserPortfolio() {
  const navigation = useNavigation<UserPortfolioNavigationProp>();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(loggedInUserSelector);
  const assetAllocation = useAppSelector(assetAllocationSelector);
  const netWorthSummary = useAppSelector(netWorthSelector);
  const isVerified = useAppSelector(isVerifiedSelector);
  const dailyQuota = useAppSelector(apiQuotaSelector);
  const [refreshing, setRefreshing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const isGenerating = useAppSelector(isLoadingSelector);

  useEffect(() => {
    const fresh = { ...assetAllocation };
    delete fresh.portfolioStrategy;
    delete fresh.projectedReturns;
    console.log(JSON.stringify(fresh), "%%");
  }, [assetAllocation]);

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    Bank: false,
    Robos: false,
    Investments: false,
    CPF: false,
    Crypto: false,
    Others: false,
  });

  const bankTotal = assetAllocation?.Bank
    ? calculateCategoryTotalRecursively(assetAllocation.Bank)
    : 0;

  const roboTotal = assetAllocation?.Robos
    ? calculateCategoryTotalRecursively(assetAllocation?.Robos)
    : 0; //additional in future

  const investmentsTotal = assetAllocation?.Investments
    ? calculateCategoryTotalRecursively(assetAllocation.Investments)
    : 0;
  const cpfTotal = assetAllocation?.CPF
    ? calculateCategoryTotalRecursively(assetAllocation.CPF)
    : 0;
  const cryptoTotal = assetAllocation?.Crypto
    ? calculateCategoryTotalRecursively(assetAllocation.Crypto)
    : 0;
  const othersTotal = assetAllocation?.Others
    ? Object.values(assetAllocation.Others).reduce(
        (sum, item) => sum + item.amount,
        0
      )
    : 0;

  const totalNetWorth =
    bankTotal +
    roboTotal +
    investmentsTotal +
    cpfTotal +
    cryptoTotal +
    othersTotal;

  const pieChartData = [
    {
      name: "Bank",
      value: bankTotal,
      color: PORTFOLIO_COLORS[0],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Robos",
      value: roboTotal,
      color: PORTFOLIO_COLORS[1],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Investments",
      value: investmentsTotal,
      color: PORTFOLIO_COLORS[2],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "CPF",
      value: cpfTotal,
      color: PORTFOLIO_COLORS[3],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Crypto",
      value: cryptoTotal,
      color: PORTFOLIO_COLORS[4],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Others",
      value: othersTotal,
      color: PORTFOLIO_COLORS[5],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ].filter((item) => item.value > 0); // Only include categories with values

  if (pieChartData.length === 0) {
    pieChartData.push({
      name: "No Data",
      value: 1,
      color: "#CCCCCC",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    });
  }

  useEffect(() => {
    const uid = currentUser.CredProfile?.uid;
    if (uid) {
      dispatch(portfolioAction.loadWealthProfile(uid));
    }
  }, []);

  const onRefresh = () => {
    const uid = currentUser.CredProfile?.uid;
    setRefreshing(true);
    if (uid) {
      dispatch(portfolioAction.loadWealthProfile(uid));
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!netWorthSummary || !assetAllocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={styles.loadingText}>Loading your portfolio!</Text>
      </View>
    );
  }

  const renderFeedback = () => {
    let currentQuota = 0;
    if (currentUser && currentUser.UserProfile && dailyQuota) {
      currentQuota = getApiQuota(
        currentUser.UserProfile,
        getCurrentDateString(),
        dailyQuota
      );
    }
    console.log("Current quota", currentQuota);
    if (
      !assetAllocation?.portfolioStrategy ||
      !assetAllocation.projectedReturns
    ) {
      if (!isVerified) {
        return (
          <View style={styles.feedbackContainer}>
            <TouchableOpacity
              style={[
                styles.generateAnalysisButton,
                isGenerating && styles.submitButtonDisabled,
              ]}
              onPress={() => navigation.navigate("ProfileTab")}
            >
              <View style={styles.generateAnalysisContent}>
                <Ionicons
                  name="person-circle-outline"
                  size={28}
                  color="#4A6FA5"
                />
                <View style={styles.generateAnalysisText}>
                  <Text style={styles.generateAnalysisTitle}>Get Verified</Text>
                  <Text style={styles.generateAnalysisSubtitle}>
                    Please verify your email to unlock personalized AI
                    investment insights and analysis.
                  </Text>
                </View>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={24}
                  color="#4A6FA5"
                />
              </View>
            </TouchableOpacity>
          </View>
        );
      }

      if (currentQuota > 0) {
        return (
          <View style={styles.feedbackContainer}>
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
                <Text style={styles.quotaLabel}>Daily AI Analysis</Text>
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

            <TouchableOpacity
              style={[
                styles.generateAnalysisButton,
                isGenerating && styles.submitButtonDisabled,
              ]}
              onPress={() => {
                console.log("Generate AI analysis");
                dispatch(recommendAction.getAnalysis(assetAllocation));
              }}
              disabled={isGenerating}
            >
              <View style={styles.generateAnalysisContent}>
                {isGenerating ? (
                  <Ionicons name="sync-outline" size={28} color="#4A6FA5" />
                ) : (
                  <Ionicons name="sparkles-outline" size={28} color="#4A6FA5" />
                )}
                <View style={styles.generateAnalysisText}>
                  <Text style={styles.generateAnalysisTitle}>
                    {isGenerating
                      ? "Generating...."
                      : "Generate AI Investment Analysis"}
                  </Text>
                  <Text style={styles.generateAnalysisSubtitle}>
                    Get personalized strategy analysis and projected returns
                    based on your current portfolio
                  </Text>
                </View>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={24}
                  color="#4A6FA5"
                />
              </View>
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <View style={styles.feedbackContainer}>
          <View style={styles.quotaExhaustedContainer}>
            <View style={styles.quotaExhaustedIcon}>
              <Ionicons name="battery-dead-outline" size={32} color="#dc3545" />
            </View>
            <View style={styles.quotaExhaustedContent}>
              <Text style={styles.quotaExhaustedTitle}>
                Daily Quota Reached
              </Text>
              <Text style={styles.quotaExhaustedSubtitle}>
                You've used all 5 AI analyses for today.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.generateAnalysisButton, styles.submitButtonDisabled]}
          >
            <View style={styles.generateAnalysisContent}>
              {isGenerating ? (
                <Ionicons name="sync-outline" size={28} color="#4A6FA5" />
              ) : (
                <Ionicons name="sparkles-outline" size={28} color="#4A6FA5" />
              )}
              <View style={styles.generateAnalysisText}>
                <Text style={styles.generateAnalysisTitle}>
                  {"You have zero quota for the day, try again tomorrow!"}
                </Text>
              </View>
              <Ionicons
                name="arrow-forward-circle-outline"
                size={24}
                color="#4A6FA5"
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    if (!showFeedback) {
      return (
        <View style={styles.feedbackContainer}>
          {currentUser.UserProfile && (
            <View style={styles.compactQuotaContainer}>
              <Ionicons name="flash-outline" size={16} color="#4A6FA5" />
              <Text style={styles.compactQuotaText}>
                {getApiQuota(currentUser.UserProfile, getCurrentDateString(), dailyQuota ?? 0)} /
                5 analyses left today
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.feedbackToggleButton}
            onPress={() => setShowFeedback(true)}
          >
            <View style={styles.feedbackToggleContent}>
              <Ionicons name="analytics-outline" size={24} color="#4A6FA5" />
              <View style={styles.feedbackToggleText}>
                <Text style={styles.feedbackToggleTitle}>
                  AI Investment Analysis
                </Text>
                <Text style={styles.feedbackToggleSubtitle}>
                  View detailed strategy and projected returns
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#4A6FA5" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.generateAgainButton,
              isGenerating && styles.submitButtonDisabled,
              styles.getVerifiedButton,
            ]}
            onPress={() => {
              console.log("Generate analysis again");
              dispatch(recommendAction.getAnalysis(assetAllocation));
            }}
            disabled={isGenerating || currentQuota === 0}
          >
            <View style={styles.generateAgainContent}>
              {isGenerating ? (
                <Ionicons name="sync-outline" size={20} color="#4A6FA5" />
              ) : (
                <Ionicons name="refresh-outline" size={20} color="#4A6FA5" />
              )}
              <Text style={styles.generateAgainText}>
                {isGenerating
                  ? "Generating..."
                  : currentQuota > 0
                    ? "Generate Fresh Analysis"
                    : "No Quota Available"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.feedbackContainer}>
        <View style={styles.feedbackHeader}>
          <View style={styles.feedbackHeaderContent}>
            <Ionicons name="analytics" size={24} color="#4A6FA5" />
            <Text style={styles.feedbackHeaderTitle}>
              AI Investment Analysis
            </Text>
          </View>
          <TouchableOpacity
            style={styles.feedbackCloseButton}
            onPress={() => setShowFeedback(false)}
          >
            <Ionicons name="close-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.feedbackContent}>
          <View style={styles.feedbackSection}>
            <View style={styles.feedbackSectionHeader}>
              <Ionicons name="trending-up-outline" size={20} color="#28a745" />
              <Text style={styles.feedbackSectionTitle}>
                Portfolio Strategy
              </Text>
            </View>
            <View style={styles.feedbackMarkdownContainer}>
              <MarkdownFormattedText
                content={assetAllocation.portfolioStrategy}
              />
            </View>
          </View>

          <View style={styles.feedbackDivider} />

          <View style={styles.feedbackSection}>
            <View style={styles.feedbackSectionHeader}>
              <Ionicons name="calculator-outline" size={20} color="#4A6FA5" />
              <Text style={styles.feedbackSectionTitle}>Projected Returns</Text>
            </View>
            <View style={styles.feedbackMarkdownContainer}>
              <MarkdownFormattedText
                content={assetAllocation.projectedReturns}
              />
            </View>
          </View>

          {assetAllocation.analysedOn && (
            <View style={styles.feedbackFooter}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.feedbackAnalysisDate}>
                Analysis Date: {assetAllocation.analysedOn}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        ></RefreshControl>
      }
    >
      <SummaryPortfolio
        totalNetWorth={totalNetWorth}
        netWorthSummary={netWorthSummary}
        pieChartData={pieChartData}
        screenWidth={screenWidth}
      />

      {renderFeedback()}

      <Text style={styles.sectionTitle}>Asset Breakdown</Text>

      <BankPortfolio
        bankTotal={bankTotal}
        totalNetWorth={totalNetWorth}
        expandedSections={expandedSections}
        setExpandedSections={setExpandedSections}
      />
      <RoboPortfolio
        expandedSections={expandedSections}
        setExpandedSections={setExpandedSections}
        assetAllocation={assetAllocation}
        roboTotal={roboTotal}
        totalNetWorth={totalNetWorth}
      />
      <InvestmentPortfolio
        totalNetWorth={totalNetWorth}
        expandedSections={expandedSections}
        setExpandedSections={setExpandedSections}
        assetAllocation={assetAllocation}
      />
      <OtherPortfolio
        totalNetWorth={totalNetWorth}
        expandedSections={expandedSections}
        setExpandedSections={setExpandedSections}
        assetAllocation={assetAllocation}
      />
    </ScrollView>
  );
}
