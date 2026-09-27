import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Info,
  Loader2,
  RefreshCw,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Button, Card, LinkButton, PageHeader, SectionLabel } from "@/components/ui";
import { SourceBadge } from "@/components/SourceBadge";
import { ExplanationCard } from "@/components/ExplanationCard";
import { predictSupportPriority, MlApiError } from "@/services/mlApi";
import type { PredictionResult } from "@/services/mlApi";
import { useDemoStudents } from "@/store/demoStudents";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";

/* ------------------------------ Form model ------------------------------- */

interface FormState {
  name: string;
  studentId: string;
  program: string;
  year: string;
  attendance_rate: string;
  attendance_change: string;
  assignment_completion: string;
  missed_assignments: string;
  average_grade: string;
  grade_change: string;
  late_submissions: string;
  engagement_score: string;
  engagement_change: string;
  classes_missed: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  studentId: "",
  program: "B.Tech • Computer Science",
  year: "1",
  attendance_rate: "62",
  attendance_change: "-24",
  assignment_completion: "55",
  missed_assignments: "3",
  average_grade: "68",
  grade_change: "-11",
  late_submissions: "4",
  engagement_score: "35",
  engagement_change: "-20",
  classes_missed: "8",
};

const PRESETS: { key: "low" | "medium" | "high"; label: string; values: FormState }[] = [
  {
    key: "low",
    label: "Low Example",
    values: {
      ...EMPTY_FORM,
      attendance_rate: "92",
      attendance_change: "-2",
      assignment_completion: "95",
      missed_assignments: "0",
      average_grade: "84",
      grade_change: "-1",
      late_submissions: "0",
      engagement_score: "86",
      engagement_change: "-3",
      classes_missed: "1",
    },
  },
  {
    key: "medium",
    label: "Medium Example",
    values: {
      ...EMPTY_FORM,
      attendance_rate: "78",
      attendance_change: "-14",
      assignment_completion: "77",
      missed_assignments: "2",
      average_grade: "73",
      grade_change: "-8",
      late_submissions: "2",
      engagement_score: "62",
      engagement_change: "-16",
      classes_missed: "4",
    },
  },
  {
    key: "high",
    label: "High Example",
    values: {
      ...EMPTY_FORM,
      attendance_rate: "62",
      attendance_change: "-24",
      assignment_completion: "55",
      missed_assignments: "3",
      average_grade: "68",
      grade_change: "-11",
      late_submissions: "4",
      engagement_score: "35",
      engagement_change: "-20",
      classes_missed: "8",
    },
  },
];

/* --------------------------- Field definitions ---------------------------- */

interface SignalField {
  key: keyof FormState;
  label: string;
  min: number;
  max: number;
  unit: string;
  helper: string;
  integer?: boolean;
}

const SIGNAL_FIELDS: SignalField[] = [
  { key: "attendance_rate", label: "Attendance rate", min: 0, max: 100, unit: "%", helper: "Overall attendance across enrolled courses" },
  { key: "attendance_change", label: "Attendance change", min: -40, max: 10, unit: "pts", helper: "Change vs. the previous period" },
  { key: "assignment_completion", label: "Assignment completion", min: 0, max: 100, unit: "%", helper: "Submitted and completed coursework" },
  { key: "missed_assignments", label: "Missed assignments", min: 0, max: 10, unit: "", helper: "Count of unsubmitted assignments", integer: true },
  { key: "average_grade", label: "Average grade", min: 0, max: 100, unit: "", helper: "Current average across assessments" },
  { key: "grade_change", label: "Grade change", min: -30, max: 10, unit: "pts", helper: "Change vs. the previous period" },
  { key: "late_submissions", label: "Late submissions", min: 0, max: 10, unit: "", helper: "Count of late submissions", integer: true },
  { key: "engagement_score", label: "Engagement score", min: 0, max: 100, unit: "/100", helper: "Composite LMS and campus engagement" },
  { key: "engagement_change", label: "Engagement change", min: -45, max: 10, unit: "pts", helper: "Change vs. the previous period" },
  { key: "classes_missed", label: "Classes missed", min: 0, max: 15, unit: "", helper: "Count of missed timetabled classes", integer: true },
];

/* -------------------------------- Validation ------------------------------- */

