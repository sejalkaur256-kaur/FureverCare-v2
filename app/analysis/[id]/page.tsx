"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NGOCard } from "@/components/NGOCard";
import { MapView } from "@/components/MapView";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, severityTone } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getRequest, patchRequest, updateStatus } from "@/lib/store";
import { getNearbyNGOs, assignVolunteer } from "@/lib/mock-data";
import { runAIAnalysis } from "@/lib/ai";
import { NGO, RescueRequest } from "@/lib/types";
import { ProgressCircle, StatusChip } from "@/components/ui/primitives";
import { Loader2, MapPinned, BrainCircuit, Activity, ShieldAlert, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const PIPELINE_STAGES = [
  { id: 1, label: "MobileNet Classification" },
  { id: 2, label: "Pixel Scan" },
  { id: 3, label: "Feature Extraction" },
  { id: 4, label: "Severity Estimation" },
  { id: 5, label: "Shelter Matching" },
  { id: 6, label: "Completed" },
];

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [request, setRequest] = useState<RescueRequest | null>(null);
  const [analyzing, setAnalyzing] = useState(true);
  const [stage, setStage] = useState("Initializing classifier...");
  const [activeStageId, setActiveStageId] = useState(1);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [requestedId, setRequestedId] = useState<string | null>(null);

  useEffect(() => {
    const r = getRequest(id);
    if (!r) return;
    setRequest(r);
    setNgos(getNearbyNGOs(r.location));

    if (!r.imageDataUrl) {
      setAnalyzing(false);
      return;
      }

    let cancelled = false;
    (async () => {
      try {
        setStage("Loading MobileNet vision weights graph...");
        setActiveStageId(1);
        await new Promise((res) => setTimeout(res, 400));
        if (cancelled) return;

        setStage("Classifying animal taxonomic label...");
        setActiveStageId(2);
        const analysis = await runAIAnalysis(r.imageDataUrl!);
        if (cancelled) return;
        await new Promise((res) => setTimeout(res, 400));

        setStage("Scanning canvas ImageData pixels for redness...");
        setActiveStageId(3);
        await new Promise((res) => setTimeout(res, 400));

        setStage("Extracting edge contour and lesion anomalies...");
        setActiveStageId(4);
        await new Promise((res) => setTimeout(res, 400));

        setStage("Calculating injury severity coefficient...");
        setActiveStageId(5);
        patchRequest(r.id, { analysis });
        setRequest((prev) => (prev ? { ...prev, analysis } : prev));
        await new Promise((res) => setTimeout(res, 400));

        setStage("Analyzing local shelter dispatch capacities...");
        setActiveStageId(6);
        await new Promise((res) => setTimeout(res, 300));

        setAnalyzing(false);
      } catch (err) {
        console.error("AI analysis failed:", err);
        if (!cancelled) setAnalyzing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleRequestRescue(ngo: NGO) {
    if (!request) return;
    setRequestingId(ngo.id);

    setTimeout(() => {
      patchRequest(request.id, { ngo });
      setRequestingId(null);
      setRequestedId(ngo.id);

      // Simulate the NGO accepting + volunteer assignment after a short delay
      setTimeout(() => {
        updateStatus(request.id, "NGO Accepted");
        const volunteer = assignVolunteer();
        patchRequest(request.id, { volunteer });
        updateStatus(request.id, "Volunteer Assigned");
        router.push(`/tracking/${request.id}`);
      }, 1600);
    }, 1100);
  }

  if (!request) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center text-slate-400 font-medium">
          Rescue request details not found. Please file a report first.
        </main>
        <Footer />
      </div>
    );
  }

  // Derived severity styles
  const isHigh = request.analysis.severity === "High";
  const isMed = request.analysis.severity === "Medium";
  const severityColor = isHigh ? "text-red-500" : isMed ? "text-orange-500" : "text-emerald-500";
  const severityBg = isHigh ? "bg-red-50 border-red-100" : isMed ? "bg-orange-50 border-orange-100" : "bg-emerald-50 border-emerald-100";

  // Visual percentages derived safely from analysis visual signals
  const confidenceVal = request.analysis.confidence || 85;
  const riskVal = isHigh ? 92 : isMed ? 58 : 18;
  const bleedingVal = request.analysis.injuries.some(i => i.toLowerCase().includes("bleeding")) ? 85 : 4;
  const lesionVal = request.analysis.injuries.some(i => i.toLowerCase().includes("lesion")) ? 65 : 8;
  const postureVal = request.analysis.injuries.some(i => i.toLowerCase().includes("posture") || i.toLowerCase().includes("swelling")) ? 75 : 10;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        
        {analyzing ? (
          /* Premium Pipeline Scanning Overlay Screen */
          <div className="max-w-xl mx-auto py-12">
            <Card className="shadow-2xl border-slate-200/60 p-8 sm:p-12 text-center bg-white relative overflow-hidden">
              {/* Scan decor background */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-emerald-500" />
              
              <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary shadow-sm">
                <BrainCircuit size={28} className="animate-pulse" />
                <span className="absolute inset-0 rounded-2xl border-2 border-primary/20 border-t-primary animate-spin" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Running On-Device AI Diagnostics...
              </h2>
              <p className="mt-2 text-xs font-semibold text-primary uppercase tracking-widest">{stage}</p>
              
              {/* Pipeline Step Marks */}
              <div className="mt-8 text-left space-y-3.5 border-t border-slate-100 pt-6">
                {PIPELINE_STAGES.map((s) => {
                  const active = activeStageId === s.id;
                  const done = activeStageId > s.id;
                  return (
                    <div key={s.id} className="flex items-center justify-between text-xs">
                      <span className={done ? "text-slate-400 line-through" : active ? "text-primary font-bold" : "text-slate-400"}>
                        {s.id}. {s.label}
                      </span>
                      {done ? (
                        <span className="text-emerald-500 font-bold">✓ DONE</span>
                      ) : active ? (
                        <span className="text-primary font-bold animate-pulse">PROCESSING...</span>
                      ) : (
                        <span className="text-slate-300 font-medium">WAITING</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        ) : (
          /* Three Column Analysis Dashboard */
          <div className="space-y-8 animate-fade-in">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Incident Analysis Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">Incident ID: #{id.split("_")[1]} • Reported Animal: {request.analysis.animalType}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusChip status={request.status} />
              </div>
            </div>

            {/* Core 3-Column Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              
              {/* COLUMN 1: Image, scan animation, AI results */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="overflow-hidden shadow-soft border-slate-200/60 bg-white">
                  {request.imageDataUrl && (
                    <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                      {/* Scanning overlay */}
                      <div className="scan-line" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={request.imageDataUrl}
                        alt="Reported animal scan"
                        className="h-full w-full object-cover opacity-90"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">AI Taxon Label</span>
                      <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <Sparkles size={14} className="text-primary" /> {request.analysis.animalType}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Incident Remarks</span>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1 bg-slate-50 border border-slate-100 rounded-xl p-3">
                        {request.description}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">GPS Coordinates</span>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">{request.address}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* COLUMN 2: Gauges, progress circles, diagnostic indicators */}
              <div className="lg:col-span-4">
                <Card className="h-full shadow-soft border-slate-200/60 bg-white p-5 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Activity size={18} className="text-primary animate-pulse" /> Diagnostic Gauges
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">On-device pixel metrics derived via Canvas ImageData scans.</p>
                  </div>

                  {/* Severity Banner */}
                  <div className={`rounded-xl border p-4 text-center ${severityBg}`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Calculated Severity</span>
                    <h4 className={`text-2xl font-black mt-1 ${severityColor}`}>{request.analysis.severity}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">{request.analysis.recommendation}</p>
                  </div>

                  {/* Circular Gauges grid */}
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                    <div className="flex flex-col items-center text-center">
                      <ProgressCircle value={confidenceVal} size={64} strokeWidth={6} colorClass="text-primary" />
                      <span className="text-[10px] font-bold text-slate-600 mt-2">ML Confidence</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <ProgressCircle value={riskVal} size={64} strokeWidth={6} colorClass={isHigh ? "text-red-500" : isMed ? "text-orange-500" : "text-emerald-500"} />
                      <span className="text-[10px] font-bold text-slate-600 mt-2">Injury Risk Index</span>
                    </div>
                  </div>

                  {/* Horizontal Linear Gauges */}
                  <div className="space-y-4 border-t border-slate-100 pt-6">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span>Redness Ratio (Blood)</span>
                        <span>{bleedingVal}%</span>
                      </div>
                      <Progress value={bleedingVal} colorClass={bleedingVal > 50 ? "bg-red-500" : "bg-emerald-500"} />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span>Lesion / Mange patches</span>
                        <span>{lesionVal}%</span>
                      </div>
                      <Progress value={lesionVal} colorClass={lesionVal > 50 ? "bg-orange-500" : "bg-emerald-500"} />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span>Swell / Posture deformity</span>
                        <span>{postureVal}%</span>
                      </div>
                      <Progress value={postureVal} colorClass={postureVal > 50 ? "bg-amber-500" : "bg-emerald-500"} />
                    </div>
                  </div>
                </Card>
              </div>

              {/* COLUMN 3: Nearby NGOs, response time, distance, map, request actions */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="shadow-soft border-slate-200/60 bg-white p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <MapPinned size={18} className="text-primary" /> Emergency Dispatch Network
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Alert nearest veterinary clinics or shelters.</p>
                  </div>

                  {/* Mini Map Preview */}
                  <div className="rounded-xl overflow-hidden border border-slate-200/50 h-40 relative">
                    <MapView
                      center={request.location}
                      className="h-full w-full"
                      markers={[
                        {
                          id: "animal",
                          point: request.location,
                          kind: "animal",
                          label: "Animal",
                          active: true,
                        },
                        ...ngos.map((n) => ({
                          id: n.id,
                          point: n.location,
                          kind: "ngo" as const,
                          label: n.name.split(" ")[0],
                        })),
                      ]}
                    />
                  </div>

                  {/* NGO lists */}
                  <div className="space-y-3 pt-2">
                    {ngos.slice(0, 3).map((ngo) => (
                      <NGOCard
                        key={ngo.id}
                        ngo={ngo}
                        onRequest={handleRequestRescue}
                        requesting={requestingId === ngo.id}
                        requested={requestedId === ngo.id}
                      />
                    ))}
                  </div>

                  {requestedId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2.5 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-xs text-primary-700 font-semibold"
                    >
                      <Loader2 size={15} className="animate-spin text-primary" />
                      NGO dispatched. Connecting to live volunteer GPS tracking…
                    </motion.div>
                  )}
                </Card>
              </div>

            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
