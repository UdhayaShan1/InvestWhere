import { View, Text, StyleSheet, Button, Modal } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/rootTypes";
import {
  isLoadingSelector,
  loggedInUserSelector,
} from "../store/auth/authSelector";
import LoadingButton from "../component/LoadingButton";
import { authAction } from "../store/auth/authSlice";
import { useState } from "react";
import { EditProfileScreen } from "./Profile/EditProfilePage";
import { InvestUser } from "../types/auth.types";
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

        <View style={styles.logoutContainer}>
          <LoadingButton
            title="Logout"
            onPress={() => dispatch(authAction.logoutUser())}
            isLoading={false}
          />

          <View style={{ height: 20 }} />

          <Button
            title="Delete"
            color="red"
            onPress={() => setDeleteConfirmModal(true)}
          ></Button>
          <Modal
            visible={deleteConfirmModal}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Delete Account?</Text>
                <Text style={styles.modalText}>
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </Text>
                <LoadingButton
                  title="Yes :("
                  onPress={() => {
                    setFinalDeleteConfirm(true);
                    dispatch(authAction.deleteUser());
                  }}
                  isLoading={loading ?? false}
                  color="red"
                ></LoadingButton>
                <View style={{ height: 20 }} />
                <Button
                  title="Cancel"
                  onPress={() => setDeleteConfirmModal(false)}
                ></Button>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  logoutContainer: {
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
