import { useCallback, useEffect, useRef, useState } from "react";
import type { PredictionResult } from "@/services/mlApi";
import { predictSupportPriority } from "@/services/mlApi";
import type { Student } from "@/data/students";

export type PredictionState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; result: PredictionResult };

/**
 * Fetches a support-priority prediction for a student from the real ML API.
 *
 * Connection failures surface as an error state ("Unable to connect to the live
 * ML service.") — the app never silently replaces a failed or successful API
 * response with demo data. Re-runs when the student id changes.
 */
export function usePrediction(student: Student) {
  const [state, setState] = useState<PredictionState>({ status: "loading" });
  const requestId = useRef(0);

  const run = useCallback(
    async (silent = false) => {
      const id = ++requestId.current;
      if (!silent) setState({ status: "loading" });
      try {
        const result = await predictSupportPriority(student);
        if (id === requestId.current) setState({ status: "done", result });
      } catch (err) {
        if (id === requestId.current) {
          setState({
            status: "error",
            message:
              err instanceof Error ? err.message : "Unable to connect to the live ML service.",
          });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [student.id]
  );

  useEffect(() => {
    void run(false);
  }, [run]);

  return { state, refresh: () => run(true) };
}
