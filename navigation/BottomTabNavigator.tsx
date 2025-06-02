import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home";
import { ProfilePageScreen } from "../screens/Profile/ProfilePage";
import { MaterialIcons } from "@expo/vector-icons";
import { UserPortfolio } from "../screens/Portfolio/UserPortfolio";
import UserAnalytics from "../screens/Analytics/UserAnalytics";
import NetWorthAnalytics from "../screens/Analytics/NetWorthAnalytics";

export type BottomTabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
  PortfolioTab: undefined;
  AnalyticsTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "HomeTab") {
            iconName = "home";
          } else if (route.name === "ProfileTab") {
            iconName = "person";
          } else if (route.name === "PortfolioTab") {
            iconName = "money";
            } else if (route.name === "AnalyticsTab") {
            iconName = "analytics";
          }
          return (
            <MaterialIcons name={iconName as any} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "Home" }}
      ></Tab.Screen>

      <Tab.Screen
        name="PortfolioTab"
        component={UserPortfolio}
        options={{ title: "Portfolio" }}
      ></Tab.Screen>

      <Tab.Screen
        name="AnalyticsTab"
        component={UserAnalytics}
        options={{ title: "Analytics" }}
      ></Tab.Screen>

      <Tab.Screen
        name="ProfileTab"
        component={ProfilePageScreen}
        options={{ title: "Profile" }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}
