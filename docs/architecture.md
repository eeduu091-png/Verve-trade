# Verve Trades Architecture

Verve Trades uses a hybrid architecture because Vercel serverless functions cannot keep persistent MT5 TCP sessions alive.

## Runtime Split

- `Next.js App Router on Vercel`: UI, auth callbacks, API routes, webhook ingestion, billing webhooks, admin portal, cached analytics.
- `Persistent MT5 worker`: A separate Node.js or Python process hosted on Render, Railway, Fly.io, or a VPS. It owns MT5 sessions, retries, historical sync, and tick/position streaming.
- `Database`: Postgres with row-level security. Recommended providers: Neon, Supabase, or RDS.
- `Realtime fanout`: Pusher, Ably, or Redis Pub/Sub. Worker events are persisted first, then published to the UI.

## MT5 Event Flow

1. User links an MT5 account through `POST /api/accounts`.
2. The app encrypts the MT5 password with AES-256-GCM and queues a worker link request.
3. The worker connects to MT5, syncs history, and posts signed events to `POST /api/worker/mt5-event`.
4. The app validates `x-verve-signature`, persists the event, evaluates prop rules, and fans out realtime updates.
5. The dashboard renders decision-centric states such as `SAFE`, `WARNING`, or `DANGER`.

## Security Baseline

- MT5 passwords are encrypted before storage and never returned to the browser.
- Worker webhooks use HMAC SHA-256 signatures.
- All user-owned tables must include `tenant_id` or `user_id` and row-level security policies.
- Admin endpoints must require scoped RBAC claims before production use.
- AI coach prompts must explicitly prohibit trade signals or financial advice.

## Graceful Degradation

If the worker is down or delayed, the UI should keep rendering cached account snapshots and show `Sync Delayed`. Rule evaluation must identify stale data so traders do not mistake cached state for live safety.
