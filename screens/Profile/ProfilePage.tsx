import { View, Text, StyleSheet } from "react-native";
import { useAppSelector } from "../../store/rootTypes";
import { loggedInUserSelector } from "../../store/auth/authSelector";
import { InvestUser } from "../../types/auth.types";
import { DeleteProfile } from "./DeleteProfile";
import { EditProfileScreen } from "./EditProfilePage";
import { stringToDate, yearDifference } from "../../constants/date_helper";
import { styles } from "./styles";

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

