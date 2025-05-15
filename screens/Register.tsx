import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAppDispatch, useAppSelector } from "../store/rootTypes";
import { authAction } from "../store/auth/authSlice";
import LoadingButton from "../component/LoadingButton";
import { isLoadingSelector } from "../store/auth/authSelector";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const loading = useAppSelector(isLoadingSelector);

  const handleRegister = async () => {
    dispatch(authAction.registerUser({ email, password }));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <LoadingButton
        title="Register"
        onPress={handleRegister}
        isLoading={loading ?? false}
      ></LoadingButton>
      <View style={{ height: 20 }} />
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}
