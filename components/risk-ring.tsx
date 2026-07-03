import type { RiskTone } from "@/lib/types";

const ringColor: Record<RiskTone, string> = {
  success: "#00FF88",
  warning: "#FFC107",
  danger: "#FF3B30",
  cyan: "#00E5FF"
};

export function RiskRing({
  label,
  value,
  caption,
  tone
}: {
  label: string;
  value: number;
  caption: string;
  tone: RiskTone;
}) {
  const safeValue = Math.min(100, Math.max(0, value));
  const background = `conic-gradient(${ringColor[tone]} ${safeValue * 3.6}deg, #1f1f1f 0deg)`;

  return (
    <div className="rounded-lg border border-line bg-black/20 p-4">
      <div className="mx-auto flex size-36 items-center justify-center rounded-full p-2" style={{ background }}>
        <div className="flex size-full flex-col items-center justify-center rounded-full border border-line bg-panel">
          <span className="font-mono text-3xl font-semibold text-white">{Math.round(safeValue)}%</span>
          <span className="mt-1 text-center text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</span>
        </div>
      </div>
      <p className="mt-4 text-center font-mono text-xs text-zinc-400">{caption}</p>
    </div>
  );
}
