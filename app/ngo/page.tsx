"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, severityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listRequests, patchRequest, updateStatus, fetchAllRequests } from "@/lib/store";
import { assignVolunteer, NGO_POOL } from "@/lib/mock-data";
import { RescueRequest } from "@/lib/types";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { CheckCircle2, XCircle, MapPin, Building2, AlertTriangle, AlertCircle, Clock, CheckCircle, ShieldAlert, SlidersHorizontal, Activity } from "lucide-react";
import { MetricCard, EmptyState } from "@/components/ui/primitives";
import { ResponseMetricsChart, SeverityDistributionChart } from "@/components/ChartsPreview";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function NGODashboard() {
  const { user, checked, roleMismatch } = useRequireAuth("ngo");
  const [requests, setRequests] = useState<RescueRequest[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [activeSubTab, setActiveSubTab] = useState<"incoming" | "active" | "completed">("incoming");

  useEffect(() => {
    async function load() {
      await fetchAllRequests();
      setRequests(listRequests());
    }
    load();
    window.addEventListener("FureverCare-store-updated", load);
    return () => window.removeEventListener("FureverCare-store-updated", load);
  }, []);

  // Filter lists
  const allIncidents = requests.filter((r) => !rejected.includes(r.id));
  
  const incoming = allIncidents.filter(
    (r) => r.status === "Request Created" && (severityFilter === "all" || r.analysis.severity === severityFilter)
  );

  const active = allIncidents.filter(
    (r) => r.status !== "Request Created" && r.status !== "Completed"
  );

  const completed = allIncidents.filter(
    (r) => r.status === "Completed"
  );

  function accept(req: RescueRequest) {
    // Preserve existing business logic strictly
    patchRequest(req.id, { ngo: req.ngo ?? (NGO_POOL[0] as any) });
    updateStatus(req.id, "NGO Accepted");
    const volunteer = assignVolunteer();
    patchRequest(req.id, { volunteer });
    updateStatus(req.id, "Volunteer Assigned");
  }

  function reject(id: string) {
    setRejected((prev) => [...prev, id]);
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center text-slate-400 font-medium">
          <Clock className="animate-spin text-primary mr-2" size={16} />
          Checking NGO operations session...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary shadow-sm">
              <Building2 size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">NGO Operations Command</h1>
              <p className="text-sm text-slate-500 mt-1">
                {user?.orgName ?? "PawSavers Rescue Trust"} — Emergency Incident Queue & Dispatch
              </p>
            </div>
          </div>
        </div>

        {roleMismatch && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800">
            <AlertTriangle size={15} className="text-amber-600 font-bold" />
            Signed in as {user?.role}. View operations commands simulated for test procedures.
          </div>
        )}

        {/* Stats Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
          <MetricCard title="Pending Dispatches" value={incoming.length} icon={AlertCircle} className="bg-amber-50/20" />
          <MetricCard title="Active Missions" value={active.length} icon={Activity} className="bg-sky-50/20" />
          <MetricCard title="Completed Rescues" value={completed.length} icon={CheckCircle} className="bg-emerald-50/20" />
          <MetricCard title="Avg. Response Time" value="12 min" icon={Clock} />
        </div>

        {/* Double-column Operations Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT: Kanban-inspired Incident Queue & Lists */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filter Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex gap-2.5">
                <button
                  onClick={() => setActiveSubTab("incoming")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                    activeSubTab === "incoming"
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Incoming Queue ({incoming.length})
                </button>
                <button
                  onClick={() => setActiveSubTab("active")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                    activeSubTab === "active"
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Active Cases ({active.length})
                </button>
                <button
                  onClick={() => setActiveSubTab("completed")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                    activeSubTab === "completed"
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Completed ({completed.length})
                </button>
              </div>

              {activeSubTab === "incoming" && (
                <div className="relative flex items-center gap-1.5">
                  <SlidersHorizontal size={13} className="text-slate-400" />
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="text-[10px] font-bold uppercase tracking-wider rounded-lg border border-slate-200 bg-white py-1 pl-2 pr-6 outline-none focus:border-primary appearance-none"
                  >
                    <option value="all">ALL SEVERITIES</option>
                    <option value="High">HIGH</option>
                    <option value="Medium">MEDIUM</option>
                    <option value="Low">LOW</option>
                  </select>
                </div>
              )}
            </div>

            {/* TAB CONTENT: INCOMING */}
            {activeSubTab === "incoming" && (
              <AnimatePresence mode="wait">
                {incoming.length === 0 ? (
                  <EmptyState title="No new incoming requests" description="Citizen reports will automatically sync and populate here." />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {incoming.map((r) => {
                      const isEmergency = r.analysis.severity === "High";
                      return (
                        <motion.div
                          key={r.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={cn(
                            "rounded-2xl border bg-white p-5 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-full",
                            isEmergency ? "border-red-200 ring-2 ring-red-500/5" : "border-slate-200/60"
                          )}
                        >
                          {isEmergency && (
                            <span className="absolute top-0 right-0 rounded-bl-xl bg-red-500 px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-white animate-pulse">
                              EMERGENCY
                            </span>
                          )}

                          <div>
                            <div className="flex gap-4">
                              {r.imageDataUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={r.imageDataUrl} alt="" className="h-16 w-16 rounded-xl object-cover shrink-0" />
                              ) : (
                                <div className="h-16 w-16 rounded-xl bg-slate-100 shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1.5">
                                  <h4 className="font-extrabold text-slate-800 text-sm">{r.analysis.animalType}</h4>
                                  <Badge tone={severityTone(r.analysis.severity)}>{r.analysis.severity}</Badge>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                  {r.analysis.summary}
                                </p>
                              </div>
                            </div>

                            <p className="mt-3 flex items-center gap-1 text-[10px] font-medium text-slate-400 truncate">
                              <MapPin size={11} className="text-primary" /> {r.address}
                            </p>
                          </div>

                          <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2">
                            <Button className="flex-1 font-bold text-xs" size="sm" onClick={() => accept(r)}>
                              Accept Case
                            </Button>
                            <Button className="flex-1 font-bold text-xs border-slate-200 text-slate-600" size="sm" variant="outline" onClick={() => reject(r.id)}>
                              Reject
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            )}

            {/* TAB CONTENT: ACTIVE CASES */}
            {activeSubTab === "active" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {active.length === 0 ? (
                  <EmptyState title="No active cases" description="Accepted rescue dispatches will populate here." />
                ) : (
                  active.map((r) => (
                    <Card key={r.id} className="p-4 border-slate-200 bg-white">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-800 text-sm">{r.analysis.animalType} Rescue</h4>
                        <Badge tone="info">{r.status}</Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-0.5"><MapPin size={11} /> {r.address.split(",")[0]}</p>
                      
                      {r.volunteer && (
                        <div className="mt-3 p-2 bg-slate-50 rounded-lg flex items-center justify-between text-[10px] text-slate-500 font-medium">
                          <span>Dispatch Volunteer: {r.volunteer.name}</span>
                          <span className="text-[9px] uppercase font-bold tracking-wider">{r.volunteer.vehicle.split(" • ")[0]}</span>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT: COMPLETED */}
            {activeSubTab === "completed" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {completed.length === 0 ? (
                  <EmptyState title="No completed rescues" description="Check back once active responders secure animal logistics." />
                ) : (
                  completed.map((r) => (
                    <Card key={r.id} className="p-4 border-slate-200/50 bg-white">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-800 text-sm">{r.analysis.animalType} Rescued</h4>
                        <Badge tone="success">Completed</Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5">{r.address}</p>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Operations Analytics Charts */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-5 border-slate-200/60 bg-white shadow-soft">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Operations Response Metrics</h3>
              <ResponseMetricsChart />
            </Card>

            <Card className="p-5 border-slate-200/60 bg-white shadow-soft">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Severity Breakdown</h3>
              <SeverityDistributionChart />
            </Card>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
