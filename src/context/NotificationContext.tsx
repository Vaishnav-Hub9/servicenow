import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { seedNotifications, type AppNotification, type NotificationPriority } from "@/data/notifications";

const STORAGE_KEY = "wellaware.notifications.v1";

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  /** Adds a notification; `dedupeKey` collapses repeated events of the same kind. */
  pushNotification: (input: {
    title: string;
    message: string;
    priority: NotificationPriority;
    route: string;
    cta: string;
    dedupeKey?: string;
    dedupeWindowMs?: number;
  }) => void;
  /** Event helpers used across the app. */
  notifyPrediction: (prediction: string, studentName: string, studentId: string) => void;
  notifyCheckIn: (studentName: string) => void;
  notifyStudentAdded: (studentName: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

function loadPersisted(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedNotifications();
    const parsed = JSON.parse(raw) as AppNotification[];
    if (!Array.isArray(parsed)) return seedNotifications();
    // Re-seed if the stored list is empty so the demo always has content.
    return parsed.length > 0 ? parsed : seedNotifications();
  } catch {
    return seedNotifications();
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(loadPersisted);
  const lastEventAt = useRef<Map<string, number>>(new Map());

  // Persist on every change (prototype-only localStorage persistence).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // Storage may be unavailable (private mode) — non-fatal for the demo.
    }
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const pushNotification = useCallback<NotificationContextValue["pushNotification"]>((input) => {
    const { dedupeKey, dedupeWindowMs = 10_000, ...rest } = input;
    if (dedupeKey) {
      const last = lastEventAt.current.get(dedupeKey) ?? 0;
      const now = Date.now();
      if (now - last < dedupeWindowMs) return;
      lastEventAt.current.set(dedupeKey, now);
    }
    setNotifications((prev) => [
      {
        id: `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
        read: false,
        ...rest,
      },
      ...prev,
    ]);
  }, []);

  /**
   * Reacts to the ACTUAL ML API response — never a hardcoded prediction.
   * HIGH -> priority alert, MEDIUM -> review suggestion, LOW -> nothing.
   */
  const notifyPrediction = useCallback(
    (prediction: string, studentName: string, studentId: string) => {
      if (prediction === "HIGH") {
        pushNotification({
          title: "High priority student",
          message: `${studentName} has been identified with a HIGH support priority. Multiple observable signals are changing.`,
          priority: "HIGH",
          route: `/students/${studentId}`,
          cta: "View student",
          dedupeKey: `prediction-high-${studentId}`,
        });
      } else if (prediction === "MEDIUM") {
        pushNotification({
          title: "Review suggested",
          message: `${studentName} has observable signals worth reviewing (MEDIUM support priority).`,
          priority: "MEDIUM",
          route: `/students/${studentId}`,
          cta: "View student",
          dedupeKey: `prediction-medium-${studentId}`,
        });
      }
      // LOW intentionally produces no urgent alert.
    },
    [pushNotification]
  );

  const notifyCheckIn = useCallback(
    (studentName: string) => {
      pushNotification({
        title: "Check-in completed",
        message: `${studentName}'s support check-in has been recorded.`,
        priority: "SUCCESS",
        route: "/support",
        cta: "View activity",
        dedupeKey: `checkin-${studentName}`,
      });
    },
    [pushNotification]
  );

  const notifyStudentAdded = useCallback(
    (studentName: string) => {
      pushNotification({
        title: "New student analysis",
        message: `${studentName} has been analyzed and added to the student list.`,
        priority: "INFO",
        route: "/students",
        cta: "View students",
        dedupeKey: `student-added-${studentName}`,
      });
    },
    [pushNotification]
  );

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo(
    () => ({ notifications, unreadCount, markAsRead, markAllAsRead, pushNotification, notifyPrediction, notifyCheckIn, notifyStudentAdded }),
    [notifications, unreadCount, markAsRead, markAllAsRead, pushNotification, notifyPrediction, notifyCheckIn, notifyStudentAdded]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
