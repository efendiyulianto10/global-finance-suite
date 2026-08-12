#!/usr/bin/env bash
set -euo pipefail

info()  { printf '\033[1;36m%s\033[0m\n' "$*"; }
ok()    { printf '\033[1;32m%s\033[0m\n' "$*"; }
warn()  { printf '\033[1;33m%s\033[0m\n' "$*"; }
error() { printf '\033[1;31m%s\033[0m\n' "$*" >&2; }

if [[ ! -d .git ]]; then
  error "Folder ini belum menjadi repository Git. Jalankan ./scripts/first-git-push.sh"
  exit 1
fi

BRANCH="$(git branch --show-current)"
if [[ -z "$BRANCH" ]]; then
  error "Repository Git belum memiliki branch aktif."
  exit 1
fi

if [[ -z "$(git status --porcelain)" ]]; then
  warn "Tidak ada perubahan untuk di-commit."
  exit 0
fi

read -r -p "Commit message [Update finance application]: " MESSAGE
MESSAGE="${MESSAGE:-Update finance application}"

git add .
git commit -m "$MESSAGE"
git push origin "$BRANCH"

ok "Push GitHub selesai."
info "Jika integrasi GitHub Vercel/Supabase sudah aktif, pipeline deployment akan berjalan dari commit ini."
