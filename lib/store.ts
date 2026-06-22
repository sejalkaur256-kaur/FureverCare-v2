"use client";

import { RescueRequest, RescueStatus } from "./types";

const KEY = "FureverCare_requests_v1";

function readAll(): RescueRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RescueRequest[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: RescueRequest[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("FureverCare-store-updated"));
}

export function saveRequest(req: RescueRequest) {
  const all = readAll();
  const idx = all.findIndex((r) => r.id === req.id);
  if (idx >= 0) all[idx] = req;
  else all.unshift(req);
  writeAll(all);
}

export function getRequest(id: string): RescueRequest | undefined {
  return readAll().find((r) => r.id === id);
}

export function listRequests(): RescueRequest[] {
  return readAll();
}

export function updateStatus(id: string, status: RescueStatus) {
  const all = readAll();
  const req = all.find((r) => r.id === id);
  if (!req) return;
  req.status = status;
  req.timeline.push({ status, time: new Date().toISOString() });
  writeAll(all);
}

export function patchRequest(id: string, patch: Partial<RescueRequest>) {
  const all = readAll();
  const idx = all.findIndex((r) => r.id === id);
  if (idx < 0) return;
  all[idx] = { ...all[idx], ...patch };
  writeAll(all);
}

export const STATUS_ORDER: RescueStatus[] = [
  "Request Created",
  "NGO Accepted",
  "Volunteer Assigned",
  "Volunteer On Route",
  "Animal Rescued",
  "Completed",
];
