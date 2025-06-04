import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/rootTypes";
import {
  isLoadingSelector,
  loggedInUserSelector,
} from "../store/auth/authSelector";
import { authAction } from "../store/auth/authSlice";
import LoadingButton from "../component/LoadingButton";
import { CredentialUserProfile, InvestUser } from "../types/auth.types";
import { auth } from "../firebase/firebase";
import { getIdToken } from "firebase/auth";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const user: InvestUser = useAppSelector(loggedInUserSelector);
  const userProfile = user.UserProfile;
  const loading = useAppSelector(isLoadingSelector) ?? false;
  const authUser = auth.currentUser;

  useEffect(() => {
    const fetchToken = async () => {
      if (authUser) {
        const token = await getIdToken(authUser, true);
        console.log("Retrieving ID ", token);
      }
    };
    fetchToken();
  }, [authUser]);

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
