import { Radio, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PredictionResult } from "@/services/mlApi";

export function SourceBadge({ source, className }: { source: PredictionResult["source"]; className?: string }) {
  const live = source === "api";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        live ? "border-teal-200 bg-teal-50 text-teal-700" : "border-amber-200 bg-amber-50 text-amber-700",
        className
      )}
      title={
        live
          ? "Prediction returned by the live FastAPI ML service"
          : "ML API unreachable — showing clearly-marked synthetic fallback"
      }
    >
      {live ? <Radio className="h-3 w-3" aria-hidden="true" /> : <FlaskConical className="h-3 w-3" aria-hidden="true" />}
      {live ? "Live ML analysis" : "Demo fallback"}
    </span>
  );
}
