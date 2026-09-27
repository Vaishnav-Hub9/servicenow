import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ClipboardList, Eye, Inbox, RotateCcw } from "lucide-react";
import { Button, Card, PageHeader, PriorityBadge, SectionLabel, DisclaimerNote } from "@/components/ui";
import { supportActions, students } from "@/data/students";
import type { SupportAction } from "@/data/students";
import { cn } from "@/lib/utils";

function Avatar({ studentId }: { studentId: string }) {
  const student = students.find((s) => s.id === studentId);
  if (!student) return null;
  return (
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
  );
}

function ActionRow({
  action,
  onToggle,
}: {
  action: SupportAction;
  onToggle: (id: string) => void;
}) {
  const student = students.find((s) => s.id === action.studentId);
  if (!student) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors hover:bg-[#F8FAFC]">
      <div className="flex min-w-[220px] flex-1 items-center gap-3">
        <Avatar studentId={action.studentId} />
        <div>
          <Link
            to={`/students/${student.id}`}
            className="text-[13.5px] font-semibold text-[#16283C] transition-colors hover:text-teal-700"
          >
            {student.name}
          </Link>
          <div className="text-[12px] text-[#8296AD]">
            {student.studentId} · {student.program.split("•")[1]?.trim()}
          </div>
        </div>
      </div>
      <PriorityBadge level={action.priority} />
      <div className="min-w-[170px] flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8296AD]">Recommended</div>
        <div className="mt-0.5 text-[13px] font-medium text-[#22303F]">{action.recommended}</div>
      </div>
      <div className="w-[90px] text-[12.5px] text-[#7A8AA0]">{action.due}</div>
      <div className="w-[110px] text-[12.5px] text-[#7A8AA0]">{action.assignee}</div>
      <div className="flex items-center gap-2">
        {action.status === "pending" ? (
          <>
            <Link
              to={`/students/${student.id}/check-in`}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-teal-700"
            >
              Start Check-in
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              to={`/students/${student.id}`}
              aria-label={`View student ${student.name}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE4EC] bg-white text-[#51617A] transition-colors hover:bg-[#F6F8FB]"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggle(action.id)}
              aria-label={`Mark ${student.name}'s check-in as completed`}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Mark completed</span>
            </Button>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Completed {action.completedOn}
            </span>
            <Button variant="ghost" size="sm" onClick={() => onToggle(action.id)} aria-label={`Reopen ${student.name}'s action`}>
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">Reopen</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function SupportActions() {
  const [actions, setActions] = useState<SupportAction[]>(supportActions);

  const toggle = (id: string) =>
    setActions((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: a.status === "pending" ? "completed" : "pending",
              completedOn: a.status === "pending" ? "Just now" : undefined,
            }
          : a
      )
    );

  const pending = useMemo(() => actions.filter((a) => a.status === "pending" && a.type === "check-in"), [actions]);
  const completed = useMemo(() => actions.filter((a) => a.status === "completed" && a.type === "check-in"), [actions]);
  const followUps = useMemo(() => actions.filter((a) => a.type === "follow-up"), [actions]);

  const sectionCard = (title: string, items: SupportAction[], SectionIcon: typeof Inbox, subtitle: string) => (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[#F0F3F8] px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F5FA]">
          <SectionIcon className="h-[18px] w-[18px] text-[#51617A]" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-[15px] font-bold tracking-[-0.01em] text-[#16283C]">{title}</h2>
          <p className="text-[12.5px] text-[#7A8AA0]">{subtitle}</p>
        </div>
        <span className="ml-auto rounded-full bg-[#F1F5FA] px-2.5 py-0.5 text-[12px] font-semibold text-[#51617A]">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <div className="px-5 py-10 text-center text-[13px] text-[#8296AD]">
          Nothing here right now — all caught up.
        </div>
      ) : (
        <div className="divide-y divide-[#F0F3F8]">
          {items.map((a) => (
            <ActionRow key={a.id} action={a} onToggle={toggle} />
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <div className="mx-auto max-w-[1320px]">
      <PageHeader
        title="Support Actions"
        subtitle="Every action is human-controlled. WellAware never sends messages automatically."
        right={
          <div className="flex items-center gap-2 rounded-xl border border-[#E8EDF3] bg-white px-3.5 py-2 shadow-card">
            <ClipboardList className="h-4 w-4 text-teal-600" aria-hidden="true" />
            <span className="text-[12.5px] font-medium text-[#51617A]">
              {pending.length} pending · {completed.length} completed
            </span>
          </div>
        }
      />

      <div className="space-y-5">
        {sectionCard("Pending Check-ins", pending, Inbox, "Human check-ins waiting to be started")}
        {sectionCard("Completed Check-ins", completed, CheckCircle2, "Recently closed check-ins with notes")}
        {sectionCard("Follow-ups", followUps, RotateCcw, "Scheduled follow-ups from earlier support actions")}

        <DisclaimerNote className="px-1">
          WellAware does not automatically contact students. Staff decide when and how to reach out. Support Priority is
          an assistive signal, not a diagnosis.
        </DisclaimerNote>
      </div>
    </div>
  );
}
