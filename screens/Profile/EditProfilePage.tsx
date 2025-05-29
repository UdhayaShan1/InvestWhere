import {
  Button,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { InvestUserProfile } from "../../types/auth.types";
import { useEffect, useState } from "react";
import { styles } from "./styles";
import LoadingButton from "../../component/LoadingButton";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import { isLoadingSelector } from "../../store/auth/authSelector";
import { authAction } from "../../store/auth/authSlice";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  dateToString,
  getCurrentDateString,
  stringToDate,
} from "../../constants/date_helper";

interface EditProfileProps {
  UserProfile: InvestUserProfile;
}

export function EditProfileScreen({ UserProfile }: EditProfileProps) {
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState<InvestUserProfile>({ ...UserProfile });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const loading = useAppSelector(isLoadingSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setForm(() => ({ ...UserProfile }));
  }, [editModal]);

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate && !isNaN(selectedDate.getTime())) {
      const formattedDate = dateToString(selectedDate);
      setForm((prev) => ({
        ...prev,
        birthday: formattedDate,
      }));
    }
  };

  return (
    <>
      <Button
        title="Edit Profile"
        color="green"
        onPress={() => setEditModal(true)}
      ></Button>

      <Modal visible={editModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit your profile here</Text>
            <View style={styles.profileInfo}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={UserProfile.displayName ?? "Set a name"}
                value={form.displayName ?? ""}
                autoCapitalize="words"
                onChangeText={(e) =>
                  setForm((prev) => ({ ...prev, displayName: e }))
                }
              />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.label}>Birthday:</Text>
              <TouchableOpacity
                style={styles.modalInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ fontSize: 16 }}>
                  {form.birthday
                    ? form.birthday
                    : "Set your birthday"}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={stringToDate(form.birthday)}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}

            <LoadingButton
              title="Submit"
              isLoading={loading ?? false}
              onPress={() => {
                dispatch(authAction.editUserProfile(form));
                setEditModal(false);
              }}
            ></LoadingButton>
            <View style={{ height: 20 }} />
            <Button
              color={"red"}
              title="Cancel"
              onPress={() => setEditModal(false)}
            ></Button>
          </View>
        </View>
      </Modal>
    </>
  );
}
