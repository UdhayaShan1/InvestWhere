import React, { ReactNode, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import {
  AssetAllocations,
  formatCurrency,
  PORTFOLIO_COLORS,
  portFolioStyles,
} from "../../types/wealth.types";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import {
  assetAllocationListSelector,
  netWorthSelector,
} from "../../store/portfolio/portfolioSelector";
import { portfolioAction } from "../../store/portfolio/portfolioSlice";
import { currentUidSelector } from "../../store/auth/authSelector";
import { calculateCategoryTotalRecursively } from "../../constants/helper";
import { LinearGradient } from "expo-linear-gradient";
import { UserPortfolio } from "../Portfolio/UserPortfolio";
import { SummaryPortfolio } from "../Portfolio/SummaryPortfolio";
import { AIUserPortfolio } from "./AIUserPortfolio";
import { AIBankPortfolio } from "./AIBankPortfolio";

const screenWidth = Dimensions.get("window").width;

export default function PortfolioList() {
  const dispatch = useAppDispatch();
  const assetAllocationList = useAppSelector(assetAllocationListSelector);
  const netWorthSummary = useAppSelector(netWorthSelector);
  const [recommendationId, setRecommendationId] = useState(-1);
  const currentAssetAllocation = assetAllocationList?.current;
  const recommendedAssetAllocationList = assetAllocationList?.recommended;
  const uid = useAppSelector(currentUidSelector);

  useEffect(() => {
    if (uid) {
      dispatch(portfolioAction.loadAssetAllocationList(uid));
    }
  }, [uid, dispatch]);

  useEffect(() => {
    console.log("Recommended", assetAllocationList);
  }, [recommendedAssetAllocationList]);

  const calculatePortfolioData = (assetAllocation: AssetAllocations) => {
    console.log(assetAllocation, "Hmm");
    const bankTotal = assetAllocation?.Bank
      ? calculateCategoryTotalRecursively(assetAllocation.Bank)
      : 0;

    const roboTotal = assetAllocation?.Robos
      ? calculateCategoryTotalRecursively(assetAllocation?.Robos)
      : 0;

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

    const total =
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
        legendFontSize: 10,
      },
      {
        name: "Robos",
        value: roboTotal,
        color: PORTFOLIO_COLORS[1],
        legendFontColor: "#7F7F7F",
        legendFontSize: 10,
      },
      {
        name: "Investments",
        value: investmentsTotal,
        color: PORTFOLIO_COLORS[2],
        legendFontColor: "#7F7F7F",
        legendFontSize: 10,
      },
      {
        name: "CPF",
        value: cpfTotal,
        color: PORTFOLIO_COLORS[3],
        legendFontColor: "#7F7F7F",
        legendFontSize: 10,
      },
      {
        name: "Crypto",
        value: cryptoTotal,
        color: PORTFOLIO_COLORS[4],
        legendFontColor: "#7F7F7F",
        legendFontSize: 10,
      },
      {
        name: "Others",
        value: othersTotal,
        color: PORTFOLIO_COLORS[5],
        legendFontColor: "#7F7F7F",
        legendFontSize: 10,
      },
    ].filter((item) => item.value > 0);

    if (pieChartData.length === 0) {
      pieChartData.push({
        name: "No Data",
        value: 1,
        color: "#CCCCCC",
        legendFontColor: "#7F7F7F",
        legendFontSize: 10,
      });
    }

    // Calculate percentages for each component
    const getPercentage = (value: number) => {
      return total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
    };

    return {
      bankTotal,
      roboTotal,
      investmentsTotal,
      cpfTotal,
      cryptoTotal,
      othersTotal,
      total,
      pieChartData,
      // Add percentages
      bankPercent: getPercentage(bankTotal),
      roboPercent: getPercentage(roboTotal),
      investmentsPercent: getPercentage(investmentsTotal),
      cpfPercent: getPercentage(cpfTotal),
      cryptoPercent: getPercentage(cryptoTotal),
      othersPercent: getPercentage(othersTotal),
    };
  };

  const renderCurrentPortfolio = () => {
    if (!currentAssetAllocation) return null;

    const portfolioData = calculatePortfolioData(currentAssetAllocation);

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Current Portfolio</Text>

        <View style={styles.portfolioCard}>
          <LinearGradient
            colors={["#4A6FA5", "#6789BE"]}
            style={styles.portfolioHeader}
          >
            <View>
              <Text style={styles.portfolioTitle}>My Current Allocation</Text>
              <Text style={styles.portfolioSubtitle}>
                Last updated: {netWorthSummary?.LastUpdated}
              </Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(portfolioData.total)}
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.portfolioContent}>
            <View style={styles.chartContainer}>
              <PieChart
                data={portfolioData.pieChartData}
                width={screenWidth * 0.35}
                height={120}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                hasLegend={false}
              />
            </View>

            <View style={styles.statsContainer}>
              {portfolioData.bankTotal > 0 && (
                <View style={styles.statRow}>
                  <View
                    style={[
                      styles.statIndicator,
                      { backgroundColor: PORTFOLIO_COLORS[0] },
                    ]}
                  />
                  <Text style={styles.statLabel}>Bank</Text>
                  <View style={styles.statValueContainer}>
                    <Text style={styles.statValue}>
                      {formatCurrency(portfolioData.bankTotal)}
                    </Text>
                    <Text style={styles.statPercent}>
                      {portfolioData.bankPercent}%
                    </Text>
                  </View>
                </View>
              )}

              {portfolioData.roboTotal > 0 && (
                <View style={styles.statRow}>
                  <View
                    style={[
                      styles.statIndicator,
                      { backgroundColor: PORTFOLIO_COLORS[1] },
                    ]}
                  />
                  <Text style={styles.statLabel}>Robos</Text>
                  <View style={styles.statValueContainer}>
                    <Text style={styles.statValue}>
                      {formatCurrency(portfolioData.roboTotal)}
                    </Text>
                    <Text style={styles.statPercent}>
                      {portfolioData.roboPercent}%
                    </Text>
                  </View>
                </View>
              )}

              {portfolioData.investmentsTotal > 0 && (
                <View style={styles.statRow}>
                  <View
                    style={[
                      styles.statIndicator,
                      { backgroundColor: PORTFOLIO_COLORS[2] },
                    ]}
                  />
                  <Text style={styles.statLabel}>Investments</Text>
                  <View style={styles.statValueContainer}>
                    <Text style={styles.statValue}>
                      {formatCurrency(portfolioData.investmentsTotal)}
                    </Text>
                    <Text style={styles.statPercent}>
                      {portfolioData.investmentsPercent}%
                    </Text>
                  </View>
                </View>
              )}

              {portfolioData.cpfTotal > 0 && (
                <View style={styles.statRow}>
                  <View
                    style={[
                      styles.statIndicator,
                      { backgroundColor: PORTFOLIO_COLORS[3] },
                    ]}
                  />
                  <Text style={styles.statLabel}>CPF</Text>
                  <View style={styles.statValueContainer}>
                    <Text style={styles.statValue}>
                      {formatCurrency(portfolioData.cpfTotal)}
                    </Text>
                    <Text style={styles.statPercent}>
                      {portfolioData.cpfPercent}%
                    </Text>
                  </View>
                </View>
              )}

              {portfolioData.cryptoTotal > 0 && (
                <View style={styles.statRow}>
                  <View
                    style={[
                      styles.statIndicator,
                      { backgroundColor: PORTFOLIO_COLORS[4] },
                    ]}
                  />
                  <Text style={styles.statLabel}>Crypto</Text>
                  <View style={styles.statValueContainer}>
                    <Text style={styles.statValue}>
                      {formatCurrency(portfolioData.cryptoTotal)}
                    </Text>
                    <Text style={styles.statPercent}>
                      {portfolioData.cryptoPercent}%
                    </Text>
                  </View>
                </View>
              )}

              {portfolioData.othersTotal > 0 && (
                <View style={styles.statRow}>
                  <View
                    style={[
                      styles.statIndicator,
                      { backgroundColor: PORTFOLIO_COLORS[5] },
                    ]}
                  />
                  <Text style={styles.statLabel}>Others</Text>
                  <View style={styles.statValueContainer}>
                    <Text style={styles.statValue}>
                      {formatCurrency(portfolioData.othersTotal)}
                    </Text>
                    <Text style={styles.statPercent}>
                      {portfolioData.othersPercent}%
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderRecommendations = () => {
    if (
      !recommendedAssetAllocationList ||
      Object.keys(recommendedAssetAllocationList).length === 0
    ) {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>AI Recommendations</Text>
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No AI recommendations yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Generate your first recommendation to see it here
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>AI Recommendations</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendationsScrollContent}
        >
          {Object.keys(recommendedAssetAllocationList).map((id) => {
            const recommendation = recommendedAssetAllocationList[Number(id)];
            const portfolioData = calculatePortfolioData(
              recommendation.assetAllocations
            );
            console.log(id, portfolioData, "@@@");

            return (
              <View key={id} style={styles.recommendationCard}>
                <LinearGradient
                  colors={["#28a745", "#4bbe65"]}
                  style={styles.portfolioHeader}
                >
                  <View>
                    <Text style={styles.portfolioTitle}>
                      AI Portfolio #{id}
                    </Text>
                    <Text style={styles.portfolioSubtitle}>
                      Created: {recommendation.createdOn || "Today"}
                    </Text>
                  </View>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                      {formatCurrency(portfolioData.total)}
                    </Text>
                  </View>
                </LinearGradient>

                <View style={styles.portfolioContent}>
                  <View style={styles.chartContainer}>
                    <PieChart
                      data={portfolioData.pieChartData}
                      width={screenWidth * 0.35}
                      height={120}
                      chartConfig={{
                        color: (opacity = 1) =>
                          `rgba(255, 255, 255, ${opacity})`,
                      }}
                      accessor="value"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                      hasLegend={false}
                    />
                  </View>

                  <View style={styles.statsContainer}>
                    {portfolioData.bankTotal > 0 && (
                      <View style={styles.statRow}>
                        <View
                          style={[
                            styles.statIndicator,
                            { backgroundColor: PORTFOLIO_COLORS[0] },
                          ]}
                        />
                        <Text style={styles.statLabel}>Bank</Text>
                        <View style={styles.statValueContainer}>
                          <Text style={styles.statValue}>
                            {formatCurrency(portfolioData.bankTotal)}
                          </Text>
                          <Text style={styles.statPercent}>
                            {portfolioData.bankPercent}%
                          </Text>
                        </View>
                      </View>
                    )}

                    {portfolioData.roboTotal > 0 && (
                      <View style={styles.statRow}>
                        <View
                          style={[
                            styles.statIndicator,
                            { backgroundColor: PORTFOLIO_COLORS[1] },
                          ]}
                        />
                        <Text style={styles.statLabel}>Robos</Text>
                        <View style={styles.statValueContainer}>
                          <Text style={styles.statValue}>
                            {formatCurrency(portfolioData.roboTotal)}
                          </Text>
                          <Text style={styles.statPercent}>
                            {portfolioData.roboPercent}%
                          </Text>
                        </View>
                      </View>
                    )}

                    {portfolioData.investmentsTotal > 0 && (
                      <View style={styles.statRow}>
                        <View
                          style={[
                            styles.statIndicator,
                            { backgroundColor: PORTFOLIO_COLORS[2] },
                          ]}
                        />
                        <Text style={styles.statLabel}>Investments</Text>
                        <View style={styles.statValueContainer}>
                          <Text style={styles.statValue}>
                            {formatCurrency(portfolioData.investmentsTotal)}
                          </Text>
                          <Text style={styles.statPercent}>
                            {portfolioData.investmentsPercent}%
                          </Text>
                        </View>
                      </View>
                    )}

                    {portfolioData.cpfTotal > 0 && (
                      <View style={styles.statRow}>
                        <View
                          style={[
                            styles.statIndicator,
                            { backgroundColor: PORTFOLIO_COLORS[3] },
                          ]}
                        />
                        <Text style={styles.statLabel}>CPF</Text>
                        <View style={styles.statValueContainer}>
                          <Text style={styles.statValue}>
                            {formatCurrency(portfolioData.cpfTotal)}
                          </Text>
                          <Text style={styles.statPercent}>
                            {portfolioData.cpfPercent}%
                          </Text>
                        </View>
                      </View>
                    )}

                    {portfolioData.cryptoTotal > 0 && (
                      <View style={styles.statRow}>
                        <View
                          style={[
                            styles.statIndicator,
                            { backgroundColor: PORTFOLIO_COLORS[4] },
                          ]}
                        />
                        <Text style={styles.statLabel}>Crypto</Text>
                        <View style={styles.statValueContainer}>
                          <Text style={styles.statValue}>
                            {formatCurrency(portfolioData.cryptoTotal)}
                          </Text>
                          <Text style={styles.statPercent}>
                            {portfolioData.cryptoPercent}%
                          </Text>
                        </View>
                      </View>
                    )}

                    {portfolioData.othersTotal > 0 && (
                      <View style={styles.statRow}>
                        <View
                          style={[
                            styles.statIndicator,
                            { backgroundColor: PORTFOLIO_COLORS[5] },
                          ]}
                        />
                        <Text style={styles.statLabel}>Others</Text>
                        <View style={styles.statValueContainer}>
                          <Text style={styles.statValue}>
                            {formatCurrency(portfolioData.othersTotal)}
                          </Text>
                          <Text style={styles.statPercent}>
                            {portfolioData.othersPercent}%
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.viewButton]}
                    onPress={() => {
                      console.log(`View portfolio ${id}`);
                      setRecommendationId(Number(id));
                    }}
                  >
                    <Ionicons
                      name="eye-outline"
                      size={18}
                      color="#fff"
                      style={styles.actionButtonIcon}
                    />
                    <Text style={styles.actionButtonText}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => {
                      console.log(`Delete portfolio ${id}`);
                      dispatch(
                        portfolioAction.deleteRecommendation({
                          id: id,
                          assetAllocationList: assetAllocationList,
                        })
                      );
                    }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color="#fff"
                      style={styles.actionButtonIcon}
                    />
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderCurrentPortfolio()}
      {renderRecommendations()}
      {recommendationId !== -1 && recommendedAssetAllocationList && (
        <Modal
          visible={recommendationId !== -1}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setRecommendationId(-1)}
        >
          <View style={portFolioStyles.bankModalContainer}>
            <View style={portFolioStyles.bankModalContent}>
              <View style={portFolioStyles.bankModalHeader}>
                <Text style={portFolioStyles.bankModalTitle}>Select Bank</Text>
                <TouchableOpacity
                  onPress={() => setRecommendationId(-1)}
                  style={portFolioStyles.bankModalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <AIUserPortfolio
                assetAllocation={
                  recommendedAssetAllocationList[recommendationId]
                    .assetAllocations
                }
              ></AIUserPortfolio>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 12,
    marginTop: 16,
  },
  portfolioCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  recommendationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
    width: screenWidth * 0.75,
    marginRight: 16,
  },
  portfolioHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  portfolioTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  portfolioSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 4,
  },
  totalContainer: {
    alignItems: "flex-end",
  },
  totalLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
  totalValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  portfolioContent: {
    padding: 16,
    flexDirection: "row",
  },
  chartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  statsContainer: {
    flex: 1.5,
    marginLeft: 8,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 2,
  },
  statIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
    color: "#444",
  },
  statValueContainer: {
    alignItems: "flex-end",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    textAlign: "right",
  },
  statPercent: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "right",
    marginTop: 2,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  viewButton: {
    backgroundColor: "#4A6FA5",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
  },
  deleteButton: {
    backgroundColor: "#e53e3e",
  },
  actionButtonIcon: {
    marginRight: 6,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  recommendationsScrollContent: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  emptyStateContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyStateImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    tintColor: "#d1d8e0",
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
  },
  closeButton: {
    padding: 8,
  },
  modalDetailText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
});
