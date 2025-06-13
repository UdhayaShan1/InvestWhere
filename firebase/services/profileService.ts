import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { API_QUOTA_PER_DAY, InvestUserProfile } from "../../types/auth.types";
import { db } from "../firebase";
import { getCurrentDateString } from "../../constants/date_helper";

export async function getUserProfile(
  uid: string,
  email: string
): Promise<InvestUserProfile | null> {
  try {
    const userDocRef = doc(db, "profiles", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as InvestUserProfile;
    }
    return createDefaultProfile(uid, email);
  } catch (error) {
    console.log("Error retrieving user profile", error);
    return null;
  }
}

export async function saveUserProfile(
  profile: InvestUserProfile
): Promise<boolean> {
  try {
    const userDocRef = doc(db, "profiles", profile.uid);
    const toSave: InvestUserProfile = {
      uid: profile.uid,
      email: profile.email,
      birthday: profile.birthday,
      displayName: profile.displayName,
      creationDate: profile.creationDate,
      apiCallsQuota: profile.apiCallsQuota,
      lastUpdated: getCurrentDateString(),
    };
    console.log(toSave);
    await setDoc(userDocRef, toSave);
    return true;
  } catch (error) {
    console.error("Error saving profile", error);
    return false;
  }
}

export async function createDefaultProfile(
  uid: string,
  email: string | null
): Promise<InvestUserProfile> {
  const newProfile: InvestUserProfile = {
    uid,
    email,
    displayName: null,
    birthday: null,
    apiCallsQuota :{
    },
    creationDate: getCurrentDateString(),
    lastUpdated: getCurrentDateString(),
  };
  await saveUserProfile(newProfile);
  return newProfile;
}

export async function deleteUserProfile(uid: string) {
  try {
    const userDocRef = doc(db, "profiles", uid);
    await deleteDoc(userDocRef);
    return true;
  } catch (error) {
    console.log("Error deleting user", error);
    return false;
  }
}
