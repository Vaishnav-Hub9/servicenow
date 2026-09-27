import type { PriorityLevel, Student } from "@/data/students";

/**
 * WellAware ML API service.
 *
 * Talks to the existing external FastAPI service — no model logic lives here.
 * The request body uses EXACTLY the API's feature names.
 */

export const ML_API_BASE =
  (import.meta.env?.VITE_ML_API_BASE as string | undefined) ?? "http://127.0.0.1:8000";

/** Error thrown when the ML API cannot be reached or returns an invalid response. */
export class MlApiError extends Error {}

export interface Probabilities {
  LOW: number;
  MEDIUM: number;
  HIGH: number;
}

/** One per-signal explanation returned by the FastAPI /predict endpoint. */
export interface MlExplanation {
  feature: string;
  value: number | string;
  impact: number;
  explanation: string;
}

export interface PredictionResult {
  prediction: PriorityLevel;
  probabilities: Probabilities;
  threshold: number;
  explanations: MlExplanation[];
  recommended_action: string;
  disclaimer: string;
  source: "api" | "fallback";
}

interface RawPrediction {
  prediction: string;
  probabilities: Partial<Record<PriorityLevel, number>>;
  threshold?: number;
  explanations?: unknown;
  recommended_action?: string;
  disclaimer?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Normalizes the API's `explanations` array.
 *
 * The FastAPI service returns objects shaped { feature, value, impact, explanation }.
 * We read `response.explanations` directly, sort by |impact| descending (impact is
 * used only for ordering — it is never displayed), and keep at most 5.
 */
function normalizeExplanations(raw: unknown): MlExplanation[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item): MlExplanation => {
      if (isRecord(item)) {
        return {
          feature: String(item.feature ?? "Signal"),
          value: (item.value ?? "") as number | string,
          impact: typeof item.impact === "number" ? item.impact : Number(item.impact ?? 0) || 0,
          explanation: String(item.explanation ?? ""),
        };
      }
      return { feature: "Signal", value: "", impact: 0, explanation: String(item) };
    })
    .filter((e) => e.explanation.trim().length > 0)
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, 5);
}

function normalizePrediction(raw: RawPrediction): Omit<PredictionResult, "source"> {
  const prediction = String(raw.prediction || "").toUpperCase() as PriorityLevel;
  const probabilities: Probabilities = {
    LOW: Number(raw.probabilities?.LOW ?? 0),
    MEDIUM: Number(raw.probabilities?.MEDIUM ?? 0),
    HIGH: Number(raw.probabilities?.HIGH ?? 0),
  };

  return {
    prediction,
    probabilities,
    threshold: Number(raw.threshold ?? 0.4),
    explanations: normalizeExplanations(raw.explanations),
    recommended_action: raw.recommended_action || "Consider a human advisor check-in",
    disclaimer:
      raw.disclaimer ||
      "AI-generated support priority. This is an assistive signal, not a diagnosis. Authorized staff review is required.",
  };
}

function featuresFromStudent(student: Student) {
  return {
    attendance_rate: student.attendance_rate,
    attendance_change: student.attendance_change,
    assignment_completion: student.assignment_completion,
    missed_assignments: student.missed_assignments,
    average_grade: student.average_grade,
    grade_change: student.grade_change,
    late_submissions: student.late_submissions,
    engagement_score: student.engagement_score,
    engagement_change: student.engagement_change,
    classes_missed: student.classes_missed,
  };
}

/**
 * Predict support priority using the real ML API.
 *
 * Throws MlApiError when the service is unreachable or responds unexpectedly —
 * a failed request is NEVER silently replaced with demo data.
 */
export async function predictSupportPriority(student: Student): Promise<PredictionResult> {
  let res: Response;
  try {
    res = await fetch(`${ML_API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(featuresFromStudent(student)),
    });
  } catch {
    throw new MlApiError(
      `Could not reach ${ML_API_BASE}/predict. Confirm the FastAPI service is running and allows CORS from this origin.`
    );
  }

  if (!res.ok) {
    throw new MlApiError(`The ML service responded with status ${res.status}.`);
  }

  let response: unknown;
  try {
    response = await res.json();
  } catch {
    throw new MlApiError("The ML service returned a response that could not be parsed as JSON.");
  }

  // Temporary debugging output — verify live API integration in the browser console.
  console.log("WellAware ML response:", response);
  console.log("WellAware explanations:", isRecord(response) ? response.explanations : undefined);

  if (!isRecord(response) || !response.prediction) {
    throw new MlApiError("The ML service returned an unexpected response shape (missing prediction).");
  }

  return { ...normalizePrediction(response as unknown as RawPrediction), source: "api" };
}
