<?php

namespace App\Http\Middleware;

use App\Enums\TeamRole;
use App\Models\Assignments\Assignment;
use App\Models\ClassroomQuestion;
use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'currentTeam' => fn () => $user?->currentTeam ? $user->toUserTeam($user->currentTeam) : null,
            'teams' => fn () => $user?->toUserTeams(includeCurrent: true) ?? [],
            'currentTeamStudents' => fn () => $user?->currentTeam
                ? $user->currentTeam
                    ->members()
                    ->wherePivot('role', TeamRole::Student->value)
                    ->orderBy('name')
                    ->get()
                    ->map(fn ($student) => [
                        'id' => $student->id,
                        'name' => $student->name,
                        'email' => $student->email,
                        'role_label' => TeamRole::Student->label(),
                        'joined_at' => $student->pivot->created_at?->toISOString(),
                        'last_active_at' => null,
                        'started_assignments_count' => 0,
                        'completion_percentage' => null,
                        'overall_grade' => null,
                    ])
                : [],
            'currentTeamAssignments' => fn () => $user?->currentTeam
                ? Assignment::query()
                    ->where('team_id', $user->currentTeam->id)
                    ->with('assignable')
                    ->latest('due_at')
                    ->latest()
                    ->get()
                    ->map(function (Assignment $assignment) use ($user) {
                        $submission = $assignment->submissions()
                            ->where('user_id', $user->id)
                            ->first();

                        return [
                            'id' => $assignment->id,
                            'type' => $assignment->type->value,
                            'type_label' => $assignment->type->label(),
                            'course_slug' => $assignment->course_slug,
                            'title' => $assignment->title,
                            'description' => $assignment->description,
                            'settings' => $assignment->settings ?? [],
                            'actions' => $this->assignmentActions($assignment),
                            'opens_at' => $assignment->opens_at?->toISOString(),
                            'due_at' => $assignment->due_at?->toISOString(),
                            'points' => (float) $assignment->points,
                            'status' => $submission?->status ?? 'assigned',
                            'completed_at' => $submission?->submitted_at?->toISOString(),
                            'assignable' => $assignment->assignable ? [
                                'id' => $assignment->assignable->id,
                                'title' => $assignment->assignable->title,
                            ] : null,
                        ];
                    })
                : [],
            'currentTeamQuestions' => fn () => $user?->currentTeam
                ? $this->questionsFor($request)
                : [],
            'pendingTeamInvitations' => fn () => $user
                ? TeamInvitation::query()
                    ->with(['team', 'inviter'])
                    ->whereNull('accepted_at')
                    ->whereRaw('lower(email) = ?', [strtolower($user->email)])
                    ->where(fn ($query) => $query
                        ->whereNull('expires_at')
                        ->orWhere('expires_at', '>', now()))
                    ->latest()
                    ->get()
                    ->map(fn (TeamInvitation $invitation) => [
                        'code' => $invitation->code,
                        'email' => $invitation->email,
                        'role' => $invitation->role->value,
                        'role_label' => $invitation->role->label(),
                        'team' => [
                            'id' => $invitation->team->id,
                            'name' => $invitation->team->name,
                            'slug' => $invitation->team->slug,
                        ],
                        'inviter' => [
                            'name' => $invitation->inviter->name,
                        ],
                        'expires_at' => $invitation->expires_at?->toISOString(),
                        'created_at' => $invitation->created_at->toISOString(),
                    ])
                : [],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function questionsFor(Request $request): array
    {
        $user = $request->user();
        $team = $user?->currentTeam;
        $role = $team ? $user->teamRole($team) : null;

        if (! $team || ! $role) {
            return [];
        }

        $query = ClassroomQuestion::query()
            ->where('team_id', $team->id)
            ->latest();

        if ($role === TeamRole::Student) {
            $query->where('user_id', $user->id);
        }

        return $query->get()
            ->map(fn (ClassroomQuestion $question) => [
                'id' => $question->id,
                'question' => $question->question,
                'response' => $question->response,
                'responded_at' => $question->responded_at?->toISOString(),
                'created_at' => $question->created_at->toISOString(),
            ])
            ->all();
    }

    /**
     * @return array<int, array{label: string, href: string}>
     */
    protected function assignmentActions(Assignment $assignment): array
    {
        if ($assignment->type->value !== 'chapter_reading' || $assignment->course_slug !== 'html') {
            return [];
        }

        $chapterLabels = [
            'elements-and-tags' => 'Elements and Tags',
            'document-structure' => 'Document Structure',
            'semantic-html' => 'Semantic HTML',
        ];

        return collect($assignment->settings['chapter_slugs'] ?? [])
            ->map(fn (string $slug) => [
                'label' => $chapterLabels[$slug] ?? str($slug)->replace('-', ' ')->title()->toString(),
                'href' => "/courses/html/{$slug}",
            ])
            ->values()
            ->all();
    }
}
