#!/usr/bin/env sh
set -e

if [ ! -f .env ]; then
  cp .env.example .env
fi

php artisan key:generate --ansi
php artisan package:discover --ansi
pnpm exec vite build