function validateSignals(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  for (const f of SIGNAL_FIELDS) {
    const raw = form[f.key];
    const n = Number(raw);
    if (raw.trim() === "" || Number.isNaN(n)) {
      errors[f.key] = "Enter a value.";
      continue;
    }
    if (f.integer && !Number.isInteger(n)) {
      errors[f.key] = "Whole numbers only.";
      continue;
    }
    if (n < f.min || n > f.max) {
      errors[f.key] = `Must be between ${f.min} and ${f.max}${f.unit && f.unit !== "/100" ? ` ${f.unit}` : ""}.`;
    }
  }
  return errors;
}

function signalsToPayload(form: FormState) {
  const num = (key: keyof FormState) => Number(form[key]);
  return {
    attendance_rate: num("attendance_rate"),
    attendance_change: num("attendance_change"),
    assignment_completion: num("assignment_completion"),
    missed_assignments: num("missed_assignments"),
    average_grade: num("average_grade"),
    grade_change: num("grade_change"),
    late_submissions: num("late_submissions"),
    engagement_score: num("engagement_score"),
    engagement_change: num("engagement_change"),
    classes_missed: num("classes_missed"),
  };
}

/* --------------------------------- Page ----------------------------------- */

type AnalyzeState =
  | { phase: "form" }
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "result"; result: PredictionResult };

