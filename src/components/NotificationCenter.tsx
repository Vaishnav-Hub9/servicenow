import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  GraduationCap,
  HeartPulse,
  Info,
  Sparkles,
  TriangleAlert,
  BellOff,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { formatNotificationTime, type AppNotification, type NotificationPriority } from "@/data/notifications";
import { cn } from "@/lib/utils";

/* ------------------------- Priority visual accents ------------------------ */

const priorityAccent: Record<NotificationPriority, { iconBg: string; iconColor: string; Icon: typeof Info }> = {
  HIGH: { iconBg: "bg-rose-50", iconColor: "text-rose-500", Icon: TriangleAlert },
  MEDIUM: { iconBg: "bg-amber-50", iconColor: "text-amber-500", Icon: HeartPulse },
  INFO: { iconBg: "bg-sky-50", iconColor: "text-sky-500", Icon: Info },
  SUCCESS: { iconBg: "bg-emerald-50", iconColor: "text-emerald-500", Icon: CheckCheck },
};

function NotificationRow({ notification, onOpen }: { notification: AppNotification; onOpen: (n: AppNotification) => void }) {
  const accent = priorityAccent[notification.priority];
  const Icon = accent.Icon;

  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className={cn(
        "group flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600",
        notification.read ? "bg-white hover:bg-[#F8FAFC]" : "bg-teal-50/40 hover:bg-teal-50/70"
      )}
    >
      <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", accent.iconBg)}>
        <Icon className={cn("h-[18px] w-[18px]", accent.iconColor)} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "text-[13px] leading-snug",
              notification.read ? "font-medium text-[#7A8AA0]" : "font-semibold text-[#16283C]"
            )}
          >
            {notification.title}
          </span>
          {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" aria-label="Unread" />}
        </span>
        <span className={cn("mt-0.5 block text-[12.5px] leading-snug", notification.read ? "text-[#9AA9BC]" : "text-[#5E7089]")}>
          {notification.message}
        </span>
        <span className="mt-1.5 flex items-center gap-2.5">
          <span className="text-[11.5px] text-[#8296AD]">{formatNotificationTime(notification.createdAt)}</span>
          <span
            className={cn(
              "text-[11.5px] font-semibold transition-colors",
              notification.read ? "text-[#9AA9BC]" : "text-teal-700 group-hover:text-teal-800"
            )}
          >
            {notification.cta}
            <span aria-hidden="true"> →</span>
          </span>
        </span>
      </span>
    </button>
  );
}

/* -------------------------------- Bell ----------------------------------- */

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [justMarkedAll, setJustMarkedAll] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => (tab === "unread" ? notifications.filter((n) => !n.read) : notifications),
    [notifications, tab]
  );

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click and Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const handleOpenNotification = (n: AppNotification) => {
    markAsRead(n.id);
    close();
    navigate(n.route);
  };

  const handleMarkAll = () => {
    markAllAsRead();
    setJustMarkedAll(true);
    window.setTimeout(() => setJustMarkedAll(false), 2600);
  };

  return (
    <div className="relative" ref={rootRef}>
      {/* Bell button (existing position, now functional) */}
      <button
        type="button"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-xl border bg-white text-[#51617A] shadow-card transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
          open ? "border-[#C9D4E0] bg-[#F6F8FB]" : "border-[#E8EDF3] hover:bg-[#F6F8FB]"
        )}
      >
        <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
          <path
            d="M10 3a5 5 0 0 0-5 5v2.6c0 .5-.2 1-.5 1.4L3.4 13.5c-.5.7 0 1.5.8 1.5h11.6c.8 0 1.3-.8.8-1.5l-1.1-1.5a2.3 2.3 0 0 1-.5-1.4V8a5 5 0 0 0-5-5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M8.5 17a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none text-white shadow-sm",
              unreadCount > 9 ? "bg-rose-500" : "bg-rose-500"
            )}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover */}
      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="animate-fade-up absolute right-0 top-12 z-50 w-[380px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-[#E8EDF3] bg-white shadow-card-hover"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F0F3F8] px-4 py-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-teal-600" aria-hidden="true" />
              <h2 className="text-[14px] font-bold tracking-[-0.01em] text-[#16283C]">Notifications</h2>
            </div>
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={unreadCount === 0}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-medium transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
                unreadCount === 0
                  ? "cursor-default text-[#B7C4D2]"
                  : "text-teal-700 hover:bg-teal-50"
              )}
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Mark all as read
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-[#F0F3F8] px-4 py-2">
            {(
              [
                { key: "all" as const, label: `All${unreadCount > 0 ? ` · ${notifications.length}` : ""}` },
                { key: "unread" as const, label: `Unread${unreadCount > 0 ? ` · ${unreadCount}` : ""}` },
              ]
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-pressed={tab === t.key}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
                  tab === t.key ? "bg-[#F1F5FA] text-[#16283C]" : "text-[#7A8AA0] hover:bg-[#F8FAFC]"
                )}
              >
                {t.label}
              </button>
            ))}
            {justMarkedAll && (
              <span className="ml-auto inline-flex items-center gap-1 text-[11.5px] font-medium text-teal-700" role="status">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                All notifications marked as read.
              </span>
            )}
          </div>

          {/* List */}
          <div className="max-h-[520px] overflow-y-auto scrollbar-thin">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1F5FA]">
                  <BellOff className="h-5 w-5 text-[#8296AD]" aria-hidden="true" />
                </div>
                <div className="mt-3 text-[14px] font-semibold text-[#16283C]">You're all caught up.</div>
                <p className="mt-1 text-[12.5px] text-[#7A8AA0]">No new support alerts or updates.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F0F3F8]">
                {visible.map((n) => (
                  <NotificationRow key={n.id} notification={n} onOpen={handleOpenNotification} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
