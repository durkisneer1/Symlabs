# Inkbooks

Inkbooks is a Laravel + Inertia + React application. Laravel handles routing,
auth, server-side data, queues, and the database. React/TypeScript handles the
pages and UI through Inertia, Vite, Tailwind CSS, and shadcn/ui components.

## Tech Stack

- PHP 8.3+
- Laravel 13
- Inertia React
- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui
- SQLite by default for local development
- pnpm for JavaScript packages

## OS Setup

### Recommended (macOS / Windows)

Laravel Herd is the simplest option. Herd includes PHP, Composer, Node,
Nginx, and Laravel tooling. After [installing Herd](https://herd.laravel.com/), verify:

```bash
php -v
composer -v
node -v
```

Enable `pnpm`:

```bash
corepack enable
corepack prepare pnpm@11.1.1 --activate
```

### Linux / Manual Setup

Install:

- Git
- PHP 8.3+
- Composer
- Node.js 22+
- SQLite support

Then enable pnpm:

```bash
corepack enable
corepack prepare pnpm@11.1.1 --activate
```

## First-Time Project Setup

### Cloning

If using Herd, clone this repo into Herd's sites folder:

```powershell
# Unix
cd ~/Herd

# Windows PS
cd $HOME\Herd

git clone https://github.com/durkisneer1/InkBooks.git inkbooks && cd inkbooks
```

Otherwise, you may clone the repo wherever.

### Setup

Install PHP and JS dependencies:

```bash
composer install
pnpm install
```

Create your local Laravel environment file:

```bash
cp .env.example .env

# Windows PS
Copy-Item .env.example .env
```

Generate the app key:

```bash
php artisan key:generate
```

This repo uses SQLite by default in `.env.example`. The file is ignored by Git,
so each developer needs to create their own local copy once:

```bash
touch database/database.sqlite

# Windows PS
New-Item database/database.sqlite -ItemType File
```

Run database migrations:

```bash
php artisan migrate

# Or for cleaning out an existing local database
php artisan migrate:fresh
```

## Running the App

If using Herd, the app will be available at http://inkbooks.test.

Otherwise, start the local dev stack in a terminal:

```bash
composer run dev
```

That runs Laravel, the queue listener, Laravel Pail logs, and Vite. The app will be available at http://127.0.0.1:8000.

## Where Things Go

| Purpose                   | Location                        |
| ------------------------- | ------------------------------- |
| Laravel routes            | `routes/web.php`                |
| Settings routes           | `routes/settings.php`           |
| React/Inertia pages       | `resources/js/pages`            |
| Shared React components   | `resources/js/components`       |
| shadcn/ui components      | `resources/js/components/ui`    |
| Layouts                   | `resources/js/layouts`          |
| Global CSS + theme tokens | `resources/css/app.css`         |
| Inertia boot file         | `resources/js/app.tsx`          |
| Root Blade shell          | `resources/views/app.blade.php` |

For example, the following code will render `resources/js/pages/my-page.tsx`.

```php
Route::inertia('/my-page', 'my-page')->name('my-page');
```

> Do not build normal pages in Blade unless there is a specific reason. Build pages in TSX under `resources/js/pages`.

### Layout Conventions

Layout selection happens in `resources/js/app.tsx`.

- Public standalone pages can return `null` layout.
- Auth pages use `AuthLayout`.
- Normal signed-in app pages use `AppLayout`.
- Settings/team pages use `AppLayout` plus `SettingsLayout`.

If a page uses the authenticated app layout, put the Laravel route behind auth
middleware so `auth.user` exists.

## Troubleshooting

| Problem                       | Command                            |
| ----------------------------- | ---------------------------------- |
| Frontend changes not updating | `pnpm dev`                         |
| Laravel cache issues          | `php artisan optimize:clear`       |
| Broken dependencies           | `composer install && pnpm install` |
| Missing app key               | `php artisan key:generate`         |

If SQLite errors say the database file does not exist, create it:

```bash
touch database/database.sqlite

# Windows PS
New-Item database/database.sqlite -ItemType File
```

## Before Opening a Pull Request

Run:

```bash
pnpm types:check
pnpm lint:check
pnpm format:check
composer lint:check
php artisan test
```

Keep changes focused, describe what changed, and mention anything you could not
test locally.
