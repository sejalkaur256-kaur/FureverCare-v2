"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PawPrint, Heart, Menu, X, LogOut, User, Building2, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { AuthUser, getUser, logout, ROLE_LABEL } from "@/lib/auth";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/report", label: "Report" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ngo", label: "NGO" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/tracking", label: "Tracking" },
];

const ROLE_ICON = { citizen: User, ngo: Building2, volunteer: Bike } as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run once initially
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  const RoleIcon = user ? ROLE_ICON[user.role] : User;
  const isLandingPage = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isLandingPage && !scrolled
          ? "bg-transparent border-transparent"
          : "bg-white/80 border-slate-200/50 backdrop-blur-md shadow-xs"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo with Paw + Heart Concept */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
            <PawPrint size={18} className="absolute transition-transform group-hover:scale-0" />
            <Heart size={18} className="absolute scale-0 transition-transform group-hover:scale-100 fill-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
            FureverCare <span className="text-primary font-black">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            // Check matching: for /tracking we check if pathname starts with /tracking
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(l.href);

            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                  active
                    ? "text-primary"
                    : isLandingPage && !scrolled
                    ? "text-slate-200 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/report">
            <Button
              size="sm"
              variant="outline"
              className={cn(
                isLandingPage && !scrolled
                  ? "border-white/20 bg-white/5 text-white hover:bg-white/10"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              Report Animal
            </Button>
          </Link>
          {user ? (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200/50 bg-white px-3 py-1.5 shadow-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-primary">
                <RoleIcon size={14} />
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-slate-800">{user.name.split(" ")[0]}</p>
                <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{ROLE_LABEL[user.role]}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-1 text-slate-300 hover:text-red-500 transition-colors"
                aria-label="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn(
            "md:hidden p-1.5 rounded-lg transition-colors",
            isLandingPage && !scrolled
              ? "text-slate-200 hover:bg-white/10"
              : "text-slate-600 hover:bg-slate-50"
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="border-t border-slate-100 bg-white px-4 py-4 md:hidden shadow-lg"
        >
          <div className="flex flex-col gap-1.5">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === l.href
                    ? "bg-primary-50 text-primary"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/report" onClick={() => setOpen(false)} className="mt-2">
              <Button className="w-full" variant="outline">
                Report Animal
              </Button>
            </Link>

            {user ? (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200/50 p-3 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary">
                    <RoleIcon size={15} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400">{ROLE_LABEL[user.role]}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={handleLogout} className="text-red-500 hover:bg-red-50">
                  <LogOut size={14} /> Logout
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="mt-1.5">
                <Button className="w-full">Login</Button>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
