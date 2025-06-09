import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import {
  isLoadingSelector,
  loggedInUserSelector,
} from "../../store/auth/authSelector";
import { InvestUser } from "../../types/auth.types";
import { DeleteProfile } from "./DeleteProfile";
import { EditProfileScreen } from "./EditProfilePage";
import { stringToDate, yearDifference } from "../../constants/date_helper";
import { styles } from "./styles";
import { authAction } from "../../store/auth/authSlice";
import { reload } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Ionicons } from "@expo/vector-icons"; // Add this import

export function ProfilePageScreen() {
  const user: InvestUser = useAppSelector(loggedInUserSelector);

  const userProfile = user?.UserProfile;
  const credProfile = user.CredProfile;
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(isLoadingSelector);

  const displayEmail = () => {
    return (
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userProfile?.email}</Text>
      </View>
    );
  };

  const displayName = () => {
    return (
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>
          {userProfile?.displayName ?? "Your name has not been set yet!"}
        </Text>
      </View>
    );
  };

  const displayBirthday = () => {
    if (!userProfile?.birthday) {
      return (
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Birthday:</Text>
          <Text style={styles.value}>Your birthday has not been set yet</Text>
        </View>
      );
    }
    return (
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Birthday:</Text>
        <Text style={styles.value}>{userProfile.birthday}</Text>
      </View>
    );
  };

  const displayAge = () => {
    if (!userProfile?.birthday) {
      return (
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>Please set a birthday first</Text>
        </View>
      );
    }

    const years = yearDifference(userProfile.birthday);

    return (
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Age:</Text>
        <Text style={styles.value}>{years}</Text>
      </View>
    );
  };

  const reloadUser = async () => {
    try {
      console.log("Here");
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "No user is currently logged in");
        return;
      }

      await reload(currentUser);

      dispatch(
        authAction.refreshSession({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          emailVerified: currentUser.emailVerified,
        })
      );

      if (currentUser.emailVerified) {
        Alert.alert("Success!", "You are now verified! ✅");
      } else {
        Alert.alert(
          "Not Yet Verified",
          "Please check your email and click the verification link first."
        );
      }
    } catch (error) {
      console.error("Error reloading user:", error);
      Alert.alert(
        "Error",
        "Failed to check verification status. Please try again."
      );
    }
  };

  const displayVerification = () => {
    return (
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Verified:</Text>
        <View>
          <Text
            style={[
              styles.value,
              styles.verificationStatusText,
              { color: credProfile?.emailVerified ? "#28a745" : "#dc3545" },
            ]}
          >
            {credProfile?.emailVerified ? "✅ Verified" : "❌ Not Verified"}
          </Text>

          {!credProfile?.emailVerified && (
            <View style={styles.verificationButtonsRow}>
              <TouchableOpacity
                style={[styles.primaryButton, { flex: 1, marginRight: 8 }]}
                onPress={() => dispatch(authAction.sendEmailVerification())}
                disabled={isLoading ?? false}
              >
                <Ionicons name="mail-outline" size={14} color="#fff" />
                <Text style={[styles.primaryButtonText, { fontSize: 12 }]}>
                  {isLoading ? "Sending..." : "Send Email"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { flex: 1 }]}
                onPress={reloadUser}
              >
                <Ionicons name="refresh-outline" size={14} color="#4A6FA5" />
                <Text style={[styles.secondaryButtonText, { fontSize: 12 }]}>
                  Check Status
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to your profile!</Text>
        <View style={styles.profileCard}>
          {displayEmail()}
          {displayName()}
          {displayBirthday()}
          {displayAge()}
          {displayVerification()}
        </View>
        <View style={styles.deleteContainer}>
          {userProfile && <EditProfileScreen UserProfile={userProfile} />}
          <View style={{ height: 20 }} />
          <DeleteProfile />
        </View>
      </View>
    </ScrollView>
  );
}
