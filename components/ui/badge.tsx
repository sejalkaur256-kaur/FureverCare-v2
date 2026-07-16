import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "danger" | "info" | "brand";

const tones: Record<Tone, string> = {
  default: "bg-slate-50 text-slate-700 border border-slate-200/50",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-100/80",
  warning: "bg-amber-50 text-amber-700 border border-amber-100/80",
  danger: "bg-red-50 text-red-700 border border-red-100/80",
  info: "bg-sky-50 text-sky-700 border border-sky-100/80",
  brand: "bg-primary-50 text-primary-700 border border-primary-100/80",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

export function severityTone(severity: string): Tone {
  if (severity === "High") return "danger";
  if (severity === "Medium") return "warning";
  return "success";
}
