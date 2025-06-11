import { Button, Text, TouchableOpacity, View } from "react-native";
import {
  AssetAllocations,
  formatCurrency,
  isCustomSyfePortfolio,
  isCustomEndowusPortfolio,
  PORTFOLIO_COLORS,
  SyfeInterface,
  EndowusInterface,
} from "../../../types/wealth.types";
import { portFolioStyles as styles } from "../../../types/wealth.types";
import {
  calculateCategoryTotalRecursively,
  calculatePercentage,
  toggleSection,
} from "../../../constants/helper";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { EditSyfePortfolio } from "./EditSyfePortfolio";
import { EditEndowusPortfolio } from "./EditEndowusPortfolio";

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

  const endowusTotal = calculateCategoryTotalRecursively(
    assetAllocation.Robos.Endowus
  );

  const [editSyfeModal, setEditSyfeModal] = useState(false);
  const [editEndowusModal, setEditEndowusModal] = useState(false);

  useEffect(() => {
    console.log(assetAllocation, assetAllocation.Robos.Syfe.cashManagement);
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

        {renderCustomAccount(syfe)}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Button
            color="green"
            title="Edit"
            onPress={() => setEditSyfeModal(true)}
          />
        </View>

        <EditSyfePortfolio
          editModal={editSyfeModal}
          setEditModal={setEditSyfeModal}
          syfeAllocation={syfe}
        />
      </>
    );
  };

  const renderCustomEndowusAccount = (endowus: EndowusInterface) => {
    const components = [];
    for (const key in endowus) {
      if (
        !isCustomEndowusPortfolio(key) ||
        calculateCategoryTotalRecursively(endowus[key]) === 0
      ) {
        continue;
      }
      for (const subKey in endowus[key]) {
        if (
          typeof endowus[key][subKey] === "number" &&
          endowus[key][subKey] > 0
        ) {
          components.push(
            <View key={`${key}-${subKey}`} style={styles.assetItem}>
              <Text style={styles.assetName}>{subKey}</Text>
              <Text style={styles.assetValue}>
                {formatCurrency(endowus[key][subKey])}
              </Text>
            </View>
          );
        }
      }
      if (components.length > 0) {
        const finalComponents = (
          <View key={key} style={styles.syfeGroup}>
            <Text style={styles.syfeGroupTitle}>{key}</Text>
            {components}
          </View>
        );
        return finalComponents;
      }
    }
  };

  const renderEndowusDetails = (endowus: EndowusInterface) => {
    if (!endowus) return null;

    return (
      <>
        {/* CORE PORTFOLIO */}
        {endowus.core &&
          calculateCategoryTotalRecursively(endowus.core) > 0 && (
            <View style={styles.syfeGroup}>
              <Text style={styles.syfeGroupTitle}>Core</Text>

              {/* Flagship Portfolios */}
              {typeof endowus.core.flagshipTotal === "number" &&
                endowus.core.flagshipTotal > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Flagship Total</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.flagshipTotal)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.flagshipVeryConservative === "number" &&
                endowus.core.flagshipVeryConservative > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>
                      Flagship Very Conservative
                    </Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.flagshipVeryConservative)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.flagshipConservative === "number" &&
                endowus.core.flagshipConservative > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Flagship Conservative</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.flagshipConservative)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.flagshipMeasured === "number" &&
                endowus.core.flagshipMeasured > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Flagship Measured</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.flagshipMeasured)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.flagshipBalanced === "number" &&
                endowus.core.flagshipBalanced > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Flagship Balanced</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.flagshipBalanced)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.flagshipAggressive === "number" &&
                endowus.core.flagshipAggressive > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Flagship Aggressive</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.flagshipAggressive)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.flagshipVeryAggressive === "number" &&
                endowus.core.flagshipVeryAggressive > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>
                      Flagship Very Aggressive
                    </Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.flagshipVeryAggressive)}
                    </Text>
                  </View>
                )}

              {/* ESG Portfolios */}
              {typeof endowus.core.esgTotal === "number" &&
                endowus.core.esgTotal > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>ESG Total</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.esgTotal)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.esgVeryConservative === "number" &&
                endowus.core.esgVeryConservative > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>ESG Very Conservative</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.esgVeryConservative)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.esgConservative === "number" &&
                endowus.core.esgConservative > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>ESG Conservative</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.esgConservative)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.esgMeasured === "number" &&
                endowus.core.esgMeasured > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>ESG Measured</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.esgMeasured)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.esgBalanced === "number" &&
                endowus.core.esgBalanced > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>ESG Balanced</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.esgBalanced)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.esgAggressive === "number" &&
                endowus.core.esgAggressive > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>ESG Aggressive</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.esgAggressive)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.esgVeryAggressive === "number" &&
                endowus.core.esgVeryAggressive > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>ESG Very Aggressive</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.esgVeryAggressive)}
                    </Text>
                  </View>
                )}

              {/* Factors Portfolios */}
              {typeof endowus.core.factorsTotal === "number" &&
                endowus.core.factorsTotal > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Factors Total</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.factorsTotal)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.factorsVeryConservative === "number" &&
                endowus.core.factorsVeryConservative > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>
                      Factors Very Conservative
                    </Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.factorsVeryConservative)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.factorsConservative === "number" &&
                endowus.core.factorsConservative > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Factors Conservative</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.factorsConservative)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.factorsMeasured === "number" &&
                endowus.core.factorsMeasured > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Factors Measured</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.factorsMeasured)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.factorsBalanced === "number" &&
                endowus.core.factorsBalanced > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Factors Balanced</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.factorsBalanced)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.factorsAggressive === "number" &&
                endowus.core.factorsAggressive > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Factors Aggressive</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.factorsAggressive)}
                    </Text>
                  </View>
                )}
              {typeof endowus.core.factorsVeryAggressive === "number" &&
                endowus.core.factorsVeryAggressive > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>
                      Factors Very Aggressive
                    </Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.core.factorsVeryAggressive)}
                    </Text>
                  </View>
                )}
            </View>
          )}

        {/* SATELLITE PORTFOLIO - unchanged */}
        {endowus.satellite &&
          calculateCategoryTotalRecursively(endowus.satellite) > 0 && (
            <View style={styles.syfeGroup}>
              <Text style={styles.syfeGroupTitle}>Satellite</Text>
              {typeof endowus.satellite.technology === "number" &&
                endowus.satellite.technology > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Technology</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.satellite.technology)}
                    </Text>
                  </View>
                )}
              {typeof endowus.satellite.chinaEquities === "number" &&
                endowus.satellite.chinaEquities > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>China Equities</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.satellite.chinaEquities)}
                    </Text>
                  </View>
                )}
              {typeof endowus.satellite.realAssets === "number" &&
                endowus.satellite.realAssets > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Real Assets</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.satellite.realAssets)}
                    </Text>
                  </View>
                )}
              {typeof endowus.satellite.megatrends === "number" &&
                endowus.satellite.megatrends > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Megatrends</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.satellite.megatrends)}
                    </Text>
                  </View>
                )}
            </View>
          )}

        {/* CASH SMART PORTFOLIO - unchanged */}
        {endowus.cashSmart &&
          calculateCategoryTotalRecursively(endowus.cashSmart) > 0 && (
            <View style={styles.syfeGroup}>
              <Text style={styles.syfeGroupTitle}>Cash Smart</Text>
              {typeof endowus.cashSmart.secure === "number" &&
                endowus.cashSmart.secure > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Secure</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.cashSmart.secure)}
                    </Text>
                  </View>
                )}
              {typeof endowus.cashSmart.enhanced === "number" &&
                endowus.cashSmart.enhanced > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Enhanced</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.cashSmart.enhanced)}
                    </Text>
                  </View>
                )}
              {typeof endowus.cashSmart.ultra === "number" &&
                endowus.cashSmart.ultra > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Ultra</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.cashSmart.ultra)}
                    </Text>
                  </View>
                )}
            </View>
          )}

        {/* INCOME PORTFOLIO - unchanged */}
        {endowus.income &&
          calculateCategoryTotalRecursively(endowus.income) > 0 && (
            <View style={styles.syfeGroup}>
              <Text style={styles.syfeGroupTitle}>Income</Text>
              {typeof endowus.income.stableIncome === "number" &&
                endowus.income.stableIncome > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Stable Income</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.income.stableIncome)}
                    </Text>
                  </View>
                )}
              {typeof endowus.income.higherIncome === "number" &&
                endowus.income.higherIncome > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Higher Income</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.income.higherIncome)}
                    </Text>
                  </View>
                )}
              {typeof endowus.income.futureIncome === "number" &&
                endowus.income.futureIncome > 0 && (
                  <View style={styles.assetItem}>
                    <Text style={styles.assetName}>Future Income</Text>
                    <Text style={styles.assetValue}>
                      {formatCurrency(endowus.income.futureIncome)}
                    </Text>
                  </View>
                )}
            </View>
          )}

        {renderCustomEndowusAccount(endowus)}

        {/* Endowus button (already correctly styled) */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Button
            color="green"
            title="Edit"
            onPress={() => setEditEndowusModal(true)}
          />
        </View>

        <EditEndowusPortfolio
          editModal={editEndowusModal}
          setEditModal={setEditEndowusModal}
          endowusAllocation={endowus}
        />
      </>
    );
  };

  const renderRoboAdvisors = () => {
    const expanded = expandedSections["Robos"];
    const percentage = calculatePercentage(roboTotal, totalNetWorth);

    // if (!assetAllocation?.Robos || roboTotal === 0) {
    //   return null;
    // }

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
            {/* SYFE PLATFORM */}
            {
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

                {roboSelections["Syfe"] && (
                  <View style={styles.nestedDetails}>
                    {renderSyfeDetails(assetAllocation.Robos.Syfe)}
                  </View>
                )}
              </View>
            }

            {/* ENDOWUS PLATFORM */}
            { (
              <View style={styles.platformContainer}>
                <TouchableOpacity
                  style={styles.platformHeader}
                  onPress={() => toggleSection("Endowus", setRoboSelections)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={[
                        styles.platformIcon,
                        { backgroundColor: PORTFOLIO_COLORS[2] },
                      ]}
                    >
                      <Text style={styles.platformIconText}>E</Text>
                    </View>
                    <Text style={styles.platformName}>Endowus</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.platformValue}>
                      {formatCurrency(endowusTotal)}
                    </Text>
                    <Ionicons
                      name={
                        roboSelections["Endowus"]
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={20}
                      color="#555"
                      style={{ marginLeft: 8 }}
                    />
                  </View>
                </TouchableOpacity>

                {roboSelections["Endowus"] && (
                  <View style={styles.nestedDetails}>
                    {renderEndowusDetails(assetAllocation.Robos.Endowus)}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return renderRoboAdvisors();
}
