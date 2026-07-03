import type { ReactNode } from "react";
import type { RiskTone } from "@/lib/types";

const toneClass: Record<RiskTone, string> = {
  success: "border-success/35 bg-success/10 text-success",
  warning: "border-warning/35 bg-warning/10 text-warning",
  danger: "border-danger/35 bg-danger/10 text-danger",
  cyan: "border-cyan/35 bg-cyan/10 text-cyan"
};

export function StatusPill({
  icon,
  label,
  value,
  tone
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: RiskTone;
}) {
  return (
    <div className={`flex items-center gap-2 rounded-md border px-3 py-2 ${toneClass[tone]}`}>
      {icon}
      <div className="min-w-0">
        <p className="truncate text-[10px] uppercase tracking-[0.16em] opacity-70">{label}</p>
        <p className="truncate font-mono text-xs">{value}</p>
      </div>
    </div>
  );
}
