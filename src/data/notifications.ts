/**
 * Centralized notification data for the WellAware notification center.
 * Seeded demo activity; runtime events (ML analyses, check-ins) append here
 * via the NotificationContext. Persisted to localStorage for the prototype.
 */

export type NotificationPriority = "HIGH" | "MEDIUM" | "INFO" | "SUCCESS";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  /** Epoch ms — display strings are derived from this. */
  createdAt: number;
  read: boolean;
  priority: NotificationPriority;
  /** In-app route to open when the notification (or its CTA) is clicked. */
  route: string;
  /** Call-to-action label, e.g. "View student". */
  cta: string;
}

const MIN = 60 * 1000;
const HOUR = 60 * MIN;

/** Seed activity so the center is immediately useful on first load. */
export function seedNotifications(): AppNotification[] {
  const now = Date.now();
  return [
    {
      id: "seed-high-priority",
      title: "High priority student",
      message: "Arjun Kumar has been identified with a HIGH support priority. Multiple observable signals are changing.",
      createdAt: now - 12 * MIN,
      read: false,
      priority: "HIGH",
      route: "/students/arjun",
      cta: "View student",
    },
    {
      id: "seed-checkin-reminder",
      title: "Check-in reminder",
      message: "Arjun Kumar's recommended advisor check-in is due within 48 hours.",
      createdAt: now - 32 * MIN,
      read: false,
      priority: "MEDIUM",
      route: "/students/arjun/check-in",
      cta: "View check-in",
    },
    {
      id: "seed-checkin-completed",
      title: "Check-in completed",
      message: "Sneha Rao's support check-in has been recorded.",
      createdAt: now - 1 * HOUR,
      read: false,
      priority: "SUCCESS",
      route: "/support",
      cta: "View activity",
    },
    {
      id: "seed-multiple-signals",
      title: "Multiple signals detected",
      message: "3 students are showing multiple changing academic and engagement signals.",
      createdAt: now - 2 * HOUR,
      read: true,
      priority: "INFO",
      route: "/students",
      cta: "View students",
    },
    {
      id: "seed-model-update",
      title: "Model update",
      message: "Support Priority Model analysis completed successfully.",
      createdAt: now - 5 * HOUR,
      read: true,
      priority: "SUCCESS",
      route: "/settings",
      cta: "View model status",
    },
  ];
}

/** Human-readable relative timestamp, e.g. "12 min ago". */
export function formatNotificationTime(createdAt: number): string {
  const diff = Date.now() - createdAt;
  if (diff < 60 * 1000) return "Just now";
  const minutes = Math.floor(diff / MIN);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(diff / HOUR);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(diff / (24 * HOUR));
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
