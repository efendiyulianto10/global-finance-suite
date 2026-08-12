# Instalasi Global Finance Suite di Linux Mint

Project ini disiapkan khusus untuk Terminal Linux Mint.

## 1. Extract dan masuk ke folder project

```bash
cd ~/Downloads
unzip global-finance-suite-linux-mint.zip
cd global-finance-suite
```

## 2. Jalankan setup

```bash
chmod +x scripts/*.sh
./scripts/setup-linux-mint.sh
```

Project membutuhkan Node.js 20.9 atau lebih baru. Jika Node belum tersedia atau terlalu lama, script akan berhenti dan memberikan instruksi instalasi NVM.

## 3. Isi environment Supabase

Edit `.env.local`:

```bash
nano .env.local
```

Isi nilai berikut dari dashboard Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_NAME=Global Finance Suite
```

`SUPABASE_SERVICE_ROLE_KEY` adalah secret server-only. Jangan pernah expose ke browser atau commit ke GitHub.

## 4. Hubungkan database Supabase

```bash
./scripts/connect-supabase.sh
```

Script menjalankan login, `supabase link`, dry-run migration, lalu meminta konfirmasi sebelum `db push`.

## 5. Jalankan aplikasi lokal

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

## 6. Push pertama ke GitHub

### Cara paling otomatis: GitHub CLI

Install GitHub CLI bila belum ada:

```bash
sudo apt update
sudo apt install -y gh
```

Lalu:

```bash
./scripts/first-git-push.sh
```

Bila `gh` tersedia, script dapat login, membuat repository GitHub, menambahkan remote, dan push source code.

### Tanpa GitHub CLI

Buat repository kosong di GitHub melalui browser, lalu jalankan:

```bash
./scripts/first-git-push.sh
```

Paste URL repository ketika diminta.

## 7. Hubungkan GitHub ke Vercel

Di dashboard Vercel:

1. Add New -> Project.
2. Import repository `global-finance-suite` dari GitHub.
3. Framework akan terdeteksi sebagai Next.js.
4. Tambahkan environment variables dari `.env.local` yang memang diperlukan di production.
5. Deploy.

Setelah repository terhubung, push/merge Git pada repository dapat memicu deployment Vercel otomatis.

## 8. Supabase + GitHub

Gunakan Supabase GitHub Integration / branching workflow bila Anda ingin migration production dipicu dari repository. Jangan menjalankan migration production otomatis sebelum alur review/approval Anda jelas.

Untuk tahap awal yang lebih aman, migration dapat diterapkan manual dari laptop:

```bash
npx supabase db push --dry-run
npx supabase db push
```

## 9. Update harian

Setelah setup awal selesai:

```bash
./scripts/push-production.sh
```

Alurnya:

```text
Linux Mint
   |
   v
Git local
   |
   v
GitHub
   |----------------> Vercel auto deployment
   |
   +----------------> Supabase deployment workflow (jika diaktifkan)
```

## Catatan keamanan

- Jangan commit `.env.local`.
- Jangan taruh `SUPABASE_SERVICE_ROLE_KEY` pada kode client/browser.
- Gunakan repository private untuk project finance internal.
- Aktifkan MFA pada GitHub, Supabase, dan Vercel.
- Terapkan RLS/authorization dengan ketat sebelum menyimpan data perusahaan nyata.
