import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles as portfolioStyles } from "../Profile/styles";
import {
  AssetComponents,
  BankEditForm,
  formatCurrency,
  PORTFOLIO_COLORS,
  portFolioStyles as styles,
} from "../../types/wealth.types";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../../store/rootTypes";
import {
  assetAllocationSelector,
  netWorthSelector,
} from "../../store/portfolio/portfolioSelector";
import {
  ChartData,
  DateRangeOption,
  formatDateLabel,
  getPastDate,
  initialChartData,
  styles as wealthStyles,
} from "../../types/analytics.types";
import { stringToDate } from "../../constants/date_helper";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function ComponentAnalytics() {
  const [componentSelected, setComponentSelected] = useState("");
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [availComponents, setAvailableComponents] =
    useState<string[]>(AssetComponents);
  const [chartData, setChartData] = useState<ChartData>();
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>("all");
  const assetAllocation = useAppSelector(assetAllocationSelector);
  const netWorthData = useAppSelector(netWorthSelector);
  const [isLoading, setIsLoading] = useState(false);

  const renderRangeSelector = () => {
    const ranges: { label: string; value: DateRangeOption }[] = [
      { label: "All", value: "all" },
      { label: "1M", value: "1m" },
      { label: "3M", value: "3m" },
      { label: "6M", value: "6m" },
      { label: "1Y", value: "1y" },
    ];

    return (
      <View style={wealthStyles.rangeSelectorContainer}>
        {ranges.map((range) => (
          <TouchableOpacity
            key={range.value}
            style={[
              wealthStyles.rangeButton,
              selectedRange === range.value && wealthStyles.rangeButtonSelected,
            ]}
            onPress={() => setSelectedRange(range.value)}
          >
            <Text
              style={[
                wealthStyles.rangeButtonText,
                selectedRange === range.value &&
                  wealthStyles.rangeButtonTextSelected,
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  useEffect(() => {
    if (netWorthData && netWorthData.History && componentSelected) {
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
        console.log(filteredDates, "HMM");
        filteredDates = filteredDates.filter(
          (date) => history[date][componentSelected] !== undefined
        );
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

        const dataPoints = filteredDates.map(
          (date) => history[date][componentSelected] ?? 0
        );
        console.log(dataPoints, "YMPA");
        setChartData({
          labels: displayLabels,
          datasets: [
            {
              data: dataPoints,
              color: (opacity = 1) => `rgba(74, 165, 225, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: [`${componentSelected} History`],
        });
      } else {
        setChartData(initialChartData);
      }
      setIsLoading(false);
    } else {
      setChartData(initialChartData);
      setIsLoading(false);
    }
  }, [netWorthData, selectedRange, componentSelected]);

  const noDataAvailable =
    !chartData?.datasets[0]?.data?.length ||
    chartData?.datasets[0]?.data?.every((val) => val === 0);

  return (
    <>
      {/* Portfolio Selector Card */}
      <View style={wealthStyles.selectorCard}>
        <View style={wealthStyles.selectorHeader}>
          <Ionicons name="pie-chart-outline" size={24} color="#4A6FA5" />
          <View style={{ height: 50 }}></View>
          <Text style={wealthStyles.selectorTitle}>Portfolio Component</Text>
        </View>

        <TouchableOpacity
          style={[
            wealthStyles.modernDropdown,
            componentSelected && wealthStyles.modernDropdownActive,
          ]}
          onPress={() => setSelectionModalVisible(true)}
        >
          <View style={wealthStyles.dropdownContent}>
            {componentSelected ? (
              <>
                <View
                  style={[
                    wealthStyles.componentIcon,
                    { backgroundColor: PORTFOLIO_COLORS[0] },
                  ]}
                >
                  <Text style={wealthStyles.componentIconText}>
                    {componentSelected.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={wealthStyles.componentInfo}>
                  <Text style={wealthStyles.componentName}>
                    {componentSelected}
                  </Text>
                </View>
              </>
            ) : (
              <View style={wealthStyles.placeholderContent}>
                <Ionicons name="folder-outline" size={24} color="#bbb" />
                <Text style={wealthStyles.placeholderText}>
                  Choose a portfolio component
                </Text>
              </View>
            )}
          </View>
          <Ionicons
            name="chevron-down"
            size={20}
            color={componentSelected ? "#4A6FA5" : "#bbb"}
          />
        </TouchableOpacity>
      </View>

      {/* Selection Modal */}
      <Modal
        visible={selectionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectionModalVisible(false)}
      >
        <View style={wealthStyles.modalOverlay}>
          <View style={wealthStyles.modalContainer}>
            <View style={wealthStyles.modalHeader}>
              <Text style={wealthStyles.modalTitle}>
                Select Portfolio Component
              </Text>
              <TouchableOpacity
                onPress={() => setSelectionModalVisible(false)}
                style={wealthStyles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={wealthStyles.modalContent}>
              {availComponents.length > 0 ? (
                availComponents.map((item, index) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      setComponentSelected(item);
                      setSelectionModalVisible(false);
                    }}
                    style={[
                      wealthStyles.modalItem,
                      componentSelected === item &&
                        wealthStyles.modalItemSelected,
                    ]}
                  >
                    <View
                      style={[
                        wealthStyles.componentIcon,
                        {
                          backgroundColor:
                            PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length],
                          marginRight: 12,
                        },
                      ]}
                    >
                      <Text style={wealthStyles.componentIconText}>
                        {item.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          wealthStyles.modalItemText,
                          componentSelected === item &&
                            wealthStyles.modalItemTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                    {componentSelected === item && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4A6FA5"
                      />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={wealthStyles.emptyState}>
                  <Ionicons name="folder-open-outline" size={48} color="#ddd" />
                  <Text style={wealthStyles.emptyStateTitle}>
                    No Components Available
                  </Text>
                  <Text style={wealthStyles.emptyStateSubtitle}>
                    Add portfolio data in the Portfolio tab to see components
                    here
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Chart Section */}
      {componentSelected && (
        <>
          <Text style={wealthStyles.header}>
            {componentSelected} Performance
          </Text>
          {renderRangeSelector()}
          {noDataAvailable ? (
            <View style={wealthStyles.centered}>
              <Ionicons name="bar-chart-outline" size={48} color="#ddd" />
              <Text style={wealthStyles.noDataText}>
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
              style={wealthStyles.chartStyle}
              fromZero={true}
              formatYLabel={(yLabel) => {
                const num = Number(yLabel);
                if (num >= 1000) return `${(num / 1000).toFixed(0)}`;
                return `${num.toFixed(0)}`;
              }}
            />
          )}
        </>
      )}
    </>
  );
}
