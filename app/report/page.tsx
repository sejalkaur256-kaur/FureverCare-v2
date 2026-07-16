"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhotoUpload } from "@/components/PhotoUpload";
import { MapPin, Loader2, Sparkles, Navigation, ArrowLeft, ArrowRight, Dog, Heart, CheckCircle2, ChevronRight } from "lucide-react";
import { DEFAULT_LOCATION, randomId } from "@/lib/mock-data";
import { GeoPoint, RescueRequest } from "@/lib/types";
import { saveRequest } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Animal Details" },
  { id: 2, label: "Photo Upload" },
  { id: 3, label: "Description" },
  { id: 4, label: "Location" },
  { id: 5, label: "Review" },
];

const ANIMAL_HINTS = [
  { key: "Dog", label: "Dog", icon: "🐶" },
  { key: "Cat", label: "Cat", icon: "🐱" },
  { key: "Cow", label: "Cow / Cattle", icon: "🐮" },
  { key: "Goat", label: "Goat / Sheep", icon: "🐐" },
  { key: "Bird", label: "Bird", icon: "🐦" },
  { key: "Other", label: "Other / Unknown", icon: "🐾" },
];

export default function ReportAnimalPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [animalHint, setAnimalHint] = useState("Dog");
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

  async function handleSubmit() {
    if (!photo || !location) return;
    setSubmitting(true);

    const id = randomId("req");
    const pendingAnalysis = {
      animalType: animalHint || "Analyzing...",
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

    await saveRequest(request);

    setTimeout(() => {
      router.push(`/analysis/${id}`);
    }, 1200);
  }

  // Step Navigations & Valdation checks
  const isStepValid = (stepNum: number) => {
    if (stepNum === 1) return !!animalHint;
    if (stepNum === 2) return !!photo;
    if (stepNum === 3) return true; // Description is optional
    if (stepNum === 4) return !!location;
    return true;
  };

  const handleNext = () => {
    if (isStepValid(activeStep) && activeStep < 5) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const progressPercentage = (activeStep / STEPS.length) * 100;
  const canSubmit = !!photo && !!location && !submitting;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Report an Injured Animal
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Provide the emergency details. Our system will analyze the photo locally and match nearby shelters.
          </p>
        </div>

        {/* Wizard Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s) => {
              const active = activeStep === s.id;
              const done = activeStep > s.id;
              return (
                <div key={s.id} className="flex flex-col items-center flex-1 relative">
                  {/* Visual Node */}
                  <div
                    onClick={() => isStepValid(s.id - 1) && s.id <= activeStep && setActiveStep(s.id)}
                    className={cn(
                      "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-bold transition-all border",
                      active && "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105",
                      done && "bg-emerald-50 text-emerald-600 border-emerald-200",
                      !active && !done && "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {done ? "✓" : s.id}
                  </div>
                  {/* Label */}
                  <span className={cn("mt-2 text-[10px] font-bold uppercase tracking-wider hidden sm:block", active ? "text-slate-900" : "text-slate-400")}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-slate-200/50 rounded-full mt-4 overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Wizard Form Container */}
        <Card className="shadow-soft overflow-hidden border-slate-200/60">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* STEP 1: Animal Details */}
              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">What animal are you reporting?</h3>
                    <p className="text-xs text-slate-500 mt-1">Provide a raw guess. The AI pipeline will refine and verify the classification during analysis.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {ANIMAL_HINTS.map((a) => {
                      const active = animalHint === a.key;
                      return (
                        <button
                          key={a.key}
                          type="button"
                          onClick={() => setAnimalHint(a.key)}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200 bg-white",
                            active
                              ? "border-primary text-primary ring-2 ring-primary/10 shadow-sm"
                              : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          )}
                        >
                          <span className="text-2xl">{a.icon}</span>
                          <span className="text-xs font-semibold">{a.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Photo Upload */}
              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Upload a Photo</h3>
                    <p className="text-xs text-slate-500 mt-1">A clear photo of the injuries is critical for the client-side TensorFlow.js vision diagnostic scans.</p>
                  </div>
                  <PhotoUpload preview={photo} onChange={setPhoto} />
                </motion.div>
              )}

              {/* STEP 3: Description */}
              {activeStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Describe the situation</h3>
                    <p className="text-xs text-slate-500 mt-1">Mention any details about behavior, visibility, or exact location markers that could help the NGO responder.</p>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g. Stray dog with bleeding front paw near the public park bus shelter, seems in pain but not aggressive..."
                    className="min-h-[120px] w-full resize-none rounded-xl border border-slate-200 p-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 bg-slate-50/50"
                  />
                </motion.div>
              )}

              {/* STEP 4: Location Capture */}
              {activeStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Capture Location</h3>
                    <p className="text-xs text-slate-500 mt-1">GPS coordinates help nearby rescue units calculate distance metrics and route navigation paths.</p>
                  </div>
                  {location ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-emerald-800">
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-bold">{address}</p>
                          <p className="text-xs text-emerald-600/80 font-medium mt-0.5">
                            Latitude: {location.lat.toFixed(5)}, Longitude: {location.lng.toFixed(5)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={captureLocation} className="text-emerald-700 hover:bg-emerald-100">
                          Recapture GPS
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 border-slate-200 bg-white hover:bg-slate-50"
                      onClick={captureLocation}
                      disabled={locating}
                    >
                      {locating ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-primary" /> Capturing location via GPS...
                        </>
                      ) : (
                        <>
                          <Navigation size={16} className="text-primary" /> Capture Current Location
                        </>
                      )}
                    </Button>
                  )}
                  {/* Severity Guidance Card */}
                  <div className="rounded-xl border border-slate-200/50 bg-slate-50/50 p-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Diagnostic Guidance</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Wounds with heavy bleeding are automatically classified as high priority. Always prioritize personal safety and do not approach hostile strays.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: Review & Submit */}
              {activeStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Review Report</h3>
                    <p className="text-xs text-slate-500 mt-1">Ensure the captured parameters are correct before initiating the neural analysis pipeline.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {photo && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-48">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo} alt="Report preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="space-y-3 text-xs text-slate-600">
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-wider block">Estimated Animal</span>
                        <span className="text-sm font-semibold text-slate-800">{animalHint}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-wider block">Incident Location</span>
                        <span className="text-sm font-semibold text-slate-800">{address}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-wider block">Details / Remarks</span>
                        <p className="text-slate-500 leading-relaxed mt-0.5">{description || "No description provided."}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-primary to-primary-600 font-bold"
                    size="lg"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin text-white mr-2" /> Initializing local MobileNet pipeline...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} className="text-white mr-2" /> Submit &amp; Run AI Diagnostics
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          {/* Stepper Navigation buttons */}
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={activeStep === 1 || submitting}
              className="border-slate-200 text-slate-600"
            >
              <ArrowLeft size={15} /> Back
            </Button>

            {activeStep < 5 ? (
              <Button
                size="sm"
                onClick={handleNext}
                disabled={!isStepValid(activeStep)}
                className="bg-primary text-white"
              >
                Next <ChevronRight size={15} />
              </Button>
            ) : null}
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
