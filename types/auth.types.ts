import { Auth, User, UserCredential } from "firebase/auth";

export interface InvestUser {
    isLoading : boolean | null;
    error: string | null;
    credProfile : CredentialUserProfile | null;
    userProfile : InvestUserProfile | null;

}

export interface CredentialUserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}

export interface InvestUserProfile {
    uid : string;
    email : string | null;
    displayName: string | null;
    age: number | null;
}

export interface FirebaseLoginRegisterProp {
    email: string;
    password: string;
}
