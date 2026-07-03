import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    workers: [
      {
        id: "mt5-worker-eu-1",
        region: "fra",
        status: "healthy",
        activeConnections: 428,
        avgTickLatencyMs: 184,
        lastHeartbeatAt: new Date().toISOString()
      }
    ],
    queues: {
      historicalSyncPending: 12,
      eventIngestLagMs: 92,
      notificationLagMs: 140
    }
  });
}
