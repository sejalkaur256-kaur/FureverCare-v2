"use client";

import { RescueRequest, RescueStatus } from "./types";
import { submitRescueRequest, updateRescueStatus, fetchRescueRequests as serverFetch } from "./actions";

// Cache for synchronous getter compatibility
let localCache: RescueRequest[] = [];

export async function fetchAllRequests() {
  const data = await serverFetch();
  localCache = data as any;
  return localCache;
}

export function listRequests(): RescueRequest[] {
  return localCache;
}

export function getRequest(id: string): RescueRequest | undefined {
  return localCache.find((r) => r.id === id);
}

export async function saveRequest(req: RescueRequest) {
  await submitRescueRequest(req);
  // We trigger event to tell UI to refetch
  window.dispatchEvent(new Event("FureverCare-store-updated"));
}

export async function updateStatus(id: string, status: RescueStatus) {
  await updateRescueStatus(id, status);
  window.dispatchEvent(new Event("FureverCare-store-updated"));
}

export async function patchRequest(id: string, patch: Partial<RescueRequest>) {
  await updateRescueStatus(id, patch.status as RescueStatus, patch);
  window.dispatchEvent(new Event("FureverCare-store-updated"));
}

export const STATUS_ORDER: RescueStatus[] = [
  "Request Created",
  "NGO Accepted",
  "Volunteer Assigned",
  "Volunteer On Route",
  "Animal Rescued",
  "Completed",
];
