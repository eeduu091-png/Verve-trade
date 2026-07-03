import { NextResponse } from "next/server";
import { z } from "zod";
import { accounts } from "@/lib/seed-data";
import { encryptSecret } from "@/lib/security";

const linkAccountSchema = z.object({
  login: z.string().min(3),
  password: z.string().min(6),
  server: z.string().min(2),
  broker: z.string().min(2)
});

export async function GET() {
  return NextResponse.json({
    accounts: accounts.map(({ login, server, broker, status, latencyMs, balance, equity, id }) => ({
      id,
      login,
      server,
      broker,
      status,
      latencyMs,
      balance,
      equity
    }))
  });
}

export async function POST(request: Request) {
  const payload = linkAccountSchema.parse(await request.json());
  const encryptedPassword = encryptSecret(payload.password);

  return NextResponse.json(
    {
      status: "queued",
      workerDispatch: {
        type: "MT5_ACCOUNT_LINK_REQUESTED",
        login: payload.login,
        server: payload.server,
        broker: payload.broker,
        encryptedPasswordRef: encryptedPassword.slice(0, 18) + "..."
      }
    },
    { status: 202 }
  );
}
