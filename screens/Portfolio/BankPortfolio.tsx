import { Button, Text, TouchableOpacity, View } from "react-native";
import {
  BankItems,
  formatCurrency,
  PORTFOLIO_COLORS,
  portFolioStyles as styles,
} from "../../types/wealth.types";
import { useAppSelector } from "../../store/rootTypes";
import { assetAllocationSelector } from "../../store/portfolio/portfolioSelector";
import { useEffect, useState } from "react";
import {
  calculateCategoryTotalRecursively,
  calculatePercentage,
  toggleSection,
} from "../../constants/helper";
import { Ionicons } from "@expo/vector-icons";
import { EditBankPortfolio } from "./EditBankPortfolio";

interface BankPortfolioProps {
  bankTotal: number;
  totalNetWorth: number;
  expandedSections: {
    [key: string]: boolean;
  };
  setExpandedSections: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
}

export function BankPortfolio({
  expandedSections,
  bankTotal,
  totalNetWorth,
  setExpandedSections,
}: BankPortfolioProps) {
  const assetAllocation = useAppSelector(assetAllocationSelector);
  const [editModal, setEditModal] = useState(false);

  const [bankSelections, setBankSelections] = useState<{
    [key: string]: boolean;
  }>({ dropdownOpen: false });

  useEffect(() => {
    console.log("hihi", assetAllocation);
  }, [bankSelections]);

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

        {Object.keys(bank).map((key) => {
          const standardBankKeys = ["savings", "fixed_deposit"];
          if (standardBankKeys.includes(key) || bank[key] === undefined) {
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
                {formatCurrency(Number(bank[key]))}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderBank = () => {
    const expanded = expandedSections["Bank"];
    const percentage = calculatePercentage(bankTotal, totalNetWorth);
    if (!assetAllocation?.Bank) {
      return null;
    }

    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryHeader,
            { borderLeftColor: PORTFOLIO_COLORS[0], borderLeftWidth: 5 },
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
                        { backgroundColor: PORTFOLIO_COLORS[0] },
                      ]}
                    >
                      <Text style={styles.platformIconText}>
                        {bank.charAt(0)}
                      </Text>
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
            <Button
              color="green"
              title="Edit"
              onPress={() => setEditModal(true)}
            ></Button>
            <EditBankPortfolio
              editModal={editModal}
              setEditModal={setEditModal}
              setMainBankSelections={setBankSelections}
            ></EditBankPortfolio>
          </View>
        )}
      </View>
    );
  };

  return renderBank();
}
