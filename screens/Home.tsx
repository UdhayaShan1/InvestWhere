import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../store/rootTypes";
import {
  isLoadingSelector,
  loggedInUserSelector,
} from "../store/auth/authSelector";
import { authAction } from "../store/auth/authSlice";
import LoadingButton from "../component/LoadingButton";
import { InvestUser } from "../types/auth.types";
import { auth } from "../firebase/firebase";
import { getIdToken } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "../navigation/BottomTabNavigator";
import { useNavigation } from "@react-navigation/native";

type UserPortfolioNavigationProp = BottomTabNavigationProp<BottomTabParamList>;

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const user: InvestUser = useAppSelector(loggedInUserSelector);
  const userProfile = user.UserProfile;
  const loading = useAppSelector(isLoadingSelector) ?? false;
  const authUser = auth.currentUser;
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigation = useNavigation<UserPortfolioNavigationProp>();

  useEffect(() => {
    const fetchToken = async () => {
      if (authUser) {
        const token = await getIdToken(authUser, true);
        console.log("Retrieving ID ", token);
      }
    };
    fetchToken();

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [authUser]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getUserDisplayName = () => {
    return (
      userProfile?.displayName ||
      userProfile?.email?.split("@")[0] ||
      "Investor"
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => dispatch(authAction.logoutUser()),
      },
    ]);
  };

  const quickActions = [
    {
      title: "Portfolio",
      subtitle: "View your investments",
      icon: "pie-chart",
      color: "#4A6FA5",
      screen: "PortfolioTab",
    },
    {
      title: "AI Assistant",
      subtitle: "Get recommendations",
      icon: "bulb",
      color: "#f39c12",
      screen: "AITab",
    },
    {
      title: "Analytics",
      subtitle: "Track performance",
      icon: "trending-up",
      color: "#28a745",
      screen: "AnalyticsTab",
    },
    {
      title: "Profile",
      subtitle: "Manage settings",
      icon: "person",
      color: "#e74c3c",
      screen: "ProfileTab",
    },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4A6FA5" />
      <LinearGradient
        colors={["#3a5683", "#4A6FA5", "#6B8DD6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.userName}>{getUserDisplayName()}!</Text>
              <Text style={styles.welcomeSubtext}>
                Ready to make smart investment decisions?
              </Text>
            </View>

            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={() => console.log("Navigate to profile")}
            >
              <Ionicons name="person" size={24} color="#4A6FA5" />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickActionCard}
                  onPress={() => {
                    console.log(`Navigate to ${action.screen}`);
                    navigation.navigate(
                      action.screen as keyof BottomTabParamList
                    );
                  }}
                >
                  <View
                    style={[
                      styles.quickActionIcon,
                      { backgroundColor: action.color },
                    ]}
                  >
                    <Ionicons
                      name={action.icon as any}
                      size={24}
                      color="#fff"
                    />
                  </View>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>
                    {action.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Enhanced Logout Section */}
          <View style={styles.logoutSection}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <View style={styles.logoutButtonContent}>
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color="#fff"
                    style={styles.logoutIcon}
                  />
                  <Text style={styles.logoutButtonText}>Sign Out</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 20,
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginLeft: 12,
  },
  statsContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e9ecef",
    marginHorizontal: 20,
  },
  statsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  statsButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A6FA5",
    marginRight: 8,
  },
  quickActionsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center",
  },
  insightsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginLeft: 12,
  },
  insightsText: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
    marginBottom: 16,
  },
  insightsButton: {
    backgroundColor: "#4A6FA5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  insightsButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginRight: 8,
  },
  logoutSection: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#e74c3c", // Red color for clear visibility against blue
    width: "100%",
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  versionText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 12,
    textAlign: "center",
  },
});
