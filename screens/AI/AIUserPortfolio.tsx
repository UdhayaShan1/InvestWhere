import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Dimensions } from "react-native";
import {
  AssetAllocations,
  PORTFOLIO_COLORS,
  formatCurrency,
} from "../../types/wealth.types";
import { portFolioStyles as styles } from "../../types/wealth.types";
import { calculateCategoryTotalRecursively } from "../../constants/helper";
import { BankPortfolio } from "../Portfolio/BankPortfolio";
import { AIBankPortfolio } from "./AIBankPortfolio";
import { SummaryPortfolio } from "../Portfolio/SummaryPortfolio";
import { AISummaryPortfolio } from "./AISummaryPortfolio";
import AIPortfolio from "./AIPortfolio";
import { AIRoboPortfolio } from "./AIRoboPortfolio";
import { AIInvestmentPortfolio } from "./AIInvestmentPortfolio";

const screenWidth = Dimensions.get("window").width;

interface AIUserPortfolioProps {
  assetAllocation: AssetAllocations;
}

export function AIUserPortfolio({ assetAllocation }: AIUserPortfolioProps) {
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = () => {
    setTimeout(() => setRefreshing(false), 1000);
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
          assetAllocation={assetAllocation}
          bankTotal={bankTotal}
          totalNetWorth={totalNetWorth}
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
        />

        <AIRoboPortfolio
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
          assetAllocation={assetAllocation}
          roboTotal={roboTotal}
          totalNetWorth={totalNetWorth}
        />

        <AIInvestmentPortfolio
          totalNetWorth={totalNetWorth}
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
          assetAllocation={assetAllocation}
        />
      </ScrollView>
    </>
  );
}
