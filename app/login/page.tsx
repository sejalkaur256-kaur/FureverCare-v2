"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Role, ROLE_HOME, ROLE_LABEL } from "@/lib/auth";
import { signIn } from "next-auth/react";
import { User, Building2, Bike, LogIn, ShieldCheck, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ROLES: { key: Role; label: string; icon: typeof User; desc: string; color: string }[] = [
  {
    key: "citizen",
    label: "Citizen",
    icon: User,
    desc: "Report injured animals and track active rescues",
    color: "from-teal-500/10 to-teal-500/5 text-teal-600 border-teal-200/50",
  },
  {
    key: "ngo",
    label: "NGO / Shelter",
    icon: Building2,
    desc: "Coordinate rescue dispatches & manage emergency clinics",
    color: "from-sky-500/10 to-sky-500/5 text-sky-600 border-sky-200/50",
  },
  {
    key: "volunteer",
    label: "Volunteer",
    icon: Bike,
    desc: "View assigned routes & update live tracking status",
    color: "from-orange-500/10 to-orange-500/5 text-orange-600 border-orange-200/50",
  },
];

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = (params.get("role") as Role) || "citizen";

  const [role, setRole] = useState<Role>(
    ROLES.some((r) => r.key === initialRole) ? initialRole : "citizen"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill some demo variables based on role selection
  useEffect(() => {
    if (role === "citizen") {
      setName("Aarav Sharma");
      setEmail("aarav@gmail.com");
    } else if (role === "ngo") {
      setName("Dr. Anjali Sen");
      setEmail("contact@pawsavers.org");
      setOrgName("PawSavers Rescue Trust");
    } else if (role === "volunteer") {
      setName("Vikram Rathore");
      setEmail("vikram@volunteer.com");
    }
  }, [role]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password: password || "demo123", // fallback
      role,
    });

    if (res?.ok) {
      router.push(ROLE_HOME[role]);
    } else {
      setSubmitting(false);
      alert("Login failed. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      {/* Split screen layout */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left Side: Branding, Mission, Metrics */}
        <div className="relative hidden w-full lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden">
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(14,165,164,0.18),transparent_50%)]" />

          {/* Top Branding */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
              <Heart size={16} className="fill-white" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              FureverCare <span className="text-primary font-black">AI</span>
            </span>
          </div>

          {/* Mission Description & Counter illustration */}
          <div className="relative z-10 my-auto max-w-md space-y-6">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary-400"
            >
              <Sparkles size={12} /> Humanitarian Platform
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Empowering stray rescues through local intelligence.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm leading-relaxed text-slate-400"
            >
              FureverCare AI coordinates reporting citizens, emergency veterinary hospitals, local NGOs, and field rescue volunteers into a unified real-time dispatch map.
            </motion.p>

            {/* Verification Stats */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6 mt-8">
              <div>
                <p className="text-2xl font-bold text-white">4,820+</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Animals Saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">&lt;14 min</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg Response</p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="relative z-10 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} FureverCare AI. Secure Sandbox authentication.
          </div>
        </div>

        {/* Right Side: Authentication Panel */}
        <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 bg-slate-50/50">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Sign in to your account
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Choose your role to load custom dashboard utilities
              </p>
            </div>

            {/* Role Cards Selector */}
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const active = role === r.key;
                return (
                  <motion.button
                    key={r.key}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRole(r.key)}
                    className={cn(
                      "flex flex-col items-center justify-between gap-2.5 rounded-xl border p-4 text-center transition-all duration-200",
                      active
                        ? "border-primary bg-white text-primary ring-2 ring-primary/10 shadow-md shadow-primary/5"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg border", active ? "bg-primary-50 border-primary-100 text-primary" : "bg-slate-50 border-slate-100 text-slate-400")}>
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-bold tracking-wide">{r.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Form Box */}
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Aarav Sharma"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 bg-slate-50/50"
                  />
                </div>

                {role === "ngo" && (
                  <div>
                    <label htmlFor="orgName" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Organization Name
                    </label>
                    <input
                      id="orgName"
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. PawSavers Rescue Trust"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 bg-slate-50/50"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="emailAddress" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="emailAddress"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label htmlFor="loginPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Password
                  </label>
                  <input
                    id="loginPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 bg-slate-50/50"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded-md border-slate-300 text-primary focus:ring-primary accent-primary"
                    />
                    <span className="text-xs font-medium text-slate-500">Remember credentials</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4 bg-gradient-to-r from-primary to-primary-600 text-white font-bold"
                  disabled={submitting}
                >
                  {submitting ? "Signing in..." : `Continue as ${ROLE_LABEL[role]}`}
                </Button>
              </form>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-400 font-medium border-t border-slate-100 pt-4">
                <ShieldCheck size={13} className="text-emerald-500" />
                Prototype mode — any password works.
              </div>
            </Card>

            <p className="text-center text-sm text-slate-500">
              Just browsing?{" "}
              <Link href="/" className="font-semibold text-primary hover:underline">
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
