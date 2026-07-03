# Persistent MT5 Worker Contract

The MT5 worker is intentionally outside Vercel. It should be deployed as a long-running service.

## Required Responsibilities

- Maintain persistent MT5 sessions.
- Retry failed broker connections with backoff.
- Sync historical trades and balance operations after account linking.
- Stream balance, equity, margin, open positions, and closed trades.
- Emit heartbeat and account sync health events.
- Never expose MT5 passwords to clients or logs.

## Webhook Signature

For every event, compute:

```txt
hex(hmac_sha256(APP_WEBHOOK_SECRET, raw_request_body))
```

Send it in:

```txt
x-verve-signature: <hex digest>
```

## Event Shape

```json
{
  "accountId": "acct_100k_alpha",
  "type": "SNAPSHOT",
  "occurredAt": "2026-07-02T11:22:08.000Z",
  "payload": {
    "balance": 104820,
    "equity": 104110,
    "marginUsedPercent": 23,
    "openPositions": []
  }
}
```

Supported event types:

- `SNAPSHOT`
- `POSITION_OPENED`
- `POSITION_CLOSED`
- `BALANCE_CHANGED`
- `SYNC_HEALTH`
