import { Link } from "react-router-dom";
import {
  BarChart3,
  CalendarClock,
  CalendarX,
  ClipboardList,
  GraduationCap,
  HeartHandshake,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Card, PageHeader, PriorityBadge, SectionLabel, DisclaimerNote } from "@/components/ui";
import { directoryPriorities, signalTrends, students } from "@/data/students";
import { cn } from "@/lib/utils";

const signalTypes = [
  { key: "attendance", label: "Attendance decline", icon: CalendarX, color: "#F43F5E", count: 31, detail: "Students with meaningful attendance drops", dataKey: "attendance" },
  { key: "assignments", label: "Assignment completion", icon: ClipboardList, color: "#D97706", count: 26, detail: "Lower completion and missed assignments", dataKey: "assignments" },
  { key: "grades", label: "Grade decline", icon: GraduationCap, color: "#0F766E", count: 17, detail: "Falling average grades across assessments", dataKey: "grades" },
  { key: "engagement", label: "Engagement decline", icon: HeartHandshake, color: "#7C3AED", count: 34, detail: "Reduced LMS and campus engagement", dataKey: "engagement" },
  { key: "missed", label: "Missed classes", icon: CalendarX, color: "#E11D48", count: 21, detail: "Repeated absences across timetabled classes", dataKey: "attendance" },
  { key: "late", label: "Late submissions", icon: CalendarClock, color: "#EA580C", count: 24, detail: "Deadlines missed across active courses", dataKey: "assignments" },
];

const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #E8EDF3",
    boxShadow: "0 4px 16px rgba(15,36,55,0.08)",
    fontSize: 12,
    padding: "8px 12px",
  },
};

export function EarlySignals() {
  const multiSignal = students.filter((s) => s.keySignals.length > 1);

  return (
    <div className="mx-auto max-w-[1320px]">
      <PageHeader
        title="Early Signals"
        subtitle="Surface meaningful changes across observable student signals."
        right={
          <div className="flex items-center gap-2 rounded-xl border border-[#E8EDF3] bg-white px-3.5 py-2 shadow-card">
            <Users className="h-4 w-4 text-[#8296AD]" aria-hidden="true" />
            <span className="text-[12.5px] font-medium text-[#51617A]">
              {multiSignal.length} students with multiple changing signals
            </span>
          </div>
        }
      />

      {/* Signal type cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {signalTypes.map((sig, i) => (
          <Card key={sig.key} className="animate-fade-up p-5 transition-shadow hover:shadow-card-hover" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl")} style={{ backgroundColor: `${sig.color}14` }}>
                <sig.icon className="h-5 w-5" style={{ color: sig.color }} aria-hidden="true" />
              </div>
              <span className="text-[12px] font-semibold text-[#8296AD]">{sig.count} students</span>
            </div>
            <h3 className="mt-3.5 text-[14.5px] font-bold tracking-[-0.01em] text-[#16283C]">{sig.label}</h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#7A8AA0]">{sig.detail}</p>
            <div className="mt-4 h-[72px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signalTrends} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                  <defs>
                    <linearGradient id={`grad-${sig.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={sig.color} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={sig.color} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" hide />
                  <Tooltip
                    {...tooltipStyle}
                    cursor={{ stroke: "#E8EDF3" }}
                    formatter={(value: number | string) => [`${value} students`, "Signal count"]}
                  />
                  <Area
                    type="monotone"
                    dataKey={sig.dataKey}
                    stroke={sig.color}
                    strokeWidth={2}
                    fill={`url(#grad-${sig.key})`}
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ))}
      </div>

      {/* Multi-signal students */}
      <Card className="animate-fade-up mt-5 overflow-hidden" style={{ animationDelay: "200ms" }}>
        <div className="px-6 pb-4 pt-5">
          <SectionLabel>Students with multiple changing signals</SectionLabel>
          <h2 className="mt-1 text-[16.5px] font-bold tracking-[-0.01em] text-[#16283C]">
            Cross-signal changes worth a human check-in
          </h2>
          <p className="mt-1 text-[13px] text-[#7A8AA0]">
            These students show more than one meaningful change across observable academic and engagement signals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 pb-6 md:grid-cols-2 xl:grid-cols-3">
          {multiSignal.map((student) => (
            <Link
              key={student.id}
              to={`/students/${student.id}`}
              className="group rounded-2xl border border-[#E8EDF3] bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold",
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
                  <div>
                    <div className="text-[13.5px] font-semibold text-[#16283C] group-hover:text-teal-700 transition-colors">
                      {student.name}
                    </div>
                    <div className="text-[12px] text-[#8296AD]">{student.studentId}</div>
                  </div>
                </div>
                <PriorityBadge level={directoryPriorities[student.id]} />
              </div>
              <div className="mt-3.5 grid grid-cols-2 gap-2 text-[12px]">
                <div className="rounded-lg bg-[#F8FAFC] px-2.5 py-1.5">
                  <div className="text-[#8296AD]">Attendance</div>
                  <div className="font-semibold text-[#22303F]">{student.attendance_rate}%</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFC] px-2.5 py-1.5">
                  <div className="text-[#8296AD]">Completion</div>
                  <div className="font-semibold text-[#22303F]">{student.assignment_completion}%</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="border-t border-[#F0F3F8] px-6 py-4">
          <div className="flex items-center gap-2 text-[12.5px] text-[#7A8AA0]">
            <BarChart3 className="h-4 w-4 text-[#8296AD]" aria-hidden="true" />
            Counts reflect observable signal changes, not clinical indicators.
          </div>
        </div>
      </Card>

      {/* Aggregate trend chart */}
      <Card className="animate-fade-up mt-5 p-6" style={{ animationDelay: "260ms" }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <SectionLabel>Signal trends</SectionLabel>
            <h2 className="mt-1 text-[16.5px] font-bold tracking-[-0.01em] text-[#16283C]">
              Observable signal changes across the cohort
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 text-[12px] font-medium text-[#5E7089]">
            {[
              ["Attendance", "#F43F5E"],
              ["Assignments", "#D97706"],
              ["Grades", "#0F766E"],
              ["Engagement", "#7C3AED"],
            ].map(([label, color]) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-5 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={signalTrends} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <Tooltip
                {...tooltipStyle}
                cursor={{ fill: "#F1F5FA" }}
                formatter={(value: number | string) => [`${value} students`, ""]}
              />
              <Bar dataKey="attendance" name="Attendance" fill="#F43F5E" radius={[5, 5, 0, 0]} maxBarSize={26} />
              <Bar dataKey="assignments" name="Assignments" fill="#D97706" radius={[5, 5, 0, 0]} maxBarSize={26} />
              <Bar dataKey="grades" name="Grades" fill="#0F766E" radius={[5, 5, 0, 0]} maxBarSize={26} />
              <Bar dataKey="engagement" name="Engagement" fill="#7C3AED" radius={[5, 5, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <DisclaimerNote className="px-0 pt-4">
          Synthetic demonstration data. Observable signals only — not clinical or mental-health indicators.
        </DisclaimerNote>
      </Card>
    </div>
  );
}
