import { dateToString, getCurrentDateString } from "../constants/date_helper";

export interface InvestUser {
  isLoading: boolean | null;
  error: string | null;
  CredProfile: CredentialUserProfile | null;
  UserProfile: InvestUserProfile | null;
}

export interface CredentialUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface InvestUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  birthday: string | null;
  creationDate: string | null;
  apiCallsQuota?: {
    [date: string]: number;
  };
  lastUpdated?: string;
}

export interface PrivateUserProfileForLLM {
  age: number | null;
}

export interface FirebaseLoginRegisterProp {
  email: string;
  password: string;
}

export interface AuthSuccessPayload {
  CredProfile: CredentialUserProfile | null;
  UserProfile: InvestUserProfile | null;
}

export const API_QUOTA_PER_DAY = 5;

export function getApiQuota(user: InvestUserProfile, date: string): number {
  if (!user.apiCallsQuota || user.apiCallsQuota[date] === undefined) {
    return API_QUOTA_PER_DAY;
  }
  return user.apiCallsQuota[date];
}

export function decreaseApiQuota(user: InvestUserProfile): InvestUserProfile {
  const updatedUser = { ...user };
  if (!updatedUser.apiCallsQuota) {
    updatedUser.apiCallsQuota = {};
  }
  const currentDate = getCurrentDateString();
  if (!updatedUser.apiCallsQuota[currentDate]) {
    updatedUser.apiCallsQuota[currentDate] = API_QUOTA_PER_DAY;
  }
  if (updatedUser.apiCallsQuota[currentDate] > 0) {
    updatedUser.apiCallsQuota[currentDate] -= 1;
  }
  return updatedUser;
}
