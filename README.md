# Global Finance Suite — Linux Mint Edition

Enterprise-oriented starter untuk aplikasi Accounting & Finance multi-entity.

## Stack

- Next.js 16.3 App Router + TypeScript
- Supabase Auth + PostgreSQL
- Row Level Security foundation
- Git/GitHub workflow
- Vercel deployment
- Linux Mint terminal scripts

## Included modules

- Executive finance dashboard
- General Ledger / journal register
- Chart of Accounts
- Accounts Receivable
- Accounts Payable
- Banking & reconciliation workspace
- Budgeting & forecasting workspace
- Financial / management reports
- Consolidation and FX translation workspace
- Audit, internal controls and close checklist
- Entity, user/role and accounting-policy settings
- Supabase/PostgreSQL enterprise core schema
- Multi-tenant Row Level Security foundation
- Balanced-journal posting function and fiscal-period lock check

## Linux Mint quick start

```bash
chmod +x scripts/*.sh
./scripts/setup-linux-mint.sh
```

Kemudian baca `INSTALL-LINUX-MINT.md` untuk proses lengkap GitHub, Supabase, dan Vercel.

## Local development

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Scripts

```text
scripts/setup-linux-mint.sh   Setup dependency + Supabase CLI
scripts/connect-supabase.sh   Login/link/migration Supabase
scripts/first-git-push.sh     Git init + GitHub first push
scripts/push-production.sh    Commit + push update harian
```

## Production warning

Ini adalah fondasi enterprise, bukan sistem yang otomatis menjadi IFRS/local-GAAP compliant hanya karena modulnya tersedia. Sebelum digunakan dengan data finansial nyata, lengkapi accounting policies, approval workflow, segregation of duties, tax rules, reporting mappings, immutable audit controls, backup/recovery, security review, dan automated accounting tests.
