import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button, Card, SectionLabel } from "@/components/ui";
import { useDemoStudents } from "@/store/demoStudents";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";

const supportOptions = [
  {
    key: "advisor",
    icon: GraduationCap,
    title: "Talk to my advisor",
    description: "A one-on-one conversation with your assigned academic advisor.",
    tone: "bg-teal-50 text-teal-600",
  },
  {
    key: "explore",
    icon: Sparkles,
    title: "Explore support options",
    description: "See the university services available to you — no commitment needed.",
    tone: "bg-violet-50 text-violet-600",
  },
  {
    key: "not-now",
    icon: MessageCircle,
    title: "Not right now",
    description: "That's completely okay. Support remains available whenever you need it.",
    tone: "bg-slate-100 text-slate-500",
  },
];

const services = [
  { icon: GraduationCap, name: "Academic Advisor", detail: "Course planning, workload and academic guidance", tone: "bg-teal-50 text-teal-600" },
  { icon: HeartHandshake, name: "Counselling Services", detail: "Confidential conversations with trained counsellors", tone: "bg-rose-50 text-rose-500" },
  { icon: Users, name: "Peer Support", detail: "Connect with trained student peers who listen", tone: "bg-sky-50 text-sky-600" },
  { icon: BookOpen, name: "Academic Assistance", detail: "Tutoring, extensions and study-skills help", tone: "bg-amber-50 text-amber-600" },
];

export function CheckIn() {
  const { id } = useParams<{ id: string }>();
  const { getById } = useDemoStudents();
  const student = getById(id ?? "");
  const { notifyCheckIn } = useNotifications();
  const [selected, setSelected] = useState<string | null>(null);
  const [showServices, setShowServices] = useState(false);
  const [recorded, setRecorded] = useState(false);

  if (!student) {
    return (
      <div className="mx-auto max-w-[1320px]">
        <Card className="mx-auto max-w-lg p-8 text-center">
          <h1 className="text-[18px] font-bold text-[#16283C]">Student not found</h1>
          <Link to="/students" className="mt-3 inline-block text-[13.5px] font-medium text-teal-700 hover:underline">
            Back to Students
          </Link>
        </Card>
      </div>
    );
  }

  const handleSelect = (key: string) => {
    setSelected(key);
    setShowServices(key === "explore");
    if (!recorded) {
      setRecorded(true);
      // A recorded check-in creates a notification (prototype behavior).
      if (key !== "not-now") notifyCheckIn(student.name);
    }
  };

  return (
    <div className="mx-auto max-w-[860px]">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8296AD]">Student Support</div>
        <Link
          to={`/students/${student.id}`}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#5E7089] transition-colors hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to {student.name.split(" ")[0]}'s profile
        </Link>
        <h1 className="mt-3 text-[26px] font-bold tracking-[-0.015em] text-[#16283C]">{student.name}</h1>
        <p className="mt-1 text-[14px] text-[#7A8AA0]">
          {student.studentId} · {student.program}
        </p>
      </div>

      {/* Main card */}
      <Card className="overflow-hidden">
        <div className="px-7 py-8 sm:px-9">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/95 shadow-lg shadow-teal-500/20">
              <HeartHandshake className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#16283C]">Start a human check-in</h2>
              <p className="text-[13px] text-[#7A8AA0]">A private, no-pressure conversation</p>
            </div>
          </div>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#43536B]">
            "We've noticed a few changes in your recent academic activity. We wanted to check in and make sure you know
            support is available."
          </p>

          <SectionLabel className="mt-8">How would you like to proceed?</SectionLabel>
          <div className="mt-3.5 space-y-3">
            {supportOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => handleSelect(option.key)}
                aria-pressed={selected === option.key}
                className={cn(
                  "group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-150",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
                  selected === option.key
                    ? "border-teal-300 bg-teal-50/60 ring-1 ring-teal-200"
                    : "border-[#E8EDF3] bg-white hover:border-[#C9D4E0] hover:bg-[#FAFBFD]"
                )}
              >
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", option.tone)}>
                  <option.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-[#16283C]">{option.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-[#7A8AA0]">{option.description}</span>
                </span>
                <span
                  className={cn(
                    "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                    selected === option.key ? "border-teal-500 bg-teal-500" : "border-[#D5DEE8] bg-white group-hover:border-[#B7C4D2]"
                  )}
                  aria-hidden="true"
                >
                  {selected === option.key && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                </span>
              </button>
            ))}
          </div>

          {/* Support services */}
          {(showServices || selected === "advisor") && (
            <div className="animate-fade-up mt-7">
              <SectionLabel>Support options at Central University</SectionLabel>
              <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <div key={s.name} className="rounded-2xl border border-[#E8EDF3] bg-white p-4 transition-shadow hover:shadow-card-hover">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", s.tone)}>
                      <s.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-[13.5px] font-semibold text-[#16283C]">{s.name}</div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-[#7A8AA0]">{s.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation */}
          {recorded && (
            <div className="animate-fade-up mt-7 rounded-2xl border border-teal-200 bg-teal-50/70 p-5" role="status">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" />
                <div>
                  <div className="text-[14.5px] font-bold text-[#0F5F58]">Check-in recorded.</div>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#3E6B66]">
                    {selected === "not-now"
                      ? "We've noted that you'd like space for now. No further messages will be sent, and support remains available whenever you need it."
                      : selected === "advisor"
                      ? "Your advisor, " + student.advisor + ", has been noted for the check-in. Nothing is sent automatically — a real person decides the next step."
                      : "Your interest in support options has been recorded locally for this demo. No communication has been sent."}
                  </p>
                  <p className="mt-2 text-[12px] text-[#5E8681]">
                    Demo note: no messages are sent by WellAware. All outreach is human-controlled.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F0F3F8] bg-[#FAFBFD] px-7 py-4">
          <div className="flex items-center gap-2 text-[12.5px] text-[#7A8AA0]">
            <ShieldCheck className="h-4 w-4 text-teal-600" aria-hidden="true" />
            Private and confidential · Visible only to authorized support staff
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="secondary" size="md" onClick={() => { setSelected(null); setShowServices(false); setRecorded(false); }}>
              Reset demo
            </Button>
            <Button variant="primary" size="md" onClick={() => setRecorded(true)} disabled={!selected}>
              Record check-in
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
