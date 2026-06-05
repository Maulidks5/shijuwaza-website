#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> SHIJUWAZA production deploy"

if [ ! -f .env ]; then
    echo "ERROR: .env is missing. Copy .env.production.example to .env and fill production values first."
    exit 1
fi

echo "==> Installing PHP dependencies"
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction

if [ "${SKIP_NPM_BUILD:-0}" != "1" ]; then
    if command -v npm >/dev/null 2>&1; then
        echo "==> Installing Node dependencies"
        npm ci

        echo "==> Building frontend assets"
        npm run build
    else
        echo "WARN: npm was not found. Skipping frontend build."
        echo "      Install Node.js on cPanel or build locally before deployment."
    fi
else
    echo "==> Skipping frontend build because SKIP_NPM_BUILD=1"
fi

echo "==> Preparing Laravel"
php artisan down --render="errors::503" || true
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan event:clear || true

php artisan migrate --force
php artisan storage:link || true

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache || true

php artisan up || true

echo "==> Deployment complete"
