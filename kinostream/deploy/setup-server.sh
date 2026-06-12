#!/usr/bin/env bash
set -euo pipefail

# First-time VPS setup for kinoregin.ru
# Usage:
#   curl -fsSL ... | bash
#   or: bash deploy/setup-server.sh

DEPLOY_PATH="${DEPLOY_PATH:-/var/www/kinoregin}"
REPO_URL="${REPO_URL:-https://github.com/Egor2929/kinostream.git}"
APP_DIR="${DEPLOY_PATH}/kinostream"
NODE_MAJOR="${NODE_MAJOR:-20}"

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root or with sudo"
  exit 1
fi

apt-get update
apt-get install -y curl git nginx certbot python3-certbot-nginx

if ! command -v node >/dev/null 2>&1 || [ "$(node -p "process.versions.node.split('.')[0]")" -lt "${NODE_MAJOR}" ]; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash -
  apt-get install -y nodejs
fi

npm install -g pm2

if [ ! -d "${DEPLOY_PATH}/.git" ]; then
  git clone "${REPO_URL}" "${DEPLOY_PATH}"
fi

cd "${APP_DIR}"

if [ ! -f .env.production ] && [ ! -f .env.local ]; then
  cat > .env.production <<'EOF'
TMDB_API_KEY=
NEXT_PUBLIC_SITE_URL=https://kinoregin.ru
NEXT_PUBLIC_AD_DURATION=15
EOF
  echo "Created ${APP_DIR}/.env.production — fill TMDB_API_KEY before going live"
fi

npm ci
npm run build
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup systemd -u "${SUDO_USER:-root}" --hp "$(eval echo ~${SUDO_USER:-root})"

cp deploy/nginx.kinoregin.ru.conf /etc/nginx/sites-available/kinoregin.ru
ln -sf /etc/nginx/sites-available/kinoregin.ru /etc/nginx/sites-enabled/kinoregin.ru
nginx -t
systemctl reload nginx

echo "Done. Next:"
echo "  1. Edit ${APP_DIR}/.env.production"
echo "  2. pm2 reload kinoregin --update-env"
echo "  3. certbot --nginx -d kinoregin.ru -d www.kinoregin.ru"
