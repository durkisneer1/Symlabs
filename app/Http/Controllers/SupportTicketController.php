<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Enums\TeamRole;
use App\Models\SupportTicket;
use App\Models\User;
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

        abort_unless(in_array($user?->role, [UserRole::Admin, UserRole::Teacher], true), 403);

        return Inertia::render('support', [
            'supportTickets' => $this->ticketsFor($request),
            'supportTeachers' => $user->role === UserRole::Admin
                ? $this->supportTeachers()
                : [],
        ]);
    }

    /**
     * Store a named teacher support ticket for admins.
     */
    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->role === UserRole::Teacher, 403);

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
                $request->user()?->role === UserRole::Teacher,
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
                ->with(['members' => fn ($members) => $members
                    ->wherePivot('role', TeamRole::Student->value)
                    ->orderBy('name')])
                ->orderBy('name')])
            ->where('role', UserRole::Teacher->value)
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
                    'students' => $team->members->map(fn (User $student) => [
                        'id' => $student->id,
                        'name' => $student->name,
                        'email' => $student->email,
                    ])->values()->all(),
                ])->values()->all(),
                'created_at' => $user->created_at?->toISOString(),
            ])
            ->all();
    }
}
