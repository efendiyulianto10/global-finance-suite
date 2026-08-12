#!/usr/bin/env bash
set -euo pipefail

info()  { printf '\033[1;36m%s\033[0m\n' "$*"; }
ok()    { printf '\033[1;32m%s\033[0m\n' "$*"; }
warn()  { printf '\033[1;33m%s\033[0m\n' "$*"; }
error() { printf '\033[1;31m%s\033[0m\n' "$*" >&2; }

info "=== Global Finance Suite - First Git Push (Linux Mint) ==="

if [[ ! -d .git ]]; then
  git init
fi

git branch -M main

if [[ -z "$(git config user.name || true)" ]]; then
  read -r -p "Nama Git Anda: " GIT_NAME
  git config user.name "$GIT_NAME"
fi

if [[ -z "$(git config user.email || true)" ]]; then
  read -r -p "Email Git/GitHub Anda: " GIT_EMAIL
  git config user.email "$GIT_EMAIL"
fi

git add .
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  git commit -m "Initial enterprise finance app"
elif ! git diff --cached --quiet; then
  git commit -m "Prepare Linux Mint deployment"
fi

# Prefer GitHub CLI when available. It can create and push the repository automatically.
if command -v gh >/dev/null 2>&1; then
  if ! gh auth status >/dev/null 2>&1; then
    warn "GitHub CLI tersedia tetapi belum login."
    info "Jalankan login GitHub sekarang..."
    gh auth login
  fi

  if ! git remote get-url origin >/dev/null 2>&1; then
    read -r -p "Nama repository GitHub [global-finance-suite]: " REPO_NAME
    REPO_NAME="${REPO_NAME:-global-finance-suite}"
    read -r -p "Buat repository PRIVATE? [Y/n]: " PRIVATE_ANSWER
    case "$PRIVATE_ANSWER" in
      n|N|no|NO) VISIBILITY="--public" ;;
      *) VISIBILITY="--private" ;;
    esac
    gh repo create "$REPO_NAME" "$VISIBILITY" --source=. --remote=origin --push
    ok "Repository GitHub dibuat dan source code sudah di-push."
    exit 0
  fi
fi

warn "GitHub CLI (gh) tidak tersedia atau origin sudah ada. Menggunakan URL repository."
if git remote get-url origin >/dev/null 2>&1; then
  ORIGIN="$(git remote get-url origin)"
  info "Origin saat ini: $ORIGIN"
else
  read -r -p "Paste URL repository GitHub (SSH/HTTPS): " REMOTE_URL
  if [[ -z "${REMOTE_URL// }" ]]; then
    error "URL GitHub wajib diisi."
    exit 1
  fi
  git remote add origin "$REMOTE_URL"
fi

git push -u origin main
ok "Initial push GitHub selesai."
