#!/usr/bin/env bash
set -euo pipefail

info()  { printf '\033[1;36m%s\033[0m\n' "$*"; }
ok()    { printf '\033[1;32m%s\033[0m\n' "$*"; }
error() { printf '\033[1;31m%s\033[0m\n' "$*" >&2; }

if [[ ! -f package.json ]]; then
  error "Jalankan script ini dari root project."
  exit 1
fi

if ! npx supabase --version >/dev/null 2>&1; then
  error "Supabase CLI belum tersedia. Jalankan ./scripts/setup-linux-mint.sh dulu."
  exit 1
fi

info "=== Hubungkan Supabase ==="
info "Login Supabase akan membuka browser atau meminta token."
npx supabase login

read -r -p "Masukkan Supabase Project Ref: " PROJECT_REF
if [[ -z "${PROJECT_REF// }" ]]; then
  error "Project Ref wajib diisi."
  exit 1
fi

npx supabase link --project-ref "$PROJECT_REF"

info "Memeriksa migration tanpa menerapkannya..."
npx supabase db push --dry-run

printf '\n'
read -r -p "Terapkan migration ke Supabase sekarang? [y/N]: " ANSWER
case "$ANSWER" in
  y|Y|yes|YES)
    npx supabase db push
    ok "Migration Supabase selesai."
    ;;
  *)
    info "Migration belum diterapkan. Nanti jalankan: npx supabase db push"
    ;;
esac
