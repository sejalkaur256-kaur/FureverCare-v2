"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhotoUpload } from "@/components/PhotoUpload";
import { MapPin, Loader2, Sparkles, Navigation } from "lucide-react";
import { DEFAULT_LOCATION, randomId } from "@/lib/mock-data";
import { GeoPoint, RescueRequest } from "@/lib/types";
import { saveRequest } from "@/lib/store";

export default function ReportAnimalPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function captureLocation() {
    setLocating(true);
    if (!navigator.geolocation) {
      setTimeout(() => {
        setLocation(DEFAULT_LOCATION);
        setAddress("Rajpur Road area, Dehradun, Uttarakhand (simulated)");
        setLocating(false);
      }, 900);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setAddress("Current location captured via GPS");
        setLocating(false);
      },
      () => {
        setLocation(DEFAULT_LOCATION);
        setAddress("Rajpur Road area, Dehradun, Uttarakhand (simulated)");
        setLocating(false);
      },
      { timeout: 5000 }
    );
  }

  function handleSubmit() {
    if (!photo || !location) return;
    setSubmitting(true);

    const id = randomId("req");
    const pendingAnalysis = {
      animalType: "Analyzing...",
      injuries: [],
      severity: "Low" as const,
      emergency: false,
      confidence: 0,
      summary: "AI analysis in progress.",
      recommendation: "Pending",
    };
    const request: RescueRequest = {
      id,
      createdAt: new Date().toISOString(),
      imageDataUrl: photo,
      description: description || "No description provided.",
      location,
      address: address || "Location captured",
      analysis: pendingAnalysis,
      status: "Request Created",
      reporterName: "You",
      timeline: [{ status: "Request Created", time: new Date().toISOString() }],
    };

    saveRequest(request);

    setTimeout(() => {
      router.push(`/analysis/${id}`);
    }, 1200);
  }

  const canSubmit = !!photo && !!location && !submitting;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">
            Report an Injured Animal
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload a photo, share a few details, and we'll get help moving.
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>1. Photo of the animal</CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoUpload preview={photo} onChange={setPhoto} />
          </CardContent>

          <CardHeader>
            <CardTitle>2. Short description</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. A dog with a visible leg injury near the bus stop, seems unable to walk..."
              className="min-h-[100px] w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </CardContent>

          <CardHeader>
            <CardTitle>3. Location</CardTitle>
          </CardHeader>
          <CardContent>
            {location ? (
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 text-emerald-700">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <div>
                    <p className="text-sm font-medium">{address}</p>
                    <p className="text-xs opacity-70">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={captureLocation}>
                  Update
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={captureLocation}
                disabled={locating}
              >
                {locating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Navigation size={16} />
                )}
                {locating ? "Capturing GPS location..." : "Capture Current Location"}
              </Button>
            )}
          </CardContent>

          <CardContent>
            <Button
              className="w-full"
              size="lg"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Submit & Run AI Analysis
                </>
              )}
            </Button>
            {(!photo || !location) && (
              <p className="mt-2 text-center text-xs text-gray-400">
                Add a photo and capture location to continue.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
