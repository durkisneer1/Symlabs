<?php

use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

test('web requests are rate limited', function () {
    for ($i = 0; $i < 120; $i++) {
        $this->get(route('home'))->assertOk();
    }

    $this->get(route('home'))->assertTooManyRequests();
});

test('password reset link requests are rate limited', function () {
    Notification::fake();

    $user = User::factory()->create();

    for ($i = 0; $i < 2; $i++) {
        $this->post(route('password.email'), ['email' => $user->email]);
    }

    $this->post(route('password.email'), ['email' => $user->email])
        ->assertTooManyRequests();

    Notification::assertSentToTimes($user, ResetPassword::class, 1);
});

test('registration requests are rate limited', function () {
    for ($i = 0; $i < 5; $i++) {
        $this->post('/register', [
            'name' => "Test User {$i}",
            'email' => "test{$i}@example.com",
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);
    }

    $this->post('/register', [
        'name' => 'Too Many',
        'email' => 'too-many@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertTooManyRequests();
});

test('classroom questions are rate limited', function () {
    $team = Team::factory()->create();
    $student = User::factory()->create(['current_team_id' => $team->id]);

    $student->teams()->attach($team, ['role' => TeamRole::Student->value]);

    for ($i = 0; $i < 10; $i++) {
        $this->actingAs($student)
            ->post(route('questions.store', ['current_team' => $team]), [
                'question' => "Question {$i}",
            ])
            ->assertRedirect(route('questions.index', ['current_team' => $team]));
    }

    $this->actingAs($student)
        ->post(route('questions.store', ['current_team' => $team]), [
            'question' => 'One more question',
        ])
        ->assertTooManyRequests();
});
