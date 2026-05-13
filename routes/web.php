<?php

use App\Http\Controllers\Courseware\AssessmentAttemptController;
use App\Http\Controllers\Courseware\CoursewareController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/my-page', 'my-page')->name('my-page');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
        Route::get('courseware', [CoursewareController::class, 'index'])->name('courseware.index');
        Route::patch('courseware/toggle', [CoursewareController::class, 'toggle'])->name('courseware.toggle');
        Route::get('courseware/lessons/{lesson}', [CoursewareController::class, 'lesson'])->name('courseware.lessons.show');
        Route::get('courseware/{type}/{content}', [AssessmentAttemptController::class, 'preview'])
            ->whereIn('type', ['homework', 'quiz'])
            ->name('courseware.assessments.preview');
        Route::post('courseware/{type}/{content}/attempts', [AssessmentAttemptController::class, 'store'])
            ->whereIn('type', ['homework', 'quiz'])
            ->name('courseware.attempts.store');
        Route::get('courseware/attempts/{attempt}', [AssessmentAttemptController::class, 'show'])->name('courseware.attempts.show');
        Route::post('courseware/attempts/{attempt}/submit', [AssessmentAttemptController::class, 'submit'])->name('courseware.attempts.submit');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
