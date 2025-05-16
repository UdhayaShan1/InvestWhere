import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home";
import { ProfilePageScreen } from "../screens/Profile/ProfilePage";
import { MaterialIcons } from "@expo/vector-icons";

export type BottomTabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
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
        name="ProfileTab"
        component={ProfilePageScreen}
        options={{ title: "Profile" }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}
