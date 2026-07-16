"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, severityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listRequests, fetchAllRequests } from "@/lib/store";
import { getNearbyNGOs, DEFAULT_LOCATION } from "@/lib/mock-data";
import { RescueRequest } from "@/lib/types";
import { NGOCard } from "@/components/NGOCard";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { PlusCircle, Inbox, MapPin, AlertTriangle, Search, Filter, LayoutDashboard, HeartHandshake, Settings, User, SlidersHorizontal, Activity } from "lucide-react";
import { MetricCard, EmptyState, GlassPanel } from "@/components/ui/primitives";
import { SeverityDistributionChart, MonthlyRescuesChart } from "@/components/ChartsPreview";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CitizenDashboard() {
  const { user, checked, roleMismatch } = useRequireAuth("citizen");
  const [requests, setRequests] = useState<RescueRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function load() {
      await fetchAllRequests();
      setRequests(listRequests());
    }
    load();
    window.addEventListener("FureverCare-store-updated", load);
    return () => window.removeEventListener("FureverCare-store-updated", load);
  }, []);

  const ngos = getNearbyNGOs(DEFAULT_LOCATION).slice(0, 3);

  // Filter logic
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.analysis.animalType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeRescuesCount = requests.filter((r) => r.status !== "Completed").length;

  if (!checked) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center text-slate-400 font-medium">
          <SlidersHorizontal className="animate-spin text-primary mr-2" size={16} />
          Checking your citizen authorization...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      {/* Main Dashboard Layout with Left Sidebar */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Collapsible Left Sidebar Panel */}
          <aside className="w-full lg:w-64 shrink-0">
            <Card className="p-4 border-slate-200/50 shadow-soft bg-white space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3">Navigation</span>
              <button
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                  activeTab === "overview"
                    ? "bg-primary-50 text-primary shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <LayoutDashboard size={15} /> Overview
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                  activeTab === "reports"
                    ? "bg-primary-50 text-primary shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Activity size={15} /> Rescue Reports ({requests.length})
              </button>
              <button
                onClick={() => setActiveTab("ngos")}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                  activeTab === "ngos"
                    ? "bg-primary-50 text-primary shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <HeartHandshake size={15} /> Find Shelters &amp; Vets
              </button>
            </Card>
          </aside>

          {/* Right Main Panel */}
          <main className="flex-1 space-y-8">
            {/* Header banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
                  Welcome, {user?.name?.split(" ")[0]}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Citizen Dashboard • Track reports, file emergency dispatches, and coordinate with nearby clinics.
                </p>
              </div>
              <Link href="/report">
                <Button className="flex items-center gap-1.5 font-bold shadow-md shadow-primary/20">
                  <PlusCircle size={15} /> Report Animal
                </Button>
              </Link>
            </div>

            {roleMismatch && (
              <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">
                <AlertTriangle size={15} className="text-amber-600" />
                Logged in as {user?.role}. Surface dashboard coordinates simulated for prototype testing.
              </div>
            )}

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Metric Widgets */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <MetricCard title="Total Reported Incidents" value={requests.length} icon={Activity} />
                  <MetricCard title="Active Rescue Missions" value={activeRescuesCount} icon={SlidersHorizontal} trend={activeRescuesCount > 0 ? "LIVE" : "Stable"} trendDirection="up" />
                  <MetricCard title="Emergency Response Vets" value={ngos.length} icon={HeartHandshake} />
                </div>

                {/* Dashboard Summary Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-5 border-slate-200/60 shadow-soft bg-white">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Severity Ratios</h3>
                    <SeverityDistributionChart />
                  </Card>
                  <Card className="p-5 border-slate-200/60 shadow-soft bg-white">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Rescues Monthly Trend</h3>
                    <MonthlyRescuesChart />
                  </Card>
                </div>

                {/* Quick feed: Active rescues */}
                <section>
                  <h3 className="text-base font-bold text-slate-800 mb-4">Active Rescue Feeds</h3>
                  {requests.filter(r => r.status !== "Completed").length === 0 ? (
                    <EmptyState title="No active rescues" description="Spot an injured stray and file a rescue dispatch." />
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {requests.filter(r => r.status !== "Completed").slice(0, 2).map(r => (
                        <Link href={`/tracking/${r.id}`} key={r.id}>
                          <Card className="p-4 border-slate-200 hover:border-slate-300 bg-white hover:shadow-md transition-all flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {r.imageDataUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={r.imageDataUrl} alt="" className="h-12 w-12 rounded-xl object-cover shrink-0" />
                              ) : (
                                <div className="h-12 w-12 rounded-xl bg-slate-100 shrink-0" />
                              )}
                              <div>
                                <h4 className="font-extrabold text-slate-800 text-xs">{r.analysis.animalType}</h4>
                                <p className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5"><MapPin size={10} /> {r.address.split(",")[0]}</p>
                              </div>
                            </div>
                            <Badge tone={severityTone(r.analysis.severity)}>{r.status}</Badge>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* TAB 2: REPORTS LIST */}
            {activeTab === "reports" && (
              <section className="space-y-6">
                {/* Search & Filter bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search reports by animal or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white shadow-xs"
                    />
                  </div>
                  <div className="relative">
                    <SlidersHorizontal className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="rounded-xl border border-slate-200 pl-10 pr-8 py-2.5 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white shadow-xs appearance-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Request Created">Request Created</option>
                      <option value="NGO Accepted">NGO Accepted</option>
                      <option value="Volunteer Assigned">Volunteer Assigned</option>
                      <option value="Volunteer On Route">Volunteer On Route</option>
                      <option value="Animal Rescued">Animal Rescued</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Grid Lists */}
                {filteredRequests.length === 0 ? (
                  <EmptyState title="No matching reports found" description="Adjust your filters or submit a new rescue request." />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredRequests.map((r) => (
                      <Link key={r.id} href={`/tracking/${r.id}`}>
                        <Card className="flex h-full flex-col justify-between border-slate-200/50 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                          <div>
                            <div className="flex gap-3 items-start">
                              {r.imageDataUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={r.imageDataUrl} alt="" className="h-14 w-14 rounded-xl object-cover shrink-0" />
                              ) : (
                                <div className="h-14 w-14 rounded-xl bg-slate-100 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-extrabold text-slate-800 text-sm truncate">{r.analysis.animalType}</h4>
                                <p className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-1 font-medium truncate">
                                  <MapPin size={11} /> {r.address}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <Badge tone={severityTone(r.analysis.severity)}>
                              {r.analysis.severity}
                            </Badge>
                            <Badge tone="info" className="text-[10px] font-bold py-0.5 px-2">
                              {r.status}
                            </Badge>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* TAB 3: NEARBY NGOS */}
            {activeTab === "ngos" && (
              <section className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Nearby Animal Welfare Organizations</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Verified rescue units, veterinary emergency clinics, and sanctuaries closest to your coordinates.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {ngos.map((ngo) => (
                    <NGOCard key={ngo.id} ngo={ngo} onRequest={() => {}} />
                  ))}
                </div>
              </section>
            )}
          </main>

        </div>
      </div>
      <Footer />
    </div>
  );
}
