import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  DatabaseZap,
  RadioTower,
  Shield,
  Siren,
  TrendingUp
} from "lucide-react";
import { CommandMetric } from "@/components/command-metric";
import { RiskRing } from "@/components/risk-ring";
import { StatusPill } from "@/components/status-pill";
import { evaluateAccountRisk } from "@/lib/risk-engine";
import { accounts, activityFeed, journalRows, newsEvents } from "@/lib/seed-data";
import { formatCurrency, formatPercent } from "@/lib/format";

export default function DashboardPage() {
  const activeAccount = accounts[0];
  const risk = evaluateAccountRisk(activeAccount);

  return (
    <main className="data-grid min-h-screen p-4 text-zinc-100 lg:p-6">
      <section className="mx-auto flex max-w-[1600px] flex-col gap-4">
        <header className="panel flex flex-col gap-4 rounded-lg px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md border border-cyan/40 bg-cyan/10 text-cyan">
              <Shield size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-[0.18em] text-white">VERVE TRADES</h1>
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">PropOS Command Center</p>
            </div>
          </div>
          <div className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <StatusPill icon={<RadioTower size={14} />} label="MT5 worker" tone="success" value="Connected" />
            <StatusPill icon={<Activity size={14} />} label="Latency" tone="success" value="184ms" />
            <StatusPill icon={<Clock3 size={14} />} label="London close" tone="cyan" value="01:42:18" />
            <StatusPill icon={<Siren size={14} />} label="High impact" tone="warning" value="USD CPI in 38m" />
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-4 lg:grid-cols-3">
            <article className="panel rounded-lg p-4 lg:col-span-2">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Account safety decision</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{risk.decision}</h2>
                  <p className="mt-1 max-w-2xl text-sm text-zinc-400">{risk.guidance}</p>
                </div>
                <StatusPill icon={<Shield size={14} />} label="Risk shield" tone={risk.tone} value={risk.state} />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <RiskRing
                  label="Daily risk used"
                  value={risk.dailyLossUsedPercent}
                  caption={`${formatCurrency(risk.dailyLossRemaining)} remaining`}
                  tone={risk.tone}
                />
                <RiskRing
                  label="Overall risk used"
                  value={risk.overallLossUsedPercent}
                  caption={`${formatCurrency(risk.overallLossRemaining)} buffer`}
                  tone={risk.overallLossUsedPercent > 80 ? "danger" : "cyan"}
                />
                <RiskRing
                  label="Target progress"
                  value={risk.targetProgressPercent}
                  caption={`${formatCurrency(risk.profitTargetRemaining)} to target`}
                  tone="success"
                />
              </div>
            </article>

            <aside className="panel rounded-lg p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Health score</p>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-mono text-6xl font-semibold text-cyan">{risk.healthScore}</span>
                <span className="mb-2 text-sm text-zinc-500">/100</span>
              </div>
              <div className="mt-5 space-y-3">
                <CommandMetric label="Pass probability" value={formatPercent(risk.passProbability)} icon={<CheckCircle2 />} />
                <CommandMetric label="Floating P/L" value={formatCurrency(activeAccount.floatingPnl)} icon={<TrendingUp />} />
                <CommandMetric label="Margin used" value={formatPercent(activeAccount.marginUsedPercent)} icon={<DatabaseZap />} />
              </div>
            </aside>
          </div>

          <aside className="panel rounded-lg p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Live activity feed</p>
              <span className="font-mono text-xs text-cyan">STREAMING</span>
            </div>
            <div className="space-y-3">
              {activityFeed.map((event) => (
                <div key={event.id} className="border-l border-line pl-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-zinc-500">{event.time}</span>
                    <span className={`font-mono text-xs ${event.tone === "danger" ? "text-danger" : event.tone === "warning" ? "text-warning" : "text-cyan"}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-200">{event.message}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
          <article className="panel rounded-lg p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Rule engine</p>
              <StatusPill icon={<BrainCircuit size={14} />} label="AI coach" tone="cyan" value="Behavior only" />
            </div>
            <div className="space-y-3">
              {risk.ruleEvaluations.map((rule) => (
                <div key={rule.name} className="rounded-md border border-line bg-black/20 p-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-zinc-100">{rule.name}</span>
                    <span className={`font-mono text-xs ${rule.tone === "danger" ? "text-danger" : rule.tone === "warning" ? "text-warning" : "text-success"}`}>
                      {rule.status}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-900">
                    <div className={`h-full ${rule.tone === "danger" ? "bg-danger" : rule.tone === "warning" ? "bg-warning" : "bg-success"}`} style={{ width: `${rule.usedPercent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">{rule.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel overflow-hidden rounded-lg">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Automated trade journal</p>
              <span className="font-mono text-xs text-zinc-500">{journalRows.length} latest closes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="sticky top-0 bg-panel text-xs uppercase tracking-[0.16em] text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Ticket</th>
                    <th className="px-4 py-3 font-medium">Symbol</th>
                    <th className="px-4 py-3 font-medium">Side</th>
                    <th className="px-4 py-3 font-medium">Session</th>
                    <th className="px-4 py-3 font-medium">R</th>
                    <th className="px-4 py-3 font-medium">Net P/L</th>
                    <th className="px-4 py-3 font-medium">Mistake</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {journalRows.map((trade) => (
                    <tr key={trade.ticket} className="border-t border-line hover:bg-cyan/5">
                      <td className="px-4 py-3 text-zinc-400">{trade.ticket}</td>
                      <td className="px-4 py-3 text-white">{trade.symbol}</td>
                      <td className="px-4 py-3">{trade.side}</td>
                      <td className="px-4 py-3 text-zinc-400">{trade.session}</td>
                      <td className="px-4 py-3 text-zinc-400">{trade.rMultiple.toFixed(2)}</td>
                      <td className={`px-4 py-3 ${trade.netPnl >= 0 ? "text-success" : "text-danger"}`}>{formatCurrency(trade.netPnl)}</td>
                      <td className="px-4 py-3 text-zinc-500">{trade.mistake ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {newsEvents.map((event) => (
            <article key={event.id} className="panel rounded-lg p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs text-warning">{event.impact}</span>
                <AlertTriangle className="text-warning" size={16} />
              </div>
              <h3 className="font-medium text-white">{event.title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{event.currency} · {event.startsIn}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
