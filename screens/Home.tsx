import React from "react";
import { View, Text, Button } from "react-native";
import { UserProfile } from "../types/auth.types";
import { useAppDispatch, useAppSelector } from "../store/rootTypes";
import { isLoadingSelector, loggedInUserSelector } from "../store/auth/authSelector";
import { authAction } from "../store/auth/authSlice";
import LoadingButton from "../component/LoadingButton";


export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const user : UserProfile | null = useAppSelector(loggedInUserSelector);
  const loading = useAppSelector(isLoadingSelector) ?? false;

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome, {user?.email}!</Text>
      <LoadingButton title="Logout" onPress={() => dispatch(authAction.logoutUser())} isLoading={loading} ></LoadingButton>
    </View>
  );
}
