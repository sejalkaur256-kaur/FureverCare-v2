import { RescueStatus } from "@/lib/types";
import { STATUS_ORDER } from "@/lib/store";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function RescueTimeline({
  current,
  className,
}: {
  current: RescueStatus;
  className?: string;
}) {
  const currentIdx = STATUS_ORDER.indexOf(current);

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {STATUS_ORDER.map((status, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const isLast = i === STATUS_ORDER.length - 1;
        return (
          <div key={status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  done && "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20",
                  active && "bg-primary text-white shadow-sm shadow-primary/20",
                  !done && !active && "bg-slate-100 text-slate-400"
                )}
              >
                {done ? (
                  <Check size={14} className="stroke-[3]" />
                ) : active ? (
                  <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                ) : (
                  i + 1
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 my-1 rounded-full",
                    done ? "bg-emerald-400" : "bg-slate-200"
                  )}
                  style={{ minHeight: "1.5rem" }}
                />
              )}
            </div>
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-bold tracking-wide",
                  active ? "text-primary" : done ? "text-slate-800" : "text-slate-400"
                )}
              >
                {status}
              </p>
              {active && (
                <p className="text-xs text-slate-400 mt-0.5 font-medium animate-pulse">Live updates in progress…</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
