#!/usr/bin/env bash
set -euo pipefail

APP_NAME="Global Finance Suite"
MIN_NODE_MAJOR=20
MIN_NODE_MINOR=9

info()  { printf '\033[1;36m%s\033[0m\n' "$*"; }
ok()    { printf '\033[1;32m%s\033[0m\n' "$*"; }
warn()  { printf '\033[1;33m%s\033[0m\n' "$*"; }
error() { printf '\033[1;31m%s\033[0m\n' "$*" >&2; }

info "=== $APP_NAME - Setup Linux Mint ==="

for cmd in node npm git; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    error "Perintah '$cmd' belum terpasang."
    if [[ "$cmd" == "node" || "$cmd" == "npm" ]]; then
      cat <<'TXT'
Install Node.js 20.9+ terlebih dahulu. Direkomendasikan menggunakan NVM:

  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  source "$HOME/.nvm/nvm.sh"
  nvm install 22
  nvm use 22

Lalu jalankan script ini lagi.
TXT
    else
      echo "Install Git: sudo apt update && sudo apt install -y git"
    fi
    exit 1
  fi
done

NODE_VERSION="$(node -p 'process.versions.node')"
NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
NODE_MINOR="$(node -p 'Number(process.versions.node.split(".")[1])')"

if (( NODE_MAJOR < MIN_NODE_MAJOR )) || { (( NODE_MAJOR == MIN_NODE_MAJOR )) && (( NODE_MINOR < MIN_NODE_MINOR )); }; then
  error "Node.js Anda v${NODE_VERSION}. Project ini membutuhkan Node.js 20.9 atau lebih baru."
  cat <<'TXT'
Direkomendasikan menggunakan NVM:

  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  source "$HOME/.nvm/nvm.sh"
  nvm install 22
  nvm use 22

Setelah itu jalankan kembali:
  ./scripts/setup-linux-mint.sh
TXT
  exit 1
fi

ok "Node: $(node -v)"
ok "npm : $(npm -v)"
ok "Git : $(git --version)"

if [[ ! -f .env.local ]]; then
  cp .env.example .env.local
  ok "Membuat .env.local dari .env.example"
else
  warn ".env.local sudah ada, tidak ditimpa."
fi

info "Menginstall dependency aplikasi..."
npm install

if ! npm ls supabase --depth=0 >/dev/null 2>&1; then
  info "Menambahkan Supabase CLI sebagai dev dependency..."
  npm install --save-dev supabase
fi

if [[ ! -f supabase/config.toml ]]; then
  info "Menginisialisasi konfigurasi Supabase lokal..."
  npx supabase init
else
  warn "supabase/config.toml sudah ada, melewati supabase init."
fi

printf '\n'
ok "SETUP LOCAL SELESAI."
printf '%s\n' \
  "Berikutnya:" \
  "1. Isi .env.local dengan URL dan publishable key Supabase." \
  "2. Jalankan: ./scripts/connect-supabase.sh" \
  "3. Jalankan aplikasi: npm run dev" \
  "4. Untuk GitHub pertama kali: ./scripts/first-git-push.sh"
