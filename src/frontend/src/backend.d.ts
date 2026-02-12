import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface FoodPreservationTip {
    id: bigint;
    title: string;
    content: string;
    createdAt: Time;
    tags?: Array<string>;
    author: Principal;
    updatedAt: Time;
}
export interface UserProfile {
    name: string;
}
export interface ScienceExplanation {
    id: bigint;
    title: string;
    summary: string;
    steps?: Array<string>;
    category: string;
    safetyNotes?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addScienceExplanation(explanation: ScienceExplanation): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTip(title: string, content: string, tags: Array<string> | null): Promise<bigint>;
    deleteTip(id: bigint): Promise<void>;
    getAllScienceExplanations(): Promise<Array<ScienceExplanation>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExplanationsByCategory(category: string): Promise<Array<ScienceExplanation>>;
    getScienceExplanation(id: bigint): Promise<ScienceExplanation>;
    getTip(id: bigint): Promise<FoodPreservationTip | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserTips(user: Principal): Promise<Array<FoodPreservationTip>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTip(id: bigint, title: string, content: string, tags: Array<string> | null): Promise<void>;
}
