export const BASE_URL = "http://localhost:8081";


export const getSocietyMemberId = (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("societyMemberId") : null;

export const getSocietyId = (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("societyId") : null;

export const getSocietyName = (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("societyName") : null;

export const getMemberId = (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("memberId") : null;

export const getFlatNumber = (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("flatNumber") : null;
