# Deployment workflow - Linux Mint

Production flow:

```text
Linux Mint -> Git -> GitHub -> Vercel
                           -> Supabase migrations/integration
```

## Local setup

```bash
chmod +x scripts/*.sh
./scripts/setup-linux-mint.sh
```

## Supabase

```bash
./scripts/connect-supabase.sh
```

Atau manual:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push --dry-run
npx supabase db push
```

## GitHub first push

```bash
./scripts/first-git-push.sh
```

Jika GitHub CLI (`gh`) tersedia, script dapat membuat repository secara otomatis. Jika tidak, script meminta URL repository yang sudah dibuat.

## Vercel

Import repository GitHub ke Vercel. Tambahkan environment variables production. Setelah Git integration aktif, commit/push baru dapat memicu deployment otomatis.

## Daily workflow

```bash
./scripts/push-production.sh
```

## Security

Never commit `.env.local`, database passwords, personal access tokens, or Supabase service-role secrets.
