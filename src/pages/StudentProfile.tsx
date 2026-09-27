import { createContext, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  CalendarX,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  HeartHandshake,
  LifeBuoy,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  Button,
  Card,
  LinkButton,
  PriorityBadge,
  SectionLabel,
  SignalChip,
} from "@/components/ui";
import { SourceBadge } from "@/components/SourceBadge";
import { ExplanationCard } from "@/components/ExplanationCard";
import { usePrediction } from "@/hooks/usePrediction";
import { useDemoStudents } from "@/store/demoStudents";
import { useNotifications } from "@/context/NotificationContext";
import type { Student } from "@/data/students";
import type { MlExplanation } from "@/services/mlApi";
import { cn } from "@/lib/utils";

/* --------------------------- Loading skeleton ---------------------------- */

function PredictionLoading() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-teal-600" aria-hidden="true" />
        <div>
          <div className="text-[15px] font-semibold text-[#16283C]">Generating live prediction…</div>
          <p className="mt-0.5 text-[13px] text-[#7A8AA0]">
            Asking the Support Priority Model to evaluate this student's observable signals.
          </p>
        </div>
      </div>
      <div className="mt-6 space-y-3" aria-hidden="true">
        <div className="h-14 w-full animate-pulse rounded-xl bg-[#F1F5FA]" />
        <div className="h-14 w-full animate-pulse rounded-xl bg-[#F1F5FA]" />
        <div className="h-14 w-full animate-pulse rounded-xl bg-[#F1F5FA]" />
      </div>
    </Card>
  );
}

/* ----------------------------- Error state ------------------------------- */

function PredictionError({ message, student }: { message: string; student: Student }) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50">
          <AlertTriangle className="h-5 w-5 text-rose-500" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-[#16283C]">Unable to connect to the live ML service.</div>
          <p className="mt-0.5 text-[13px] leading-relaxed text-[#7A8AA0]">{message}</p>
          <RetryButton student={student} />
        </div>
      </div>
    </Card>
  );
}

function RetryButton({ student, className }: { student: Student; className?: string }) {
  const { refresh } = usePredictionContext();
  return (
    <Button variant="secondary" size="sm" className={cn("mt-4", className)} onClick={refresh}>
      <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
      Retry prediction
      <span className="sr-only"> for {student.name}</span>
    </Button>
  );
}

/* ----------------------- Explanation card mapping ------------------------- */
/* Explanation cards now live in @/components/ExplanationCard and are shared
   with the Analyze Student page so both pages render identically. */

/* -------------------------------- Page ----------------------------------- */

const ProfileContext = createContext<{ refresh: () => void }>({ refresh: () => {} });
function usePredictionContext() {
  return useContext(ProfileContext);
}

