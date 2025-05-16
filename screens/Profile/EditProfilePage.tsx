import { Button, Modal, Text, TextInput, View } from "react-native";
import { InvestUserProfile } from "../../types/auth.types";
import { useEffect, useState } from "react";
import { styles } from "./ProfilePage";
import LoadingButton from "../../component/LoadingButton";
import { useAppDispatch, useAppSelector } from "../../store/rootTypes";
import { isLoadingSelector } from "../../store/auth/authSelector";
import { authAction } from "../../store/auth/authSlice";

interface EditProfileProps {
  UserProfile: InvestUserProfile;
}

export function EditProfileScreen({ UserProfile }: EditProfileProps) {
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState<InvestUserProfile>({ ...UserProfile });
  const loading = useAppSelector(isLoadingSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {}, [form]);
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
              <Text style={styles.label}>Age:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={
                  UserProfile.age !== null && UserProfile.age !== undefined
                    ? UserProfile.age.toString()
                    : "Set an age"
                }
                value={
                  form.age !== null && form.age !== undefined
                    ? String(form.age)
                    : ""
                }
                keyboardType="numeric"
                onChangeText={(e) =>
                  setForm((prev) => ({ ...prev, age: Number(e) }))
                }
                maxLength={3}
              />
            </View>

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
