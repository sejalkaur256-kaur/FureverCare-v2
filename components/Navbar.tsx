"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PawPrint, Menu, X, LogOut, User, Building2, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { AuthUser, getUser, logout, ROLE_LABEL } from "@/lib/auth";

const LINKS = [
  { href: "/dashboard", label: "Citizen Dashboard" },
  { href: "/ngo", label: "NGO Dashboard" },
  { href: "/volunteer", label: "Volunteer" },
];

const ROLE_ICON = { citizen: User, ngo: Building2, volunteer: Bike } as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUserState] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUserState(getUser());
    function onChange() {
      setUserState(getUser());
    }
    window.addEventListener("FureverCare-auth-updated", onChange);
    return () => window.removeEventListener("FureverCare-auth-updated", onChange);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  const RoleIcon = user ? ROLE_ICON[user.role] : User;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <PawPrint size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight text-ink-900">
            FureverCare <span className="text-brand-500">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname?.startsWith(l.href)
                  ? "bg-brand-50 text-brand-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/report">
            <Button size="md" variant="outline">
              Report Animal
            </Button>
          </Link>
          {user ? (
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <RoleIcon size={14} />
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-ink-900">{user.name}</p>
                <p className="text-[10px] text-gray-400">{ROLE_LABEL[user.role]}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-1 text-gray-400 hover:text-red-500"
                aria-label="Logout"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="md">Login</Button>
            </Link>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/report" onClick={() => setOpen(false)}>
              <Button className="mt-2 w-full" variant="outline">
                Report Animal
              </Button>
            </Link>

            {user ? (
              <div className="mt-2 flex items-center justify-between rounded-xl border border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <RoleIcon size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{user.name}</p>
                    <p className="text-xs text-gray-400">{ROLE_LABEL[user.role]}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={handleLogout}>
                  <LogOut size={14} /> Logout
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button className="mt-2 w-full">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
