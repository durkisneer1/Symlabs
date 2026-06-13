<?php

namespace App\Actions\Teams;

use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateTeam
{
    /**
     * Create a new team and add the user as owner.
     */
    public function handle(
        User $user,
        string $name,
        bool $isPersonal = false,
        TeamRole $role = TeamRole::Teacher,
        bool $makeCurrent = true,
    ): Team
    {
        return DB::transaction(function () use ($user, $name, $isPersonal, $role, $makeCurrent) {
            $team = Team::create([
                'name' => $name,
                'is_personal' => $isPersonal,
            ]);

            $membership = $team->memberships()->create([
                'user_id' => $user->id,
                'role' => $role,
            ]);

            if ($makeCurrent) {
                $user->switchTeam($team);
            } else {
                $user->update(['current_team_id' => $team->id]);
            }

            return $team;
        });
    }
}
