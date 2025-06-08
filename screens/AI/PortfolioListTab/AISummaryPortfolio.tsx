import { Text, View } from "react-native";
import {
  formatCurrency,
  NetWorthSummary,
  portFolioStyles as styles,
} from "../../../types/wealth.types";
import { PieChart } from "react-native-chart-kit";

interface SummaryPortfolioProps {
  totalNetWorth: number;
  pieChartData: Array<{
    name: string;
    value: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  }>;
  screenWidth: number;
}

export function AISummaryPortfolio({
  totalNetWorth,
  pieChartData,
  screenWidth,
}: SummaryPortfolioProps) {
  return (
    <>
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
    </>
  );
}
