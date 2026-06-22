"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge, severityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listRequests } from "@/lib/store";
import { getNearbyNGOs, DEFAULT_LOCATION } from "@/lib/mock-data";
import { RescueRequest } from "@/lib/types";
import { NGOCard } from "@/components/NGOCard";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { PlusCircle, Inbox, MapPin, AlertTriangle } from "lucide-react";

export default function CitizenDashboard() {
  const { user, checked, roleMismatch } = useRequireAuth("citizen");
  const [requests, setRequests] = useState<RescueRequest[]>([]);

  useEffect(() => {
    function load() {
      setRequests(listRequests());
    }
    load();
    window.addEventListener("FureverCare-store-updated", load);
    return () => window.removeEventListener("FureverCare-store-updated", load);
  }, []);

  const ngos = getNearbyNGOs(DEFAULT_LOCATION).slice(0, 3);

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
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink-900">
              Welcome, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-sm text-gray-500">
              Track your rescue reports and discover nearby help.
            </p>
          </div>
          <Link href="/report">
            <Button>
              <PlusCircle size={16} /> Report Animal
            </Button>
          </Link>
        </div>

        {roleMismatch && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
            <AlertTriangle size={16} />
            You're signed in as {user?.role}. Viewing the Citizen Dashboard
            anyway for this prototype demo.
          </div>
        )}

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-ink-900">
            Your Rescue Requests
          </h2>
          {requests.length === 0 ? (
            <Card className="flex flex-col items-center gap-3 p-12 text-center text-gray-400">
              <Inbox size={32} />
              <p>No rescue requests yet.</p>
              <Link href="/report">
                <Button size="sm" variant="outline">
                  Report your first animal
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {requests.map((r) => (
                <Link key={r.id} href={`/tracking/${r.id}`}>
                  <Card className="flex h-full flex-col gap-3 p-4 transition-shadow hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      {r.imageDataUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.imageDataUrl}
                          alt=""
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-xl bg-gray-100" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-ink-900">
                          {r.analysis.animalType}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={11} /> {r.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge tone={severityTone(r.analysis.severity)}>
                        {r.analysis.severity} severity
                      </Badge>
                      <Badge tone="info">{r.status}</Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-ink-900">
            Nearby Rescue Organizations
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ngos.map((ngo) => (
              <NGOCard key={ngo.id} ngo={ngo} onRequest={() => {}} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
