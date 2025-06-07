import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import { loggedInUserSelector } from "../../store/auth/authSelector";
import { portfolioAction } from "../../store/portfolio/portfolioSlice";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { aiTabDescriptions, styles } from "../../types/analytics.types";
import { Ionicons } from "@expo/vector-icons";
import PortfolioList from "./PortfolioListTab/PortfolioListTab";

type AITab = "recommend" | "portfolios";

export default function AIPortfolio() {
  const [activeTab, setActiveTab] = useState("recommend");
  const [refreshing, setRefreshing] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(
    aiTabDescriptions[activeTab]
  );
  const currentUser = useAppSelector(loggedInUserSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(activeTab);
    setDisplayTitle(aiTabDescriptions[activeTab]);
  }, [activeTab]);

  const onRefresh = () => {
    const uid = currentUser.CredProfile?.uid;
    setRefreshing(true);
    if (uid) {
      dispatch(portfolioAction.loadWealthProfile(uid));
      dispatch(portfolioAction.loadAssetAllocationList(uid));
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderTabButton = (tab: AITab, label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => {
        setActiveTab(tab);
      }}
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
        <Text style={styles.pageTitle}>AI Portfolio</Text>
        <Text style={styles.pageSubtitle}>{displayTitle}</Text>
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
        <View style={styles.tabContainer}>
          {renderTabButton("recommend", "Recommend Portfolio", "bulb-outline")}
          {renderTabButton(
            "portfolios",
            "View Portfolios",
            "briefcase-outline"
          )}
        </View>
        {activeTab === "portfolios" ? (
          <PortfolioList></PortfolioList>
        ) : undefined}
      </ScrollView>
    </View>
  );
}
