export interface InvestUser {
    isLoading : boolean | null;
    error: string | null;
    CredProfile : CredentialUserProfile | null;
    UserProfile : InvestUserProfile | null;
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
    birthday: string| null;
    creationDate : string | null;
    lastUpdated?: string;
}

export interface FirebaseLoginRegisterProp {
    email: string;
    password: string;
}

export interface AuthSuccessPayload {
    CredProfile : CredentialUserProfile | null;
    UserProfile : InvestUserProfile | null;
}

