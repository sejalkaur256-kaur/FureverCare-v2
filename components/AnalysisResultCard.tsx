import { AIAnalysis } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge, severityTone } from "@/components/ui/badge";
import { AlertTriangle, Dog, Stethoscope, Gauge, Siren } from "lucide-react";

export function AnalysisResultCard({ analysis }: { analysis: AIAnalysis }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-brand-50 to-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Dog size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Animal Detected
            </p>
            <p className="text-lg font-bold text-ink-900">
              {analysis.animalType}
            </p>
          </div>
        </div>
        <Badge tone={severityTone(analysis.severity)} className="text-sm">
          Severity: {analysis.severity}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
            <Stethoscope size={15} /> Detected Injuries
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.injuries.map((injury) => (
              <Badge key={injury} tone="danger">
                {injury}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
            <Gauge size={15} /> AI Confidence
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-brand-500"
                style={{ width: `${analysis.confidence}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-ink-900">
              {analysis.confidence}%
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
            <AlertTriangle size={15} /> AI Summary
          </p>
          <p className="text-sm text-ink-900">{analysis.summary}</p>
        </div>

        <div
          className={`flex items-center gap-3 rounded-xl p-4 sm:col-span-2 ${
            analysis.emergency
              ? "bg-red-50 text-red-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <Siren size={20} />
          <div>
            <p className="text-sm font-semibold">Recommendation</p>
            <p className="text-sm">{analysis.recommendation}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