export function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById } = useDemoStudents();
  const student = getById(id ?? "");
  const { notifyPrediction } = useNotifications();

  const { state, refresh } = usePrediction(student ?? ({
    // Placeholder only used when the route id is unknown; the page renders not-found below.
    id: "unknown", name: "Unknown", studentId: "", program: "", year: 0, email: "", initials: "",
    avatarTone: "slate", keySignals: [], lastUpdated: "", advisor: "", hostelResident: false,
    attendance_rate: 0, attendance_change: 0, assignment_completion: 0, missed_assignments: 0,
    average_grade: 0, grade_change: 0, late_submissions: 0, engagement_score: 0, engagement_change: 0,
    classes_missed: 0, timeline: [],
  } as Student));

  // Fire a notification when the ACTUAL ML API returns HIGH or MEDIUM for this
  // student. One alert per prediction per session; LOW is intentionally silent.
  const predictionRef = useRef("");
  useEffect(() => {
    if (state.status !== "done" || state.result.source !== "api") return;
    const key = `${student?.id ?? id ?? ""}:${state.result.prediction}`;
    if (predictionRef.current === key) return;
    predictionRef.current = key;
    if (student) {
      notifyPrediction(state.result.prediction, student.name, student.id);
    }
  }, [state, student, id, notifyPrediction]);

  if (!student) {
    return (
      <div className="mx-auto max-w-[1320px]">
        <Card className="mx-auto max-w-lg p-8 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-amber-500" aria-hidden="true" />
          <h1 className="mt-3 text-[18px] font-bold text-[#16283C]">Student not found</h1>
          <p className="mt-1 text-[13.5px] text-[#7A8AA0]">The student profile you're looking for doesn't exist.</p>
          <LinkButton to="/students" variant="secondary" className="mt-5">Back to Students</LinkButton>
        </Card>
      </div>
    );
  }

  const result = state.status === "done" ? state.result : null;
  const priority = result?.prediction;
  const priorityTone =
    priority === "HIGH"
      ? "bg-rose-50 border-rose-200/80"
      : priority === "MEDIUM"
      ? "bg-amber-50 border-amber-200/80"
      : "bg-emerald-50 border-emerald-200/80";
  const priorityText =
    priority === "HIGH" ? "text-rose-600" : priority === "MEDIUM" ? "text-amber-600" : "text-emerald-600";

  const probabilityRows = priority
    ? [
        { label: "LOW", value: result!.probabilities.LOW, bar: "bg-emerald-500" },
        { label: "MEDIUM", value: result!.probabilities.MEDIUM, bar: "bg-amber-500" },
        { label: "HIGH", value: result!.probabilities.HIGH, bar: "bg-rose-500" },
      ]
    : [];

  return (
    <ProfileContext.Provider value={{ refresh }}>
      <div className="mx-auto max-w-[1320px]">
        {/* Breadcrumb / back */}
        <Link
          to="/students"
          className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-[#5E7089] transition-colors hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Students
        </Link>

        {/* Identity header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-[16px] font-bold text-rose-600 shadow-card">
              {student.initials}
            </div>
            <div>
              <h1 className="text-[26px] font-bold leading-tight tracking-[-0.015em] text-[#16283C]">{student.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#7A8AA0]">
                <span className="font-medium text-[#51617A]">Student ID: {student.studentId}</span>
                <span className="text-[#C3D0DE]">•</span>
                <span>{student.program}</span>
                <span className="text-[#C3D0DE]">•</span>
                <span>Year {student.year}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {state.status === "done" && <SourceBadge source={state.result.source} />}
            <LinkButton to={`/students/${student.id}/check-in`} size="md">
              Start Check-in
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[1fr_320px]">
          {/* Left column */}
          <div className="space-y-5">
            {/* Support priority card */}
            {state.status === "loading" && <PredictionLoading />}
            {state.status === "error" && <PredictionError message={state.message} student={student} />}

            {result && (
              <Card className={cn("animate-fade-up border p-6", priorityTone)}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <SectionLabel>Support priority</SectionLabel>
                    <div className="mt-2 flex items-center gap-3">
                      <span className={cn("text-[34px] font-bold leading-none tracking-[-0.02em]", priorityText)}>
                        {result.prediction}
                      </span>
                      <PriorityBadge level={result.prediction} className="mt-1" />
                    </div>
                    <p className="mt-2 max-w-md text-[13px] leading-relaxed text-[#5E7089]">
                      Generated by the Support Priority Model from this student's observable academic and engagement
                      signals.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8296AD]">
                      Model threshold
                    </div>
                    <div className="mt-1 text-[20px] font-bold text-[#16283C]">
                      {result.threshold.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Probability bars */}
                <div className="mt-6 space-y-3.5">
                  {probabilityRows.map((row) => (
                    <div key={row.label}>
                      <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                        <span className="font-semibold tracking-wide text-[#51617A]">{row.label} probability</span>
                        <span className="font-bold tabular-nums text-[#16283C]">
                          {(row.value * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div
                        className="h-2.5 w-full overflow-hidden rounded-full bg-white/70 ring-1 ring-inset ring-black/[0.04]"
                        role="meter"
                        aria-valuenow={Math.round(row.value * 100)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${row.label} probability`}
                      >
                        <div
                          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", row.bar)}
                          style={{ width: `${Math.max(2, Math.min(100, row.value * 100))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-start gap-2 rounded-xl bg-white/70 p-3.5 text-[12.5px] leading-relaxed text-[#5E7089]">
                  <LifeBuoy className="mt-0.5 h-4 w-4 shrink-0 text-[#8296AD]" aria-hidden="true" />
                  {result.disclaimer}
                </div>
              </Card>
            )}

            {/* Why flagged */}
            {result && (
              <Card className="animate-fade-up p-6" style={{ animationDelay: "80ms" }}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <SectionLabel>Why this student was flagged</SectionLabel>
                    <h2 className="mt-1 text-[16.5px] font-bold tracking-[-0.01em] text-[#16283C]">
                      Explanations from the Support Priority Model
                    </h2>
                  </div>
                  <RetryButton student={student} />
                </div>

                {result.explanations.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {result.explanations.map((ex, i) => (
                      <ExplanationCard key={`${ex.feature}-${i}`} explanation={ex} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#DDE4EC] bg-[#FAFBFD] p-5 text-[13px] leading-relaxed text-[#7A8AA0]">
                    The model returned no per-signal explanations for this prediction. Raw observable values are shown
                    on the right for authorized staff review.
                  </div>
                )}
              </Card>
            )}

            {/* Signal timeline */}
            <Card className="animate-fade-up p-6" style={{ animationDelay: "140ms" }}>
              <SectionLabel>Signal timeline</SectionLabel>
              <h2 className="mt-1 text-[16.5px] font-bold tracking-[-0.01em] text-[#16283C]">
                How signals changed over the last four weeks
              </h2>
              <ol className="mt-5 space-y-0">
                {student.timeline.map((entry, i) => (
                  <li key={entry.week} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < student.timeline.length - 1 && (
                      <span className="absolute left-[13px] top-7 h-[calc(100%-14px)] w-px bg-[#E8EDF3]" aria-hidden="true" />
                    )}
                    <span
                      className={cn(
                        "relative z-10 mt-0.5 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full ring-4 ring-white",
                        entry.status === "stable" && "bg-emerald-100 text-emerald-600",
                        entry.status === "watch" && "bg-amber-100 text-amber-600",
                        entry.status === "active" && "bg-rose-100 text-rose-600"
                      )}
                    >
                      {entry.status === "stable" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : entry.status === "watch" ? (
                        <span className="h-2 w-2 rounded-full bg-current" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1 rounded-xl border border-[#EEF2F7] bg-[#FAFBFD] px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[13px] font-semibold text-[#16283C]">{entry.week}</span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                            entry.status === "stable" && "bg-emerald-50 text-emerald-700",
                            entry.status === "watch" && "bg-amber-50 text-amber-700",
                            entry.status === "active" && "bg-rose-50 text-rose-700"
                          )}
                        >
                          {entry.label}
                        </span>
                      </div>
                      <p className="mt-1 text-[12.5px] text-[#7A8AA0]">{entry.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>

            {/* Recommended next step */}
            {result && (
              <Card className="animate-fade-up bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white" style={{ animationDelay: "200ms" }}>
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="max-w-xl">
                    <SectionLabel className="text-teal-100/90">Recommended next step</SectionLabel>
                    <h2 className="mt-1.5 text-[20px] font-bold leading-snug tracking-[-0.01em]">
                      {result.recommended_action}
                    </h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-teal-50/90">
                      All actions are human-controlled. WellAware never sends messages automatically.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <LinkButton
                      to={`/students/${student.id}/check-in`}
                      className="border-0 bg-white text-teal-800 hover:bg-teal-50"
                      size="md"
                    >
                      Start Check-in
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </LinkButton>
                    <LinkButton
                      to="/support"
                      variant="secondary"
                      size="md"
                      className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50"
                    >
                      View Support Resources
                    </LinkButton>
                  </div>
                </div>
                <div className="mt-5 border-t border-white/20 pt-3.5 text-[12px] leading-relaxed text-teal-50/80">
                  AI-generated support priority. This is an assistive signal, not a diagnosis. Authorized staff review is
                  required.
                </div>
              </Card>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Observable signals */}
            <Card className="animate-fade-up p-5" style={{ animationDelay: "120ms" }}>
              <SectionLabel>Observable signals</SectionLabel>
              <div className="mt-4 space-y-2.5">
                {[
                  { label: "Attendance rate", value: `${student.attendance_rate}%` },
                  { label: "Attendance change", value: `${student.attendance_change} pts` },
                  { label: "Assignment completion", value: `${student.assignment_completion}%` },
                  { label: "Missed assignments", value: `${student.missed_assignments}` },
                  { label: "Average grade", value: `${student.average_grade}` },
                  { label: "Grade change", value: `${student.grade_change} pts` },
                  { label: "Late submissions", value: `${student.late_submissions}` },
                  { label: "Engagement score", value: `${student.engagement_score}` },
                  { label: "Engagement change", value: `${student.engagement_change} pts` },
                  { label: "Classes missed", value: `${student.classes_missed}` },
                ].map((row) => {
                  const negative = row.value.startsWith("-") || ["Missed assignments", "Late submissions", "Classes missed"].includes(row.label);
                  return (
                    <div key={row.label} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-[13px] hover:bg-[#F8FAFC]">
                      <span className="text-[#7A8AA0]">{row.label}</span>
                      <span className={cn("font-semibold tabular-nums", negative && row.value !== "0" ? "text-rose-600" : "text-[#16283C]")}>
                        {row.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Student info */}
            <Card className="animate-fade-up p-5" style={{ animationDelay: "180ms" }}>
              <SectionLabel>Student information</SectionLabel>
              <div className="mt-4 space-y-3 text-[13px]">
                <div className="flex items-center gap-2.5 text-[#51617A]">
                  <Mail className="h-4 w-4 text-[#8296AD]" aria-hidden="true" />
                  {student.email}
                </div>
                <div className="flex items-center gap-2.5 text-[#51617A]">
                  <GraduationCap className="h-4 w-4 text-[#8296AD]" aria-hidden="true" />
                  {student.program}
                </div>
                <div className="flex items-center gap-2.5 text-[#51617A]">
                  <MapPin className="h-4 w-4 text-[#8296AD]" aria-hidden="true" />
                  {student.hostelResident ? "On-campus residence" : "Off-campus"}
                </div>
                <div className="flex items-center gap-2.5 text-[#51617A]">
                  <Phone className="h-4 w-4 text-[#8296AD]" aria-hidden="true" />
                  Assigned advisor: {student.advisor}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {student.keySignals.map((s) => (
                  <SignalChip key={s}>{s}</SignalChip>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProfileContext.Provider>
  );
}
