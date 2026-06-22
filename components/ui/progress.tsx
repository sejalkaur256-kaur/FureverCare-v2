import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  colorClass = "bg-brand-500",
}: {
  value: number;
  className?: string;
  colorClass?: string;
}) {
  return (
    <div className={cn("h-2 w-full rounded-full bg-gray-100", className)}>
      <div
        className={cn("h-2 rounded-full transition-all duration-500", colorClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
