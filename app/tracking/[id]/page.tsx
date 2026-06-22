"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapView } from "@/components/MapView";
import { RescueTimeline } from "@/components/RescueTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRequest, updateStatus } from "@/lib/store";
import { GeoPoint, RescueRequest } from "@/lib/types";
import { Phone, Star, Clock, Navigation2, CheckCircle2 } from "lucide-react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const TOTAL_STEPS = 18;
const STEP_MS = 1800;

export default function TrackingPage() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<RescueRequest | null>(null);
  const [volunteerPos, setVolunteerPos] = useState<GeoPoint | null>(null);
  const [step, setStep] = useState(0);
  const startRef = useRef<GeoPoint | null>(null);

  // load request + poll local store for status updates from other pages
  useEffect(() => {
    function load() {
      const r = getRequest(id);
      if (r) setRequest(r);
    }
    load();
    window.addEventListener("FureverCare-store-updated", load);
    return () => window.removeEventListener("FureverCare-store-updated", load);
  }, [id]);

  // initialize volunteer starting point near the NGO
  useEffect(() => {
    if (!request) return;
    if (startRef.current) return;
    const origin = request.ngo
      ? request.ngo.location
      : {
          lat: request.location.lat + 0.02,
          lng: request.location.lng + 0.02,
        };
    startRef.current = origin;
    setVolunteerPos(origin);
  }, [request]);

  // simulate movement + status progression
  useEffect(() => {
    if (!request || !startRef.current) return;
    if (request.status === "Completed") return;

    const interval = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1;
        const t = Math.min(1, next / TOTAL_STEPS);
        const start = startRef.current!;
        setVolunteerPos({
          lat: lerp(start.lat, request.location.lat, t),
          lng: lerp(start.lng, request.location.lng, t),
        });

        if (next === 1) updateStatus(request.id, "Volunteer On Route");
        if (next === TOTAL_STEPS) updateStatus(request.id, "Animal Rescued");
        if (next === TOTAL_STEPS + 3) updateStatus(request.id, "Completed");

        if (next >= TOTAL_STEPS + 3) {
          clearInterval(interval);
        }
        return next;
      });
    }, STEP_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.id]);

  if (!request) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center text-gray-400">
          Loading rescue request...
        </main>
        <Footer />
      </div>
    );
  }

  const progress = Math.min(1, step / TOTAL_STEPS);
  const distanceRemainingKm = request.ngo
    ? Math.max(0, (request.ngo.distanceKm * (1 - progress)).toFixed(1))
    : "0.0";
  const etaMins = request.ngo
    ? Math.max(0, Math.round(request.ngo.etaMins * (1 - progress)))
    : 0;

  const rescued = request.status === "Animal Rescued" || request.status === "Completed";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Live Rescue Tracking</h1>
            <p className="text-sm text-gray-500">
              Request #{request.id.split("_")[1]} • {request.analysis.animalType}
            </p>
          </div>
          <Badge tone={rescued ? "success" : "brand"} className="text-sm">
            {request.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-2 sm:p-3">
              <MapView
                center={request.location}
                className="h-80 w-full sm:h-96"
                showRoute={!rescued}
                routeFrom={volunteerPos ?? undefined}
                routeTo={request.location}
                markers={[
                  {
                    id: "animal",
                    point: request.location,
                    kind: "animal",
                    label: "Animal",
                    active: !rescued,
                  },
                  ...(volunteerPos
                    ? [
                        {
                          id: "volunteer",
                          point: volunteerPos,
                          kind: "volunteer" as const,
                          label: request.volunteer?.name.split(" ")[0] ?? "Volunteer",
                          active: !rescued,
                        },
                      ]
                    : []),
                ]}
              />
            </Card>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Card className="flex flex-col items-center justify-center p-4 text-center">
                <Navigation2 size={18} className="mb-1 text-brand-500" />
                <p className="text-lg font-bold text-ink-900">
                  {distanceRemainingKm} km
                </p>
                <p className="text-xs text-gray-500">Distance Remaining</p>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 text-center">
                <Clock size={18} className="mb-1 text-brand-500" />
                <p className="text-lg font-bold text-ink-900">
                  {rescued ? "Arrived" : `${etaMins} min`}
                </p>
                <p className="text-xs text-gray-500">ETA</p>
              </Card>
              <Card className="col-span-2 flex flex-col items-center justify-center p-4 text-center sm:col-span-1">
                <CheckCircle2
                  size={18}
                  className={`mb-1 ${rescued ? "text-emerald-500" : "text-gray-300"}`}
                />
                <p className="text-lg font-bold text-ink-900">
                  {rescued ? "Rescued" : "On the way"}
                </p>
                <p className="text-xs text-gray-500">Status</p>
              </Card>
            </div>

            {request.volunteer && (
              <Card className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: request.volunteer.avatarColor }}
                  >
                    {request.volunteer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">
                      {request.volunteer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {request.volunteer.vehicle}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      {request.volunteer.rating} •{" "}
                      {request.volunteer.rescuesCompleted} rescues
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${request.volunteer.phone}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
                >
                  <Phone size={16} />
                </a>
              </Card>
            )}
          </div>

          <Card className="p-5">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Rescue Timeline</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <RescueTimeline current={request.status} />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
