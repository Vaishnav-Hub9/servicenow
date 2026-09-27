import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { students as baseStudents, getStudentById as getBaseStudentById } from "@/data/students";
import type { Student } from "@/data/students";

interface DemoStudentsContextValue {
  /** All students: seeded demo data + students added at runtime via Analyze Student. */
  allStudents: Student[];
  /** Look up a student by id across seeded + runtime-added students. */
  getById: (id: string) => Student | undefined;
  /** Register (or update) a student created from the Analyze Student page. Returns the id used. */
  addStudent: (student: Omit<Student, "id" | "initials" | "avatarTone" | "keySignals" | "lastUpdated" | "timeline" | "advisor" | "hostelResident"> & Partial<Pick<Student, "id">>) => string;
}

const DemoStudentsContext = createContext<DemoStudentsContextValue | null>(null);

const avatarTones: Student["avatarTone"][] = ["teal", "sky", "violet", "amber", "slate", "rose"];
const advisors = ["Dr. Meera Iyer", "Dr. Anand Rao", "Dr. Kavita Menon"];

export function DemoStudentsProvider({ children }: { children: ReactNode }) {
  const [added, setAdded] = useState<Student[]>([]);

  const addStudent = useCallback<DemoStudentsContextValue["addStudent"]>((input) => {
    const existingId = input.id && baseStudents.some((s) => s.id === input.id) ? undefined : input.id;
    const id =
      existingId ??
      (input.id && !baseStudents.some((s) => s.id === input.id)
        ? input.id
        : `analyzed-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`);

    const student: Student = {
      ...input,
      id,
      initials: input.name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      avatarTone: avatarTones[Math.floor(Math.random() * avatarTones.length)],
      keySignals: [
        ...(input.attendance_change <= -10 ? [`Attendance ↓ ${Math.abs(input.attendance_change)}%`] : []),
        ...(input.missed_assignments > 0 ? [`${input.missed_assignments} missed assignments`] : []),
        ...(input.engagement_change <= -8 ? [`Engagement ↓ ${Math.abs(input.engagement_change)}%`] : []),
        ...(input.attendance_change > -10 && input.missed_assignments === 0 && input.engagement_change > -8 ? ["Stable"] : []),
      ].slice(0, 3) as string[],
      lastUpdated: "Just now",
      advisor: advisors[Math.floor(Math.random() * advisors.length)],
      hostelResident: false,
      timeline: [
        { week: "Week 1", label: "Analyzed via form entry", detail: `Attendance ${input.attendance_rate}%`, status: "stable" },
        { week: "Week 2", label: "Demo entry", detail: "Values entered by support staff", status: "watch" },
        { week: "Week 3", label: "Demo entry", detail: "Values entered by support staff", status: "watch" },
        { week: "Week 4", label: "Analyzed via form entry", detail: `Completion ${input.assignment_completion}%`, status: "active" },
        ],
    };

    setAdded((prev) => {
      const existing = prev.findIndex((s) => s.id === id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = student;
        return next;
      }
      return [...prev, student];
    });

    return id;
  }, []);

  const allStudents = useMemo(() => [...baseStudents, ...added], [added]);

  const getById = useCallback(
    (id: string) => allStudents.find((s) => s.id === id),
    [allStudents]
  );

  const value = useMemo(
    () => ({ allStudents, getById, addStudent }),
    [allStudents, getById, addStudent]
  );

  return <DemoStudentsContext.Provider value={value}>{children}</DemoStudentsContext.Provider>;
}

export function useDemoStudents(): DemoStudentsContextValue {
  const ctx = useContext(DemoStudentsContext);
  if (!ctx) throw new Error("useDemoStudents must be used within DemoStudentsProvider");
  return ctx;
}
