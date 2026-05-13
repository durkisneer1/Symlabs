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

## Prerequisites

Install these before setting up the project:

- Git
- PHP 8.3 or newer
- Composer
- Node.js 22 or newer
- pnpm 11 or newer
- SQLite support for PHP

Recommended editor: VS Code with PHP, Laravel, ESLint, Prettier, and Tailwind
CSS extensions.

## OS Setup Notes

Windows, macOS, and Linux all work. If you are new to Laravel, use Laravel Herd
on Windows or macOS; it bundles most of the PHP/Laravel tooling so there is less
to install by hand.

### macOS

Laravel Herd is the simplest option on macOS. Herd includes PHP, Composer, Node,
Nginx, and Laravel tooling. After installing Herd, verify:

```bash
herd --version
php --version
composer --version
node --version
```

Homebrew is also fine if you prefer managing tools yourself:

```bash
brew install php composer node pnpm
```

If `pnpm` is not available after installing Node, enable Corepack:

```bash
corepack enable
corepack prepare pnpm@11.1.1 --activate
```

### Linux

Use your distro package manager for Git, PHP, Composer, and SQLite extensions.
On Ubuntu/Debian, the rough shape is:

```bash
sudo apt update
sudo apt install git php php-cli php-sqlite3 php-mbstring php-xml php-curl php-zip unzip composer
```

Install Node.js 22 from your preferred source, then enable pnpm:

```bash
corepack enable
corepack prepare pnpm@11.1.1 --activate
```

### Windows

Use Laravel Herd for Windows unless you already have a PHP environment you like.
Herd requires Windows 10 or newer and needs administrator permissions during
installation. It ships with PHP, Composer, Node.js, Nginx, and Laravel command
line tools.

1. Download and install Laravel Herd for Windows:

    ```txt
    https://herd.laravel.com/docs/windows
    ```

2. Open Herd once so it can finish onboarding.

3. Open PowerShell and verify the tools are available:

    ```powershell
    herd --version
    php --version
    composer --version
    node --version
    ```

4. Install or enable pnpm:

    ```powershell
    corepack enable
    corepack prepare pnpm@11.1.1 --activate
    pnpm -v
    ```

5. Clone this repo into Herd's sites folder if you want a `.test` domain:

    ```powershell
    cd $HOME\Herd
    git clone <repo-url> inkbooks
    cd inkbooks
    ```

    Herd usually serves projects in that folder at:

    ```txt
    http://inkbooks.test
    ```

    You can also clone anywhere and use `php artisan serve` instead.

6. Continue with the first-time project setup below.

WSL 2 with Ubuntu also works well. If you use WSL, follow the Linux steps inside
the Ubuntu terminal.

Native Windows without Herd is possible, but make sure PHP, Composer, Node.js,
and pnpm are all available in PowerShell:

```powershell
php -v
composer -V
node -v
pnpm -v
```

## First-Time Project Setup

Clone the repo and enter it:

```bash
git clone <repo-url>
cd inkbooks
```

Install PHP dependencies:

```bash
composer install
```

Install JavaScript dependencies:

```bash
pnpm install
```

Create your local Laravel environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Generate the app key:

```bash
php artisan key:generate
```

Create the local SQLite database file:

```bash
touch database/database.sqlite
```

On Windows PowerShell:

```powershell
New-Item database/database.sqlite -ItemType File
```

This repo uses SQLite by default in `.env.example`. The file is ignored by Git,
so each developer needs to create their own local copy once.

Run database migrations:

```bash
php artisan migrate
```

## Running the App

Start the local dev stack in a terminal:

```bash
composer run dev
```

That runs Laravel, the queue listener, Laravel Pail logs, and Vite. Open:

```txt
http://127.0.0.1:8000
```

If you are using Herd and cloned the project into Herd's sites folder, you can
usually open:

```txt
http://inkbooks.test
```

## Where Things Go

Laravel routes live in:

```txt
routes/web.php
routes/settings.php
```

React/Inertia pages live in:

```txt
resources/js/pages
```

Example:

```php
Route::inertia('/my-page', 'my-page')->name('my-page');
```

renders:

```txt
resources/js/pages/my-page.tsx
```

Shared React components live in:

```txt
resources/js/components
```

shadcn/ui components live in:

```txt
resources/js/components/ui
```

Layouts live in:

```txt
resources/js/layouts
```

Global CSS and theme tokens live in:

```txt
resources/css/app.css
```

The main Inertia app boot file is:

```txt
resources/js/app.tsx
```

The Blade file is only the root shell for Inertia:

```txt
resources/views/app.blade.php
```

Do not build normal pages in Blade unless there is a specific reason. Build
pages in TSX under `resources/js/pages`.

## Page Layout Rules

Layout selection happens in `resources/js/app.tsx`.

- Public standalone pages can return `null` layout.
- Auth pages use `AuthLayout`.
- Normal signed-in app pages use `AppLayout`.
- Settings/team pages use `AppLayout` plus `SettingsLayout`.

If a page uses the authenticated app layout, put the Laravel route behind auth
middleware so `auth.user` exists.

## shadcn/ui Notes

Components are copied into this repo, not imported from a remote package at
runtime. That means component behavior and styling are editable in
`resources/js/components/ui`.

Add a component with:

```bash
pnpm dlx shadcn@latest add button
```

The shadcn config is:

```txt
components.json
```

Theme tokens are in:

```txt
resources/css/app.css
```

## Database Notes

Local development uses SQLite by default:

```env
DB_CONNECTION=sqlite
```

After pulling new migrations, run:

```bash
php artisan migrate
```

If you need a clean local database:

```bash
php artisan migrate:fresh
```

Only use `migrate:fresh` when you are okay deleting local data.

## Troubleshooting

If frontend changes do not show up, restart Vite:

```bash
pnpm dev
```

If Laravel config or routes seem stale:

```bash
php artisan optimize:clear
```

If dependencies seem broken:

```bash
composer install
pnpm install
```

If the app key is missing:

```bash
php artisan key:generate
```

If SQLite errors say the database file does not exist, create it:

```bash
touch database/database.sqlite
```

On Windows PowerShell:

```powershell
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
