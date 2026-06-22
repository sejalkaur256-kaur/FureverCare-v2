"use client";

import { GeoPoint } from "@/lib/types";
import { Dog, Building2, Bike } from "lucide-react";

interface Marker {
  id: string;
  point: GeoPoint;
  kind: "animal" | "volunteer" | "ngo";
  label?: string;
  active?: boolean;
}

interface MapViewProps {
  center: GeoPoint;
  markers: Marker[];
  className?: string;
  showRoute?: boolean;
  routeFrom?: GeoPoint;
  routeTo?: GeoPoint;
}

// Projects lat/lng deltas onto a 0-100 percentage box around the center,
// purely for prototype visualization (not real-world accurate projection).
function project(p: GeoPoint, center: GeoPoint) {
  const scale = 900; // visual zoom factor
  const x = 50 + (p.lng - center.lng) * scale;
  const y = 50 - (p.lat - center.lat) * scale;
  return {
    x: Math.min(94, Math.max(6, x)),
    y: Math.min(90, Math.max(10, y)),
  };
}

export function MapView({
  center,
  markers,
  className,
  showRoute,
  routeFrom,
  routeTo,
}: MapViewProps) {
  const from = routeFrom ? project(routeFrom, center) : null;
  const to = routeTo ? project(routeTo, center) : null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50 ${
        className ?? "h-80 w-full"
      }`}
    >
      {/* fake grid roads */}
      <svg className="absolute inset-0 h-full w-full opacity-40">
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={`${(i + 1) * 12}%`}
            x2="100%"
            y2={`${(i + 1) * 12}%`}
            stroke="#cbd5e1"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={`${(i + 1) * 12}%`}
            y1="0"
            x2={`${(i + 1) * 12}%`}
            y2="100%"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
        ))}
      </svg>

      {showRoute && from && to && (
        <svg className="absolute inset-0 h-full w-full">
          <line
            x1={`${from.x}%`}
            y1={`${from.y}%`}
            x2={`${to.x}%`}
            y2={`${to.y}%`}
            stroke="#f9580f"
            strokeWidth="3"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
        </svg>
      )}

      {markers.map((m) => {
        const pos = project(m.point, center);
        return (
          <div
            key={m.id}
            className="absolute -translate-x-1/2 -translate-y-full transition-all duration-1000 ease-linear"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className="flex flex-col items-center">
              <div
                className={`relative flex h-9 w-9 items-center justify-center rounded-full shadow-lg ring-2 ring-white ${
                  m.kind === "animal"
                    ? "bg-red-500"
                    : m.kind === "volunteer"
                    ? "bg-brand-500"
                    : "bg-sky-500"
                }`}
              >
                {m.active && (
                  <span className="dot-pulse absolute inset-0 rounded-full text-current opacity-60" />
                )}
                {m.kind === "animal" && <Dog size={16} className="text-white" />}
                {m.kind === "volunteer" && (
                  <Bike size={16} className="text-white" />
                )}
                {m.kind === "ngo" && (
                  <Building2 size={16} className="text-white" />
                )}
              </div>
              {m.label && (
                <span className="mt-1 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-medium text-ink-900 shadow">
                  {m.label}
                </span>
              )}
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-2 right-2 rounded-md bg-white/80 px-2 py-1 text-[10px] text-gray-500">
        Map view simulated for prototype
      </div>
    </div>
  );
}
