import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import { netWorthSelector } from "../../store/portfolio/portfolioSelector";
import { NetWorthSummary } from "../../types/wealth.types"; // Assuming NetWorthSummary is exported
import { stringToDate } from "../../constants/date_helper";
import { loggedInUserSelector } from "../../store/auth/authSelector";
import { portfolioAction } from "../../store/portfolio/portfolioSlice";

const screenWidth = Dimensions.get("window").width;

const formatDateLabel = (dateString: string) => {
  const date = stringToDate(dateString);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${month}/${day}`;
};

const getPastDate = (months: number): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
};

type DateRangeOption = "all" | "1m" | "3m" | "6m" | "1y";

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
  legend?: string[];
}

const initialChartData: ChartData = {
  labels: [],
  datasets: [{ data: [] }],
};

export default function UserAnalytics() {
  const currentUser = useAppSelector(loggedInUserSelector);
  const netWorthData = useAppSelector(netWorthSelector);
  const [chartData, setChartData] = useState<ChartData>(initialChartData);
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>("all");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (netWorthData && netWorthData.History) {
      setIsLoading(true);
      const history = netWorthData.History;
      const allDates = Object.keys(history).sort(
        (a, b) => stringToDate(a).getTime() - stringToDate(b).getTime()
      );

      if (allDates.length === 0) {
        setChartData(initialChartData);
        setIsLoading(false);
        return;
      }

      let filteredDates: string[] = [];
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Ensure today includes the whole day

      switch (selectedRange) {
        case "1m":
          const oneMonthAgo = getPastDate(1);
          filteredDates = allDates.filter(
            (dateStr) =>
              stringToDate(dateStr) >= oneMonthAgo && stringToDate(dateStr) <= today
          );
          break;
        case "3m":
          const threeMonthsAgo = getPastDate(3);
          filteredDates = allDates.filter(
            (dateStr) =>
              stringToDate(dateStr) >= threeMonthsAgo && stringToDate(dateStr) <= today
          );
          break;
        case "6m":
          const sixMonthsAgo = getPastDate(6);
          filteredDates = allDates.filter(
            (dateStr) =>
              stringToDate(dateStr) >= sixMonthsAgo && stringToDate(dateStr) <= today
          );
          break;
        case "1y":
          const oneYearAgo = getPastDate(12);
          filteredDates = allDates.filter(
            (dateStr) =>
              stringToDate(dateStr) >= oneYearAgo && stringToDate(dateStr) <= today
          );
          break;
        case "all":
        default:
          filteredDates = allDates;
          break;
      }

      if (
        filteredDates.length === 0 &&
        allDates.length > 0 &&
        selectedRange !== "all"
      ) {
        setChartData(initialChartData);
      } else if (filteredDates.length > 0) {
        const labels = filteredDates.map(formatDateLabel);

        const MAX_LABELS = 7;
        let displayLabels = labels;
        if (labels.length > MAX_LABELS) {
          displayLabels = labels.filter(
            (_, i) => i % Math.ceil(labels.length / MAX_LABELS) === 0
          );
          if (displayLabels.length < 2 && labels.length >= 2)
            displayLabels = [labels[0], labels[labels.length - 1]]; // Ensure at least start and end
        }

        const dataPoints = filteredDates.map((date) => history[date]["Total"]);
        console.log(dataPoints, "YMPA");
        setChartData({
          labels: displayLabels,
          datasets: [
            {
              data: dataPoints,
              color: (opacity = 1) => `rgba(74, 165, 225, ${opacity})`, // Blue color
              strokeWidth: 2,
            },
          ],
          legend: ["Net Worth History"],
        });
      } else {
        setChartData(initialChartData);
      }
      setIsLoading(false);
    } else {
      setChartData(initialChartData);
      setIsLoading(false);
    }
  }, [netWorthData, selectedRange]);

  const renderRangeSelector = () => {
    const ranges: { label: string; value: DateRangeOption }[] = [
      { label: "All", value: "all" },
      { label: "1M", value: "1m" },
      { label: "3M", value: "3m" },
      { label: "6M", value: "6m" },
      { label: "1Y", value: "1y" },
    ];

    return (
      <View style={styles.rangeSelectorContainer}>
        {ranges.map((range) => (
          <TouchableOpacity
            key={range.value}
            style={[
              styles.rangeButton,
              selectedRange === range.value && styles.rangeButtonSelected,
            ]}
            onPress={() => setSelectedRange(range.value)}
          >
            <Text
              style={[
                styles.rangeButtonText,
                selectedRange === range.value && styles.rangeButtonTextSelected,
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A6FA5" />
        <Text>Loading Chart...</Text>
      </View>
    );
  }

  const noDataAvailable =
    !chartData.datasets[0]?.data?.length ||
    chartData.datasets[0].data.every((val) => val === 0);

  const onRefresh = () => {
    const uid = currentUser.CredProfile?.uid;
    setRefreshing(true);
    if (uid) {
      dispatch(portfolioAction.loadWealthProfile(uid));
    }
    setTimeout(() => setRefreshing(false), 1000);
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
      <Text style={styles.header}>Net Worth History</Text>
      {renderRangeSelector()}
      {noDataAvailable ? (
        <View style={styles.centered}>
          <Text style={styles.noDataText}>
            No historical data available for the selected range.
          </Text>
        </View>
      ) : (
        <LineChart
          data={chartData}
          width={screenWidth - 16}
          height={250}
          yAxisLabel="S$"
          yAxisSuffix="k"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(74, 107, 165, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#4AA5E1",
            },
            propsForBackgroundLines: {
              strokeDasharray: "",
              stroke: "#e3e3e3",
            },
          }}
          bezier
          style={styles.chartStyle}
          fromZero={true}
          formatYLabel={(yLabel) => {
            const num = Number(yLabel);
            if (num >= 1000) return `${(num / 1000).toFixed(0)}`;
            return `${num.toFixed(0)}`;
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    paddingVertical: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 15,
  },
  rangeSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  rangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  rangeButtonSelected: {
    backgroundColor: "#4A6FA5",
  },
  rangeButtonText: {
    color: "#4A6FA5",
    fontWeight: "500",
  },
  rangeButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
});
