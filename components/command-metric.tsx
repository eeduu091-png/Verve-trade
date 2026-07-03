import type { ReactElement } from "react";

export function CommandMetric({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon: ReactElement;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
      <div className="flex items-center gap-2 text-zinc-500">
        <span className="text-cyan [&_svg]:size-4">{icon}</span>
        <span className="text-xs uppercase tracking-[0.14em]">{label}</span>
      </div>
      <span className="font-mono text-sm text-white">{value}</span>
    </div>
  );
}
