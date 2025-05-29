import { Button, Text, TouchableOpacity, View } from "react-native";
import {
  AssetAllocations,
  formatCurrency,
  isCustomSyfePortfolio,
  PORTFOLIO_COLORS,
  SyfeInterface,
} from "../../types/wealth.types";
import { portFolioStyles as styles } from "../../types/wealth.types";
import {
  calculateCategoryTotalRecursively,
  calculatePercentage,
  toggleSection,
} from "../../constants/helper";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { EditSyfePortfolio } from "./EditSyfePortfolio";

interface RoboPortfolioProps {
  expandedSections: { [key: string]: boolean };
  setExpandedSections: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
  roboTotal: number;
  totalNetWorth: number;
  assetAllocation: AssetAllocations;
}

export function RoboPortfolio({
  expandedSections,
  setExpandedSections,
  roboTotal,
  totalNetWorth,
  assetAllocation,
}: RoboPortfolioProps) {
  const [roboSelections, setRoboSelections] = useState<{
    [key: string]: boolean;
  }>({
    Syfe: false,
    Endowus: false,
    Stashaway: false,
  });
  const syfeTotal = calculateCategoryTotalRecursively(
    assetAllocation.Robos.Syfe
  );

  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    console.log(
      "FUCK",
      assetAllocation,
      assetAllocation.Robos.Syfe.cashManagement
    );
  }, [assetAllocation]);

  const renderCustomAccount = (syfe: SyfeInterface) => {
    const components = [];
    for (const key in syfe) {
      if (
        !isCustomSyfePortfolio(key) ||
        calculateCategoryTotalRecursively(syfe[key]) === 0
      ) {
        continue;
      }
      for (const subKey in syfe[key]) {
        if (typeof syfe[key][subKey] === "number" && syfe[key][subKey] > 0) {
          components.push(
            <View key={`${key}-${subKey}`} style={styles.assetItem}>
              <Text style={styles.assetName}>{subKey}</Text>
              <Text style={styles.assetValue}>
                {formatCurrency(syfe[key][subKey])}
              </Text>
            </View>
          );
        }
      }
      const finalComponents = (
        <View style={styles.syfeGroup}>
          <Text style={styles.syfeGroupTitle}>Core</Text>
          {components}
        </View>
      );
      return finalComponents;
    }
  };

  const renderSyfeDetails = (syfe: SyfeInterface) => {
    if (!syfe) return null;

    return (
      <>
        {/* CORE PORTFOLIO */}
        {syfe.core && calculateCategoryTotalRecursively(syfe.core) > 0 && (
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

            {typeof syfe.core.balanced === "number" &&
              syfe.core.balanced > 0 && (
                <View style={styles.assetItem}>
                  <Text style={styles.assetName}>Balanced</Text>
                  <Text style={styles.assetValue}>
                    {formatCurrency(syfe.core.balanced)}
                  </Text>
                </View>
              )}

            {typeof syfe.core.defensive === "number" &&
              syfe.core.defensive > 0 && (
                <View style={styles.assetItem}>
                  <Text style={styles.assetName}>Defensive</Text>
                  <Text style={styles.assetValue}>
                    {formatCurrency(syfe.core.defensive)}
                  </Text>
                </View>
              )}
          </View>
        )}

        {/* CASH MANAGEMENT PORTFOLIO */}
        {syfe.cashManagement &&
          calculateCategoryTotalRecursively(syfe.cashManagement) > 0 && (
            <View style={styles.syfeGroup}>
              <Text style={styles.syfeGroupTitle}>Cash Management</Text>
              {typeof syfe.cashManagement.cashPlusFlexi === "number" &&
                syfe.cashManagement.cashPlusFlexi > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Cash+ Flexi</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(syfe.cashManagement.cashPlusFlexi)}
                    </Text>
                  </View>
                )}

              {typeof syfe.cashManagement.cashPlusGuranteed === "number" &&
                syfe.cashManagement.cashPlusGuranteed > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Cash+ Guaranteed</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(syfe.cashManagement.cashPlusGuranteed)}
                    </Text>
                  </View>
                )}
            </View>
          )}

        {/* REIT+ PORTFOLIO */}
        {syfe.reitPlus &&
          calculateCategoryTotalRecursively(syfe.reitPlus) > 0 && (
            <View style={styles.syfeGroup}>
              <Text style={styles.syfeGroupTitle}>REIT+</Text>
              {typeof syfe.reitPlus.standard === "number" &&
                syfe.reitPlus.standard > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Standard</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(syfe.reitPlus.standard)}
                    </Text>
                  </View>
                )}

              {typeof syfe.reitPlus.withRiskManagement === "number" &&
                syfe.reitPlus.withRiskManagement > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>With Risk Management</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(syfe.reitPlus.withRiskManagement)}
                    </Text>
                  </View>
                )}
            </View>
          )}

        {/* INCOME PLUS PORTFOLIO */}
        {syfe.incomePlus &&
          calculateCategoryTotalRecursively(syfe.incomePlus) > 0 && (
            <View style={styles.syfeGroup}>
              <Text style={styles.syfeGroupTitle}>Income Plus</Text>
              {typeof syfe.incomePlus.preserve === "number" &&
                syfe.incomePlus.preserve > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Preserve</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(syfe.incomePlus.preserve)}
                    </Text>
                  </View>
                )}

              {typeof syfe.incomePlus.enhance === "number" &&
                syfe.incomePlus.enhance > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Enhance</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(syfe.incomePlus.enhance)}
                    </Text>
                  </View>
                )}
            </View>
          )}

        {/* THEMATIC PORTFOLIO */}
        {syfe.thematic &&
          calculateCategoryTotalRecursively(syfe.thematic) > 0 && (
            <View style={styles.syfeGroup}>
              <Text style={styles.syfeGroupTitle}>Thematic</Text>
              {typeof syfe.thematic.chinaGrowth === "number" &&
                syfe.thematic.chinaGrowth > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>China Growth</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(syfe.thematic.chinaGrowth)}
                    </Text>
                  </View>
                )}

              {typeof syfe.thematic.esgCleanEnergy === "number" &&
                syfe.thematic.esgCleanEnergy > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>ESG Clean Energy</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(syfe.thematic.esgCleanEnergy)}
                    </Text>
                  </View>
                )}

              {typeof syfe.thematic.disruptiveTechnology === "number" &&
                syfe.thematic.disruptiveTechnology > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Disruptive Technology</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(syfe.thematic.disruptiveTechnology)}
                    </Text>
                  </View>
                )}

              {typeof syfe.thematic.healthcareInnovation === "number" &&
                syfe.thematic.healthcareInnovation > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Healthcare Innovation</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(syfe.thematic.healthcareInnovation)}
                    </Text>
                  </View>
                )}
            </View>
          )}

        {/* DOWNSIDE PROTECTION PORTFOLIO */}
        {syfe.downsideProtected &&
          calculateCategoryTotalRecursively(syfe.downsideProtected) > 0 && (
            <View style={styles.syfeGroup}>
              <Text style={styles.syfeGroupTitle}>Downside Protection</Text>
              {typeof syfe.downsideProtected.protectedSP500 === "number" &&
                syfe.downsideProtected.protectedSP500 > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Protected S&P 500</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(syfe.downsideProtected.protectedSP500)}
                    </Text>
                  </View>
                )}
            </View>
          )}

        {/* CUSTOM ADDED PROTECTION PORTFOLIO */}
        {renderCustomAccount(syfe)}

        <Button
          color="green"
          title="Edit"
          onPress={() => setEditModal(true)}
        ></Button>
        <EditSyfePortfolio
          editModal={editModal}
          setEditModal={setEditModal}
          syfeAllocation={syfe}
        />
      </>
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
            { borderLeftColor: PORTFOLIO_COLORS[1], borderLeftWidth: 5 },
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

        {expanded && (
          <View style={styles.categoryDetails}>
            <View style={styles.platformContainer}>
              <TouchableOpacity
                style={styles.platformHeader}
                onPress={() => toggleSection("Syfe", setRoboSelections)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={[
                      styles.platformIcon,
                      { backgroundColor: PORTFOLIO_COLORS[1] },
                    ]}
                  >
                    <Text style={styles.platformIconText}>S</Text>
                  </View>
                  <Text style={styles.platformName}>Syfe</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.platformValue}>
                    {formatCurrency(
                      calculateCategoryTotalRecursively(syfeTotal)
                    )}
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

  return renderRoboAdvisors();
}
