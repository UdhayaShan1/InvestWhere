import { Button, Text, TouchableOpacity, View } from "react-native";
import {
  calculateCategoryTotalRecursively,
  calculatePercentage,
  toggleSection,
} from "../../../constants/helper";
import {
  AssetAllocations,
  formatCurrency,
  InvestmentItems,
  PORTFOLIO_COLORS,
} from "../../../types/wealth.types";
import { portFolioStyles as styles } from "../../../types/wealth.types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

interface InvestmentPortfolioProps {
  totalNetWorth: number;
  expandedSections: { [key: string]: boolean };
  setExpandedSections: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
  assetAllocation: AssetAllocations;
}

export function AIInvestmentPortfolio({
  totalNetWorth,
  expandedSections,
  assetAllocation,
  setExpandedSections,
}: InvestmentPortfolioProps) {
  const [investmentSelections, setInvestmentSelections] = useState<{
    [key: string]: boolean;
  }>({});
  useEffect(() => {
    if (assetAllocation?.Investments) {
      const initialSelections: { [key: string]: boolean } = {};
      Object.keys(assetAllocation.Investments).forEach((broker) => {
        investmentSelections[broker] = false;
      });
      setInvestmentSelections(initialSelections);
    }
  }, [assetAllocation?.Investments]);

  const investmentsTotal = assetAllocation.Investments
    ? calculateCategoryTotalRecursively(assetAllocation.Investments)
    : 0;

  const renderBrokerDetails = (investment: InvestmentItems) => {
    if (!investment) {
      return null;
    }

    return (
      <View style={styles.bankDetailsContainer}>
        {investment.amount !== undefined && (
          <View style={styles.assetItem}>
            <View style={styles.assetInfoRow}>
              <View
                style={[
                  styles.accountTypeIndicator,
                  { backgroundColor: "#4A90E2" },
                ]}
              />
              <View>
                <Text style={styles.assetName}>Amount Invested</Text>
              </View>
            </View>
            <Text style={styles.assetValue}>
              {formatCurrency(investment.amount)}
            </Text>
          </View>
        )}

        {Object.keys(investment).map((key: string) => {
          const standardBankKeys = ["amount"];
          if (standardBankKeys.includes(key) || investment[key] === undefined) {
            return null;
          }
          return (
            <View key={key} style={styles.assetItem}>
              <View style={styles.assetInfoRow}>
                <View
                  style={[
                    styles.accountTypeIndicator,
                    { backgroundColor: "#ff0066" },
                  ]}
                />
                <View>
                  <Text style={styles.assetName}>{key}</Text>
                </View>
              </View>
              <Text style={styles.assetValue}>
                {formatCurrency(investment[key])}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderBroker = () => {
    const expanded = expandedSections["Investments"];
    const percentage = calculatePercentage(investmentsTotal, totalNetWorth);
    if (!assetAllocation?.Investments || investmentsTotal === 0) {
      return null;
    }

    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryHeader,
            { borderLeftColor: PORTFOLIO_COLORS[2], borderLeftWidth: 5 },
          ]}
          onPress={() => toggleSection("Investments", setExpandedSections)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.categoryTitle}>Investments</Text>
            <Text style={styles.categoryPercentage}>
              {percentage.toFixed(1)}% of portfolio
            </Text>
          </View>
          <Text style={styles.categoryValue}>
            {formatCurrency(investmentsTotal)}
          </Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#555"
            style={styles.expandIcon}
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.categoryDetails}>
            {Object.keys(assetAllocation.Investments).map((broker) => (
              <View key={broker} style={styles.platformContainer}>
                <TouchableOpacity
                  style={styles.platformHeader}
                  onPress={() => toggleSection(broker, setInvestmentSelections)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={[
                        styles.platformIcon,
                        { backgroundColor: PORTFOLIO_COLORS[0] },
                      ]}
                    >
                      <Text style={styles.platformIconText}>
                        {broker.charAt(0)}
                      </Text>
                    </View>
                    <Text style={styles.platformName}>{broker}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.platformValue}>
                      {formatCurrency(
                        calculateCategoryTotalRecursively(
                          assetAllocation.Investments[broker]
                        )
                      )}
                    </Text>
                    <Ionicons
                      name={
                        investmentSelections[broker]
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={20}
                      color="#555"
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                </TouchableOpacity>
                {investmentSelections[broker] && (
                  <View style={styles.nestedDetails}>
                    {renderBrokerDetails(assetAllocation.Investments[broker])}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };
  return renderBroker();
}
