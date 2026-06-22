import { AIAnalysis, GeoPoint, NGO, Severity, Volunteer } from "./types";

export const DEFAULT_LOCATION: GeoPoint = { lat: 30.3165, lng: 78.0322 }; // Dehradun

export function randomId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export const NGO_POOL: Omit<NGO, "distanceKm" | "etaMins">[] = [
  {
    id: "ngo_1",
    name: "PawSavers Rescue Trust",
    type: "NGO",
    rating: 4.8,
    reviews: 312,
    address: "Rajpur Road, Dehradun",
    location: { lat: 30.3398, lng: 78.0664 },
    verified: true,
    activeVolunteers: 6,
    phone: "+91 98765 43210",
  },
  {
    id: "ngo_2",
    name: "Happy Tails Animal Shelter",
    type: "Shelter",
    rating: 4.6,
    reviews: 198,
    address: "Sahastradhara Road, Dehradun",
    location: { lat: 30.3654, lng: 78.0904 },
    verified: true,
    activeVolunteers: 4,
    phone: "+91 98123 45678",
  },
  {
    id: "ngo_3",
    name: "City Care Veterinary Hospital",
    type: "Veterinary Hospital",
    rating: 4.9,
    reviews: 521,
    address: "Chakrata Road, Dehradun",
    location: { lat: 30.3225, lng: 78.0211 },
    verified: true,
    activeVolunteers: 3,
    phone: "+91 90123 88990",
  },
  {
    id: "ngo_4",
    name: "Stray Hearts Foundation",
    type: "NGO",
    rating: 4.5,
    reviews: 145,
    address: "Clement Town, Dehradun",
    location: { lat: 30.2843, lng: 78.0102 },
    verified: false,
    activeVolunteers: 5,
    phone: "+91 99887 76655",
  },
  {
    id: "ngo_5",
    name: "Second Chance Animal Sanctuary",
    type: "Shelter",
    rating: 4.7,
    reviews: 267,
    address: "Mussoorie Road, Dehradun",
    location: { lat: 30.3501, lng: 78.0451 },
    verified: true,
    activeVolunteers: 7,
    phone: "+91 98220 11223",
  },
];

const VOLUNTEER_POOL: Volunteer[] = [
  {
    id: "vol_1",
    name: "Aarav Sharma",
    avatarColor: "#f9580f",
    vehicle: "Rescue Bike • DL 04 RX 4521",
    phone: "+91 99012 34567",
    rating: 4.9,
    rescuesCompleted: 142,
  },
  {
    id: "vol_2",
    name: "Priya Nair",
    avatarColor: "#0ea5e9",
    vehicle: "Rescue Van • UK07 AB 2233",
    phone: "+91 98231 09876",
    rating: 4.8,
    rescuesCompleted: 98,
  },
  {
    id: "vol_3",
    name: "Karan Mehta",
    avatarColor: "#16a34a",
    vehicle: "Rescue Bike • UK07 PQ 7781",
    phone: "+91 97654 32109",
    rating: 4.95,
    rescuesCompleted: 211,
  },
];

function haversineKm(a: GeoPoint, b: GeoPoint) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function getNearbyNGOs(origin: GeoPoint): NGO[] {
  return NGO_POOL.map((n) => {
    const distanceKm = Math.round(haversineKm(origin, n.location) * 10) / 10;
    const etaMins = Math.max(3, Math.round(distanceKm * 3.4));
    return { ...n, distanceKm, etaMins };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}

export function assignVolunteer(): Volunteer {
  return VOLUNTEER_POOL[Math.floor(Math.random() * VOLUNTEER_POOL.length)];
}

// ---- Mocked "Gemini Vision" AI analysis ----
const ANIMAL_TYPES = ["Dog", "Cat", "Cow", "Bird", "Goat"];
const INJURY_SETS: Record<string, string[][]> = {
  Dog: [
    ["Leg Wound", "Bleeding"],
    ["Limping", "Swelling on paw"],
    ["Skin infection", "Mange patches"],
    ["Road accident trauma", "Fractured limb"],
  ],
  Cat: [
    ["Eye infection", "Minor scratches"],
    ["Tail injury", "Limping"],
    ["Dehydration", "Visible ribs"],
  ],
  Cow: [
    ["Open wound on flank", "Bleeding"],
    ["Limping", "Hoof injury"],
  ],
  Bird: [
    ["Wing fracture", "Unable to fly"],
    ["Feather loss", "Lethargic"],
  ],
  Goat: [["Leg injury", "Limping"], ["Cut on body", "Mild bleeding"]],
};

export function mockAIAnalysis(): AIAnalysis {
  const animalType =
    ANIMAL_TYPES[Math.floor(Math.random() * ANIMAL_TYPES.length)];
  const injurySets = INJURY_SETS[animalType] ?? [["Visible distress"]];
  const injuries = injurySets[Math.floor(Math.random() * injurySets.length)];

  const severityRoll = Math.random();
  let severity: Severity = "Low";
  if (severityRoll > 0.75) severity = "High";
  else if (severityRoll > 0.4) severity = "Medium";

  const emergency = severity === "High";
  const confidence = 84 + Math.floor(Math.random() * 14);

  const summaryMap: Record<Severity, string> = {
    Low: `The ${animalType.toLowerCase()} shows minor signs of distress but appears largely stable. Monitoring and basic first-aid are recommended.`,
    Medium: `The ${animalType.toLowerCase()} has noticeable injuries (${injuries
      .join(", ")
      .toLowerCase()}) that require professional veterinary attention within the next few hours.`,
    High: `The ${animalType.toLowerCase()} is showing severe injuries (${injuries
      .join(", ")
      .toLowerCase()}) with signs of significant distress. Immediate rescue and veterinary intervention is critical.`,
  };

  const recommendationMap: Record<Severity, string> = {
    Low: "Schedule a routine check-up",
    Medium: "Veterinary attention required within 24 hours",
    High: "Immediate Rescue Required",
  };

  return {
    animalType,
    injuries,
    severity,
    emergency,
    confidence,
    summary: summaryMap[severity],
    recommendation: recommendationMap[severity],
  };
}

export const PLATFORM_STATS = [
  { label: "Animals Rescued", value: "4,820+" },
  { label: "Partner NGOs", value: "210+" },
  { label: "Active Volunteers", value: "1,340+" },
  { label: "Avg. Response Time", value: "14 min" },
];
