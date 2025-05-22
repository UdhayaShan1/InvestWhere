import { Button, Modal, Text, View } from "react-native";
import { styles } from "./styles";
import LoadingButton from "../../component/LoadingButton";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import { authAction } from "../../store/auth/authSlice";
import { useState } from "react";
import { isLoadingSelector } from "../../store/auth/authSelector";


export function DeleteProfile() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(isLoadingSelector);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [finalDeleteConfirm, setFinalDeleteConfirm] = useState(false);
  return (
    <>
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
              Are you sure you want to delete your account? This action cannot
              be undone.
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
    </>
  );
}
