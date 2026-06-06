<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('symlabs:admin
    {email : The email address for the admin account}
    {--name= : The display name to use when creating the account}
    {--password= : The password to set. If omitted for a new user, a temporary password is generated}
    {--unverified : Leave the account email unverified}', function () {
    if (User::query()->where('role', UserRole::Admin->value)->exists()) {
        $this->error('An admin already exists. Use the admin dashboard to invite additional admins.');

        return 1;
    }

    $email = Str::lower(trim($this->argument('email')));
    $name = trim($this->option('name') ?: 'Symlabs Admin');
    $password = $this->option('password') ?: Str::password(24);
    $verifiedAt = $this->option('unverified') ? null : now();

    $user = User::query()->firstOrNew(['email' => $email]);
    $wasRecentlyCreated = ! $user->exists;

    $user->name = $user->exists ? $user->name : $name;
    $user->role = UserRole::Admin;
    $user->can_invite_admins = true;
    $user->email_verified_at = $user->email_verified_at ?: $verifiedAt;

    if ($wasRecentlyCreated || $this->option('password')) {
        $user->password = $password;
    }

    $user->save();

    $this->info($wasRecentlyCreated ? 'Admin account created.' : 'Existing account promoted to admin.');
    $this->line("Email: {$user->email}");

    if ($wasRecentlyCreated && ! $this->option('password')) {
        $this->warn("Temporary password: {$password}");
        $this->warn('Change this password after the first login.');
    }
})->purpose('Create or promote a Symlabs admin account');

Artisan::command('symlabs:prune-users
    {--email=* : Exact email address to delete}
    {--domain=* : Email domain to delete, for example example.test}
    {--unverified-older-than= : Delete unverified accounts older than this many hours}
    {--force : Actually delete matching users}', function () {
    $emails = collect($this->option('email'))
        ->map(fn (string $email) => Str::lower(trim($email)))
        ->filter()
        ->values();
    $domains = collect($this->option('domain'))
        ->map(fn (string $domain) => Str::lower(ltrim(trim($domain), '@')))
        ->filter()
        ->values();
    $unverifiedOlderThan = $this->option('unverified-older-than');

    if ($emails->isEmpty() && $domains->isEmpty() && blank($unverifiedOlderThan)) {
        $this->error('Add at least one selector: --email, --domain, or --unverified-older-than.');

        return 1;
    }

    if (
        ! blank($unverifiedOlderThan)
        && (! ctype_digit((string) $unverifiedOlderThan) || (int) $unverifiedOlderThan < 1)
    ) {
        $this->error('--unverified-older-than must be a whole number of hours greater than zero.');

        return 1;
    }

    $query = User::query()
        ->where('role', '!=', UserRole::Admin->value)
        ->where(function ($query) use ($emails, $domains, $unverifiedOlderThan) {
            if ($emails->isNotEmpty()) {
                $query->orWhereIn('email', $emails);
            }

            foreach ($domains as $domain) {
                $query->orWhereRaw('lower(email) like ?', ["%@{$domain}"]);
            }

            if (! blank($unverifiedOlderThan)) {
                $query->orWhere(function ($query) use ($unverifiedOlderThan) {
                    $query
                        ->whereNull('email_verified_at')
                        ->where('created_at', '<=', now()->subHours((int) $unverifiedOlderThan));
                });
            }
        });

    $users = $query
        ->oldest()
        ->get(['id', 'name', 'email', 'role', 'email_verified_at', 'created_at']);

    if ($users->isEmpty()) {
        $this->info('No matching non-admin users found.');

        return 0;
    }

    $this->table(
        ['ID', 'Name', 'Email', 'Role', 'Verified', 'Created'],
        $users->take(50)->map(fn (User $user) => [
            $user->id,
            $user->name,
            $user->email,
            $user->role->value,
            $user->email_verified_at?->toDateTimeString() ?? 'no',
            $user->created_at?->toDateTimeString(),
        ])->all()
    );

    if ($users->count() > 50) {
        $this->warn('Showing the first 50 matches only.');
    }

    if (! $this->option('force')) {
        $this->warn("Dry run only. Re-run with --force to delete {$users->count()} matching user(s).");

        return 0;
    }

    $users->each->delete();

    $this->info("Deleted {$users->count()} user(s).");

    return 0;
})->purpose('Preview or delete bot accounts with guardrails');
