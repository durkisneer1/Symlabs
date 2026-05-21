# Railway Deployment

This app is a Laravel + Inertia application, so deploy it as a Laravel service
with a MySQL database in the same Railway project.

## Project Setup

1. Push the repository to GitHub.
2. In Railway, create a new project.
3. Add a MySQL database service.
4. Add a new service from the GitHub repository.
5. In the app service settings, use these commands:

   Build command:

   ```sh
   pnpm build
   ```

   Pre-deploy command:

   ```sh
   chmod +x ./railway/init-app.sh && sh ./railway/init-app.sh
   ```

6. Generate a public domain for the app service.

## App Service Variables

Set these on the Laravel app service. Do not commit real secret values.
`APP_KEY` and `DB_URL` are required; the app will not build/deploy correctly
without them.

```env
APP_NAME=InkBooks
APP_ENV=production
APP_KEY=base64:replace-with-a-generated-key
APP_DEBUG=false
APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

LOG_CHANNEL=stderr
LOG_LEVEL=info
COMPOSER_ALLOW_SUPERUSER=1

DB_CONNECTION=mysql
DB_URL=${{MySQL.MYSQL_URL}}

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

CACHE_STORE=database
QUEUE_CONNECTION=sync

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local

MAIL_MAILER=log
MAIL_FROM_ADDRESS=hello@example.com
MAIL_FROM_NAME="${APP_NAME}"

VITE_APP_NAME="${APP_NAME}"
```

This project requires PHP 8.4 because the locked Laravel/Symfony dependency set
requires it. The repo pins PHP 8.4 in `composer.json`, `composer.lock`,
`.php-version`, and `mise.toml` so Railway/Railpack does not fall back to PHP
8.3.

Generate `APP_KEY` locally with:

```sh
php artisan key:generate --show
```

If PHP is not on your local PATH, you can generate a compatible key with
PowerShell:

```powershell
'base64:' + [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Later

When the app starts sending email, replace the `MAIL_*` values with real SMTP or
mail provider credentials.

When background jobs become important, change `QUEUE_CONNECTION=database` and
add a separate Railway worker service from the same repo with this start
command:

```sh
php artisan queue:work --sleep=3 --tries=3 --timeout=90
```

Only the app service should have a public domain. The MySQL service should stay
private inside the Railway project.
