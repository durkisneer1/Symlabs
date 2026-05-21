#!/usr/bin/env sh
set -e

APP_URL=http://localhost php artisan migrate --force
APP_URL=http://localhost php artisan config:cache
APP_URL=http://localhost php artisan route:cache
APP_URL=http://localhost php artisan view:cache
