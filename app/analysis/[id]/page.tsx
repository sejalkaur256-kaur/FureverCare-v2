"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnalysisResultCard } from "@/components/AnalysisResultCard";
import { NGOCard } from "@/components/NGOCard";
import { MapView } from "@/components/MapView";
import { Card } from "@/components/ui/card";
import { getRequest, patchRequest, updateStatus } from "@/lib/store";
import { getNearbyNGOs, assignVolunteer } from "@/lib/mock-data";
import { runAIAnalysis } from "@/lib/ai";
import { NGO, RescueRequest } from "@/lib/types";
import { Loader2, MapPinned, BrainCircuit } from "lucide-react";

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [request, setRequest] = useState<RescueRequest | null>(null);
  const [analyzing, setAnalyzing] = useState(true);
  const [stage, setStage] = useState("Loading vision model...");
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
        setStage("Loading MobileNet vision model...");
        await new Promise((res) => setTimeout(res, 300));
        setStage("Classifying animal type...");
        const analysis = await runAIAnalysis(r.imageDataUrl!);
        if (cancelled) return;
        setStage("Scanning photo for injury signals...");
        patchRequest(r.id, { analysis });
        setRequest((prev) => (prev ? { ...prev, analysis } : prev));
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
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center text-gray-400">
          Request not found. Please submit a report first.
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        {analyzing ? (
          <Card className="flex flex-col items-center gap-4 p-16 text-center animate-fade-in">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              <BrainCircuit size={28} className="animate-pulse" />
              <span className="absolute inset-0 rounded-full border-4 border-brand-200 border-t-brand-500 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-ink-900">
              Running AI Injury Detection...
            </h2>
            <p className="max-w-sm text-sm text-gray-500">{stage}</p>
            <p className="max-w-sm text-xs text-gray-400">
              Running MobileNet (TensorFlow.js) on-device and scanning pixel
              data for wound signals — no data leaves your browser.
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-8 animate-fade-in">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <Card className="overflow-hidden">
                  {request.imageDataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={request.imageDataUrl}
                      alt="Reported animal"
                      className="h-56 w-full object-cover"
                    />
                  )}
                  <div className="p-4">
                    <p className="text-xs uppercase text-gray-400">
                      Description
                    </p>
                    <p className="mt-1 text-sm text-ink-900">
                      {request.description}
                    </p>
                    <p className="mt-3 text-xs uppercase text-gray-400">
                      Location
                    </p>
                    <p className="text-sm text-ink-900">{request.address}</p>
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <AnalysisResultCard analysis={request.analysis} />
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <MapPinned size={18} className="text-brand-500" />
                <h2 className="text-xl font-semibold text-ink-900">
                  Nearby Rescue NGOs &amp; Vets
                </h2>
              </div>

              <MapView
                center={request.location}
                className="mb-6 h-72 w-full"
                markers={[
                  {
                    id: "animal",
                    point: request.location,
                    kind: "animal",
                    label: "Reported Animal",
                    active: true,
                  },
                  ...ngos.map((n) => ({
                    id: n.id,
                    point: n.location,
                    kind: "ngo" as const,
                    label: n.name.split(" ").slice(0, 2).join(" "),
                  })),
                ]}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ngos.map((ngo) => (
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
                <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">
                  <Loader2 size={16} className="animate-spin" />
                  Waiting for NGO confirmation — redirecting to live tracking…
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
