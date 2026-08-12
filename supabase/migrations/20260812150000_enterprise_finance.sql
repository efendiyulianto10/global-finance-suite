-- Global Finance Suite - enterprise accounting core schema
-- Run in Supabase SQL editor or through Supabase CLI migrations.

create extension if not exists pgcrypto;

create type public.membership_role as enum ('owner','cfo','controller','accountant','ap','ar','approver','auditor','viewer');
create type public.account_type as enum ('asset','liability','equity','income','expense');
create type public.journal_status as enum ('draft','pending_approval','approved','posted','reversed');
create type public.document_status as enum ('draft','open','partially_paid','paid','overdue','void');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  reporting_currency char(3) not null default 'USD',
  created_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.membership_role not null default 'viewer',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.entities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  legal_name text not null,
  country_code char(2) not null,
  base_currency char(3) not null,
  tax_id text,
  fiscal_year_start smallint not null default 1 check (fiscal_year_start between 1 and 12),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.fiscal_periods (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  period_year int not null,
  period_month smallint not null check (period_month between 1 and 12),
  starts_on date not null,
  ends_on date not null,
  is_closed boolean not null default false,
  closed_at timestamptz,
  closed_by uuid references auth.users(id),
  unique(entity_id, period_year, period_month)
);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  code text not null,
  name text not null,
  account_type public.account_type not null,
  parent_id uuid references public.accounts(id),
  currency char(3),
  allow_manual_posting boolean not null default true,
  active boolean not null default true,
  unique(entity_id, code)
);

create table public.cost_centers (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  code text not null,
  name text not null,
  active boolean not null default true,
  unique(entity_id, code)
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete restrict,
  journal_no text not null,
  posting_date date not null,
  document_date date,
  description text not null,
  reference text,
  currency char(3) not null,
  exchange_rate numeric(20,8) not null default 1,
  status public.journal_status not null default 'draft',
  source text not null default 'manual',
  created_by uuid not null references auth.users(id),
  approved_by uuid references auth.users(id),
  posted_by uuid references auth.users(id),
  approved_at timestamptz,
  posted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(entity_id, journal_no)
);

create table public.journal_lines (
  id uuid primary key default gen_random_uuid(),
  journal_entry_id uuid not null references public.journal_entries(id) on delete cascade,
  line_no int not null,
  account_id uuid not null references public.accounts(id),
  cost_center_id uuid references public.cost_centers(id),
  description text,
  debit numeric(20,2) not null default 0 check (debit >= 0),
  credit numeric(20,2) not null default 0 check (credit >= 0),
  functional_debit numeric(20,2) not null default 0,
  functional_credit numeric(20,2) not null default 0,
  constraint one_sided_amount check ((debit > 0 and credit = 0) or (credit > 0 and debit = 0)),
  unique(journal_entry_id, line_no)
);

create table public.business_partners (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  partner_type text not null check (partner_type in ('customer','vendor','both')),
  code text not null,
  legal_name text not null,
  tax_id text,
  email text,
  payment_terms_days int not null default 30,
  active boolean not null default true,
  unique(organization_id, code)
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete restrict,
  partner_id uuid not null references public.business_partners(id),
  invoice_no text not null,
  invoice_type text not null check (invoice_type in ('receivable','payable')),
  invoice_date date not null,
  due_date date not null,
  currency char(3) not null,
  subtotal numeric(20,2) not null default 0,
  tax_amount numeric(20,2) not null default 0,
  total_amount numeric(20,2) generated always as (subtotal + tax_amount) stored,
  amount_paid numeric(20,2) not null default 0,
  status public.document_status not null default 'draft',
  journal_entry_id uuid references public.journal_entries(id),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique(entity_id, invoice_no, invoice_type)
);

