import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, CalendarCheck, GraduationCap, Info, Users } from "lucide-react";
import { Card, PageHeader, SectionLabel, DisclaimerNote } from "@/components/ui";
import { checkInLog, priorityDistribution, signalTrends } from "@/data/students";

const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #E8EDF3",
    boxShadow: "0 4px 16px rgba(15,36,55,0.08)",
    fontSize: 12,
    padding: "8px 12px",
  },
};

const attentionData = signalTrends.map((w, i) => ({
  week: w.week,
  students: [8, 9, 10, 12][i] ?? 0,
}));

const workloadData = [
  { day: "Mon", checkIns: 4, reviews: 3 },
  { day: "Tue", checkIns: 5, reviews: 2 },
  { day: "Wed", checkIns: 3, reviews: 4 },
  { day: "Thu", checkIns: 6, reviews: 3 },
  { day: "Fri", checkIns: 4, reviews: 2 },
];

export function Insights() {
  return (
    <div className="mx-auto max-w-[1320px]">
      <PageHeader
        title="Wellbeing Intelligence"
        subtitle="Aggregated, anonymized patterns to help support teams plan earlier outreach."
        right={
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2">
            <Info className="h-4 w-4 text-amber-600" aria-hidden="true" />
            <span className="text-[12.5px] font-semibold text-amber-700">Synthetic demonstration data</span>
          </div>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Students monitored", value: "290", icon: Users, tone: "bg-[#EEF2F7] text-[#51617A]" },
          { label: "Needing attention", value: "12", icon: Activity, tone: "bg-rose-50 text-rose-500" },
          { label: "Check-ins completed", value: "18", icon: CalendarCheck, tone: "bg-teal-50 text-teal-600" },
          { label: "Avg. days to check-in", value: "2.4", icon: GraduationCap, tone: "bg-amber-50 text-amber-600" },
        ].map((kpi, i) => (
          <Card key={kpi.label} className="animate-fade-up p-5" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-center gap-3.5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.tone}`}>
                <kpi.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[12.5px] font-medium text-[#5E7089]">{kpi.label}</div>
                <div className="text-[22px] font-bold leading-tight tracking-[-0.01em] text-[#16283C]">{kpi.value}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Distribution + trends */}
      <div className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <Card className="animate-fade-up p-6" style={{ animationDelay: "100ms" }}>
          <SectionLabel>Support Priority Distribution</SectionLabel>
          <h2 className="mt-1 text-[16.5px] font-bold tracking-[-0.01em] text-[#16283C]">
            Current cohort snapshot
          </h2>
          <div className="mt-2 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {priorityDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(value: number | string, name) => [`${value} students`, String(name)]} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-[12.5px] text-[#5E7089]">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="animate-fade-up p-6" style={{ animationDelay: "160ms" }}>
          <SectionLabel>Signal Trends</SectionLabel>
          <h2 className="mt-1 text-[16.5px] font-bold tracking-[-0.01em] text-[#16283C]">
            Observable signal changes over four weeks
          </h2>
          <div className="mt-2 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signalTrends} margin={{ top: 8, right: 12, bottom: 0, left: -14 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} formatter={(value: number | string, name) => [`${value} students`, String(name)]} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-[12.5px] text-[#5E7089]">{value}</span>}
                />
                <Line type="monotone" dataKey="attendance" name="Attendance" stroke="#F43F5E" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="assignments" name="Assignments" stroke="#D97706" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="grades" name="Grades" stroke="#0F766E" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="engagement" name="Engagement" stroke="#7C3AED" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Attention + workload */}
      <div className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <Card className="animate-fade-up p-6" style={{ animationDelay: "220ms" }}>
          <SectionLabel>Students Needing Attention</SectionLabel>
          <h2 className="mt-1 text-[16.5px] font-bold tracking-[-0.01em] text-[#16283C]">
            Weekly trend of students with multiple changing signals
          </h2>
          <div className="mt-2 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attentionData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} cursor={{ fill: "#F1F5FA" }} />
                <Bar dataKey="students" name="Students" fill="#0D9488" radius={[6, 6, 0, 0]} maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="animate-fade-up p-6" style={{ animationDelay: "280ms" }}>
          <SectionLabel>Support Workload</SectionLabel>
          <h2 className="mt-1 text-[16.5px] font-bold tracking-[-0.01em] text-[#16283C]">
            Check-ins and reviews by weekday
          </h2>
          <div className="mt-2 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} cursor={{ fill: "#F1F5FA" }} />
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-[12.5px] text-[#5E7089]">{value}</span>} />
                <Bar dataKey="checkIns" name="Check-ins" fill="#0D9488" radius={[5, 5, 0, 0]} maxBarSize={22} />
                <Bar dataKey="reviews" name="Reviews" fill="#93AFC9" radius={[5, 5, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <DisclaimerNote className="mt-5 px-1">
        Synthetic demonstration data — these charts do not represent real university statistics. Support Priority is an
        assistive signal, not a diagnosis.
      </DisclaimerNote>
    </div>
  );
}
