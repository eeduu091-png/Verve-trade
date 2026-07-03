import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyWorkerSignature } from "@/lib/security";

const mt5EventSchema = z.object({
  accountId: z.string(),
  type: z.enum(["SNAPSHOT", "POSITION_OPENED", "POSITION_CLOSED", "BALANCE_CHANGED", "SYNC_HEALTH"]),
  occurredAt: z.string().datetime(),
  payload: z.record(z.unknown())
});

export async function POST(request: Request) {
  const body = await request.text();
  const isValid = verifyWorkerSignature(body, request.headers.get("x-verve-signature"));
  if (!isValid) {
    return NextResponse.json({ error: "Invalid worker signature" }, { status: 401 });
  }

  const event = mt5EventSchema.parse(JSON.parse(body));

  return NextResponse.json({
    accepted: true,
    eventId: `${event.accountId}:${event.type}:${event.occurredAt}`,
    fanout: ["persist-event", "evaluate-rules", "publish-realtime-update", "schedule-ai-analysis"]
  });
}
