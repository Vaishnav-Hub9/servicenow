import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  CircleAlert,
  Clock,
  Layers,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Card, DisclaimerNote, LinkButton, PriorityBadge, SectionLabel, SignalWarningChip, SignalChip, Table, Td, Th, THead, Tr } from "@/components/ui";
import { NotificationCenter } from "@/components/NotificationCenter";
import { MODEL_STATUS, students, directoryPriorities } from "@/data/students";
import { cn } from "@/lib/utils";

const kpis = [
  { label: "Students monitored", value: "290", sub: "All active", icon: Users, iconBg: "bg-[#EEF2F7]", iconColor: "text-[#51617A]" },
  { label: "High priority", value: "12", sub: "+3 this week", icon: CircleAlert, iconBg: "bg-rose-50", iconColor: "text-rose-500" },
  { label: "Medium priority", value: "31", sub: "Needs review", icon: Layers, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
  { label: "Check-ins this week", value: "18", sub: "+12% vs last week", icon: CalendarCheck, iconBg: "bg-teal-50", iconColor: "text-teal-600" },
];

const rows = [
  { studentId: "arjun", keySignals: ["Attendance ↓ 24%", "3 missed assignments"], trend: "Declining" as const, direction: "down" as const, action: "Advisor check-in", updated: "12 min ago" },
  { studentId: "sneha", keySignals: ["Attendance ↓ 9%", "Engagement ↓"], trend: "Declining" as const, direction: "down" as const, action: "Review", updated: "32 min ago" },
  { studentId: "rahul", keySignals: ["Stable"], trend: "Stable" as const, direction: "flat" as const, action: "No action", updated: "1 hr ago" },
];

const trendStyles = {
  down: "text-rose-600",
  flat: "text-slate-500",
} as const;

export function Overview() {
  const now = new Date();
  const dateLine = now.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" }).toUpperCase();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto max-w-[1320px]">
      {/* Header */}
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8296AD]">{dateLine}</div>
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.015em] text-[#16283C]">
            {greeting}, Support Team
          </h1>
          <p className="mt-1 text-[15px] text-[#5E7089]">Here's what needs your attention today.</p>
        </div>
        <div className="flex items-center gap-3">
          <LinkButton to="/analyze" variant="primary" size="md">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Analyze Student
          </LinkButton>
          <div className="flex items-center gap-2 rounded-xl border border-[#E8EDF3] bg-white px-3.5 py-2 shadow-card">
            <ShieldCheck className="h-4 w-4 text-teal-600" aria-hidden="true" />
            <span className="text-[12.5px] font-medium text-[#51617A]">
              Student data protected <span className="mx-1 text-[#C3D0DE]">·</span> Role-based access
            </span>
          </div>
          <NotificationCenter />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => (
          <Card
            key={kpi.label}
            className="animate-fade-up p-5 transition-shadow hover:shadow-card-hover"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", kpi.iconBg)}>
                <kpi.icon className={cn("h-5 w-5", kpi.iconColor)} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-[#5E7089]">{kpi.label}</div>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-[24px] font-bold leading-none tracking-[-0.01em] text-[#16283C]">{kpi.value}</span>
                  <span className="truncate text-[11.5px] text-[#8296AD]">{kpi.sub}</span>
                </div>
          </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[1fr_300px]">
        {/* Attention table */}
        <Card className="animate-fade-up overflow-hidden" style={{ animationDelay: "120ms" }}>
          <div className="flex flex-wrap items-start justify-between gap-3 px-6 pb-4 pt-5">
            <div>
              <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-[#16283C]">Students needing attention</h2>
              <p className="mt-0.5 text-[13px] text-[#7A8AA0]">Prioritized by recent changes across observable signals</p>
            </div>
            <LinkButton to="/students" variant="secondary" size="sm">
              View all students
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </LinkButton>
          </div>

          <Table>
            <THead>
              <Th>Student</Th>
              <Th>Support Priority</Th>
              <Th>Key Signals</Th>
              <Th>Trend</Th>
              <Th>Recommended Action</Th>
              <Th>Last Updated</Th>
            </THead>
            <tbody>
              {rows.map((row) => {
                const student = students.find((s) => s.id === row.studentId)!;
                const priority = directoryPriorities[row.studentId];
                return (
                  <Tr key={row.studentId}>
                    <Td>
                      <Link to={`/students/${student.id}`} className="group flex items-center gap-3 rounded-lg outline-offset-4">
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
                            student.avatarTone === "rose" && "bg-rose-50 text-rose-600",
                            student.avatarTone === "amber" && "bg-amber-50 text-amber-600",
                            student.avatarTone === "teal" && "bg-teal-50 text-teal-600"
                          )}
                          aria-hidden="true"
                        >
                          {student.initials}
                        </span>
                        <span>
                          <span className="block text-[13.5px] font-semibold text-[#16283C] group-hover:text-teal-700 transition-colors">
                            {student.name}
                          </span>
                          <span className="block text-[12px] text-[#8296AD]">{student.studentId}</span>
                        </span>
                      </Link>
                    </Td>
                    <Td><PriorityBadge level={priority} /></Td>
                    <Td>
                      <div className="flex max-w-[240px] flex-wrap gap-1.5">
                        {row.keySignals.map((s) =>
                          row.direction === "down" && s.includes("↓") ? (
                            <SignalWarningChip key={s}>{s}</SignalWarningChip>
                          ) : (
                            <SignalChip key={s}>{s}</SignalChip>
                          )
                        )}
                      </div>
                    </Td>
                    <Td>
                      <span className={cn("inline-flex items-center gap-1.5 text-[13px] font-medium", trendStyles[row.direction])}>
                        {row.direction === "down" ? (
                          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                            <path d="M2 5l4.5 4.5L9 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 8.5V12h-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                            <path d="M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        )}
                        {row.trend}
                      </span>
                    </Td>
                    <Td className="font-medium text-[#16283C]">{row.action}</Td>
                    <Td className="text-[13px] text-[#8296AD]">{row.updated}</Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
          <DisclaimerNote>Support Priority is an assistive signal, not a diagnosis.</DisclaimerNote>
        </Card>

        {/* Right column */}
        <div className="space-y-5">
          {/* Why this matters */}
          <Card className="animate-fade-up overflow-hidden bg-gradient-to-b from-teal-50/80 to-white" style={{ animationDelay: "180ms" }}>
            <div className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/95 shadow-md shadow-teal-500/20">
                <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <SectionLabel className="mt-4 text-teal-700/90">Why this matters</SectionLabel>
              <h3 className="mt-1.5 text-[19px] font-bold leading-snug tracking-[-0.01em] text-[#16283C]">
                12 students showing multiple changing signals
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#5E7089]">
                Earlier human check-ins can be considered.
              </p>
              <button
                type="button"
                aria-label="Learn more about why this matters"
                className="mt-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#7A8AA0] transition-colors hover:bg-[#F6F8FB]"
              >
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </Card>

          {/* Model status */}
          <Card className="animate-fade-up p-5" style={{ animationDelay: "240ms" }}>
            <div className="flex items-start justify-between">
              <SectionLabel>Model status</SectionLabel>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-teal-500" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-500" />
                </span>
                {MODEL_STATUS.state}
              </span>
            </div>
            <div className="mt-3 text-[14.5px] font-semibold text-[#16283C]">{MODEL_STATUS.name}</div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#7A8AA0]">{MODEL_STATUS.note}</p>
            <div className="mt-4 space-y-2 rounded-xl bg-[#F8FAFC] p-3.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5 text-[#7A8AA0]">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  Last evaluated
                </span>
                <span className="font-medium text-[#43536B]">{MODEL_STATUS.lastEvaluated}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#7A8AA0]">Review mode</span>
                <span className="font-medium text-[#43536B]">Human-in-the-loop</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
