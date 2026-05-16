<?php

use App\Http\Controllers\Admin\QuizController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('/courses/html', 'courses/html-course')->name('courses.html');
Route::inertia('/courses/css', 'courses/course-shell', ['course' => 'CSS'])->name('courses.css');
Route::inertia('/courses/php', 'courses/course-shell', ['course' => 'PHP'])->name('courses.php');
Route::inertia('/courses/mysql', 'courses/course-shell', ['course' => 'MySQL'])->name('courses.mysql');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
    });

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard.global');
    Route::resource('admin/quizzes', QuizController::class)
        ->except(['show'])
        ->names('admin.quizzes');

    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
