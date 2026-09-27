import {
  BadgeCheck,
  Eye,
  FileLock2,
  ScrollText,
  ShieldCheck,
  UserCheck,
  Ban,
} from "lucide-react";
import { Card, PageHeader, SectionLabel } from "@/components/ui";

const principles = [
  {
    icon: UserCheck,
    title: "Human-in-the-loop",
    desc: "Every support priority is reviewed by authorized staff before any action. The model informs — people decide.",
    tone: "bg-teal-50 text-teal-600",
  },
  {
    icon: Eye,
    title: "Role-based access",
    desc: "Only authorized support staff can view student profiles and signals. Access is scoped to the minimum needed.",
    tone: "bg-sky-50 text-sky-600",
  },
  {
    icon: ScrollText,
    title: "Audit logging",
    desc: "Profile views, check-ins and support actions are logged for accountability and transparency.",
    tone: "bg-violet-50 text-violet-600",
  },
  {
    icon: FileLock2,
    title: "Synthetic demonstration data",
    desc: "This deployment uses synthetic demonstration data. No real student records are processed or stored.",
    tone: "bg-amber-50 text-amber-600",
  },
];

const exclusions = [
  "No automated diagnosis",
  "No automated disciplinary decisions",
  "No mental-health predictions",
  "No automated messages to students",
];

export function Privacy() {
  return (
    <div className="mx-auto max-w-[980px]">
      <PageHeader
        title="Privacy & Governance"
        subtitle="How WellAware protects students and keeps humans in charge of support."
      />

      {/* Prominent statement */}
      <Card className="animate-fade-up overflow-hidden border-teal-200/80 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="flex items-start gap-4 p-7">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <ShieldCheck className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <SectionLabel className="text-teal-100/90">Our commitment</SectionLabel>
            <p className="mt-2 text-[19px] font-bold leading-snug tracking-[-0.01em] text-white">
              AI-generated support priority is an assistive signal, not a diagnosis.
            </p>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-teal-50/90">
              WellAware surfaces meaningful changes in observable academic and engagement signals so that trained staff
              can start supportive human conversations earlier. It never labels, diagnoses or penalizes students.
            </p>
          </div>
        </div>
      </Card>

      {/* Principles */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {principles.map((p, i) => (
          <Card key={p.title} className="animate-fade-up p-6" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${p.tone}`}>
              <p.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-3.5 text-[15.5px] font-bold tracking-[-0.01em] text-[#16283C]">{p.title}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#7A8AA0]">{p.desc}</p>
          </Card>
        ))}
      </div>

      {/* What WellAware never does */}
      <Card className="animate-fade-up mt-5 p-6" style={{ animationDelay: "240ms" }}>
        <SectionLabel>What WellAware never does</SectionLabel>
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {exclusions.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl border border-[#EEF2F7] bg-[#FAFBFD] px-4 py-3">
              <Ban className="h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
              <span className="text-[13px] font-medium text-[#22303F]">{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Governance detail */}
      <Card className="animate-fade-up mt-5 p-6" style={{ animationDelay: "300ms" }}>
        <SectionLabel>Governance detail</SectionLabel>
        <div className="mt-4 space-y-4 text-[13.5px] leading-relaxed text-[#43536B]">
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
            <p>
              <strong className="font-semibold text-[#16283C]">Purpose limitation.</strong> Signals are used solely to
              enable earlier, supportive human contact. They are never used for admissions, grading, placements or
              discipline.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
            <p>
              <strong className="font-semibold text-[#16283C]">Transparency.</strong> Every prediction is accompanied by
              per-signal explanations and a visible disclaimer, so staff always understand what the model observed.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
            <p>
              <strong className="font-semibold text-[#16283C]">Oversight.</strong> The Support Priority Model is
              periodically re-evaluated by the university wellbeing committee, and any staff member can contest a
              classification through the governance board.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
