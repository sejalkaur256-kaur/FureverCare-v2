"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, severityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listRequests, fetchAllRequests } from "@/lib/store";
import { RescueRequest } from "@/lib/types";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { Bike, MapPin, Navigation2, Star, AlertTriangle, Award, Shield, Trophy, Flame, SlidersHorizontal, Activity } from "lucide-react";
import { MetricCard, EmptyState } from "@/components/ui/primitives";
import { VolunteerActivityChart } from "@/components/ChartsPreview";
import { MapView } from "@/components/MapView";
import { motion } from "framer-motion";

const BADGES = [
  { name: "First Responder", desc: "Arrived under 10 minutes", icon: Trophy, color: "text-amber-500 bg-amber-50 border-amber-100" },
  { name: "Stray Ally", desc: "Completed 50+ stray saves", icon: Shield, color: "text-primary bg-primary-50 border-primary-100" },
  { name: "Night Owl", desc: "Handled 12:00 AM emergency", icon: Award, color: "text-purple-500 bg-purple-50 border-purple-100" },
];

const LEADERBOARD = [
  { name: "Karan Mehta", count: 211, active: true },
  { name: "Vikram Rathore (You)", count: 142, active: false },
  { name: "Priya Nair", count: 98, active: false },
];

export default function VolunteerDashboard() {
  const { user, checked, roleMismatch } = useRequireAuth("volunteer");
  const [requests, setRequests] = useState<RescueRequest[]>([]);

  useEffect(() => {
    async function load() {
      await fetchAllRequests();
      setRequests(listRequests());
    }
    load();
    window.addEventListener("FureverCare-store-updated", load);
    return () => window.removeEventListener("FureverCare-store-updated", load);
  }, []);

  const assigned = requests.filter(
    (r) =>
      r.volunteer &&
      ["Volunteer Assigned", "Volunteer On Route", "Animal Rescued"].includes(
        r.status
      )
  );
  const completed = requests.filter(
    (r) => r.volunteer && r.status === "Completed"
  );

  if (!checked) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center text-slate-400 font-medium">
          <Bike className="animate-spin text-primary mr-2" size={16} />
          Checking volunteer profile telemetry...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary shadow-xs">
              <Bike size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Mission Control</h1>
              <p className="text-sm text-slate-500 mt-1">
                Welcome, {user?.name?.split(" ")[0] ?? "Volunteer"} — field dispatcher dispatch telemetry
              </p>
            </div>
          </div>
        </div>

        {roleMismatch && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">
            <AlertTriangle size={15} className="text-amber-600" />
            Signed in as {user?.role}. Surface dashboard simulated metrics for system testing.
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT: Profile & Gamified achievements */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Operator Card */}
            <Card className="p-5 border-slate-200/50 bg-white shadow-soft">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-lg font-black shadow-sm">
                  {user?.name?.charAt(0) ?? "V"}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{user?.name ?? "Vikram Rathore"}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Rescue operator</p>
                </div>
              </div>
              
              {/* Profile Stats */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100 text-center">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xl font-bold text-slate-800">142</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Rescues Done</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xl font-bold text-slate-800 flex items-center justify-center gap-0.5">
                    <Flame size={15} className="text-orange-500 fill-orange-500" /> 12
                  </p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Day Streak</p>
                </div>
              </div>
            </Card>

            {/* Badges & achievements */}
            <Card className="p-5 border-slate-200/50 bg-white shadow-soft">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Operator Achievements</h3>
              <div className="space-y-3">
                {BADGES.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.name} className="flex gap-3 items-center">
                      <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${b.color}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{b.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{b.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Leaderboard */}
            <Card className="p-5 border-slate-200/50 bg-white shadow-soft">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">City Leaderboard</h3>
              <div className="space-y-3">
                {LEADERBOARD.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-xs font-medium border-b border-slate-50 pb-2 last:border-none">
                    <span className={item.active ? "text-primary font-bold" : "text-slate-600"}>
                      {idx + 1}. {item.name}
                    </span>
                    <span className="font-bold text-slate-700">{item.count} saves</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT: Active assignments & route previews */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active missions */}
            <section>
              <h3 className="text-base font-bold text-slate-800 mb-4">Assigned Rescues ({assigned.length})</h3>
              {assigned.length === 0 ? (
                <EmptyState title="No active assignments" description="Accepted NGO requests matching your coordinates will appear here." />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {assigned.map((r) => (
                    <Card key={r.id} className="p-5 border-slate-200/50 bg-white shadow-soft flex flex-col justify-between h-full">
                      <div>
                        <div className="flex gap-3">
                          {r.imageDataUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.imageDataUrl} alt="" className="h-16 w-16 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="h-16 w-16 rounded-xl bg-slate-100 shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="font-extrabold text-slate-800 text-xs">{r.analysis.animalType}</h4>
                              <Badge tone={severityTone(r.analysis.severity)}>{r.analysis.severity}</Badge>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-0.5 truncate"><MapPin size={11} /> {r.address}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Current Status</span>
                          <Badge tone="info" className="text-[9px] font-bold py-0.5 px-2">{r.status}</Badge>
                        </div>
                      </div>

                      <div className="mt-5">
                        <Link href={`/tracking/${r.id}`}>
                          <Button size="sm" className="w-full font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/20">
                            <Navigation2 size={13} className="fill-white" /> Open Route Telemetry
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Volunteer Activity Chart */}
            <Card className="p-5 border-slate-200/60 bg-white shadow-soft">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Your Completed Rescues Activity</h3>
              <VolunteerActivityChart />
            </Card>

            {/* Completed Rescues lists */}
            <section>
              <h3 className="text-base font-bold text-slate-800 mb-4">Completed Rescue Logs ({completed.length})</h3>
              {completed.length === 0 ? (
                <EmptyState title="No completed rescues logged" description="Secure animals and mark them completed inside tracking." />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {completed.map((r) => (
                    <Card key={r.id} className="p-4 border-slate-200/50 bg-white">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-800 text-xs">{r.analysis.animalType} Rescued</h4>
                        <Badge tone="success">Completed</Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{r.address}</p>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
