import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { AuthContext } from "../contexts/AuthContext";

export default function HomeScreen() {
  const { user } = useContext(AuthContext);


  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome, {user?.email}!</Text>
      <Button title="Logout" onPress={() => signOut(auth)} />
    </View>
  );
}
