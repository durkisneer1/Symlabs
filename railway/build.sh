#!/usr/bin/env sh
set -e

if [ ! -f .env ]; then
  cp .env.example .env
fi

php artisan key:generate --ansi
APP_URL=http://localhost php artisan package:discover --ansi
APP_URL=http://localhost pnpm exec vite build
