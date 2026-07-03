import type { RiskTone, TradeJournalRow, TradingAccount } from "@/lib/types";

export const ftmoTemplate = {
  id: "ftmo-100k",
  name: "FTMO 100K Challenge",
  dailyLossLimitPercent: 5,
  overallLossLimitPercent: 10,
  profitTargetPercent: 10,
  minTradingDays: 4,
  maxTradingDays: 30,
  consistencyMaxDailyProfitPercent: 40,
  weekendHoldingAllowed: false,
  maxOpenPositions: 6,
  maxLotSize: 8,
  allowedSymbols: ["EURUSD", "GBPUSD", "XAUUSD", "US30", "NAS100"]
};

export const accounts: TradingAccount[] = [
  {
    id: "acct_100k_alpha",
    userId: "usr_demo",
    broker: "MetaQuotes",
    login: "87214420",
    server: "FTMO-Demo",
    status: "connected",
    latencyMs: 184,
    startingBalance: 100000,
    balance: 104820,
    equity: 104110,
    floatingPnl: -710,
    dayStartEquity: 105200,
    dailyPnl: -1090,
    marginUsedPercent: 23,
    openPositions: 3,
    tradingDays: 8,
    bestDayProfit: 2120,
    ruleTemplate: ftmoTemplate
  }
];

export const activityFeed: Array<{ id: string; time: string; type: string; tone: RiskTone; message: string }> = [
  { id: "evt_1", time: "14:22:08", type: "RULE", tone: "warning", message: "Daily risk usage crossed 20%. Size reduction recommended." },
  { id: "evt_2", time: "14:18:41", type: "TRADE", tone: "cyan", message: "XAUUSD SELL 0.70 opened. Correlation exposure unchanged." },
  { id: "evt_3", time: "14:09:12", type: "SYNC", tone: "success", message: "Historical balance sync completed for FTMO-Demo." },
  { id: "evt_4", time: "13:56:59", type: "AI", tone: "cyan", message: "Behavior note: win rate drops after two consecutive manual re-entries." }
];

export const journalRows: TradeJournalRow[] = [
  { ticket: "53982144", symbol: "EURUSD", side: "BUY", volume: 1.2, entryPrice: 1.08221, exitPrice: 1.08492, session: "London", rMultiple: 1.8, netPnl: 612 },
  { ticket: "53981703", symbol: "XAUUSD", side: "SELL", volume: 0.7, entryPrice: 2332.4, exitPrice: 2338.1, session: "New York", rMultiple: -0.9, netPnl: -399, mistake: "Moved SL" },
  { ticket: "53980188", symbol: "NAS100", side: "BUY", volume: 0.4, entryPrice: 18542.2, exitPrice: 18594.5, session: "New York", rMultiple: 2.1, netPnl: 831 },
  { ticket: "53979852", symbol: "GBPUSD", side: "SELL", volume: 1, entryPrice: 1.2721, exitPrice: 1.2708, session: "London", rMultiple: 1.1, netPnl: 284 }
];

export const newsEvents = [
  { id: "news_1", impact: "HIGH", currency: "USD", title: "Core CPI m/m", startsIn: "38 minutes" },
  { id: "news_2", impact: "HIGH", currency: "GBP", title: "BOE Governor speech", startsIn: "2 hours 11 minutes" },
  { id: "news_3", impact: "MEDIUM", currency: "EUR", title: "ECB monetary policy minutes", startsIn: "4 hours 06 minutes" }
];
