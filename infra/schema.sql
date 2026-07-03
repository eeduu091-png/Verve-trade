create extension if not exists "uuid-ossp";

create table app_users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  role text not null default 'trader',
  timezone text not null default 'UTC',
  base_currency text not null default 'USD',
  risk_tolerance text not null default 'standard',
  created_at timestamptz not null default now()
);

create table prop_rule_templates (
  id uuid primary key default uuid_generate_v4(),
  owner_user_id uuid references app_users(id),
  name text not null,
  daily_loss_limit_percent numeric(8, 4) not null,
  overall_loss_limit_percent numeric(8, 4) not null,
  profit_target_percent numeric(8, 4) not null,
  min_trading_days integer not null default 0,
  max_trading_days integer,
  consistency_max_daily_profit_percent numeric(8, 4),
  weekend_holding_allowed boolean not null default false,
  max_open_positions integer,
  max_lot_size numeric(12, 4),
  allowed_symbols text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table mt5_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references app_users(id),
  rule_template_id uuid references prop_rule_templates(id),
  broker text not null,
  login text not null,
  server text not null,
  encrypted_password text not null,
  status text not null default 'syncing',
  last_snapshot_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, login, server)
);

create table account_snapshots (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid not null references mt5_accounts(id),
  balance numeric(18, 2) not null,
  equity numeric(18, 2) not null,
  margin_used_percent numeric(8, 4) not null,
  floating_pnl numeric(18, 2) not null,
  captured_at timestamptz not null
);

create table trades (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid not null references mt5_accounts(id),
  ticket text not null,
  symbol text not null,
  side text not null,
  volume numeric(12, 4) not null,
  entry_price numeric(18, 6) not null,
  exit_price numeric(18, 6),
  opened_at timestamptz not null,
  closed_at timestamptz,
  commission numeric(18, 2) not null default 0,
  swap numeric(18, 2) not null default 0,
  net_pnl numeric(18, 2),
  session text,
  r_multiple numeric(12, 4),
  tags text[] not null default '{}',
  mistake text,
  notes text,
  unique (account_id, ticket)
);

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_user_id uuid references app_users(id),
  action text not null,
  target_type text not null,
  target_id text,
  ip_address inet,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index account_snapshots_account_captured_idx on account_snapshots (account_id, captured_at desc);
create index trades_account_closed_idx on trades (account_id, closed_at desc);
create index trades_symbol_idx on trades (symbol);

alter table mt5_accounts enable row level security;
alter table account_snapshots enable row level security;
alter table trades enable row level security;

-- Example Supabase-compatible policy shape. Replace auth.uid() mapping with your auth adapter.
create policy mt5_accounts_owner_read on mt5_accounts
  for select using (user_id::text = current_setting('app.current_user_id', true));

create policy trades_owner_read on trades
  for select using (
    exists (
      select 1 from mt5_accounts
      where mt5_accounts.id = trades.account_id
      and mt5_accounts.user_id::text = current_setting('app.current_user_id', true)
    )
  );
