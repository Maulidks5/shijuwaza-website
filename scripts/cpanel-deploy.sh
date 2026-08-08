#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> SHIJUWAZA production deploy"

if [ ! -f .env ]; then
    echo "ERROR: .env is missing. Copy .env.production.example to .env and fill production values first."
    exit 1
fi

if [ ! -f public/build/manifest.json ]; then
    echo "ERROR: public/build/manifest.json is missing. Run npm run build locally and commit public/build."
    exit 1
fi

echo "==> Preparing Laravel"
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan event:clear || true

php artisan migrate --force

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache || true

echo "==> Deployment complete"
