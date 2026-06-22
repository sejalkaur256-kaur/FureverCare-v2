"use client";

export type Role = "citizen" | "ngo" | "volunteer";

export interface AuthUser {
  name: string;
  email: string;
  role: Role;
  orgName?: string;
}

const KEY = "FureverCare_auth_v1";

export const ROLE_HOME: Record<Role, string> = {
  citizen: "/dashboard",
  ngo: "/ngo",
  volunteer: "/volunteer",
};

export const ROLE_LABEL: Record<Role, string> = {
  citizen: "Citizen",
  ngo: "NGO / Shelter",
  volunteer: "Volunteer",
};

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser) {
  window.localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("FureverCare-auth-updated"));
}

export function logout() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("FureverCare-auth-updated"));
}
