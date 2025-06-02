import { useEffect, useState } from "react";
import NetWorthAnalytics from "./NetWorthAnalytics";
import ComponentAnalytics from "./ComponentAnalytics";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import { portfolioAction } from "../../store/portfolio/portfolioSlice";
import { loggedInUserSelector } from "../../store/auth/authSelector";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles, tabDescriptions } from "../../types/analytics.types";
import { Ionicons } from "@expo/vector-icons";

type AnalyticsTab = "networth" | "component";

export default function UserAnalytics() {
  const currentUser = useAppSelector(loggedInUserSelector);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("networth");
  const [displayTitle, setDisplayTitle] = useState(tabDescriptions[activeTab]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setDisplayTitle(tabDescriptions[activeTab]);
  }, [activeTab]);

  const onRefresh = () => {
    const uid = currentUser.CredProfile?.uid;
    setRefreshing(true);
    if (uid) {
      dispatch(portfolioAction.loadWealthProfile(uid));
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderTabButton = (tab: AnalyticsTab, label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={activeTab === tab ? "#fff" : "#4A6FA5"}
        style={styles.tabIcon}
      />
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tab && styles.tabButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Analytics Dashboard</Text>
        <Text style={styles.pageSubtitle}>{displayTitle}</Text>
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton("networth", "Net Worth", "trending-up")}
        {renderTabButton("component", "Components", "pie-chart")}
      </View>

      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4A6FA5"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {activeTab === "networth" ? (
            <NetWorthAnalytics />
          ) : (
            <ComponentAnalytics />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