create table public.bank_accounts (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  bank_name text not null,
  account_name text not null,
  account_number_masked text not null,
  currency char(3) not null,
  gl_account_id uuid not null references public.accounts(id),
  active boolean not null default true
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete restrict,
  partner_id uuid references public.business_partners(id),
  bank_account_id uuid not null references public.bank_accounts(id),
  payment_type text not null check (payment_type in ('receipt','disbursement','transfer')),
  payment_date date not null,
  reference text,
  currency char(3) not null,
  amount numeric(20,2) not null check (amount > 0),
  journal_entry_id uuid references public.journal_entries(id),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  name text not null,
  fiscal_year int not null,
  version text not null default 'Base',
  status text not null default 'draft' check (status in ('draft','submitted','approved','locked')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique(entity_id, fiscal_year, name, version)
);

create table public.budget_lines (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  account_id uuid not null references public.accounts(id),
  cost_center_id uuid references public.cost_centers(id),
  period_month smallint not null check (period_month between 1 and 12),
  amount numeric(20,2) not null default 0,
  unique(budget_id, account_id, cost_center_id, period_month)
);

create table public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  rate_date date not null,
  from_currency char(3) not null,
  to_currency char(3) not null,
  rate_type text not null check (rate_type in ('spot','average','closing','historical')),
  rate numeric(20,8) not null check (rate > 0),
  unique(organization_id, rate_date, from_currency, to_currency, rate_type)
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_id uuid references public.entities(id) on delete set null,
  actor_user_id uuid references auth.users(id),
  action text not null,
  object_type text not null,
  object_id text not null,
  before_data jsonb,
  after_data jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

create index idx_journal_entries_entity_date on public.journal_entries(entity_id, posting_date desc);
create index idx_journal_lines_account on public.journal_lines(account_id);
create index idx_invoices_entity_due on public.invoices(entity_id, due_date);
create index idx_audit_logs_org_created on public.audit_logs(organization_id, created_at desc);

create or replace function public.user_has_org_access(p_org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = p_org
      and m.user_id = (select auth.uid())
      and m.active = true
  );
$$;

create or replace function public.post_journal_entry(p_entry uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_debit numeric(20,2);
  v_credit numeric(20,2);
  v_entity uuid;
  v_posting_date date;
  v_closed boolean;
begin
  select entity_id, posting_date into v_entity, v_posting_date from journal_entries where id = p_entry for update;
  if v_entity is null then raise exception 'Journal entry not found'; end if;

  select coalesce(sum(debit),0), coalesce(sum(credit),0) into v_debit, v_credit
  from journal_lines where journal_entry_id = p_entry;

  if v_debit = 0 or v_debit <> v_credit then
    raise exception 'Journal is not balanced. Debit %, Credit %', v_debit, v_credit;
  end if;

  select coalesce(is_closed,false) into v_closed
  from fiscal_periods
  where entity_id = v_entity
    and period_year = extract(year from v_posting_date)::int
    and period_month = extract(month from v_posting_date)::int;

  if v_closed then raise exception 'Fiscal period is closed'; end if;

  update journal_entries
  set status = 'posted', posted_by = (select auth.uid()), posted_at = now(), updated_at = now()
  where id = p_entry;
end;
$$;

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.entities enable row level security;
alter table public.fiscal_periods enable row level security;
alter table public.accounts enable row level security;
alter table public.cost_centers enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_lines enable row level security;
alter table public.business_partners enable row level security;
alter table public.invoices enable row level security;
alter table public.bank_accounts enable row level security;
alter table public.payments enable row level security;
alter table public.budgets enable row level security;
alter table public.budget_lines enable row level security;
alter table public.exchange_rates enable row level security;
alter table public.audit_logs enable row level security;

create policy "org members can read organization" on public.organizations for select to authenticated
using (public.user_has_org_access(id));

create policy "members can read membership" on public.organization_members for select to authenticated
using (public.user_has_org_access(organization_id));

create policy "members can read entities" on public.entities for select to authenticated
using (public.user_has_org_access(organization_id));

create policy "members can read partners" on public.business_partners for select to authenticated
using (public.user_has_org_access(organization_id));

create policy "members can read fx" on public.exchange_rates for select to authenticated
using (public.user_has_org_access(organization_id));

create policy "members can read audit" on public.audit_logs for select to authenticated
using (public.user_has_org_access(organization_id));

-- Entity-scoped access policies
create policy "members can read accounts" on public.accounts for select to authenticated
using (exists (select 1 from public.entities e where e.id = entity_id and public.user_has_org_access(e.organization_id)));

create policy "members can read periods" on public.fiscal_periods for select to authenticated
using (exists (select 1 from public.entities e where e.id = entity_id and public.user_has_org_access(e.organization_id)));

create policy "members can read cost centers" on public.cost_centers for select to authenticated
using (exists (select 1 from public.entities e where e.id = entity_id and public.user_has_org_access(e.organization_id)));

create policy "members can read journals" on public.journal_entries for select to authenticated
using (exists (select 1 from public.entities e where e.id = entity_id and public.user_has_org_access(e.organization_id)));

create policy "members can read journal lines" on public.journal_lines for select to authenticated
using (exists (
  select 1 from public.journal_entries j join public.entities e on e.id = j.entity_id
  where j.id = journal_entry_id and public.user_has_org_access(e.organization_id)
));

create policy "members can read invoices" on public.invoices for select to authenticated
using (exists (select 1 from public.entities e where e.id = entity_id and public.user_has_org_access(e.organization_id)));

create policy "members can read bank accounts" on public.bank_accounts for select to authenticated
using (exists (select 1 from public.entities e where e.id = entity_id and public.user_has_org_access(e.organization_id)));

create policy "members can read payments" on public.payments for select to authenticated
using (exists (select 1 from public.entities e where e.id = entity_id and public.user_has_org_access(e.organization_id)));

create policy "members can read budgets" on public.budgets for select to authenticated
using (exists (select 1 from public.entities e where e.id = entity_id and public.user_has_org_access(e.organization_id)));

create policy "members can read budget lines" on public.budget_lines for select to authenticated
using (exists (
  select 1 from public.budgets b join public.entities e on e.id = b.entity_id
  where b.id = budget_id and public.user_has_org_access(e.organization_id)
));

-- Production note: add INSERT/UPDATE/DELETE policies per role and approval responsibility.
-- Keep service-role credentials server-side only.
