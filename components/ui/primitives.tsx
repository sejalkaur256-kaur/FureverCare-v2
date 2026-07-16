"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Info, X, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. StatusChip Component
export function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Request Created": "bg-slate-50 text-slate-700 border-slate-200/60",
    "NGO Accepted": "bg-sky-50 text-sky-700 border-sky-100",
    "Volunteer Assigned": "bg-indigo-50 text-indigo-700 border-indigo-100",
    "Volunteer On Route": "bg-amber-50 text-amber-700 border-amber-100",
    "Animal Rescued": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Completed": "bg-teal-50 text-teal-700 border-teal-100",
  };

  const currentStyle = styles[status] || "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm tracking-wide",
        currentStyle
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-currentColor animate-pulse" />
      {status}
    </motion.span>
  );
}

// 2. ProgressCircle Component
export function ProgressCircle({
  value,
  size = 64,
  strokeWidth = 6,
  colorClass = "text-primary",
  showText = true,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  showText?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          className="text-slate-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className={cn("transition-all duration-500 ease-out", colorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showText && (
        <span className="absolute text-xs font-bold text-slate-800">
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}

// 3. AnimatedCounter Component
export function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(10, Math.floor(totalMiliseconds / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}

// 4. MetricCard Component
export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = "up",
  className,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string; size?: number | string }>;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "rounded-2xl border border-slate-200/50 bg-white p-6 shadow-soft relative overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5">
        {Icon && <Icon size={80} />}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-bold tracking-tight text-slate-900">
          {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
        </p>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
              trendDirection === "up" && "bg-emerald-50 text-emerald-700 border-emerald-100",
              trendDirection === "down" && "bg-red-50 text-red-700 border-red-100",
              trendDirection === "neutral" && "bg-slate-50 text-slate-700 border-slate-100"
            )}
          >
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </motion.div>
  );
}

// 5. GlassPanel Component
export function GlassPanel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/40 bg-white/70 shadow-soft backdrop-blur-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// 6. LoadingSkeleton Component
export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl shimmer", className)} style={{ minHeight: "1rem" }} />
  );
}

// 7. EmptyState Component
export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Info,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// 8. AlertBanner Component
export function AlertBanner({
  title,
  message,
  type = "info",
  onClose,
}: {
  title?: string;
  message: string;
  type?: "info" | "success" | "warning" | "danger";
  onClose?: () => void;
}) {
  const styles = {
    info: "bg-sky-50 border-sky-200 text-sky-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    danger: ShieldAlert,
  };

  const Icon = icons[type];

  return (
    <div className={cn("flex items-start gap-3 rounded-xl border p-4 text-sm shadow-sm", styles[type])}>
      <Icon size={18} className="shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <p className="opacity-90">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="p-0.5 hover:bg-black/5 rounded-full shrink-0">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

// 9. Toast Component
export function Toast({
  message,
  isVisible,
  onClose,
  type = "info",
}: {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: "info" | "success" | "warning" | "danger";
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl bg-slate-900 p-4 text-white shadow-2xl flex items-center justify-between gap-3 border border-slate-800"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary-400 shrink-0" />
            <p className="text-xs font-medium">{message}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white shrink-0">
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 10. Modal Component
export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-100"
          >
            {title && (
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>
            )}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// 11. Drawer Component
export function Drawer({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="pointer-events-auto w-screen max-w-md bg-white p-6 shadow-2xl border-l border-slate-100 flex flex-col"
            >
              <div className="flex items-center justify-end mb-4">
                <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// 12. FloatingCard Component
export function FloatingCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "rounded-2xl border border-slate-200/50 bg-white/95 p-5 shadow-2xl backdrop-blur-md",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
