"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Role, ROLE_HOME, ROLE_LABEL, setUser } from "@/lib/auth";
import { User, Building2, Bike, LogIn, ShieldCheck } from "lucide-react";

const ROLES: { key: Role; label: string; icon: typeof User; desc: string }[] = [
  {
    key: "citizen",
    label: "Citizen",
    icon: User,
    desc: "Report injured animals and track rescues",
  },
  {
    key: "ngo",
    label: "NGO / Shelter",
    icon: Building2,
    desc: "Manage incoming rescue requests",
  },
  {
    key: "volunteer",
    label: "Volunteer",
    icon: Bike,
    desc: "View assigned rescues and live tracking",
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
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);

    setTimeout(() => {
      setUser({
        name,
        email,
        role,
        orgName: role === "ngo" ? orgName || "PawSavers Rescue Trust" : undefined,
      });
      router.push(ROLE_HOME[role]);
    }, 600);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white">
            <LogIn size={22} />
          </div>
          <h1 className="text-2xl font-bold text-ink-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to FureverCare AI as a {ROLE_LABEL[role]}
          </p>
        </div>

        <Card className="w-full p-5">
          <div className="mb-5 grid grid-cols-3 gap-2">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const active = role === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors ${
                    active
                      ? "border-brand-400 bg-brand-50 text-brand-700"
                      : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  {r.label}
                </button>
              );
            })}
          </div>
          <p className="mb-4 text-center text-xs text-gray-400">
            {ROLES.find((r) => r.key === role)?.desc}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Aarav Sharma"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {role === "ngo" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Organization Name
                </label>
                <input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. PawSavers Rescue Trust"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={submitting}>
              {submitting ? "Signing in..." : `Continue as ${ROLE_LABEL[role]}`}
            </Button>
          </form>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-400">
            <ShieldCheck size={12} />
            Prototype login — no password is verified, any details will work.
          </p>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-500">
          Just browsing?{" "}
          <Link href="/" className="font-medium text-brand-600 hover:underline">
            Back to home
          </Link>
        </p>
      </main>
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
