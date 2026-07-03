# Verve Trades PropOS

Enterprise-grade scaffold for the Verve Trades SRS: a Vercel-native Next.js App Router application with a separated persistent MT5 worker contract.

## What Is Included

- Dense dark-mode command dashboard focused on account safety decisions.
- Typed prop-firm rule engine for daily loss, overall loss, targets, consistency, and position caps.
- Serverless API routes for account linking, risk evaluation, worker event ingestion, and admin worker health.
- AES-256-GCM MT5 credential encryption helper and HMAC worker webhook verification.
- Database schema starter with row-level security policies and analytics indexes.
- Worker integration contract and deployment architecture docs.

## Local Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill required secrets. Generate the MT5 encryption key with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Key Routes

- `/` command dashboard.
- `GET /api/risk` current account risk evaluations.
- `GET /api/accounts` linked account summaries.
- `POST /api/accounts` queue a secure MT5 account link request.
- `POST /api/worker/mt5-event` signed event ingress for persistent workers.
- `GET /api/admin/health` worker and queue health shape.

## Production Gaps To Complete

- Wire auth, RBAC, and session/device management.
- Replace seed data with Postgres repositories.
- Add Pusher/Ably/Redis realtime fanout.
- Implement Stripe, email, browser push, and Vercel Blob integrations.
- Deploy the MT5 worker as a separate long-running service.
