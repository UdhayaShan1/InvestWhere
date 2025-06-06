import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Button,
} from "react-native";
import { Dimensions } from "react-native";
import {
  AssetAllocations,
  AssetAllocationsList,
  PORTFOLIO_COLORS,
  defaultAssetAllocations,
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
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import { portfolioAction } from "../../store/portfolio/portfolioSlice";
import { currentUidSelector } from "../../store/auth/authSelector";

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
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
          assetAllocation={
            assetAllocation ?? defaultAssetAllocations(uid ?? "")
          }
          roboTotal={roboTotal}
          totalNetWorth={totalNetWorth}
        />

        <AIInvestmentPortfolio
          totalNetWorth={totalNetWorth}
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
          assetAllocation={
            assetAllocation ?? defaultAssetAllocations(uid ?? "")
          }
        />
        <Button
          title="Apply"
          onPress={() => {
            dispatch(
              portfolioAction.applyRecommendation({
                assetAllocationList: assetAllocationList,
                recommendationId: recommendationId,
              })
            );
            setRecommendationId(-1);
          }}
        ></Button>
      </ScrollView>
    </>
  );
}
