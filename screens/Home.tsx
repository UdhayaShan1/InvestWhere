import React from "react";
import { View, Text, Button } from "react-native";
import { UserProfile } from "../types/auth.types";
import { useAppDispatch, useAppSelector } from "../store/rootTypes";
import { loggedInUserSelector } from "../store/auth/authSelector";
import { authAction } from "../store/auth/authSlice";


export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const user : UserProfile | null = useAppSelector(loggedInUserSelector);

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome, {user?.email}!</Text>
      <Button title="Logout" onPress={() => dispatch(authAction.logoutUser())} />
    </View>
  );
}
