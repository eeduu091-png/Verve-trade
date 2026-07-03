export type RiskTone = "success" | "warning" | "danger" | "cyan";

export type PropRuleTemplate = {
  id: string;
  name: string;
  dailyLossLimitPercent: number;
  overallLossLimitPercent: number;
  profitTargetPercent: number;
  minTradingDays: number;
  maxTradingDays: number;
  consistencyMaxDailyProfitPercent: number;
  weekendHoldingAllowed: boolean;
  maxOpenPositions: number;
  maxLotSize: number;
  allowedSymbols: string[];
};

export type TradingAccount = {
  id: string;
  userId: string;
  broker: string;
  login: string;
  server: string;
  status: "connected" | "syncing" | "delayed" | "disconnected" | "error";
  latencyMs: number;
  startingBalance: number;
  balance: number;
  equity: number;
  floatingPnl: number;
  dayStartEquity: number;
  dailyPnl: number;
  marginUsedPercent: number;
  openPositions: number;
  tradingDays: number;
  bestDayProfit: number;
  ruleTemplate: PropRuleTemplate;
};

export type RuleEvaluation = {
  name: string;
  status: string;
  detail: string;
  usedPercent: number;
  tone: RiskTone;
};

export type RiskEvaluation = {
  state: string;
  decision: string;
  guidance: string;
  tone: RiskTone;
  healthScore: number;
  passProbability: number;
  dailyLossRemaining: number;
  overallLossRemaining: number;
  profitTargetRemaining: number;
  dailyLossUsedPercent: number;
  overallLossUsedPercent: number;
  targetProgressPercent: number;
  ruleEvaluations: RuleEvaluation[];
};

export type TradeJournalRow = {
  ticket: string;
  symbol: string;
  side: "BUY" | "SELL";
  volume: number;
  entryPrice: number;
  exitPrice: number;
  session: "Asian" | "London" | "New York";
  rMultiple: number;
  netPnl: number;
  mistake?: string;
};
