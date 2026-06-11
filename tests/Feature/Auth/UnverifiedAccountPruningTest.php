<?php

use App\Enums\UserRole;
use App\Models\User;

test('old unverified non-admin accounts can be pruned', function () {
    $oldUnverified = User::factory()->unverified()->create([
        'created_at' => now()->subHours(73),
    ]);
    $freshUnverified = User::factory()->unverified()->create([
        'created_at' => now()->subHours(12),
    ]);
    $verified = User::factory()->create([
        'created_at' => now()->subHours(100),
    ]);
    $admin = User::factory()->unverified()->create([
        'role' => UserRole::Admin,
        'created_at' => now()->subHours(100),
    ]);

    $this->artisan('symlabs:prune-users', [
        '--unverified-older-than' => 72,
        '--force' => true,
    ])->assertSuccessful();

    expect(User::find($oldUnverified->id))->toBeNull();
    expect(User::find($freshUnverified->id))->not->toBeNull();
    expect(User::find($verified->id))->not->toBeNull();
    expect(User::find($admin->id))->not->toBeNull();
});
