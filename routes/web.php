<?php

use App\Http\Controllers\QuizController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('/courses/html', 'courses/html-course')->name('courses.html');
Route::inertia('/courses/css', 'courses/css-course')->name('courses.css');
Route::inertia('/courses/php', 'courses/php-course')->name('courses.php');
Route::inertia('/courses/mysql', 'courses/mysql-course')->name('courses.mysql');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

Route::resource('quizzes', QuizController::class);

require __DIR__.'/settings.php';
