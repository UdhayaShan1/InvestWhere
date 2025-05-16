import { Button, Modal, Text, View } from "react-native";
import { styles } from "./ProfilePage";
import LoadingButton from "../../component/LoadingButton";
import { useAppDispatch } from "../../store/rootTypes";
import { authAction } from "../../store/auth/authSlice";

interface DeleteProfileProps {
  loading?: boolean;
  deleteConfirmModal: boolean;
  setDeleteConfirmModal: (value: boolean) => void;
  setFinalDeleteConfirm: (value: boolean) => void;
}

export function DeleteProfile({
  loading,
  deleteConfirmModal,
  setDeleteConfirmModal,
  setFinalDeleteConfirm,
}: DeleteProfileProps) {
  const dispatch = useAppDispatch();
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
