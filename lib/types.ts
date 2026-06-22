export type Severity = "Low" | "Medium" | "High";

export type RescueStatus =
  | "Request Created"
  | "NGO Accepted"
  | "Volunteer Assigned"
  | "Volunteer On Route"
  | "Animal Rescued"
  | "Completed";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface AIAnalysis {
  animalType: string;
  breed?: string;
  injuries: string[];
  severity: Severity;
  emergency: boolean;
  confidence: number; // 0-100
  summary: string;
  recommendation: string;
}

export interface NGO {
  id: string;
  name: string;
  type: "NGO" | "Shelter" | "Veterinary Hospital";
  rating: number;
  reviews: number;
  distanceKm: number;
  etaMins: number;
  address: string;
  location: GeoPoint;
  verified: boolean;
  activeVolunteers: number;
  phone: string;
}

export interface Volunteer {
  id: string;
  name: string;
  avatarColor: string;
  vehicle: string;
  phone: string;
  rating: number;
  rescuesCompleted: number;
}

export interface RescueRequest {
  id: string;
  createdAt: string;
  imageDataUrl?: string;
  description: string;
  location: GeoPoint;
  address: string;
  analysis: AIAnalysis;
  status: RescueStatus;
  ngo?: NGO;
  volunteer?: Volunteer;
  reporterName: string;
  timeline: { status: RescueStatus; time: string }[];
}
