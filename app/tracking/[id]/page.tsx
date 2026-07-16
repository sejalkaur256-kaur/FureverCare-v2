"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapView } from "@/components/MapView";
import { RescueTimeline } from "@/components/RescueTimeline";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listRequests, updateStatus, STATUS_ORDER, fetchAllRequests } from "@/lib/store";
import { GeoPoint, RescueRequest } from "@/lib/types";
import { Phone, Star, Clock, Navigation2, CheckCircle2, Bike, MapPin, Sparkles, Loader2 } from "lucide-react";
import { FloatingCard } from "@/components/ui/primitives";
import { motion } from "framer-motion";

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
    async function load() {
      await fetchAllRequests();
      const r = listRequests().find((r) => r.id === id);
      if (r) setRequest(r);
    }
    if (id) load();
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
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center text-slate-400 font-medium">
          <Loader2 className="animate-spin text-primary mr-2" size={20} />
          Retrieving live tracking telemetry...
        </main>
        <Footer />
      </div>
    );
  }

  const progress = Math.min(1, step / TOTAL_STEPS);
  const distanceRemainingKm = request.ngo
    ? Math.max(0, parseFloat((request.ngo.distanceKm * (1 - progress)).toFixed(1)))
    : "0.0";
  const etaMins = request.ngo
    ? Math.max(0, Math.round(request.ngo.etaMins * (1 - progress)))
    : 0;

  const rescued = request.status === "Animal Rescued" || request.status === "Completed";
  const currentStatusLabel = request.status;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Live Dispatch Tracking</h1>
            <p className="text-sm text-slate-500 mt-1">
              Case Incident ID: #{request.id.split("_")[1]} • Reported Animal: {request.analysis.animalType}
            </p>
          </div>
          <Badge tone={rescued ? "success" : "brand"} className="px-3.5 py-1.5 text-xs font-bold shadow-sm animate-pulse">
            {request.status}
          </Badge>
        </div>

        {/* Uber-like interactive grid layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* LEFT: Map + Volunteer Card overlays */}
          <div className="lg:col-span-8 space-y-6 relative flex flex-col">
            
            {/* Map wrapper card */}
            <Card className="p-2 overflow-hidden border-slate-200/50 shadow-soft h-[350px] sm:h-[450px] relative">
              <MapView
                center={request.location}
                className="h-full w-full rounded-xl"
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

              {/* Floating Live Telemetry Cards on top of the Map */}
              <div className="absolute top-6 left-6 z-10 hidden sm:flex gap-3">
                <FloatingCard className="flex items-center gap-3 p-3">
                  <div className="h-8 w-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                    <Navigation2 size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{distanceRemainingKm} km</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Distance</p>
                  </div>
                </FloatingCard>

                <FloatingCard className="flex items-center gap-3 p-3">
                  <div className="h-8 w-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                    <Clock size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{rescued ? "Arrived" : `${etaMins} min`}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ETA</p>
                  </div>
                </FloatingCard>
              </div>
            </Card>

            {/* Mobile Telemetry Layout */}
            <div className="grid grid-cols-3 gap-3 sm:hidden">
              <Card className="flex flex-col items-center justify-center p-3 text-center bg-white shadow-soft">
                <Navigation2 size={16} className="text-primary mb-1 animate-pulse" />
                <p className="text-sm font-black text-slate-800">{distanceRemainingKm} km</p>
                <p className="text-[9px] text-slate-400 font-medium">Distance</p>
              </Card>
              <Card className="flex flex-col items-center justify-center p-3 text-center bg-white shadow-soft">
                <Clock size={16} className="text-primary mb-1 animate-pulse" />
                <p className="text-sm font-black text-slate-800">{rescued ? "Arrived" : `${etaMins} m`}</p>
                <p className="text-[9px] text-slate-400 font-medium">ETA</p>
              </Card>
              <Card className="flex flex-col items-center justify-center p-3 text-center bg-white shadow-soft">
                <CheckCircle2 size={16} className={rescued ? "text-emerald-500 mb-1" : "text-slate-300 mb-1"} />
                <p className="text-sm font-black text-slate-800">{rescued ? "Rescued" : "In Route"}</p>
                <p className="text-[9px] text-slate-400 font-medium">Status</p>
              </Card>
            </div>

            {/* Volunteer Details Card */}
            {request.volunteer && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-5 border-slate-200/50 shadow-soft bg-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm"
                      style={{ backgroundColor: request.volunteer.avatarColor || "#0ea5a4" }}
                    >
                      {request.volunteer.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                        {request.volunteer.name}
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-50 border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                          Active Responder
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{request.volunteer.vehicle}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mt-1">
                        <span className="flex items-center gap-0.5">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          {request.volunteer.rating}
                        </span>
                        <span>•</span>
                        <span>{request.volunteer.rescuesCompleted} completed rescues</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`tel:${request.volunteer.phone}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors shadow-xs shrink-0"
                  >
                    <Phone size={16} className="fill-emerald-600" />
                  </a>
                </Card>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Rescue Progress Timeline */}
          <div className="lg:col-span-4">
            <Card className="p-5 border-slate-200/50 shadow-soft bg-white h-full flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" /> Live Progress Timeline
                </h3>
                <RescueTimeline current={request.status} />
              </div>
              
              {/* ETA Indicator */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Telemetry feed active and tracking volunteer coordinates.</span>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
