"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { HowItWorks } from "@/components/HowItWorks";
import { MetricCard, AnimatedCounter, GlassPanel } from "@/components/ui/primitives";
import {
  SeverityDistributionChart,
  MonthlyRescuesChart,
  VolunteerActivityChart,
} from "@/components/ChartsPreview";
import {
  Heart,
  Users,
  Building2,
  Clock,
  ArrowRight,
  Sparkles,
  Dog,
  ShieldAlert,
  MapPin,
  TrendingUp,
  Brain,
  Navigation,
  Activity,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const STATS = [
  { label: "Animals Rescued", value: 4820, suffix: "+", icon: Heart },
  { label: "Active Volunteers", value: 1340, suffix: "+", icon: Users },
  { label: "Partner Shelters & NGOs", value: 210, suffix: "+", icon: Building2 },
  { label: "Cities Covered", value: 45, suffix: "+", icon: Clock },
];

const FEATURES = [
  {
    icon: Brain,
    title: "AI Injury Detection",
    desc: "Runs MobileNet v2 client-side in seconds. Detects animal types, open wounds, skin lesions, and posture irregularities.",
  },
  {
    icon: Activity,
    title: "Severity Assessment",
    desc: "Calculates real-time injury risk score and emergency levels instantly based on redness ratios and dark spot density.",
  },
  {
    icon: Navigation,
    title: "Real-Time Tracking",
    desc: "Live map telemetry tracks the rescue vehicle's dispatch, transit, and arrival progress step-by-step.",
  },
  {
    icon: Users,
    title: "Volunteer Dispatch",
    desc: "Coordinates active local rescue networks automatically. Instantly routes assignments to the closest responder.",
  },
  {
    icon: Building2,
    title: "Nearby Shelter Discovery",
    desc: "Identifies nearby verified veterinary hospitals, NGO rescue trusts, and animal sanctuaries within seconds.",
  },
  {
    icon: Award,
    title: "Emergency Routing",
    desc: "Calculates the fastest route from volunteer location, to the injured animal, and to the nearest emergency shelter.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Reported a stray dog with an open leg wound near Rajpur Road. The AI classified it as High Severity. Within 12 minutes, a volunteer arrived. Amazing response!",
    author: "Rohan Kapoor",
    role: "Dehradun Citizen",
    avatar: "RK",
    color: "bg-teal-500",
  },
  {
    quote: "The incoming priority queue helps us dispatch our rescue vans immediately to high-risk cases. FureverCare AI has eliminated delayed reports and save-life errors.",
    author: "Dr. Anjali Sen",
    role: "Lead Vet, PawSavers Trust",
    avatar: "AS",
    color: "bg-emerald-500",
  },
  {
    quote: "Being a rescue volunteer on the platform is gamified and transparent. Live GPS tracking allows citizens to know exactly when we will arrive.",
    author: "Vikram Rathore",
    role: "Active Volunteer",
    avatar: "VR",
    color: "bg-orange-500",
  },
];

export default function LandingPage() {
  const [activeChartTab, setActiveChartTab] = useState<"rescues" | "severity" | "volunteers">("rescues");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
        {/* Soft Radial Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,164,0.18),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(34,197,94,0.12),transparent_45%)]" />

        {/* Diagonal Wave Pattern Decor */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <motion.span
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-semibold text-primary-400"
              >
                <Sparkles size={13} className="animate-pulse" /> AI-Powered Rescue Network
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                AI Powered Rescue Network for <span className="text-primary-400">Injured Animals</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-lg leading-relaxed text-slate-300 max-w-2xl"
              >
                Connecting citizens, shelters, NGOs and volunteers through intelligent emergency response. Spot an animal in distress, snap a photo, and let on-device computer vision orchestrate the rescue.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <Link href="/report" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
                    <Dog size={18} /> Report Animal
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-slate-700 bg-slate-800/40 text-white hover:bg-slate-800 sm:w-auto flex items-center justify-center gap-2"
                  >
                    Explore Platform <ArrowRight size={16} />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right Illustration / Floating Cards area */}
            <div className="lg:col-span-5 relative h-[380px] sm:h-[450px]">
              {/* Dashboard Preview Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                className="absolute inset-0 rounded-2xl border border-slate-700/60 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Live AI Pipeline Feed</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-slate-900/80 p-3.5 border border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Dog size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">Request #512019</p>
                        <p className="text-[10px] text-slate-400">Dog Classified • Dehradun</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-bold text-red-400 border border-red-500/20">HIGH SEVERITY</span>
                  </div>

                  <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-300">TensorFlow.js Pixel Scan</span>
                      <span className="text-slate-400">Done</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[85%]" />
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800/80 text-[10px] text-slate-400">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles size={11} className="text-primary-400 animate-pulse" />
                      <span className="font-semibold text-slate-200">Visual Wounds Detected</span>
                    </div>
                    <p className="text-[9px] leading-relaxed">
                      Bleeding / Open Wound (92% confidence) • Swelling on left rear leg joint (84% confidence).
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Overlapping Floating Cards */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.5 }}
                className="absolute top-10 -right-4 rounded-xl border border-slate-800 bg-slate-900 p-3.5 shadow-2xl flex items-center gap-3"
              >
                <div className="h-9 w-9 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <Heart size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">NGO Alerted</p>
                  <p className="text-[9px] text-slate-400">PawSavers accepted rescue</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.6 }}
                className="absolute bottom-6 -left-4 rounded-xl border border-slate-800 bg-slate-900 p-3.5 shadow-2xl flex items-center gap-3"
              >
                <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Users size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Volunteer Assigned</p>
                  <p className="text-[9px] text-slate-400">Vikram (Bike) is on route</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section className="relative z-10 mx-auto -mt-12 w-full max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, type: "spring" }}
              className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-soft hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary mb-3">
                <s.icon size={18} />
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                  <AnimatedCounter value={s.value} />
                  {s.suffix}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Core Capabilities</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              An intelligent, responsive emergency infrastructure
            </h2>
            <p className="mt-4 text-base text-slate-500">
              Modern solutions tailored for community-centric animal welfare operations.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={itemVariants}
                  className="group rounded-2xl border border-slate-200/50 bg-white p-6 shadow-soft hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-primary-50 group-hover:text-primary mb-5">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works (Timeline) Section */}
      <HowItWorks />

      {/* AI Pipeline Demonstration Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
            {/* Left explanation */}
            <div className="lg:col-span-6 mb-10 lg:mb-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary">
                <Brain size={14} /> Neural Engineering
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                On-device Computer Vision
              </h2>
              <p className="mt-4 text-slate-500 leading-relaxed text-sm">
                FureverCare AI executes local ML execution completely within the citizen's browser using Google's MobileNet classifier running on TensorFlow.js. No photos are sent to server APIs for diagnostics.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">100% Data Privacy</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Pixel analysis, boundary classification, and redness detection execute strictly in browser memory.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Redness Ratio Diagnosis</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Inspects raw RGB channels on downsampled canvas components to measure blood indices and prioritize open wounds.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right illustration / Mock pipeline graph */}
            <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl text-white">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pipeline Execution Log</h4>
              <div className="space-y-3 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-primary-400">INIT: TensorFlow.js engine</span>
                  <span className="text-emerald-400">READY</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">LOAD: MobileNet v2 weight graph</span>
                  <span className="text-emerald-400">22.4 MB CACHED</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">EXEC: classifyAnimal(img_canvas)</span>
                  <span className="text-slate-300">"Labrador Retriever" (94% prob)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">CV_PASS: analyzeInjurySignals(canvas)</span>
                  <span className="text-primary-400">rednessRatio: 0.081</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">CV_PASS: darkSpotRatio / edgeDistortion</span>
                  <span className="text-slate-300">dark: 0.12, edge: 0.28</span>
                </div>
                <div className="flex justify-between font-bold text-slate-100">
                  <span>OUT: severityScore</span>
                  <span className="text-red-400">17.82 - HIGH SEVERITY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics & Statistics Section */}
      <section className="py-24 sm:py-32 bg-slate-100/40 border-y border-slate-200/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">System Analytics</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Platform Activity &amp; Live Stats
            </h2>
            <p className="mt-4 text-sm text-slate-500">
              Visualizing incident severity, rescue distributions, and responder performance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Chart controller panel */}
            <div className="lg:col-span-4 space-y-3 flex flex-col justify-center">
              <button
                onClick={() => setActiveChartTab("rescues")}
                className={`flex items-center gap-3 w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  activeChartTab === "rescues"
                    ? "bg-white border-primary/20 shadow-soft text-primary font-semibold"
                    : "border-transparent text-slate-600 hover:bg-slate-100/80"
                }`}
              >
                <TrendingUp size={16} />
                <div>
                  <p className="text-sm">Monthly Rescue Trends</p>
                  <p className="text-[10px] text-slate-400 font-normal">Track total cases rescued over time</p>
                </div>
              </button>
              <button
                onClick={() => setActiveChartTab("severity")}
                className={`flex items-center gap-3 w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  activeChartTab === "severity"
                    ? "bg-white border-primary/20 shadow-soft text-primary font-semibold"
                    : "border-transparent text-slate-600 hover:bg-slate-100/80"
                }`}
              >
                <ShieldAlert size={16} />
                <div>
                  <p className="text-sm">Severity Distribution</p>
                  <p className="text-[10px] text-slate-400 font-normal">Emergency vs minor injury ratios</p>
                </div>
              </button>
              <button
                onClick={() => setActiveChartTab("volunteers")}
                className={`flex items-center gap-3 w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  activeChartTab === "volunteers"
                    ? "bg-white border-primary/20 shadow-soft text-primary font-semibold"
                    : "border-transparent text-slate-600 hover:bg-slate-100/80"
                }`}
              >
                <Users size={16} />
                <div>
                  <p className="text-sm">Volunteer Activity</p>
                  <p className="text-[10px] text-slate-400 font-normal">Daily active responders metrics</p>
                </div>
              </button>
            </div>

            {/* Chart display panel */}
            <div className="lg:col-span-8 bg-white border border-slate-200/50 rounded-2xl p-6 shadow-soft flex items-center justify-center min-h-[300px]">
              {activeChartTab === "rescues" && <MonthlyRescuesChart />}
              {activeChartTab === "severity" && <SeverityDistributionChart />}
              {activeChartTab === "volunteers" && <VolunteerActivityChart />}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Testimonials</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Trusted by rescuers, NGOs, and citizens
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-soft relative flex flex-col justify-between"
              >
                <p className="text-sm italic text-slate-600 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className={`h-9 w-9 rounded-full ${t.color} text-white font-bold flex items-center justify-center text-xs shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{t.author}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NGO Partners Logos Section */}
      <section className="py-12 border-t border-slate-200/50 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">Our Partner Rescue Coalitions</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            <span className="text-base font-bold text-slate-700 tracking-tight">PawSavers Rescue Trust</span>
            <span className="text-base font-bold text-slate-700 tracking-tight">Stray Hearts Dehradun</span>
            <span className="text-base font-bold text-slate-700 tracking-tight">Second Chance Shelter</span>
            <span className="text-base font-bold text-slate-700 tracking-tight">City Care Vet Group</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto mb-24 w-full max-w-7xl px-6">
        <GlassPanel className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-600 p-8 sm:p-12 text-white flex flex-col sm:flex-row justify-between items-center gap-6 border-none shadow-2xl">
          {/* Subtle light bubble decor */}
          <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative z-10 text-center sm:text-left">
            <h3 className="text-2xl font-bold tracking-tight">Spotted an injured stray animal?</h3>
            <p className="mt-2 text-sm text-primary-50 max-w-xl">
              Do not wait. Snap a photo now to run automatic on-device diagnostics and dispatch nearby emergency rescue units in real time.
            </p>
          </div>
          <Link href="/report" className="relative z-10 shrink-0 w-full sm:w-auto">
            <Button size="lg" className="w-full bg-white text-primary hover:bg-slate-50 font-bold border-none shadow-lg">
              Report Now <ArrowRight size={16} />
            </Button>
          </Link>
        </GlassPanel>
      </section>

      <Footer />
    </div>
  );
}
