<?php

use App\Http\Controllers\Admin\QuizController;
use App\Http\Controllers\Admin\QuizQuestionController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Teams\AssignmentAttemptController;
use App\Http\Controllers\Teams\ClassroomSettingsController;
use App\Http\Controllers\Teams\ClassroomQuestionController;
use App\Http\Controllers\Teams\ChapterProgressController;
use App\Http\Controllers\Teams\CourseworkController;
use App\Http\Controllers\Teams\StudentAnalyticsController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\SupportTicketController;
use App\Http\Controllers\TeacherAccountRequestController;
use App\Http\Middleware\EnsureTeamMembership;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('/courses/html', 'courses/html-course')->name('courses.html');
Route::get('/courses/html/{chapter}', fn (string $chapter) => Inertia::render('courses/html-chapter', [
    'chapterSlug' => $chapter,
]))->name('courses.html.chapter');
Route::inertia('/courses/css', 'courses/course-shell', ['course' => 'CSS'])->name('courses.css');
Route::inertia('/courses/php', 'courses/php-course')->name('courses.php');
Route::get('/courses/php/{chapter}', fn (string $chapter) => Inertia::render('courses/php-chapter', [
    'chapterSlug' => $chapter,
]))->whereIn('chapter', ['variables-and-flow'])->name('courses.php.chapter');
Route::inertia('/courses/mysql', 'courses/course-shell', ['course' => 'MySQL'])->name('courses.mysql');

Route::get('/sitemap.xml', function () {
    $urls = collect([
        route('home'),
        route('courses.html'),
        route('courses.css'),
        route('courses.php'),
        route('courses.mysql'),
    ]);

    $htmlChapters = [
        'intro-to-web',
        'elements-and-tags',
        'text-formatting-and-special-characters',
        'images',
        'links',
        'lists',
        'tables',
        'containers-and-semantic-tags',
        'forms',
        'audio-and-video',
        'developer-guidelines-and-best-practices',
    ];

    $chapterUrls = collect($htmlChapters)
        ->map(fn (string $chapter) => route('courses.html.chapter', $chapter));

    return response()
        ->view('sitemap', [
            'urls' => $urls->merge($chapterUrls),
        ])
        ->header('Content-Type', 'application/xml');
})->name('sitemap');

// When in a classroom as teacher or student
Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::inertia('dashboard', 'dashboard')->name('dashboard');
        Route::inertia('work', 'classroom-work')->name('work.index');
        Route::inertia('roster', 'classroom-roster')->name('roster.index');
        Route::inertia('classroom', 'classroom-settings')->name('classroom.settings');
        Route::put('classroom', [ClassroomSettingsController::class, 'update'])
            ->middleware('throttle:heavy')
            ->name('classroom.update');
        Route::get('coursework/create', [CourseworkController::class, 'create'])->name('coursework.create');
        Route::post('coursework', [CourseworkController::class, 'store'])
            ->middleware('throttle:heavy')
            ->name('coursework.store');
        Route::get('coursework/{assignment}/edit', [CourseworkController::class, 'edit'])->name('coursework.edit');
        Route::put('coursework/{assignment}', [CourseworkController::class, 'update'])
            ->middleware('throttle:heavy')
            ->name('coursework.update');
        Route::post('coursework/{assignment}/publish-grades', [CourseworkController::class, 'publishGrades'])
            ->middleware('throttle:heavy')
            ->name('coursework.publish-grades');
        Route::get('coursework/{assignment}/attempt', [AssignmentAttemptController::class, 'show'])->name('coursework.attempt');
        Route::post('coursework/{assignment}/attempt', [AssignmentAttemptController::class, 'submit'])
            ->middleware('throttle:heavy')
            ->name('coursework.submit');
        Route::get('students/{student}', [StudentAnalyticsController::class, 'show'])
            ->middleware('throttle:heavy')
            ->name('students.show');
        Route::post('chapter-progress/complete', [ChapterProgressController::class, 'complete'])
            ->middleware('throttle:heavy')
            ->name('chapter-progress.complete');
        Route::inertia('questions', 'classroom-questions')->name('questions.index');
        Route::post('questions', [ClassroomQuestionController::class, 'store'])
            ->middleware('throttle:classroom-questions')
            ->name('questions.store');
        Route::post('questions/{question}/respond', [ClassroomQuestionController::class, 'respond'])
            ->middleware('throttle:classroom-questions')
            ->name('questions.respond');
        Route::delete('questions/{question}', [ClassroomQuestionController::class, 'destroy'])->name('questions.destroy');
    });

// When logged in as an admin
Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard.global');
    Route::get('support', [SupportTicketController::class, 'index'])->name('support.index');
    Route::post('support', [SupportTicketController::class, 'store'])
        ->middleware('throttle:heavy')
        ->name('support.store');
    Route::get('support/teachers/{teacher}', [SupportTicketController::class, 'teacher'])
        ->middleware('throttle:heavy')
        ->name('support.teachers.show');
    Route::put('support/tickets/{ticket}', [SupportTicketController::class, 'update'])
        ->middleware('throttle:heavy')
        ->name('support.update');
    Route::get('teacher-requests', [TeacherAccountRequestController::class, 'index'])->name('teacher-requests.index');
    Route::post('teacher-requests', [TeacherAccountRequestController::class, 'store'])
        ->middleware('throttle:heavy')
        ->name('teacher-requests.store');
    Route::put('teacher-requests/{teacherRequest}', [TeacherAccountRequestController::class, 'update'])
        ->middleware('throttle:heavy')
        ->name('teacher-requests.update');
    Route::get('admin/users', [AdminUserController::class, 'index'])->name('admin.users.index');
    Route::post('admin/invitations', [AdminUserController::class, 'invite'])->name('admin.invitations.store');
    Route::delete('admin/invitations/{invitation}', [AdminUserController::class, 'cancelInvitation'])
        ->name('admin.invitations.destroy');
    Route::get('admin/invitations/{invitation}/accept', [AdminUserController::class, 'acceptInvitation'])
        ->name('admin.invitations.accept');
    Route::delete('admin/users/{user}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');
    Route::resource('admin/quizzes', QuizController::class)
        ->except(['show'])
        ->names('admin.quizzes');
    Route::resource('admin/quizzes.questions', QuizQuestionController::class)
        ->only(['store', 'update', 'destroy'])
        ->shallow(false);

    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])
        ->middleware('verified')
        ->name('invitations.accept');
});

require __DIR__.'/settings.php';
