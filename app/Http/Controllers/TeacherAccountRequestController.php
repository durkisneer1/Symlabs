<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\TeacherAccountRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TeacherAccountRequestController extends Controller
{
    /**
     * Show teacher account requests.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        abort_unless(in_array($user?->role, [UserRole::Admin, UserRole::Student], true), 403);

        return Inertia::render('teacher-requests', [
            'teacherAccountRequests' => $this->requestsFor($request),
        ]);
    }

    /**
     * Store a teacher account request from a regular user.
     */
    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->role === UserRole::Student, 403);

        $data = $request->validate([
            'institution' => ['required', 'string', 'max:160'],
            'instructor_title' => ['required', 'string', 'max:120'],
            'proof' => ['required', 'string', 'max:4000'],
        ]);

        TeacherAccountRequest::create([
            ...$data,
            'requester_id' => $request->user()->id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Teacher request sent.'),
        ]);

        return to_route('teacher-requests.index');
    }

    /**
     * Approve or deny a teacher account request.
     */
    public function update(Request $request, TeacherAccountRequest $teacherRequest): RedirectResponse
    {
        abort_unless($request->user()?->role === UserRole::Admin, 403);

        $data = $request->validate([
            'status' => ['required', 'string', 'in:approved,denied'],
            'admin_notes' => ['nullable', 'string', 'max:3000'],
        ]);

        DB::transaction(function () use ($request, $teacherRequest, $data) {
            $teacherRequest->update([
                ...$data,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);

            if ($data['status'] === 'approved') {
                $teacherRequest->requester()->update([
                    'role' => UserRole::Teacher->value,
                ]);
            }
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $data['status'] === 'approved'
                ? __('Teacher account approved.')
                : __('Teacher account request denied.'),
        ]);

        return to_route('teacher-requests.index');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function requestsFor(Request $request): array
    {
        return TeacherAccountRequest::query()
            ->with(['requester:id,name,email,role', 'reviewer:id,name,email'])
            ->when(
                $request->user()?->role === UserRole::Student,
                fn ($query) => $query->where('requester_id', $request->user()->id),
            )
            ->latest()
            ->get()
            ->map(fn (TeacherAccountRequest $teacherRequest) => [
                'id' => $teacherRequest->id,
                'institution' => $teacherRequest->institution,
                'instructor_title' => $teacherRequest->instructor_title,
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
            ])
            ->all();
    }
}
