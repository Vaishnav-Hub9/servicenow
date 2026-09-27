import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Info,
  ShieldCheck,
  Sliders,
  User,
} from "lucide-react";
import { Button, Card, PageHeader, SectionLabel } from "@/components/ui";
import { cn } from "@/lib/utils";

const toggleRow =
  "flex items-center justify-between gap-4 rounded-xl border border-[#EEF2F7] bg-white px-4 py-3.5 transition-colors hover:border-[#DDE4EC]";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
        checked ? "bg-teal-600" : "bg-[#CBD5E1]"
      )}
    >
      <span
        className={cn(
          "inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-[3px]"
        )}
      />
    </button>
  );
}

export function Settings() {
  const [threshold, setThreshold] = useState(0.4);
  const [savedFlash, setSavedFlash] = useState(false);
  const [notif, setNotif] = useState({
    dailyDigest: true,
    highPriority: true,
    mediumPriority: false,
    weeklyReport: true,
  });

  const handleSave = () => {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
  };

  return (
    <div className="mx-auto max-w-[980px]">
      <PageHeader title="Settings" subtitle="Configure your account, notifications and governance preferences." />

      <div className="space-y-5">
        {/* Account */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F5FA]">
              <User className="h-[18px] w-[18px] text-[#51617A]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold tracking-[-0.01em] text-[#16283C]">Account</h2>
              <p className="text-[12.5px] text-[#7A8AA0]">Your support-team profile</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-[12.5px] font-semibold text-[#51617A]">Full name</label>
              <input
                id="name"
                defaultValue="Support Team"
                className="h-10 w-full rounded-xl border border-[#DDE4EC] bg-white px-3.5 text-[13.5px] text-[#22303F] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              />
            </div>
            <div>
              <label htmlFor="role" className="mb-1.5 block text-[12.5px] font-semibold text-[#51617A]">Role</label>
              <select
                id="role"
                defaultValue="support"
                className="h-10 w-full rounded-xl border border-[#DDE4EC] bg-white px-3 text-[13.5px] text-[#22303F] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                <option value="support">Support Team — Central University</option>
                <option value="advisor">Academic Advisor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F5FA]">
              <Bell className="h-[18px] w-[18px] text-[#51617A]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold tracking-[-0.01em] text-[#16283C]">Notifications</h2>
              <p className="text-[12.5px] text-[#7A8AA0]">Choose what lands in your inbox</p>
            </div>
          </div>
          <div className="mt-5 space-y-2.5">
            {[
              { key: "dailyDigest" as const, label: "Daily attention digest", desc: "A morning summary of students needing attention" },
              { key: "highPriority" as const, label: "High priority alerts", desc: "Immediate note when a student is classified HIGH" },
              { key: "mediumPriority" as const, label: "Medium priority review queue", desc: "Weekly nudge for medium priority reviews" },
              { key: "weeklyReport" as const, label: "Weekly wellbeing report", desc: "Aggregated trends for the support leadership" },
            ].map((row) => (
              <div key={row.key} className={toggleRow}>
                <div>
                  <div className="text-[13.5px] font-medium text-[#22303F]">{row.label}</div>
                  <div className="text-[12.5px] text-[#7A8AA0]">{row.desc}</div>
                </div>
                <Toggle checked={notif[row.key]} onChange={(v) => setNotif((p) => ({ ...p, [row.key]: v }))} label={row.label} />
              </div>
            ))}
          </div>
        </Card>

        {/* Support Priority */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1F5FA]">
              <Sliders className="h-[18px] w-[18px] text-[#51617A]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold tracking-[-0.01em] text-[#16283C]">Support Priority</h2>
              <p className="text-[12.5px] text-[#7A8AA0]">How classification thresholds are displayed</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#EEF2F7] bg-[#FAFBFD] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[13.5px] font-semibold text-[#22303F]">HIGH threshold</div>
                <p className="mt-1 max-w-md text-[12.5px] leading-relaxed text-[#7A8AA0]">
                  Students are classified as HIGH when the model's HIGH probability reaches the configured threshold.
                </p>
              </div>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={threshold}
                onChange={(e) => setThreshold(Math.min(1, Math.max(0, Number(e.target.value) || 0)))}
                aria-label="HIGH probability threshold (display only)"
                className="h-11 w-28 rounded-xl border border-[#DDE4EC] bg-white px-3.5 text-[16px] font-bold tabular-nums text-[#16283C] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              />
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-white p-3.5 text-[12.5px] leading-relaxed text-[#7A8AA0]">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#8296AD]" aria-hidden="true" />
              Prototype note: this field is editable for demonstration only and does not modify the backend model
              threshold. The live model continues to use its own configured threshold ({threshold.toFixed(2)} shown here).
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50">
              <ShieldCheck className="h-[18px] w-[18px] text-teal-600" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold tracking-[-0.01em] text-[#16283C]">Privacy</h2>
              <p className="text-[12.5px] text-[#7A8AA0]">Governance defaults for this workspace</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {[
              "Role-based access enforced",
              "Audit logging enabled",
              "No automated diagnosis",
              "No automated disciplinary decisions",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 rounded-xl border border-[#EEF2F7] bg-white px-4 py-3 text-[13px] font-medium text-[#22303F]">
                <CheckCircle2 className="h-4 w-4 text-teal-600" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </Card>

        {/* Model information */}
        <Card className="p-6">
          <SectionLabel>Model information</SectionLabel>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ["Model", "Support Priority Model"],
              ["Status", "Active"],
              ["Mode", "Assistive • Human review required"],
              ["Endpoint", "POST /predict (FastAPI)"],
              ["Outputs", "LOW / MEDIUM / HIGH probability"],
              ["Explainability", "Per-signal explanations returned with each prediction"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-[#EEF2F7] bg-[#FAFBFD] px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8296AD]">{k}</div>
                <div className="mt-1 text-[13.5px] font-medium text-[#22303F]">{v}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Save */}
        <div className="flex items-center justify-end gap-3 pb-2">
          {savedFlash && (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-700" role="status">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Preferences saved (demo)
            </span>
          )}
          <Button variant="secondary" size="md">Cancel</Button>
          <Button variant="primary" size="md" onClick={handleSave}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}
