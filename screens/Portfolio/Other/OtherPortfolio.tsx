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
  OtherAssetItem,
  PORTFOLIO_COLORS,
} from "../../../types/wealth.types";
import { portFolioStyles as styles } from "../../../types/wealth.types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { EditOtherPortfolio } from "./EditOtherPortfolio";

interface OtherPortfolioProps {
  totalNetWorth: number;
  expandedSections: { [key: string]: boolean };
  setExpandedSections: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
  assetAllocation: AssetAllocations;
}

export function OtherPortfolio({
  totalNetWorth,
  expandedSections,
  assetAllocation,
  setExpandedSections,
}: OtherPortfolioProps) {
  const [otherSelections, setOtherSelections] = useState<{
    [key: string]: boolean;
  }>({});
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    if (assetAllocation?.Others) {
      const initialSelections: { [key: string]: boolean } = {};
      Object.keys(assetAllocation.Others).forEach((broker) => {
        otherSelections[broker] = false;
      });
      setOtherSelections(initialSelections);
    }
  }, [assetAllocation?.Others]);

  const othersTotal = assetAllocation.Others
    ? calculateCategoryTotalRecursively(assetAllocation.Others)
    : 0;

  const renderBrokerDetails = (others: OtherAssetItem) => {
    if (!others) {
      return null;
    }

    return (
      <View style={styles.bankDetailsContainer}>
        <View style={styles.assetItem}>
          <View style={styles.assetInfoRow}>
            <View
              style={[
                styles.accountTypeIndicator,
                { backgroundColor: "#4A90E2" },
              ]}
            />
            <View style={styles.assetInfo}>
              <Text style={styles.assetName}>
                {others.label || "Other Asset"}
              </Text>
            </View>
          </View>
          <Text style={styles.assetValue}>{formatCurrency(others.amount)}</Text>
        </View>
      </View>
    );
  };

  const renderBroker = () => {
    const expanded = expandedSections["Others"];
    const percentage = calculatePercentage(othersTotal, totalNetWorth);

    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryHeader,
            { borderLeftColor: PORTFOLIO_COLORS[4], borderLeftWidth: 5 },
          ]}
          onPress={() => toggleSection("Others", setExpandedSections)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.categoryTitle}>Other Investments</Text>
            <Text style={styles.categoryPercentage}>
              {percentage.toFixed(1)}% of portfolio
            </Text>
          </View>
          <Text style={styles.categoryValue}>
            {formatCurrency(othersTotal)}
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
            {Object.keys(assetAllocation.Others).map((broker) => (
              <View key={broker} style={styles.platformContainer}>
                <TouchableOpacity
                  style={styles.platformHeader}
                  onPress={() => toggleSection(broker, setOtherSelections)}
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
                          assetAllocation.Others[broker]
                        )
                      )}
                    </Text>
                    <Ionicons
                      name={
                        otherSelections[broker] ? "chevron-up" : "chevron-down"
                      }
                      size={20}
                      color="#555"
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                </TouchableOpacity>
                {otherSelections[broker] && (
                  <View style={styles.nestedDetails}>
                    {renderBrokerDetails(assetAllocation.Others[broker])}
                  </View>
                )}
              </View>
            ))}
            <Button
              color="green"
              title="Edit"
              onPress={() => setEditModal(true)}
            ></Button>
            <EditOtherPortfolio
              editModal={editModal}
              setEditModal={setEditModal}
              setMainOtherSelections={setOtherSelections}
            ></EditOtherPortfolio>
          </View>
        )}
      </View>
    );
  };
  return renderBroker();
}
