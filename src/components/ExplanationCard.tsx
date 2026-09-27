import {
  CalendarClock,
  CalendarX,
  ClipboardList,
  GraduationCap,
  HeartHandshake,
  TrendingDown,
  WalletCards,
  BookOpenCheck,
} from "lucide-react";
import type { MlExplanation } from "@/services/mlApi";
import { cn } from "@/lib/utils";

/** "Assignment completion" (or "assignment_completion") -> "assignment_completion" */
export function keyifyFeature(feature: string): string {
  return feature.trim().toLowerCase().replace(/\s+/g, "_");
}

/** Feature-specific value formatting (no raw SHAP/impact numbers are shown). */
export function formatFeatureValue(feature: string, value: number | string): string {
  const key = keyifyFeature(feature);
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  switch (key) {
    case "assignment_completion":
    case "attendance_rate":
      return `${n}%`;
    case "engagement_score":
      return `${n}/100`;
    case "attendance_change":
    case "grade_change":
    case "engagement_change":
      return `${n} pts`;
    default:
      return `${n}`;
  }
}

const explanationIcons: Record<string, { icon: typeof TrendingDown; tone: string }> = {
  attendance_rate: { icon: CalendarX, tone: "bg-rose-50 text-rose-600" },
  attendance_change: { icon: TrendingDown, tone: "bg-rose-50 text-rose-600" },
  assignment_completion: { icon: ClipboardList, tone: "bg-amber-50 text-amber-600" },
  missed_assignments: { icon: WalletCards, tone: "bg-amber-50 text-amber-600" },
  average_grade: { icon: GraduationCap, tone: "bg-slate-100 text-slate-600" },
  grade_change: { icon: TrendingDown, tone: "bg-slate-100 text-slate-600" },
  late_submissions: { icon: CalendarClock, tone: "bg-amber-50 text-amber-600" },
  engagement_score: { icon: HeartHandshake, tone: "bg-violet-50 text-violet-600" },
  engagement_change: { icon: TrendingDown, tone: "bg-violet-50 text-violet-600" },
  classes_missed: { icon: CalendarX, tone: "bg-rose-50 text-rose-600" },
  signal: { icon: BookOpenCheck, tone: "bg-teal-50 text-teal-600" },
};

/**
 * One per-signal explanation card shared by the Student Profile and
 * Analyze Student pages. Feature / formatted value / model explanation.
 */
export function ExplanationCard({ explanation }: { explanation: MlExplanation }) {
  const meta = explanationIcons[keyifyFeature(explanation.feature)] ?? explanationIcons.signal;
  const Icon = meta.icon;
  const formattedValue = formatFeatureValue(explanation.feature, explanation.value);

  return (
    <div className="rounded-2xl border border-[#E8EDF3] bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start gap-3.5">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", meta.tone)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#8296AD]">
            {explanation.feature}
          </div>
          <div className="mt-0.5 text-[14px] font-bold tabular-nums text-[#16283C]">{formattedValue}</div>
          <p className="mt-1 text-[13px] leading-snug text-[#5E7089]">{explanation.explanation}</p>
        </div>
      </div>
    </div>
  );
}
