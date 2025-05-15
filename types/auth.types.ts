import { Auth, User, UserCredential } from "firebase/auth";

export interface InvestUser {
    isLoading : boolean | null;
    error: string | null;
    user : UserProfile | null;
}

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}

export interface FirebaseLoginProp {
    email: string;
    password: string;
}

export interface FirebaseLoginSuccess {
    Credentials : UserCredential;
}

export interface FirebaseLoginFail {
    Error : string;
}
