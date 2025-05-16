import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { authAction } from "../store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/rootTypes";
import LoadingButton from "../component/LoadingButton";
import { errorSelector, isLoadingSelector } from "../store/auth/authSelector";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(isLoadingSelector) ?? false;
  const errorMessage = useAppSelector(errorSelector);

  const handleLogin = async () => {
    if (!email) {
      Alert.alert("Email is empty");
      return;
    }
    if (!password) {
      Alert.alert("Password is empty");
      return;
    }
    dispatch(authAction.signInWithEmailAndPassword({ email, password }));
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Please enter your email above first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password Reset", "A password reset email has been sent.");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      Alert.alert(errorMessage);
    }
  }, [errorMessage]);

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={{ color: "#2196F3", marginVertical: 8 }}>
          Forgot Password? 
        </Text>
      </TouchableOpacity>
      <LoadingButton
        title="Login"
        onPress={handleLogin}
        isLoading={isLoading}
      />
      <View style={{ height: 20 }} />

      <Button
        title="Create an account!"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}