export function Analyze() {
  const { addStudent } = useDemoStudents();
  const { notifyPrediction, notifyStudentAdded } = useNotifications();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [state, setState] = useState<AnalyzeState>({ phase: "form" });
  const [savedId, setSavedId] = useState<string | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);

  const setSignal = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setForm(preset.values);
    setErrors({});
    setState({ phase: "form" });
  };

  const analyze = async () => {
    const found = validateSignals(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setState({ phase: "form" });
      return;
    }
    setState({ phase: "loading" });
    try {
      const payload = signalsToPayload(form);
      const result = await predictSupportPriority({
        id: "analyze-preview",
        name: form.name.trim() || "Unnamed Student",
        studentId: form.studentId.trim() || "—",
        program: form.program || "B.Tech • Computer Science",
        year: Number(form.year) || 1,
        email: "demo@university.edu",
        initials: "AN",
        avatarTone: "slate",
        keySignals: [],
        lastUpdated: "",
        advisor: "",
        hostelResident: false,
        timeline: [],
        ...payload,
      });
      setState({ phase: "result", result });
      // Notification reacts to the ACTUAL API result: HIGH/MEDIUM alert, LOW silent.
      notifyPrediction(result.prediction, form.name.trim() || "A newly analyzed student", "analyze");
    } catch (err) {
      setState({
        phase: "error",
        message: err instanceof MlApiError ? err.message : "Unable to connect to the live ML service.",
      });
    }
  };

  const resetAll = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setState({ phase: "form" });
    setSavedId(null);
    setSavedName(null);
  };

  const backToForm = () => {
    setState({ phase: "form" });
    setSavedId(null);
    setSavedName(null);
  };

  const saveToDemoList = () => {
    if (state.phase !== "result") return;
    const name = form.name.trim() || "Analyzed Student";
    const id = addStudent({
      name,
      studentId: form.studentId.trim() || `AN-${Math.floor(1000 + Math.random() * 9000)}`,
      program: form.program || "B.Tech • Computer Science",
      year: Number(form.year) || 1,
      email: "demo@university.edu",
      ...signalsToPayload(form),
    });
    setSavedId(id);
    setSavedName(name);
    notifyStudentAdded(name);
  };

  const resultSubtext =
    state.phase === "result"
      ? state.result.prediction === "HIGH"
        ? "These observable signals contributed most strongly to the HIGH support priority assessment."
        : state.result.prediction === "MEDIUM"
        ? "These observable signals contributed to the current assessment."
        : "These observable signals support the LOW-priority assessment."
      : "";

  const inputBase =
    "h-10 w-full rounded-xl border bg-white px-3 text-[13.5px] text-[#22303F] shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";

  return (
    <div className="mx-auto max-w-[1320px]">
      <PageHeader
        title="Analyze Student"
        subtitle="Enter observable student signals to generate an assistive Support Priority assessment."
        right={
          state.phase === "result" ? (
            <SourceBadge source={state.result.source} />
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-[#E8EDF3] bg-white px-3.5 py-2 shadow-card">
              <FlaskConical className="h-4 w-4 text-[#8296AD]" aria-hidden="true" />
              <span className="text-[12.5px] font-medium text-[#51617A]">Assistive model output · staff review required</span>
            </div>
          )
        }
      />

      {/* Form card */}
      {state.phase !== "result" && (
        <Card className="animate-fade-up p-6 sm:p-7">
          {/* Presets */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <SectionLabel>Presets</SectionLabel>
              <p className="mt-1 text-[12.5px] text-[#7A8AA0]">
                Example values only — the prediction always comes from the live ML API.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <Button key={preset.key} variant="secondary" size="sm" onClick={() => applyPreset(preset)}>
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Student information */}
          <SectionLabel>Student information</SectionLabel>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {(
              [
                { key: "name", label: "Student name", placeholder: "e.g. Arjun Kumar" },
                { key: "studentId", label: "Student ID", placeholder: "e.g. 23IT1042" },
                { key: "program", label: "Program", placeholder: "B.Tech • Information Technology" },
                { key: "year", label: "Year", placeholder: "1" },
              ] as const
            ).map((f) => (
              <div key={f.key}>
                <label htmlFor={`f-${f.key}`} className="mb-1.5 block text-[12.5px] font-semibold text-[#51617A]">
                  {f.label}
                </label>
                <input
                  id={`f-${f.key}`}
                  type={f.key === "year" ? "number" : "text"}
                  min={f.key === "year" ? 1 : undefined}
                  max={f.key === "year" ? 5 : undefined}
                  value={form[f.key]}
                  onChange={(e) => setSignal(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={cn(inputBase, "border-[#DDE4EC] hover:border-[#C9D4E0]")}
                />
              </div>
            ))}
          </div>

          {/* Observable signals */}
          <div className="mt-8">
            <SectionLabel>Observable signals</SectionLabel>
            <p className="mt-1 text-[12.5px] text-[#7A8AA0]">
              These ten values are sent to the Support Priority Model exactly as entered.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
            {SIGNAL_FIELDS.map((f) => {
              const error = errors[f.key];
              const displayValue = form[f.key];
              const numeric = Number(displayValue);
              const invalid = Boolean(error);
              return (
                <div key={f.key}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-2">
                    <label htmlFor={`s-${f.key}`} className="text-[12.5px] font-semibold text-[#51617A]">
                      {f.label}
                      {f.unit && (
                        <span className="ml-1.5 text-[11px] font-medium text-[#8296AD]">
                          ({f.unit === "pts" ? "percentage points" : f.unit === "/100" ? "0–100" : f.unit})
                        </span>
                      )}
                    </label>
                    <span className={cn("text-[13px] font-bold tabular-nums", invalid ? "text-rose-600" : "text-[#16283C]")}>
                      {displayValue || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={f.min}
                      max={f.max}
                      step={1}
                      value={Number.isNaN(numeric) || displayValue.trim() === "" ? f.min : Math.min(f.max, Math.max(f.min, numeric))}
                      onChange={(e) => setSignal(f.key, e.target.value)}
                      aria-label={`${f.label} slider`}
                      className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-[#E2E8F0]"
                      style={{ accentColor: "#0D9488" }}
                    />
                    <input
                      id={`s-${f.key}`}
                      type="number"
                      min={f.min}
                      max={f.max}
                      step={1}
                      value={displayValue}
                      onChange={(e) => setSignal(f.key, e.target.value)}
                      aria-invalid={invalid || undefined}
                      className={cn(
                        inputBase,
                        "w-[104px] shrink-0 tabular-nums",
                        invalid ? "border-rose-300 focus-visible:outline-rose-400" : "border-[#DDE4EC] hover:border-[#C9D4E0]"
                      )}
                    />
                  </div>
                  <p className={cn("mt-1.5 text-[12px]", invalid ? "font-medium text-rose-600" : "text-[#8296AD]")}>
                    {invalid ? error : f.helper}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0F3F8] pt-6">
            <div className="flex items-center gap-2 text-[12.5px] text-[#7A8AA0]">
              <Info className="h-4 w-4 text-[#8296AD]" aria-hidden="true" />
              Assistive model output. Authorized staff review required.
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button variant="secondary" size="md" onClick={resetAll}>
                Clear
              </Button>
              <Button variant="primary" size="lg" onClick={analyze} disabled={state.phase === "loading"}>
                {state.phase === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Analyzing student signals…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Analyze Student
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error state — distinct from "empty explanations" */}
          {state.phase === "error" && (
            <div className="animate-fade-up mt-5 rounded-2xl border border-rose-200 bg-rose-50/70 p-5" role="alert">
              <div className="flex items-start gap-3">
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] font-bold text-[#9F1239]">ML service unavailable</div>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#7A8AA0]">{state.message}</p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    <Button variant="secondary" size="sm" onClick={analyze}>
                      <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                      Retry analysis
                    </Button>
                    <Button variant="ghost" size="sm" onClick={backToForm}>
                      Back to form
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cross-link to student list */}
          <div className="mt-5 flex items-center gap-2 text-[13px] text-[#7A8AA0]">
            <Activity className="h-4 w-4 text-[#8296AD]" aria-hidden="true" />
            Looking for an existing student?{" "}
            <Link to="/students" className="font-medium text-teal-700 hover:underline">
              View all students
            </Link>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </div>
        </Card>
      )}

      {/* Result section — same page */}
      {state.phase === "result" && (
        <div className="animate-fade-up space-y-5">
          {/* Priority + probabilities */}
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4 p-6">
              <div>
                <SectionLabel>Support priority</SectionLabel>
                <div className="mt-2 flex items-center gap-3">
                  <span
                    className={cn(
                      "text-[36px] font-bold leading-none tracking-[-0.02em]",
                      state.result.prediction === "HIGH" && "text-rose-600",
                      state.result.prediction === "MEDIUM" && "text-amber-600",
                      state.result.prediction === "LOW" && "text-emerald-600"
                    )}
                  >
                    {state.result.prediction}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      state.result.prediction === "HIGH" && "bg-rose-50 text-rose-700",
                      state.result.prediction === "MEDIUM" && "bg-amber-50 text-amber-700",
                      state.result.prediction === "LOW" && "bg-emerald-50 text-emerald-700"
                    )}
                  >
                    Assistive model output
                  </span>
                </div>
                <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-[#5E7089]">
                  Generated by the Support Priority Model from the values you entered. Authorized staff review required.
                </p>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8296AD]">Model threshold</div>
                <div className="mt-1 text-[20px] font-bold text-[#16283C]">{state.result.threshold.toFixed(2)}</div>
              </div>
            </div>

            {/* Probability breakdown */}
            <div className="space-y-3.5 border-t border-[#F0F3F8] px-6 py-5">
              {(
                [
                  { label: "LOW", value: state.result.probabilities.LOW, bar: "bg-emerald-500" },
                  { label: "MEDIUM", value: state.result.probabilities.MEDIUM, bar: "bg-amber-500" },
                  { label: "HIGH", value: state.result.probabilities.HIGH, bar: "bg-rose-500" },
                ] as const
              ).map((row) => (
                <div key={row.label}>
                  <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                    <span className="font-semibold tracking-wide text-[#51617A]">{row.label} probability</span>
                    <span className="font-bold tabular-nums text-[#16283C]">{(row.value * 100).toFixed(1)}%</span>
                  </div>
                  <div
                    className="h-2.5 w-full overflow-hidden rounded-full bg-[#F1F5FA] ring-1 ring-inset ring-black/[0.04]"
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
          </Card>

          {/* Explanations */}
          <Card className="p-6">
            <div className="mb-4">
              <SectionLabel>Why this student was flagged</SectionLabel>
              <h2 className="mt-1 text-[16.5px] font-bold tracking-[-0.01em] text-[#16283C]">{resultSubtext}</h2>
            </div>
            {state.result.explanations.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {state.result.explanations.map((ex, i) => (
                  <ExplanationCard key={`${ex.feature}-${i}`} explanation={ex} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#DDE4EC] bg-[#FAFBFD] p-5 text-[13px] leading-relaxed text-[#7A8AA0]">
                The model returned no per-signal explanations for this prediction.
              </div>
            )}
          </Card>

          {/* Recommended action */}
          <Card className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="max-w-xl">
                <SectionLabel className="text-teal-100/90">Recommended next step</SectionLabel>
                <h2 className="mt-1.5 text-[20px] font-bold leading-snug tracking-[-0.01em]">
                  {state.result.recommended_action}
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-teal-50/90">
                  All actions are human-controlled. WellAware never sends messages automatically.
                </p>
              </div>
            </div>
          </Card>

          {/* Result actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="secondary" size="md" onClick={backToForm}>
              Analyze Another Student
            </Button>
            <Button variant="secondary" size="md" onClick={resetAll}>
              Clear
            </Button>
            {!savedId ? (
              <Button variant="primary" size="md" onClick={saveToDemoList}>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Add to Demo Students
              </Button>
            ) : (
              <LinkButton to="/students" variant="primary" size="md">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                {savedName} added — view in Students
              </LinkButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
