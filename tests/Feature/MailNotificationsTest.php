<?php

use App\Enums\UserRole;
use App\Models\AdminInvitation;
use App\Models\TeamInvitation as TeamInvitationModel;
use App\Models\User;
use App\Notifications\AdminInvitationNotification;
use App\Notifications\Teams\TeamInvitation;
use Illuminate\Contracts\Queue\ShouldQueue;

test('admin invitation email sends synchronously and uses symlabs mail branding', function () {
    $inviter = User::factory()->create(['role' => UserRole::Admin]);
    $invitation = AdminInvitation::create([
        'email' => 'new-admin@example.com',
        'invited_by' => $inviter->id,
        'expires_at' => now()->addDays(3),
    ]);

    $notification = new AdminInvitationNotification($invitation);
    $html = (string) $notification->toMail($inviter)->render();

    expect($notification)->not->toBeInstanceOf(ShouldQueue::class);
    expect($html)->toContain('symlabs@2x.png');
    expect($html)->toContain('All rights reserved.');
    expect($html)->toContain('Accept admin invitation');
});

test('classroom invitation email sends synchronously and uses symlabs mail branding', function () {
    $invitation = TeamInvitationModel::factory()->create();
    $notification = new TeamInvitation($invitation);
    $html = (string) $notification->toMail($invitation->inviter)->render();

    expect($notification)->not->toBeInstanceOf(ShouldQueue::class);
    expect($html)->toContain('symlabs@2x.png');
    expect($html)->toContain('All rights reserved.');
    expect($html)->toContain('Accept invitation');
});
