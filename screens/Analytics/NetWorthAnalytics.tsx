import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import { netWorthSelector } from "../../store/portfolio/portfolioSelector";
import { stringToDate } from "../../constants/date_helper";
import {
  ChartData,
  DateRangeOption,
  formatDateLabel,
  getPastDate,
  initialChartData,
  styles,
} from "../../types/analytics.types";
import {
  netWorthFeedbackSelector,
  isLoadingSelector,
} from "../../store/analytics/analyticsSelector";
import { analyticsAction } from "../../store/analytics/analyticsSlice";
import { Ionicons } from "@expo/vector-icons";
import { FormattedText } from "../../component/MarkdownFormattedText";
const screenWidth = Dimensions.get("window").width;

export default function NetWorthAnalytics() {
  const netWorthData = useAppSelector(netWorthSelector);
  const [chartData, setChartData] = useState<ChartData>(initialChartData);
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>("all");
  const [isLoading, setIsLoading] = useState(true);
  const netWorthFeedback = useAppSelector(netWorthFeedbackSelector);
  const isAnalyzing = useAppSelector(isLoadingSelector);
  const dispatch = useAppDispatch();

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
      today.setHours(23, 59, 59, 999);

      switch (selectedRange) {
        case "1m":
          const oneMonthAgo = getPastDate(1);
          filteredDates = allDates.filter(
            (dateStr) =>
              stringToDate(dateStr) >= oneMonthAgo &&
              stringToDate(dateStr) <= today
          );
          break;
        case "3m":
          const threeMonthsAgo = getPastDate(3);
          filteredDates = allDates.filter(
            (dateStr) =>
              stringToDate(dateStr) >= threeMonthsAgo &&
              stringToDate(dateStr) <= today
          );
          break;
        case "6m":
          const sixMonthsAgo = getPastDate(6);
          filteredDates = allDates.filter(
            (dateStr) =>
              stringToDate(dateStr) >= sixMonthsAgo &&
              stringToDate(dateStr) <= today
          );
          break;
        case "1y":
          const oneYearAgo = getPastDate(12);
          filteredDates = allDates.filter(
            (dateStr) =>
              stringToDate(dateStr) >= oneYearAgo &&
              stringToDate(dateStr) <= today
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
            displayLabels = [labels[0], labels[labels.length - 1]];
        }

        const dataPoints = filteredDates.map((date) => history[date]["Total"]);
        setChartData({
          labels: displayLabels,
          datasets: [
            {
              data: dataPoints,
              color: (opacity = 1) => `rgba(74, 165, 225, ${opacity})`,
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

  const renderLineChart = () => {
    return (
      <>
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
      </>
    );
  };

  const handleAnalyze = () => {
    console.log("Analyze button pressed", netWorthData);
    if (netWorthData) {
      dispatch(analyticsAction.getNetWorthLLM(netWorthData));
    } else {
      console.log("No netWorthData available");
    }
  };

  return (
    <>
      <Text style={styles.header}>Net Worth History</Text>
      {renderLineChart()}

      {/* Analyze Button */}
      <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
        <TouchableOpacity
          style={[
            styles.rangeButton,
            styles.rangeButtonSelected,
            {
              paddingVertical: 15,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              opacity: isAnalyzing ? 0.7 : 1,
            },
          ]}
          onPress={handleAnalyze}
          disabled={isAnalyzing || !netWorthData}
        >
          {isAnalyzing ? (
            <>
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.rangeButtonTextSelected]}>Analyzing...</Text>
            </>
          ) : (
            <>
              <Ionicons
                name="analytics"
                size={18}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.rangeButtonTextSelected]}>
                Analyze with AI
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Feedback Display */}
      {netWorthFeedback && (
        <View
          style={{
            margin: 10,
            padding: 15,
            backgroundColor: "#fff",
            borderRadius: 12,
            borderLeftWidth: 4,
            borderLeftColor: "#4A6FA5",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#4A6FA5",
              marginBottom: 8,
            }}
          >
            🤖 AI Financial Analysis
          </Text>
          <FormattedText content={netWorthFeedback} />
        </View>
      )}
    </>
  );
}
