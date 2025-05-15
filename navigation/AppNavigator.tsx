import React, {  } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/Register";
import { useAppSelector } from "../store/rootTypes";
import { loggedInUserSelector } from "../store/auth/authSelector";
import BottomTabNavigator from "./BottomTabNavigator";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  InvestWhere: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const user = useAppSelector(loggedInUserSelector);

  return (
  <NavigationContainer>
      <Stack.Navigator>
        {user.credProfile ? (
          <Stack.Screen name="InvestWhere" component={BottomTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
