import { View, Text, StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import {
  isLoadingSelector,
  loggedInUserSelector,
} from "../../store/auth/authSelector";
import { useState } from "react";
import { InvestUser } from "../../types/auth.types";
import { DeleteProfile } from "./DeleteProfile";

export function ProfilePageScreen() {
  const user: InvestUser = useAppSelector(loggedInUserSelector);
  const loading = useAppSelector(isLoadingSelector);
  const userProfile = user?.UserProfile;
  const dispatch = useAppDispatch();
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [finalDeleteConfirm, setFinalDeleteConfirm] = useState(false);

  const displayEmail = () => {
    return (
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userProfile?.email}</Text>
      </View>
    );
  };

  const displayName = () => {
    if (!userProfile?.displayName) {
      return (
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>Your name has not been set yet!</Text>
        </View>
      );
    }
    return (
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userProfile.displayName}</Text>
      </View>
    );
  };

  const displayAge = () => {
    if (!userProfile?.age) {
      return (
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>Your age has not been set yet</Text>
        </View>
      );
    }
    return (
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Age:</Text>
        <Text style={styles.value}>{userProfile.age}</Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to your profile!</Text>
        {displayEmail()}
        {displayName()}
        {displayAge()}

        <View style={styles.deleteContainer}>
          <DeleteProfile
            loading={loading ?? false}
            deleteConfirmModal={deleteConfirmModal}
            setDeleteConfirmModal={setDeleteConfirmModal}
            setFinalDeleteConfirm={setFinalDeleteConfirm}
          ></DeleteProfile>
        </View>
      </View>
    </>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  profileInfo: {
    flexDirection: "row",
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    width: 80,
  },
  value: {
    flex: 1,
  },
  deleteContainer: {
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    textAlign: "center",
    marginBottom: 15,
  },
});
