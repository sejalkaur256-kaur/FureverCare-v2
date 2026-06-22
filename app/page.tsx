import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { HowItWorks } from "@/components/HowItWorks";
import { PLATFORM_STATS } from "@/lib/mock-data";
import {
  Heart,
  Users,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Dog,
} from "lucide-react";

const STAT_ICONS = [Heart, Users, ShieldCheck, Clock];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,88,15,0.25),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.18),transparent_40%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center sm:py-28">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-200 animate-fade-in">
            <Sparkles size={14} /> AI-Powered Rescue, In Real Time
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-6xl animate-fade-in">
            Every Stray Deserves a{" "}
            <span className="text-brand-500">Fast Rescue</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-gray-300 sm:text-lg animate-fade-in">
            Report an injured animal in seconds. Our AI detects the injury,
            finds the nearest rescue team, and lets you track the rescue live —
            just like calling a ride.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-in">
            <Link href="/report">
              <Button size="lg" className="w-full sm:w-auto">
                <Dog size={18} /> Report Injured Animal
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
                View Dashboard <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto -mt-10 grid w-full max-w-7xl grid-cols-1 gap-4 px-6 sm:-mt-14 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM_STATS.map((s, i) => (
          <StatCard key={s.label} label={s.label} value={s.value} icon={STAT_ICONS[i]} />
        ))}
      </section>

      <HowItWorks />

      {/* CTA banner */}
      <section className="mx-auto mb-20 w-full max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 p-8 text-white sm:flex-row sm:p-10">
          <div>
            <h3 className="text-2xl font-bold">Spotted an injured animal?</h3>
            <p className="mt-1 text-brand-50">
              Help is one tap away. Report now and let AI + nearby NGOs do the
              rest.
            </p>
          </div>
          <Link href="/report" className="shrink-0">
            <Button size="lg" variant="secondary" className="bg-white text-brand-600 hover:bg-gray-100">
              Report Now <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
