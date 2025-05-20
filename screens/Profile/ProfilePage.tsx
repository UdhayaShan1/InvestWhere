import { View, Text, StyleSheet } from "react-native";
import { useAppSelector } from "../../store/rootTypes";
import { loggedInUserSelector } from "../../store/auth/authSelector";
import { InvestUser } from "../../types/auth.types";
import { DeleteProfile } from "./DeleteProfile";
import { EditProfileScreen } from "./EditProfilePage";
import { parseDate, yearDifference } from "../../constants/helper";

export function ProfilePageScreen() {
  const user: InvestUser = useAppSelector(loggedInUserSelector);

  const userProfile = user?.UserProfile;

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to your profile!</Text>
      <View style={styles.profileCard}>
        {displayEmail()}
        {displayName()}
        {displayBirthday()}
        {displayAge()}
      </View>
      <View style={styles.deleteContainer}>
        {userProfile && <EditProfileScreen UserProfile={userProfile} />}
        <View style={{ height: 20 }} />
        <DeleteProfile />
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f4f6fb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 28,
    color: "#22223b",
    alignSelf: "center",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  label: {
    fontWeight: "bold",
    width: 90,
    color: "#3a3a40",
    fontSize: 16,
  },
  value: {
    flex: 1,
    color: "#4a4e69",
    fontSize: 16,
  },
  deleteContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#22223b",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    marginBottom: 18,
    color: "#444",
    fontSize: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#d1d1d6",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f8f8fa",
    color: "#22223b",
    flex: 1,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 12,
  },
});
