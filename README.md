# FureverCare AI — Prototype MVP

An AI-powered animal rescue platform prototype. Citizens report injured strays,
a (mocked) AI vision model detects the injury and severity, nearby NGOs/shelters/vets
are matched, and the rescue is tracked live, Uber-style, until completion.

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- TailwindCSS
- lucide-react icons
- **TensorFlow.js + MobileNet (real, in-browser ML inference)** for animal classification
- Custom canvas-based pixel analysis for injury/wound visual signals
- Fully client-side mocked backend (localStorage) — structured so it can be
  swapped for real APIs (Gemini Vision, a NGO database, a maps SDK, websockets) later.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

The first time you submit a report, your browser will download the MobileNet
model weights (a few MB) from TensorFlow's model hosting CDN — this requires
an internet connection but no API key. After that it's cached by the browser.

## Authentication

`/login` lets you sign in as one of three roles: **Citizen**, **NGO / Shelter**,
or **Volunteer**. This is a mocked auth flow for the prototype (any
name/email/password works, nothing is verified against a server) — session is
stored in `localStorage` via `lib/auth.ts`. Each dashboard route
(`/dashboard`, `/ngo`, `/volunteer`) is guarded by `lib/useRequireAuth.ts`,
which redirects to `/login` if no session exists.

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, stats, how it works |
| `/login` | Role-based login (Citizen / NGO / Volunteer) |
| `/report` | Report Injured Animal — photo upload, description, GPS capture |
| `/analysis/[id]` | **Real AI Injury Detection** (MobileNet classification + pixel CV) + Nearby NGO Discovery & Request Rescue |
| `/tracking/[id]` | Uber-style live tracking with map, ETA, and rescue timeline |
| `/dashboard` | Citizen Dashboard — your rescue requests + nearby NGOs |
| `/ngo` | NGO Dashboard — accept/reject incoming requests |
| `/volunteer` | Volunteer Dashboard — assigned rescues + tracking links |

## End-to-end demo flow

1. Go to **`/login`**, pick a role (try Citizen first), enter any name/email, continue.
2. Go to **Report Animal**, upload any photo, add a description, capture location, submit.
3. Watch the **AI Injury Detection** step run for real: it loads MobileNet in
   your browser, classifies the animal in the photo, and scans the pixels for
   reddish/dark/irregular regions to estimate wound severity.
4. Browse **Nearby NGOs** on the simulated map, click **Request Rescue** on any card.
5. The app simulates the NGO accepting and assigning a volunteer, then redirects you
   to the **Live Tracking** page.
6. Watch the volunteer marker move toward the animal's location in real time, with
   live ETA/distance and a status timeline (Request Created → NGO Accepted →
   Volunteer Assigned → Volunteer On Route → Animal Rescued → Completed).
7. Open `/login` again, sign in as **NGO / Shelter**, visit `/ngo` to see the
   accept/reject workflow on incoming requests.
8. Sign in as **Volunteer** and visit `/volunteer` to see the assigned-rescue view.

## Notes on the AI / ML pipeline (`lib/ai.ts`)

- **Animal classification** is real, on-device inference: `@tensorflow/tfjs` +
  `@tensorflow-models/mobilenet` run MobileNetV2 (trained on ImageNet) directly
  on the uploaded photo. Its hundreds of fine-grained labels (e.g. "Labrador
  retriever", "Egyptian cat", "ox") are mapped to simplified categories like
  Dog / Cat / Cow / Goat / Bird / Horse / Monkey / Pig / Rabbit.
- **Injury / disease signal extraction** uses genuine canvas pixel analysis
  (not a random mock): it measures the proportion of blood-red pixels, dark
  lesion-like patches, and brightness irregularity in the photo to flag
  "Bleeding / Open Wound", "Visible Lesions / Skin Discoloration", and
  "Swelling / Abnormal Posture", and derives a Low/Medium/High severity score
  from those measurements.
- There is no open, redistributable veterinary-diagnosis dataset suitable for
  a prototype, so this rule-based visual layer stands in for a true disease
  classifier. `runAIAnalysis()` in `lib/ai.ts` is written as a single
  async function with a stable return shape (`AIAnalysis`), so it can be
  swapped for a real call to Gemini Vision or a fine-tuned veterinary model
  with no changes anywhere else in the app.

## Notes on other mocking

- **Maps**: `components/MapView.tsx` is a lightweight CSS/SVG map mock (no API key
  required) so the prototype runs anywhere. Swap it for `@react-google-maps/api` or
  Mapbox GL in production — the marker/route data shape is already map-library-agnostic.
- **Persistence**: `lib/store.ts` uses `localStorage` to simulate a backend across
  pages/tabs, and `lib/auth.ts` does the same for sessions. Replace both with real
  REST/GraphQL/auth calls or a websocket connection for live volunteer location updates.

## Folder structure

```
app/                 routes (App Router)
  page.tsx           landing
  login/             role-based login (citizen / ngo / volunteer)
  report/            report animal form
  analysis/[id]/     real AI results (MobileNet + pixel CV) + NGO discovery
  tracking/[id]/     live tracking
  dashboard/         citizen dashboard
  ngo/               NGO dashboard
  volunteer/         volunteer dashboard
components/          reusable UI + feature components
  ui/                button, card, badge, progress primitives
lib/                 types, mock data, AI/ML pipeline, auth, localStorage store, utils
```

"# FureverCare-ai" 
