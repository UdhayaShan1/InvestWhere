import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import {
  AssetAllocationsList,
  PORTFOLIO_COLORS,
  defaultAssetAllocations,
} from "../../../types/wealth.types";
import { portFolioStyles as styles } from "../../../types/wealth.types";
import { calculateCategoryTotalRecursively } from "../../../constants/helper";
import { AIBankPortfolio } from "./AIBankPortfolio";
import { AISummaryPortfolio } from "./AISummaryPortfolio";
import { AIInvestmentPortfolio } from "./AIInvestmentPortfolio";
import { useAppDispatch, useAppSelector } from "../../../store/rootTypes";
import { portfolioAction } from "../../../store/portfolio/portfolioSlice";
import { currentUidSelector } from "../../../store/auth/authSelector";
import { Ionicons } from "@expo/vector-icons";
import { assetAllocationSelector } from "../../../store/portfolio/portfolioSelector";
import { AIRoboPortfolio } from "./AIRoboPortfolio";
import { MarkdownFormattedText } from "../../../component/MarkdownFormattedText";

const screenWidth = Dimensions.get("window").width;

interface AIUserPortfolioProps {
  assetAllocationList: AssetAllocationsList;
  recommendationId: string;
  setRecommendationId: React.Dispatch<React.SetStateAction<number>>;
}

export function AIUserPortfolio({
  assetAllocationList,
  recommendationId,
  setRecommendationId,
}: AIUserPortfolioProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const uid = useAppSelector(currentUidSelector);
  const assetAllocation =
    assetAllocationList.recommended?.[recommendationId].assetAllocations;
  const dispatch = useAppDispatch();

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
  ].filter((item) => item.value > 0);

  if (pieChartData.length === 0) {
    pieChartData.push({
      name: "No Data",
      value: 1,
      color: "#CCCCCC",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    });
  }

  const onRefresh = () => {
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderFeedback = () => {
    if (
      !assetAllocation?.portfolioStrategy ||
      !assetAllocation.projectedReturns
    ) {
      return null;
    }

    if (!showFeedback) {
      return (
        <View style={styles.feedbackContainer}>
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
    <>
      <ScrollView>
        <AISummaryPortfolio
          totalNetWorth={totalNetWorth}
          pieChartData={pieChartData}
          screenWidth={screenWidth}
        />

        <AIBankPortfolio
          assetAllocation={
            assetAllocation ?? defaultAssetAllocations(uid ?? "")
          }
          bankTotal={bankTotal}
          totalNetWorth={totalNetWorth}
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
        />

        <AIRoboPortfolio
          assetAllocation={
            assetAllocation ?? defaultAssetAllocations(uid ?? "")
          }
          roboTotal={roboTotal}
          totalNetWorth={totalNetWorth}
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
        />

        <AIInvestmentPortfolio
          totalNetWorth={totalNetWorth}
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
          assetAllocation={
            assetAllocation ?? defaultAssetAllocations(uid ?? "")
          }
        />

        {renderFeedback()}

        {/* Replace the single Apply button with two buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.applyEntireButton]}
            onPress={() => {
              dispatch(
                portfolioAction.applyRecommendation({
                  assetAllocationList: assetAllocationList,
                  recommendationId: recommendationId,
                })
              );
              setRecommendationId(-1);
            }}
          >
            <Ionicons
              name="checkmark-done"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.actionButtonText}>Apply Entire</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.applyCompositionButton]}
            onPress={() => {
              console.log("Apply Composition clicked");
              dispatch(
                portfolioAction.applyRecommendationComposition({
                  assetAllocationList: assetAllocationList,
                  recommendationId: recommendationId,
                })
              );
              setRecommendationId(-1);
            }}
          >
            <Ionicons
              name="layers"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.actionButtonText}>Apply Composition</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
