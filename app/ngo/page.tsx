"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge, severityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listRequests, patchRequest, updateStatus } from "@/lib/store";
import { assignVolunteer, NGO_POOL } from "@/lib/mock-data";
import { RescueRequest } from "@/lib/types";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { CheckCircle2, XCircle, MapPin, Building2, AlertTriangle } from "lucide-react";

export default function NGODashboard() {
  const { user, checked, roleMismatch } = useRequireAuth("ngo");
  const [requests, setRequests] = useState<RescueRequest[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  useEffect(() => {
    function load() {
      setRequests(listRequests());
    }
    load();
    window.addEventListener("FureverCare-store-updated", load);
    return () => window.removeEventListener("FureverCare-store-updated", load);
  }, []);

  const incoming = requests.filter(
    (r) => r.status === "Request Created" && !rejected.includes(r.id)
  );
  const active = requests.filter(
    (r) => r.status !== "Request Created" && !rejected.includes(r.id)
  );

  function accept(req: RescueRequest) {
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
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <main className="flex flex-1 items-center justify-center text-gray-400">
          Checking your session...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink-900">NGO Dashboard</h1>
            <p className="text-sm text-gray-500">
              {user?.orgName ?? "PawSavers Rescue Trust"} — manage incoming
              rescue requests
            </p>
          </div>
        </div>

        {roleMismatch && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
            <AlertTriangle size={16} />
            You're signed in as {user?.role}. Viewing the NGO Dashboard anyway
            for this prototype demo.
          </div>
        )}

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-ink-900">
            Incoming Requests{" "}
            <span className="text-sm font-normal text-gray-400">
              ({incoming.length})
            </span>
          </h2>

          {incoming.length === 0 ? (
            <Card className="p-10 text-center text-gray-400">
              No new incoming requests. New citizen reports will appear here
              automatically.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {incoming.map((r) => (
                <Card key={r.id} className="flex flex-col gap-3 p-4">
                  <div className="flex gap-3">
                    {r.imageDataUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.imageDataUrl}
                        alt=""
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-ink-900">
                          {r.analysis.animalType}
                        </p>
                        <Badge tone={severityTone(r.analysis.severity)}>
                          {r.analysis.severity}
                        </Badge>
                      </div>
                      <p className="line-clamp-2 text-xs text-gray-500">
                        {r.analysis.summary}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={11} /> {r.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      size="sm"
                      onClick={() => accept(r)}
                    >
                      <CheckCircle2 size={14} /> Accept
                    </Button>
                    <Button
                      className="flex-1"
                      size="sm"
                      variant="outline"
                      onClick={() => reject(r.id)}
                    >
                      <XCircle size={14} /> Reject
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-ink-900">
            Active &amp; Past Requests{" "}
            <span className="text-sm font-normal text-gray-400">
              ({active.length})
            </span>
          </h2>
          {active.length === 0 ? (
            <Card className="p-10 text-center text-gray-400">
              No active requests yet.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((r) => (
                <Card key={r.id} className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-ink-900">
                      {r.analysis.animalType}
                    </p>
                    <Badge tone="info">{r.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">{r.address}</p>
                  {r.volunteer && (
                    <p className="text-xs text-gray-400">
                      Volunteer: {r.volunteer.name}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
