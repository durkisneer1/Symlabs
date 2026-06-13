<?php

use App\Enums\TeamRole;
use App\Enums\UserRole;
use App\Models\TeacherAccountRequest;
use App\Models\Team;
use App\Models\User;

test('approved classroom requests create a classroom teacher without promoting the account', function () {
    $requester = User::factory()->create(['role' => UserRole::Member]);
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    $this
        ->actingAs($requester)
        ->post(route('teacher-requests.store'), [
            'institution' => 'San Jacinto College',
            'instructor_title' => 'Professor',
            'course_name' => 'CSCI 1301',
            'expected_student_count' => 24,
            'proof' => 'Faculty profile URL and teacher ID details.',
        ])
        ->assertRedirect(route('teacher-requests.index'));

    $classroomRequest = TeacherAccountRequest::query()->firstOrFail();

    $this
        ->actingAs($admin)
        ->put(route('teacher-requests.update', $classroomRequest), [
            'status' => 'approved',
            'admin_notes' => 'Looks valid.',
        ])
        ->assertRedirect(route('teacher-requests.index'));

    $team = Team::query()->where('name', 'CSCI 1301')->first();

    expect($team)->not->toBeNull();
    expect($requester->fresh()->role)->toBe(UserRole::Member);

    $this->assertDatabaseHas('team_members', [
        'team_id' => $team->id,
        'user_id' => $requester->id,
        'role' => TeamRole::Teacher->value,
    ]);
});

test('admins can join and leave classrooms as classroom admins', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $team = Team::factory()->create();

    $this
        ->actingAs($admin)
        ->post(route('teams.join', $team))
        ->assertRedirect();

    $this->assertDatabaseHas('team_members', [
        'team_id' => $team->id,
        'user_id' => $admin->id,
        'role' => TeamRole::Admin->value,
    ]);

    $this
        ->actingAs($admin)
        ->delete(route('teams.leave', $team))
        ->assertRedirect();

    $this->assertDatabaseMissing('team_members', [
        'team_id' => $team->id,
        'user_id' => $admin->id,
        'role' => TeamRole::Admin->value,
    ]);
});
