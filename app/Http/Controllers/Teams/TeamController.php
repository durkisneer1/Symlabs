<?php

namespace App\Http\Controllers\Teams;

use App\Actions\Teams\CreateTeam;
use App\Enums\TeamRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\DeleteTeamRequest;
use App\Http\Requests\Teams\SaveTeamRequest;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    /**
     * Display a listing of the user's teams.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Team::class);

        $user = $request->user();

        return Inertia::render('teams/index', [
            'teams' => $user->role->isAdmin()
                ? $this->adminTeamList($user)
                : $user->toUserTeams(includeCurrent: true),
        ]);
    }

    /**
     * Store a newly created team.
     */
    public function store(SaveTeamRequest $request, CreateTeam $createTeam): RedirectResponse
    {
        Gate::authorize('create', Team::class);

        $team = $createTeam->handle($request->user(), $request->validated('name'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Team created.')]);

        return to_route('teams.edit', ['team' => $team->slug]);
    }

    /**
     * Show the team edit page.
     */
    public function edit(Request $request, Team $team): Response
    {
        $user = $request->user();

        return Inertia::render('teams/edit', [
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
                'slug' => $team->slug,
                'isPersonal' => $team->is_personal,
            ],
            'members' => $team->members()->get()->map(fn ($member) => [
                'id' => $member->id,
                'name' => $member->name,
                'email' => $member->email,
                'avatar' => $member->avatar ?? null,
                'role' => $member->pivot->role->value,
                'role_label' => $member->pivot->role?->label(),
            ]),
            'invitations' => $team->invitations()
                ->whereNull('accepted_at')
                ->get()
                ->map(fn ($invitation) => [
                    'code' => $invitation->code,
                    'email' => $invitation->email,
                    'role' => $invitation->role->value,
                    'role_label' => $invitation->role->label(),
                    'created_at' => $invitation->created_at->toISOString(),
                ]),
            'permissions' => $user->toTeamPermissions($team),
            'availableRoles' => TeamRole::assignable(),
        ]);
    }

    /**
     * Update the specified team.
     */
    public function update(SaveTeamRequest $request, Team $team): RedirectResponse
    {
        Gate::authorize('update', $team);

        $team = DB::transaction(function () use ($request, $team) {
            $team = Team::whereKey($team->id)->lockForUpdate()->firstOrFail();

            $team->update(['name' => $request->validated('name')]);

            return $team;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Team updated.')]);

        return to_route('teams.edit', ['team' => $team->slug]);
    }

    /**
     * Switch the user's current team.
     */
    public function switch(Request $request, Team $team): RedirectResponse
    {
        abort_unless($request->user()->belongsToTeam($team), 403);

        $request->user()->switchTeam($team);

        return back();
    }

    /**
     * Join a classroom as an admin.
     */
    public function join(Request $request, Team $team): RedirectResponse
    {
        abort_unless($request->user()?->role->isAdmin(), 403);

        $team->memberships()->firstOrCreate(
            ['user_id' => $request->user()->id],
            ['role' => TeamRole::Admin],
        );

        $request->user()->switchTeam($team);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Joined classroom as admin.')]);

        return back();
    }

    /**
     * Leave a classroom admin membership.
     */
    public function leave(Request $request, Team $team): RedirectResponse
    {
        $user = $request->user();

        abort_unless($user?->role->isAdmin(), 403);

        $team->memberships()
            ->where('user_id', $user->id)
            ->where('role', TeamRole::Admin->value)
            ->delete();

        if ($user->isCurrentTeam($team)) {
            if ($fallbackTeam = $user->fallbackTeam($team)) {
                $user->switchTeam($fallbackTeam);
            } else {
                $user->update(['current_team_id' => null]);
            }
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Left classroom.')]);

        return back();
    }

    /**
     * Delete the specified team.
     */
    public function destroy(DeleteTeamRequest $request, Team $team): RedirectResponse
    {
        $user = $request->user();
        $fallbackTeam = $user->isCurrentTeam($team)
            ? $user->fallbackTeam($team)
            : null;

        DB::transaction(function () use ($user, $team) {
            User::where('current_team_id', $team->id)
                ->where('id', '!=', $user->id)
                ->each(function (User $affectedUser) use ($team) {
                    if ($fallbackTeam = $affectedUser->fallbackTeam($team)) {
                        $affectedUser->switchTeam($fallbackTeam);
                    } else {
                        $affectedUser->update(['current_team_id' => null]);
                    }
                });

            $team->invitations()->delete();
            $team->memberships()->delete();
            $team->delete();
        });

        if ($fallbackTeam) {
            $user->switchTeam($fallbackTeam);
        } elseif ($user->isCurrentTeam($team)) {
            $user->update(['current_team_id' => null]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Team deleted.')]);

        return to_route('teams.index');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function adminTeamList(User $user): array
    {
        return Team::query()
            ->orderBy('name')
            ->get()
            ->map(function (Team $team) use ($user) {
                $membership = $team->memberships()
                    ->where('user_id', $user->id)
                    ->first();

                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'slug' => $team->slug,
                    'isPersonal' => $team->is_personal,
                    'role' => $membership?->role?->value,
                    'roleLabel' => $membership?->role?->label(),
                    'isCurrent' => $user->isCurrentTeam($team),
                    'viewModes' => $membership?->role?->viewModes() ?? [],
                    'gradeWeights' => $team->grade_weights,
                    'semesterStartsAt' => $team->semester_starts_at?->toISOString(),
                    'semesterEndsAt' => $team->semester_ends_at?->toISOString(),
                    'semesterActive' => $team->semesterIsActive(),
                ];
            })
            ->all();
    }
}
