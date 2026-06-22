"use client";

import { NGO } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, ShieldCheck, Loader2 } from "lucide-react";

export function NGOCard({
  ngo,
  onRequest,
  requesting,
  requested,
}: {
  ngo: NGO;
  onRequest: (ngo: NGO) => void;
  requesting?: boolean;
  requested?: boolean;
}) {
  return (
    <Card className="flex flex-col justify-between p-4 transition-shadow hover:shadow-lg">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-ink-900">{ngo.name}</h4>
            <p className="text-xs text-gray-500">{ngo.address}</p>
          </div>
          {ngo.verified && (
            <Badge tone="info" className="shrink-0">
              <ShieldCheck size={12} /> Verified
            </Badge>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {ngo.rating} ({ngo.reviews})
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {ngo.distanceKm} km away
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> ~{ngo.etaMins} min
          </span>
        </div>

        <Badge tone="default" className="mt-3">
          {ngo.type}
        </Badge>
      </div>

      <Button
        className="mt-4 w-full"
        variant={requested ? "outline" : "primary"}
        disabled={requesting || requested}
        onClick={() => onRequest(ngo)}
      >
        {requesting && <Loader2 size={16} className="animate-spin" />}
        {requested
          ? "Request Sent ✓"
          : requesting
          ? "Sending Request..."
          : "Request Rescue"}
      </Button>
    </Card>
  );
}
