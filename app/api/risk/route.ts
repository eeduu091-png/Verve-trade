import { NextResponse } from "next/server";
import { accounts } from "@/lib/seed-data";
import { evaluateAccountRisk } from "@/lib/risk-engine";

export async function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    evaluations: accounts.map((account) => ({
      accountId: account.id,
      risk: evaluateAccountRisk(account)
    }))
  });
}
