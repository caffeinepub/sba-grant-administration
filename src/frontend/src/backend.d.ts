import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Application {
    id: bigint;
    status: ApplicationStatus;
    country: string;
    name: string;
    email: string;
    amount: bigint;
}
export interface ReceivingAccount {
    id: bigint;
    accountName: string;
    accountType: AccountType;
    accountDetails: string;
}
export interface UserProfile {
    name: string;
    email: string;
}
export type ProcessingFee = bigint;
export enum AccountType {
    bank = "bank",
    crypto = "crypto"
}
export enum ApplicationStatus {
    pending = "pending",
    underReview = "underReview",
    completed = "completed",
    approved = "approved",
    rejected = "rejected",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignReceivingAccount(applicationId: bigint, accountId: bigint): Promise<void>;
    createApplication(name: string, email: string, amount: bigint, country: string): Promise<Application>;
    createReceivingAccount(accountType: AccountType, accountName: string, accountDetails: string): Promise<ReceivingAccount>;
    getAllApplications(): Promise<Array<[bigint, Application]>>;
    getAllProcessingFees(): Promise<Array<[bigint, ProcessingFee]>>;
    getAllReceivingAccounts(): Promise<Array<[bigint, ReceivingAccount]>>;
    getApplicationStatus(applicationID: bigint): Promise<Application | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPaymentInstructions(applicationId: bigint): Promise<ReceivingAccount | null>;
    getProcessingFee(appId: bigint): Promise<ProcessingFee | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeProcessingFee(appId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setProcessingFee(appId: bigint, fee: ProcessingFee): Promise<void>;
    updateApplicationStatus(applicationID: bigint, newStatus: ApplicationStatus): Promise<void>;
    updateReceivingAccount(accountId: bigint, accountType: AccountType, accountName: string, accountDetails: string): Promise<void>;
}
