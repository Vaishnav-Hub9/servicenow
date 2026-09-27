import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Plus, Search, SlidersHorizontal } from "lucide-react";
import {
  Card,
  DisclaimerNote,
  LinkButton,
  PageHeader,
  PriorityBadge,
  SignalChip,
  SignalWarningChip,
  Table,
  Td,
  Th,
  THead,
  Tr,
} from "@/components/ui";
import { directoryPriorities } from "@/data/students";
import { useDemoStudents } from "@/store/demoStudents";
import type { PriorityLevel } from "@/data/students";
import { cn } from "@/lib/utils";

const trendFromPriority: Record<PriorityLevel, { label: string; direction: "down" | "flat" }> = {
  HIGH: { label: "Declining", direction: "down" },
  MEDIUM: { label: "Watch", direction: "down" },
  LOW: { label: "Stable", direction: "flat" },
};

export function Students() {
  const { allStudents } = useDemoStudents();
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<"ALL" | PriorityLevel>("ALL");
  const [program, setProgram] = useState("ALL");

  const programs = useMemo(() => {
    const set = new Set(allStudents.map((s) => s.program.split("•")[1]?.trim() ?? s.program));
    return ["ALL", ...Array.from(set)];
  }, [allStudents]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allStudents.filter((s) => {
      if (priority !== "ALL" && directoryPriorities[s.id] !== priority) return false;
      if (program !== "ALL" && !(s.program.split("•")[1]?.trim() === program)) return false;
      if (q && !(s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [allStudents, query, priority, program, directoryPriorities]);

  const selectClass =
    "h-10 rounded-xl border border-[#DDE4EC] bg-white px-3 pr-8 text-[13.5px] font-medium text-[#43536B] shadow-sm transition-colors hover:border-[#C9D4E0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";

  return (
    <div className="mx-auto max-w-[1320px]">
      <PageHeader
        title="Students"
        subtitle="Review student signals and support priority."
        right={
          <LinkButton to="/analyze" variant="primary" size="md">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Analyze Student
          </LinkButton>
        }
      />

      {/* Controls */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-[340px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8296AD]" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students"
            aria-label="Search students by name or ID"
            className="h-10 w-full rounded-xl border border-[#DDE4EC] bg-white pl-10 pr-4 text-[13.5px] text-[#22303F] shadow-sm placeholder:text-[#9AA9BC] transition-colors hover:border-[#C9D4E0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          />
        </div>

        <div className="relative">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "ALL" | PriorityLevel)}
            aria-label="Filter by support priority"
            className={selectClass}
          >
            <option value="ALL">All priorities</option>
            <option value="HIGH">High priority</option>
            <option value="MEDIUM">Medium priority</option>
            <option value="LOW">Low priority</option>
          </select>
          <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 rotate-90 -translate-y-1/2 text-[#8296AD]" aria-hidden="true" />
        </div>

        <div className="relative">
          <select
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            aria-label="Filter by program"
            className={selectClass}
          >
            {programs.map((p) => (
              <option key={p} value={p}>{p === "ALL" ? "All programs" : p}</option>
            ))}
          </select>
          <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 rotate-90 -translate-y-1/2 text-[#8296AD]" aria-hidden="true" />
        </div>

        <div className="ml-auto flex items-center gap-2 text-[12.5px] text-[#7A8AA0]">
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          {filtered.length} of {allStudents.length} students
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table className="min-w-[900px]">
          <THead>
            <Th>Student</Th>
            <Th>Student ID</Th>
            <Th>Program</Th>
            <Th>Year</Th>
            <Th>Support Priority</Th>
            <Th>Key Signals</Th>
            <Th>Trend</Th>
            <Th>Last Updated</Th>
          </THead>
          <tbody>
            {filtered.map((student) => {
              const level = directoryPriorities[student.id];
              const isNew = !level;
              const trend = level ? trendFromPriority[level] : { label: "New entry", direction: "flat" as const };
              return (
                <Tr key={student.id}>
                  <Td>
                    <Link
                      to={`/students/${student.id}`}
                      className="group flex items-center gap-3 outline-offset-4"
                      aria-label={`Open profile for ${student.name}`}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
                          student.avatarTone === "rose" && "bg-rose-50 text-rose-600",
                          student.avatarTone === "amber" && "bg-amber-50 text-amber-600",
                          student.avatarTone === "teal" && "bg-teal-50 text-teal-600",
                          student.avatarTone === "sky" && "bg-sky-50 text-sky-600",
                          student.avatarTone === "violet" && "bg-violet-50 text-violet-600",
                          student.avatarTone === "slate" && "bg-slate-100 text-slate-600"
                        )}
                        aria-hidden="true"
                      >
                        {student.initials}
                      </span>
                      <span className="text-[13.5px] font-semibold text-[#16283C] group-hover:text-teal-700 transition-colors">
                        {student.name}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#C3D0DE] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  </Td>
                  <Td className="font-medium text-[#43536B]">{student.studentId}</Td>
                  <Td>{student.program}</Td>
                  <Td>{student.year}</Td>
                  <Td>
                    {isNew ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-slate-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden="true" />
                        Not rated
                      </span>
                    ) : (
                      <PriorityBadge level={level} />
                    )}
                  </Td>
                  <Td>
                    <div className="flex max-w-[250px] flex-wrap gap-1.5">
                      {student.keySignals.map((s) =>
                        s.includes("↓") ? <SignalWarningChip key={s}>{s}</SignalWarningChip> : <SignalChip key={s}>{s}</SignalChip>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <span className={cn("inline-flex items-center gap-1.5 text-[13px] font-medium", trend.direction === "down" ? "text-rose-600" : "text-slate-500")}>
                      {isNew ? null : trend.direction === "down" ? (
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                          <path d="M2 5l4.5 4.5L9 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14 8.5V12h-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                          <path d="M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      )}
                      {trend.label}
                    </span>
                  </Td>
                  <Td className="text-[13px] text-[#8296AD]">{student.lastUpdated}</Td>
                </Tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-sm text-[#8296AD]">
                  No students match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <DisclaimerNote>Support Priority is an assistive signal, not a diagnosis. Predictions are generated live on each student profile.</DisclaimerNote>
      </Card>
    </div>
  );
}
