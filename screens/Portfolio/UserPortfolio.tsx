import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import {
  assetAllocationSelector,
  netWorthSelector,
} from "../../store/portfolio/portfolioSelector";
import { portfolioAction } from "../../store/portfolio/portfolioSlice";
import { Dimensions } from "react-native";
import { PORTFOLIO_COLORS } from "../../types/wealth.types";
import { loggedInUserSelector } from "../../store/auth/authSelector";
import { portFolioStyles as styles } from "../../types/wealth.types";
import { calculateCategoryTotalRecursively } from "../../constants/helper";
import { BankPortfolio } from "./BankPortfolio";
import { SummaryPortfolio } from "./SummaryPortfolio";
import { RoboPortfolio } from "./RoboPortfolio";
import { InvestmentPortfolio } from "./InvestmentPortfolio";

const screenWidth = Dimensions.get("window").width;

export function UserPortfolio() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(loggedInUserSelector);
  const assetAllocation = useAppSelector(assetAllocationSelector);
  const netWorthSummary = useAppSelector(netWorthSelector);
  const [refreshing, setRefreshing] = useState(false);

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
    </ScrollView>
  );
}
