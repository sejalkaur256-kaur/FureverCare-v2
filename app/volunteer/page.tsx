"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge, severityTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listRequests } from "@/lib/store";
import { RescueRequest } from "@/lib/types";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { Bike, MapPin, Navigation2, Star, AlertTriangle } from "lucide-react";

export default function VolunteerDashboard() {
  const { user, checked, roleMismatch } = useRequireAuth("volunteer");
  const [requests, setRequests] = useState<RescueRequest[]>([]);

  useEffect(() => {
    function load() {
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Bike size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink-900">
              Welcome, {user?.name?.split(" ")[0] ?? "Volunteer"}
            </h1>
            <p className="text-sm text-gray-500">
              Your assigned rescues and live tracking
            </p>
          </div>
        </div>

        {roleMismatch && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
            <AlertTriangle size={16} />
            You're signed in as {user?.role}. Viewing the Volunteer Dashboard
            anyway for this prototype demo.
          </div>
        )}

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-ink-900">
            Assigned Rescues ({assigned.length})
          </h2>
          {assigned.length === 0 ? (
            <Card className="p-10 text-center text-gray-400">
              No active assignments right now. Accepted NGO requests with a
              volunteer will show up here.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assigned.map((r) => (
                <Card key={r.id} className="flex flex-col gap-3 p-4">
                  <div className="flex gap-3">
                    {r.imageDataUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.imageDataUrl}
                        alt=""
                        className="h-16 w-16 rounded-xl object-cover"
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
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={11} /> {r.address}
                      </p>
                    </div>
                  </div>

                  {r.volunteer && (
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        {r.volunteer.rating}
                      </span>
                      <span>{r.volunteer.vehicle}</span>
                    </div>
                  )}

                  <Badge tone="info" className="w-fit">
                    {r.status}
                  </Badge>

                  <Link href={`/tracking/${r.id}`}>
                    <Button size="sm" className="w-full">
                      <Navigation2 size={14} /> Open Live Tracking
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-ink-900">
            Completed Rescues ({completed.length})
          </h2>
          {completed.length === 0 ? (
            <Card className="p-10 text-center text-gray-400">
              Completed rescues will appear here.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completed.map((r) => (
                <Card key={r.id} className="flex flex-col gap-2 p-4">
                  <p className="font-semibold text-ink-900">
                    {r.analysis.animalType} rescued
                  </p>
                  <p className="text-xs text-gray-500">{r.address}</p>
                  <Badge tone="success" className="w-fit">
                    Completed
                  </Badge>
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
