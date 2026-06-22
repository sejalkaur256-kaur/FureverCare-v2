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
                  done && "bg-emerald-500 text-white",
                  active && "bg-brand-500 text-white",
                  !done && !active && "bg-gray-100 text-gray-400"
                )}
              >
                {done ? (
                  <Check size={14} />
                ) : active ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  i + 1
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 my-0.5",
                    done ? "bg-emerald-400" : "bg-gray-200"
                  )}
                  style={{ minHeight: "1.5rem" }}
                />
              )}
            </div>
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-medium",
                  active ? "text-brand-600" : done ? "text-ink-900" : "text-gray-400"
                )}
              >
                {status}
              </p>
              {active && (
                <p className="text-xs text-gray-400">In progress…</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
