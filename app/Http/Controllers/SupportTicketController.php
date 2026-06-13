<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Enums\TeamRole;
use App\Models\Assignments\Assignment;
use App\Models\SupportTicket;
use App\Models\User;
use App\Support\ClassroomGrading;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupportTicketController extends Controller
{
    /**
     * Show the support console for admins and the ticket form for teachers.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        abort_unless($user && ($user->role->isAdmin() || $this->isClassroomTeacher($user)), 403);

        return Inertia::render('support', [
            'supportTickets' => $this->ticketsFor($request),
            'supportTeachers' => $user->role->isAdmin()
                ? $this->supportTeachers()
                : [],
        ]);
    }

    /**
     * Show an admin-only course summary for a teacher's classrooms.
     */
    public function teacher(Request $request, User $teacher): Response
    {
        abort_unless($request->user()?->role === UserRole::Admin, 403);
        abort_unless($this->isClassroomTeacher($teacher), 404);

        return Inertia::render('support-teacher', [
            'supportTeacher' => [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'email' => $teacher->email,
                'created_at' => $teacher->created_at?->toISOString(),
            ],
            'classrooms' => $this->teacherClassrooms($teacher),
        ]);
    }

    /**
     * Store a named teacher support ticket for admins.
     */
    public function store(Request $request): RedirectResponse
    {
        abort_unless($this->isClassroomTeacher($request->user()), 403);

        $data = $request->validate([
            'subject' => ['required', 'string', 'max:120'],
            'message' => ['required', 'string', 'max:3000'],
        ]);

        SupportTicket::create([
            ...$data,
            'requester_id' => $request->user()->id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Ticket sent to admins.'),
        ]);

        return to_route('support.index');
    }

    /**
     * Save an admin response to a support ticket.
     */
    public function update(Request $request, SupportTicket $ticket): RedirectResponse
    {
        abort_unless($request->user()?->role === UserRole::Admin, 403);

        $data = $request->validate([
            'admin_response' => ['required', 'string', 'max:3000'],
            'status' => ['required', 'string', 'in:open,resolved'],
        ]);

        $ticket->update([
            ...$data,
            'responded_by' => $request->user()->id,
            'responded_at' => now(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Support response saved.'),
        ]);

        return to_route('support.index');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function ticketsFor(Request $request): array
    {
        return SupportTicket::query()
            ->with(['requester:id,name,email,role', 'respondent:id,name,email'])
            ->when(
                $request->user()?->role->isMember(),
                fn ($query) => $query->where('requester_id', $request->user()->id),
            )
            ->latest()
            ->get()
            ->map(fn (SupportTicket $ticket) => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'message' => $ticket->message,
                'status' => $ticket->status,
                'admin_response' => $ticket->admin_response,
                'created_at' => $ticket->created_at?->toISOString(),
                'responded_at' => $ticket->responded_at?->toISOString(),
                'requester' => $ticket->requester ? [
                    'id' => $ticket->requester->id,
                    'name' => $ticket->requester->name,
                    'email' => $ticket->requester->email,
                    'role' => $ticket->requester->role->value,
                ] : null,
                'respondent' => $ticket->respondent ? [
                    'id' => $ticket->respondent->id,
                    'name' => $ticket->respondent->name,
                    'email' => $ticket->respondent->email,
                ] : null,
            ])
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function supportTeachers(): array
    {
        return User::query()
            ->with(['teams' => fn ($query) => $query
                ->wherePivot('role', TeamRole::Teacher->value)
                ->withCount(['members as students_count' => fn ($members) => $members
                    ->where('team_members.role', TeamRole::Student->value)])
                ->orderBy('name')])
            ->whereHas('teams', fn ($query) => $query->wherePivot('role', TeamRole::Teacher->value))
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role', 'created_at'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'classrooms' => $user->teams->map(fn ($team) => [
                    'id' => $team->id,
                    'name' => $team->name,
                    'slug' => $team->slug,
                    'students_count' => $team->students_count,
                ])->values()->all(),
                'created_at' => $user->created_at?->toISOString(),
            ])
            ->all();
    }

    protected function isClassroomTeacher(?User $user): bool
    {
        return $user?->teams()
            ->wherePivot('role', TeamRole::Teacher->value)
            ->exists() ?? false;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function teacherClassrooms(User $teacher): array
    {
        return $teacher->teams()
            ->wherePivot('role', TeamRole::Teacher->value)
            ->with([
                'members' => fn ($members) => $members
                    ->wherePivot('role', TeamRole::Student->value)
                    ->orderBy('name'),
            ])
            ->orderBy('name')
            ->get()
            ->map(function ($team) {
                $assignments = Assignment::query()
                    ->where('team_id', $team->id)
                    ->with(['submissions'])
                    ->orderBy('due_at')
                    ->orderBy('created_at')
                    ->get();

                $students = $team->members->map(function (User $student) use ($team) {
                    $summary = ClassroomGrading::summaryFor($team, $student);

                    return [
                        'id' => $student->id,
                        'name' => $student->name,
                        'email' => $student->email,
                        'started_assignments_count' => $summary['started_assignments_count'],
                        'completion_percentage' => $summary['completion_percentage'],
                        'overall_grade' => $summary['overall_grade'],
                        'last_worked_at' => $summary['last_worked_at'],
                    ];
                })->values();

                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'slug' => $team->slug,
                    'semester_starts_at' => $team->semester_starts_at?->toISOString(),
                    'semester_ends_at' => $team->semester_ends_at?->toISOString(),
                    'semester_active' => $team->semesterIsActive(),
                    'grade_weights' => ClassroomGrading::weightsFor($team),
                    'average_class_score' => $students
                        ->pluck('overall_grade')
                        ->filter(fn ($grade) => $grade !== null)
                        ->avg(),
                    'students' => $students->all(),
                    'assignments' => $assignments->map(fn (Assignment $assignment) => [
                        'id' => $assignment->id,
                        'title' => $assignment->title,
                        'type' => $assignment->type->value,
                        'course_slug' => $assignment->course_slug,
                        'opens_at' => $assignment->opens_at?->toISOString(),
                        'due_at' => $assignment->due_at?->toISOString(),
                        'points' => $assignment->points,
                        'submissions_count' => $assignment->submissions->count(),
                        'completed_submissions_count' => $assignment->submissions
                            ->where('status', 'completed')
                            ->count(),
                    ])->values()->all(),
                ];
            })
            ->values()
            ->all();
    }
}
