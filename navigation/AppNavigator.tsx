import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/Register";
import { useAppDispatch, useAppSelector } from "../store/rootTypes";
import { loggedInUserSelector } from "../store/auth/authSelector";
import BottomTabNavigator from "./BottomTabNavigator";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { authAction } from "../store/auth/authSlice";
import { recommendAction } from "../store/recommend/recommendSlice";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  InvestWhere: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const loggedInUser = useAppSelector(loggedInUserSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log(currentUser, currentUser.emailVerified, "Verified Check");
        dispatch(
          authAction.refreshSession({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            emailVerified: currentUser.emailVerified,
          })
        );
      } else {
        dispatch(authAction.logoutUser());
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {loggedInUser.CredProfile ? (
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
