import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import type { PriorityLevel } from "@/data/students";
import { AlertTriangle, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------- Card ---------------------------------- */

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E8EDF3] bg-white shadow-card",
        className
      )}
      {...props}
    />
  );
}

/* --------------------------------- Button --------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm hover:shadow",
  secondary:
    "bg-white text-[#22303F] border border-[#DDE4EC] hover:bg-[#F6F8FB] hover:border-[#C9D4E0] active:bg-[#EEF2F7]",
  ghost: "bg-transparent text-[#51617A] hover:bg-[#EEF2F7] hover:text-[#22303F]",
  danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-xl gap-2",
  lg: "h-11 px-5 text-sm rounded-xl gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex select-none items-center justify-center font-medium transition-all duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
        "disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

/* ------------------------------ Link buttons ------------------------------ */

interface LinkButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  ariaLabel?: string;
}

export function LinkButton({ to, children, variant = "primary", size = "md", className, ariaLabel }: LinkButtonProps) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex select-none items-center justify-center font-medium transition-all duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
    >
      {children}
    </Link>
  );
}

/* ------------------------------ Priority badge ----------------------------- */

const priorityStyles: Record<PriorityLevel, { badge: string; dot: string }> = {
  LOW: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200/70", dot: "bg-emerald-500" },
  MEDIUM: { badge: "bg-amber-50 text-amber-700 border-amber-200/70", dot: "bg-amber-500" },
  HIGH: { badge: "bg-rose-50 text-rose-700 border-rose-200/70", dot: "bg-rose-500" },
};

export function PriorityBadge({ level, className }: { level: PriorityLevel; className?: string }) {
  const s = priorityStyles[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        s.badge,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden="true" />
      {level}
    </span>
  );
}

/* --------------------------------- Trend ---------------------------------- */

export function TrendIndicator({
  direction,
  label,
  className,
}: {
  direction: "down" | "up" | "flat";
  label: string;
  className?: string;
}) {
  const styles = {
    down: "text-rose-600",
    up: "text-emerald-600",
    flat: "text-slate-500",
  } as const;
  const Icon = direction === "down" ? TrendingDown : direction === "up" ? TrendingUp : Minus;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13px] font-medium", styles[direction], className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

/* ---------------------------------- Table --------------------------------- */

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto scrollbar-thin", className)}>
      <table className="w-full min-w-[720px] border-collapse text-left">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-[#E8EDF3] bg-[#FAFBFD]">
        {children}
      </tr>
    </thead>
  );
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7A8AA0]",
        className
      )}
      {...props}
    />
  );
}

export function Tr({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("border-b border-[#F0F3F8] transition-colors last:border-0 hover:bg-[#F8FAFC]", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-5 py-4 align-middle text-sm text-[#43536B]", className)} {...props} />;
}

/* ------------------------------- Page header ------------------------------ */

export function PageHeader({
  title,
  subtitle,
  right,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-700">{eyebrow}</div>
        )}
        <h1 className="text-[26px] font-bold leading-tight tracking-[-0.01em] text-[#16283C]">{title}</h1>
        {subtitle && <p className="mt-1 text-[14.5px] text-[#5E7089]">{subtitle}</p>}
      </div>
      {right && <div className="flex flex-wrap items-center gap-2.5">{right}</div>}
    </div>
  );
}

/* ------------------------------ Signal helpers ----------------------------- */

export function SignalChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-[#F1F5FA] px-2 py-1 text-[12.5px] font-medium text-[#43536B]">
      {children}
    </span>
  );
}

export function SignalWarningChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-rose-50/80 px-2 py-1 text-[12.5px] font-medium text-rose-700">
      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
      {children}
    </span>
  );
}

/* ------------------------------ Section label ------------------------------ */

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8296AD]", className)}>
      {children}
    </div>
  );
}

/* ------------------------------- Disclaimer ------------------------------- */

export function DisclaimerNote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start gap-2 px-5 py-3.5 text-[12.5px] leading-relaxed text-[#7A8AA0]", className)}>
      <svg viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" aria-hidden="true">
        <path d="M8 1.5 2 5v3c0 3.2 2.4 5.9 6 6.5 3.6-.6 6-3.3 6-6.5V5L8 1.5Z" stroke="#9AA9BC" strokeWidth="1.2" />
        <path d="M8 5.5v3" stroke="#9AA9BC" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="8" cy="10.8" r="0.7" fill="#9AA9BC" />
      </svg>
      <span>{children}</span>
    </div>
  );
}
