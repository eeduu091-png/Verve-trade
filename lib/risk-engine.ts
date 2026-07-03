import { clamp } from "@/lib/format";
import type { RiskEvaluation, RiskTone, RuleEvaluation, TradingAccount } from "@/lib/types";

function toneFromUsage(percent: number): RiskTone {
  if (percent >= 90) return "danger";
  if (percent >= 70) return "warning";
  return "success";
}

function ruleStatus(tone: RiskTone) {
  if (tone === "danger") return "VIOLATION IMMINENT";
  if (tone === "warning") return "WARNING";
  return "PROTECTED";
}

export function evaluateAccountRisk(account: TradingAccount): RiskEvaluation {
  const template = account.ruleTemplate;
  const dailyLossLimit = account.dayStartEquity * (template.dailyLossLimitPercent / 100);
  const overallLossLimit = account.startingBalance * (template.overallLossLimitPercent / 100);
  const profitTarget = account.startingBalance * (template.profitTargetPercent / 100);

  const dailyLossUsed = Math.max(0, -account.dailyPnl);
  const overallLossUsed = Math.max(0, account.startingBalance - account.equity);
  const profit = Math.max(0, account.balance - account.startingBalance);

  const dailyLossUsedPercent = clamp((dailyLossUsed / dailyLossLimit) * 100);
  const overallLossUsedPercent = clamp((overallLossUsed / overallLossLimit) * 100);
  const targetProgressPercent = clamp((profit / profitTarget) * 100);
  const consistencyPercent = profit > 0 ? clamp((account.bestDayProfit / profit) * 100) : 0;
  const openPositionPercent = clamp((account.openPositions / template.maxOpenPositions) * 100);

  const ruleEvaluations: RuleEvaluation[] = [
    {
      name: "Max daily loss",
      status: ruleStatus(toneFromUsage(dailyLossUsedPercent)),
      detail: `${dailyLossUsedPercent.toFixed(1)}% of daily loss allowance consumed.`,
      usedPercent: dailyLossUsedPercent,
      tone: toneFromUsage(dailyLossUsedPercent)
    },
    {
      name: "Max overall loss",
      status: ruleStatus(toneFromUsage(overallLossUsedPercent)),
      detail: `${overallLossUsedPercent.toFixed(1)}% of account loss allowance consumed.`,
      usedPercent: overallLossUsedPercent,
      tone: toneFromUsage(overallLossUsedPercent)
    },
    {
      name: "Profit target",
      status: targetProgressPercent >= 100 ? "TARGET HIT" : "IN PROGRESS",
      detail: `${targetProgressPercent.toFixed(1)}% of challenge target reached.`,
      usedPercent: targetProgressPercent,
      tone: targetProgressPercent >= 100 ? "success" : "cyan"
    },
    {
      name: "Consistency rule",
      status: consistencyPercent > template.consistencyMaxDailyProfitPercent ? "WARNING" : "PROTECTED",
      detail: `Best day is ${consistencyPercent.toFixed(1)}% of total profit.`,
      usedPercent: consistencyPercent,
      tone: consistencyPercent > template.consistencyMaxDailyProfitPercent ? "warning" : "success"
    },
    {
      name: "Open position cap",
      status: account.openPositions > template.maxOpenPositions ? "VIOLATION" : "PROTECTED",
      detail: `${account.openPositions}/${template.maxOpenPositions} open positions.`,
      usedPercent: openPositionPercent,
      tone: account.openPositions > template.maxOpenPositions ? "danger" : toneFromUsage(openPositionPercent)
    }
  ];

  const worstUsage = Math.max(dailyLossUsedPercent, overallLossUsedPercent);
  const tone = toneFromUsage(worstUsage);
  const healthScore = clamp(100 - worstUsage * 0.62 - account.marginUsedPercent * 0.22 + targetProgressPercent * 0.18);

  return {
    state: tone === "danger" ? "DANGER" : tone === "warning" ? "WARNING" : "SAFE",
    decision:
      tone === "danger"
        ? "DAILY RISK: DANGER. Stop trading until risk resets."
        : tone === "warning"
          ? "DAILY RISK: WARNING. Reduce size."
          : "DAILY RISK: SAFE. Account remains tradable.",
    guidance:
      tone === "danger"
        ? "The account is close to a hard rule breach. Flatten exposure and wait for the next evaluation window."
        : tone === "warning"
          ? "Only A+ setups should be considered. Reduce position size and avoid correlated exposure."
          : "Risk buffers are intact. Maintain normal execution rules and monitor news windows.",
    tone,
    healthScore: Math.round(healthScore),
    passProbability: clamp(72 + targetProgressPercent * 0.24 - worstUsage * 0.34),
    dailyLossRemaining: Math.max(0, dailyLossLimit - dailyLossUsed),
    overallLossRemaining: Math.max(0, overallLossLimit - overallLossUsed),
    profitTargetRemaining: Math.max(0, profitTarget - profit),
    dailyLossUsedPercent,
    overallLossUsedPercent,
    targetProgressPercent,
    ruleEvaluations
  };
}
