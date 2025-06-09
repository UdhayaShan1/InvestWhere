import {
  Button,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView, // Add ScrollView import
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
      />

      <Modal visible={editModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit your profile here</Text>

            <ScrollView
              style={{ width: "100%" }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Name Field */}
              <View style={{ marginBottom: 20 }}>
                <Text style={[styles.label, { marginBottom: 8 }]}>Name:</Text>
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

              {/* Birthday Field */}
              <View style={{ marginBottom: 20 }}>
                <Text style={[styles.label, { marginBottom: 8 }]}>
                  Birthday:
                </Text>
                <TouchableOpacity
                  style={[
                    styles.modalInput,
                    {
                      justifyContent: "center",
                      backgroundColor: "#f8f9fa",
                    },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: form.birthday ? "#22223b" : "#999",
                    }}
                  >
                    {form.birthday ? form.birthday : "Set your birthday"}
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

              {/* Buttons */}
              <View style={{ marginTop: 20 }}>
                <LoadingButton
                  title="Submit"
                  isLoading={loading ?? false}
                  onPress={() => {
                    dispatch(authAction.editUserProfile(form));
                    setEditModal(false);
                  }}
                />

                <View style={{ height: 16 }} />

                <TouchableOpacity
                  style={{
                    backgroundColor: "#dc3545",
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                  onPress={() => setEditModal(false)}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
