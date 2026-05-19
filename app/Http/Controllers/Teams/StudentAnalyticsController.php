<?php

namespace App\Http\Controllers\Teams;

use App\Enums\TeamPermission;
use App\Enums\TeamRole;
use App\Http\Controllers\Controller;
use App\Models\Assignments\Assignment;
use App\Models\Team;
use App\Models\User;
use App\Support\ClassroomGrading;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentAnalyticsController extends Controller
{
    /**
     * Show a teacher-facing student progress page.
     */
    public function show(Request $request, Team $currentTeam, User $student): Response
    {
        abort_unless($request->user()?->hasTeamPermission($currentTeam, TeamPermission::ViewStudentProgress), 403);
        abort_unless(
            $currentTeam->members()
                ->where('users.id', $student->id)
                ->wherePivot('role', TeamRole::Student->value)
                ->exists(),
            404,
        );

        $assignments = Assignment::query()
            ->where('team_id', $currentTeam->id)
            ->with(['assignable', 'submissions' => fn ($query) => $query->where('user_id', $student->id)])
            ->latest('due_at')
            ->latest()
            ->get()
            ->map(fn (Assignment $assignment) => [
                'id' => $assignment->id,
                'type' => $assignment->type->value,
                'type_label' => $assignment->type->label(),
                'title' => $assignment->title,
                'due_at' => $assignment->due_at?->toISOString(),
                'status' => $assignment->submissions->first()?->status ?? 'assigned',
                'completed_at' => $assignment->submissions->first()?->submitted_at?->toISOString(),
                'score' => $assignment->submissions->first()?->score,
                'max_score' => $assignment->submissions->first()?->max_score,
            ]);

        $summaryAssignments = Assignment::query()
            ->where('team_id', $currentTeam->id)
            ->with(['submissions' => fn ($query) => $query->where('user_id', $student->id)])
            ->get();
        $summary = ClassroomGrading::summaryFromAssignments($currentTeam, $summaryAssignments);

        return Inertia::render('teacher/students/show', [
            'team' => $request->user()->toUserTeam($currentTeam),
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
            ],
            'summary' => [
                'assigned_count' => $summary['assigned_count'],
                'completed_count' => $summary['completed_count'],
                'completion_percentage' => $summary['completion_percentage'],
                'overall_grade' => $summary['overall_grade'],
                'last_worked_at' => $summary['last_worked_at'],
            ],
            'assignments' => $assignments,
        ]);
    }
}
