import React, { use, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/rootTypes";
import {
  isLoadingSelector,
  loggedInUserSelector,
} from "../store/auth/authSelector";
import { authAction } from "../store/auth/authSlice";
import LoadingButton from "../component/LoadingButton";
import { CredentialUserProfile, InvestUser } from "../types/auth.types";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const user: InvestUser = useAppSelector(loggedInUserSelector);
  console.log("Home Screen", user);
  const userProfile = user.UserProfile;
  const loading = useAppSelector(isLoadingSelector) ?? false;
  useEffect(() => {
    console.log(userProfile);
  }, [userProfile]);
  return (
    <>
      <View style={{ padding: 20 }}>
        <Text>Welcome, {userProfile?.email}!</Text>
      </View>
      <LoadingButton
        title="Logout"
        onPress={() => dispatch(authAction.logoutUser())}
        isLoading={loading}
      ></LoadingButton>
    </>
  );
}
