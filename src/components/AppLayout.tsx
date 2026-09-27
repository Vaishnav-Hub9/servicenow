import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Activity,
  BarChart3,
  HeartHandshake,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Students", icon: Users },
  { to: "/signals", label: "Early Signals", icon: Activity },
  { to: "/support", label: "Support Actions", icon: HeartHandshake },
  { to: "/insights", label: "Insights", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-[248px] flex-col bg-navy-900 text-white lg:sticky lg:top-0 lg:h-screen">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 pb-5 pt-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/95 shadow-lg shadow-teal-500/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path
                d="M3 12h4l2.5-6 4 12 2.5-6h5"
                stroke="#0B3A47"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-[16px] font-bold leading-tight tracking-[-0.01em]">WellAware</div>
            <div className="mt-0.5 text-[10.5px] leading-snug text-navy-200/90">
              Notice earlier.
              <br />
              Support sooner.
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav aria-label="Primary" className="mt-2 flex-1 space-y-1 px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end as boolean | undefined}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400",
                  isActive
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-navy-100/80 hover:bg-white/[0.06] hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn("h-[18px] w-[18px] transition-colors", isActive ? "text-teal-300" : "text-navy-200/70 group-hover:text-teal-200/90")}
                    aria-hidden="true"
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="space-y-1 px-3 pb-3">
          <NavLink
            to="/privacy"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400",
                isActive ? "bg-white/10 text-white" : "text-navy-100/70 hover:bg-white/[0.06] hover:text-white"
              )
            }
          >
            <ShieldCheck className="h-[18px] w-[18px] text-navy-200/70" aria-hidden="true" />
            Privacy &amp; Governance
          </NavLink>

          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5">
            <button
              type="button"
              className="flex w-full items-center gap-3 text-left"
              aria-label="Support Team account"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-500/90 text-[11px] font-bold text-[#082F36]">
                ST
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-white">Support Team</span>
                <span className="block truncate text-[11px] text-navy-200/80">Central University</span>
              </span>
              <ChevronDown className="h-4 w-4 text-navy-200/70" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main key={location.pathname} className="animate-fade-up flex-1 px-6 py-8 lg:px-9 lg:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
