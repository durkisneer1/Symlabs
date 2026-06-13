<?php

namespace App\Http\Controllers;

use App\Actions\Teams\CreateTeam;
use App\Enums\TeamRole;
use App\Models\TeacherAccountRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TeacherAccountRequestController extends Controller
{
    /**
     * Show classroom creation requests.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        abort_unless($user && ($user->role->isAdmin() || $user->role->isMember()), 403);

        return Inertia::render('teacher-requests', [
            'teacherAccountRequests' => $this->requestsFor($request),
        ]);
    }

    /**
     * Store a classroom creation request from a regular user.
     */
    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->role->isMember(), 403);

        $data = $request->validate([
            'institution' => ['required', 'string', 'max:160'],
            'instructor_title' => ['required', 'string', 'max:120'],
            'course_name' => ['required', 'string', 'max:160'],
            'expected_student_count' => ['nullable', 'integer', 'min:1', 'max:10000'],
            'proof' => ['required', 'string', 'max:4000'],
        ]);

        TeacherAccountRequest::create([
            ...$data,
            'requester_id' => $request->user()->id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Classroom request sent.'),
        ]);

        return to_route('teacher-requests.index');
    }

    /**
     * Approve or deny a classroom creation request.
     */
    public function update(
        Request $request,
        TeacherAccountRequest $teacherRequest,
        CreateTeam $createTeam,
    ): RedirectResponse
    {
        abort_unless($request->user()?->role->isAdmin(), 403);

        $data = $request->validate([
            'status' => ['required', 'string', 'in:approved,denied'],
            'admin_notes' => ['nullable', 'string', 'max:3000'],
        ]);

        DB::transaction(function () use ($request, $teacherRequest, $data, $createTeam) {
            $teacherRequest->update([
                ...$data,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);

            if ($data['status'] === 'approved' && ! $teacherRequest->team_id) {
                $team = $createTeam->handle(
                    $teacherRequest->requester,
                    $teacherRequest->course_name,
                    role: TeamRole::Teacher,
                    makeCurrent: false,
                );

                $teacherRequest->update(['team_id' => $team->id]);
            }
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $data['status'] === 'approved'
                ? __('Classroom request approved.')
                : __('Classroom request denied.'),
        ]);

        return to_route('teacher-requests.index');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function requestsFor(Request $request): array
    {
        return TeacherAccountRequest::query()
            ->with(['requester:id,name,email,role', 'reviewer:id,name,email', 'team:id,name,slug'])
            ->when(
                $request->user()?->role->isMember(),
                fn ($query) => $query->where('requester_id', $request->user()->id),
            )
            ->latest()
            ->get()
            ->map(fn (TeacherAccountRequest $teacherRequest) => [
                'id' => $teacherRequest->id,
                'institution' => $teacherRequest->institution,
                'instructor_title' => $teacherRequest->instructor_title,
                'course_name' => $teacherRequest->course_name,
                'expected_student_count' => $teacherRequest->expected_student_count,
                'proof' => $teacherRequest->proof,
                'status' => $teacherRequest->status,
                'admin_notes' => $teacherRequest->admin_notes,
                'created_at' => $teacherRequest->created_at?->toISOString(),
                'reviewed_at' => $teacherRequest->reviewed_at?->toISOString(),
                'requester' => $teacherRequest->requester ? [
                    'id' => $teacherRequest->requester->id,
                    'name' => $teacherRequest->requester->name,
                    'email' => $teacherRequest->requester->email,
                    'role' => $teacherRequest->requester->role->value,
                ] : null,
                'reviewer' => $teacherRequest->reviewer ? [
                    'id' => $teacherRequest->reviewer->id,
                    'name' => $teacherRequest->reviewer->name,
                    'email' => $teacherRequest->reviewer->email,
                ] : null,
                'team' => $teacherRequest->team ? [
                    'id' => $teacherRequest->team->id,
                    'name' => $teacherRequest->team->name,
                    'slug' => $teacherRequest->team->slug,
                ] : null,
            ])
            ->all();
    }
}
