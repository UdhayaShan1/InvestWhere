import { Modal, Text, TouchableOpacity, View } from "react-native";
import { styles as profileStyles } from "../screens/Profile/styles";
import { portFolioStyles } from "../types/wealth.types";
import { Ionicons } from "@expo/vector-icons";

interface ConfirmDeleteProps<T extends (...args: any[]) => void> {
  confirmDelete: boolean;
  setConfirmDelete: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: T;
}

export default function ConfirmDelete<T extends (...args: any[]) => void>({
  confirmDelete,
  setConfirmDelete,
  handleDelete,
}: ConfirmDeleteProps<T>) {
  const handleConfirm = () => {
    handleDelete();
  };

  return (
    <Modal visible={confirmDelete} transparent={true} animationType="fade">
      <View style={profileStyles.modalContainer}>
        <View
          style={[profileStyles.modalView, portFolioStyles.compactModalView]}
        >
          <Text style={profileStyles.modalTitle}>{"Are you sure?"}</Text>

          <View style={portFolioStyles.buttonRow}>
            <TouchableOpacity
              style={[
                portFolioStyles.actionButton,
                portFolioStyles.cancelButton,
                { backgroundColor: "#28a745" },
              ]}
              onPress={handleConfirm}
            >
              <Ionicons name="checkmark" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                portFolioStyles.actionButton,
                portFolioStyles.cancelButton,
                { backgroundColor: "red" },
              ]}
              onPress={() => setConfirmDelete(false)}
            >
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
