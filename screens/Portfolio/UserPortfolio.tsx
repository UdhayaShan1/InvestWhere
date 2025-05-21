import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import {
  assetAllocationSelector,
  netWorthSelector,
} from "../../store/portfolio/portfolioSelector";
import { Ionicons } from "@expo/vector-icons";
import { portfolioAction } from "../../store/portfolio/portfolioSlice";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import {
  BankInterface,
  BankItems,
  calculatePercentage,
  formatCurrency,
  isJsonObject,
  SyfeInterface,
} from "../../types/wealth.types";
import { loggedInUserSelector } from "../../store/auth/authSelector";
import { portFolioStyles as styles } from "../../types/wealth.types";

const screenWidth = Dimensions.get("window").width;

const COLORS = [
  "blue", // Bank (blue)
  "red", // Robos (red)
  "teal", // Investments (teal)
  "yellow", // CPF (yellow)
  "purple", // Crypto (purple)
  "green", // Others (green)
];

export function UserPortfolio() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(loggedInUserSelector);
  const assetAllocation = useAppSelector(assetAllocationSelector);
  const netWorthSummary = useAppSelector(netWorthSelector);
  const [refreshing, setRefreshing] = useState(false);

  // Dynamically initialize bankSelections based on assetAllocation.Bank keys
  const [bankSelections, setBankSelections] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (assetAllocation?.Bank) {
      const initialSelections: { [key: string]: boolean } = {};
      Object.keys(assetAllocation.Bank).forEach((bank) => {
        initialSelections[bank] = false;
      });
      setBankSelections(initialSelections);
    }
  }, [assetAllocation?.Bank]);

  const [roboSelections, setRoboSelections] = useState<{
    [key: string]: boolean;
  }>({
    Syfe: false,
    Endowus: false,
    Stashaway: false,
  });

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    Bank: false,
    Robos: false,
    SyfeDetail: false,
    Investments: false,
    CPF: false,
    Crypto: false,
    Others: false,
  });

  function calculateCategoryTotalRecursively(obj: any) {
    if (!isJsonObject(obj)) {
      return obj;
    }
    let sum = 0;
    for (const key in obj) {
      sum += calculateCategoryTotalRecursively(obj[key]);
    }
    return sum;
  }

  const bankTotal = assetAllocation?.Bank
    ? calculateCategoryTotalRecursively(assetAllocation.Bank)
    : 0;

  const syfeTotal = assetAllocation?.Robos?.Syfe
    ? calculateCategoryTotalRecursively(assetAllocation.Robos.Syfe)
    : 0;
  const roboTotal = syfeTotal; //additional in future

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
      color: COLORS[0],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Robos",
      value: roboTotal,
      color: COLORS[1],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Investments",
      value: investmentsTotal,
      color: COLORS[2],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "CPF",
      value: cpfTotal,
      color: COLORS[3],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Crypto",
      value: cryptoTotal,
      color: COLORS[4],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Others",
      value: othersTotal,
      color: COLORS[5],
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

  const toggleSection = (
    section: string,
    setSection: (
      value: React.SetStateAction<{
        [key: string]: boolean;
      }>
    ) => void
  ) => {
    setSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!netWorthSummary || !assetAllocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text style={styles.loadingText}>Loading your portfolio!</Text>
      </View>
    );
  }

  const renderCategorySection = (
    title: string,
    total: number,
    color: string,
    items:
      | { [key: string]: number }
      | { [key: string]: { amount: number; label?: string; notes?: string } }
      | SyfeInterface
      | undefined,
    isRobo = false
  ) => {
    const expanded = expandedSections[title];
    const percentage = calculatePercentage(total, totalNetWorth);
    if (!items || Object.keys(items).length === 0) {
      return null;
    }

    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryHeader,
            { borderLeftColor: color, borderLeftWidth: 5 },
          ]}
          onPress={() => toggleSection(title, setExpandedSections)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.categoryTitle}>{title}</Text>
            <Text style={styles.categoryPercentage}>
              {percentage.toFixed(1)}% of portfolio
            </Text>
          </View>
          <Text style={styles.categoryValue}>{formatCurrency(total)}</Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#555"
            style={styles.expandIcon}
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.categoryDetails}>
            {isRobo
              ? // Special handling for Syfe
                renderSyfeDetails(items as SyfeInterface)
              : // Normal handling for other categories
                Object.entries(items).map(([key, value]) => {
                  // Handle different item formats
                  const itemValue =
                    typeof value === "number" ? value : value.amount;
                  const itemLabel =
                    typeof value === "number" ? key : value.label || key;
                  const itemNote =
                    typeof value === "number" ? undefined : value.notes;

                  return (
                    <View key={key} style={styles.assetItem}>
                      <View style={styles.assetInfo}>
                        <Text style={styles.assetName}>{itemLabel}</Text>
                        {itemNote && (
                          <Text style={styles.assetNote}>{itemNote}</Text>
                        )}
                      </View>
                      <Text style={styles.assetValue}>
                        {formatCurrency(itemValue)}
                      </Text>
                    </View>
                  );
                })}
          </View>
        )}
      </View>
    );
  };

  const renderSyfeDetails = (syfe: SyfeInterface) => {
    if (!syfe) return null;

    return (
      <>
        {syfe.core && Object.keys(syfe.core).length > 0 && (
          <View style={styles.syfeGroup}>
            <Text style={styles.syfeGroupTitle}>Core</Text>
            {typeof syfe.core.equity100 === "number" &&
              syfe.core.equity100 > 0 && (
                <View style={styles.assetItem}>
                  <Text style={styles.assetName}>Equity100</Text>
                  <Text style={styles.assetValue}>
                    {formatCurrency(syfe.core.equity100)}
                  </Text>
                </View>
              )}

            {typeof syfe.core.growth === "number" && syfe.core.growth > 0 && (
              <View style={styles.assetItem}>
                <Text style={styles.assetName}>Growth</Text>
                <Text style={styles.assetValue}>
                  {formatCurrency(syfe.core.growth)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Similar blocks for incomePlus, thematic, downsideProtected, cashManagement */}
        {/* (Abbreviated for space - include all Syfe portfolio types here) */}
      </>
    );
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
            { borderLeftColor: COLORS[0], borderLeftWidth: 5 },
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
                        { backgroundColor: COLORS[0] },
                      ]}
                    >
                      <Text style={styles.platformIconText}>{bank.charAt(0)}</Text>
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
            {/* You can add other bank platforms here in the future */}
          </View>
        )}
      </View>
    );
  };

  const renderRoboAdvisors = () => {
    const expanded = expandedSections["Robos"];
    const percentage = calculatePercentage(roboTotal, totalNetWorth);

    if (!assetAllocation?.Robos || roboTotal === 0) {
      return null;
    }

    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryHeader,
            { borderLeftColor: COLORS[1], borderLeftWidth: 5 },
          ]}
          onPress={() => toggleSection("Robos", setExpandedSections)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.categoryTitle}>RoboAdvisors</Text>
            <Text style={styles.categoryPercentage}>
              {percentage.toFixed(1)}% of portfolio
            </Text>
          </View>
          <Text style={styles.categoryValue}>{formatCurrency(roboTotal)}</Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#555"
            style={styles.expandIcon}
          />
        </TouchableOpacity>

        {/* Expanded view shows robo platform details */}
        {expanded && (
          <View style={styles.categoryDetails}>
            {/* Syfe Platform Row */}
            <View style={styles.platformContainer}>
              <TouchableOpacity
                style={styles.platformHeader}
                onPress={() => toggleSection("Syfe", setRoboSelections)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={[
                      styles.platformIcon,
                      { backgroundColor: COLORS[1] },
                    ]}
                  >
                    <Text style={styles.platformIconText}>S</Text>
                  </View>
                  <Text style={styles.platformName}>Syfe</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.platformValue}>
                    {formatCurrency(syfeTotal)}
                  </Text>
                  <Ionicons
                    name={
                      roboSelections["Syfe"] ? "chevron-up" : "chevron-down"
                    }
                    size={20}
                    color="#555"
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </TouchableOpacity>

              {/* Expanded Syfe Details */}
              {roboSelections["Syfe"] && (
                <View style={styles.nestedDetails}>
                  {renderSyfeDetails(assetAllocation.Robos.Syfe)}
                </View>
              )}
            </View>

            {/* You can add other robo platforms here in the future */}
            {/* Example: StashAway, Endowus, etc. */}
          </View>
        )}
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
      <View style={styles.netWorthContainer}>
        <Text style={styles.netWorthLabel}>TOTAL NET WORTH</Text>
        <Text style={styles.netWorthValue}>
          {formatCurrency(totalNetWorth)}
        </Text>
        <Text style={styles.lastUpdated}>
          Last updated: {netWorthSummary.LastUpdated || "Unknown"}
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Asset Allocation</Text>
        {pieChartData.length > 0 && (
          <PieChart
            data={pieChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          ></PieChart>
        )}
      </View>

      <Text style={styles.sectionTitle}>Asset Breakdown</Text>
      {renderBank()}
      {renderRoboAdvisors()}
    </ScrollView>
  );
}
