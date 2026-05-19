<?php

namespace App\Http\Controllers\Teams;

use App\Enums\TeamPermission;
use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomSettingsController extends Controller
{
    /**
     * Update classroom grading settings.
     */
    public function update(Request $request, Team $currentTeam): RedirectResponse
    {
        abort_unless($request->user()?->hasTeamPermission($currentTeam, TeamPermission::UpdateTeam), 403);

        $data = $request->validate([
            'grade_weights.chapter_reading' => ['required', 'integer', 'min:0', 'max:100'],
            'grade_weights.homework' => ['required', 'integer', 'min:0', 'max:100'],
            'grade_weights.quiz' => ['required', 'integer', 'min:0', 'max:100'],
            'semester_starts_at' => ['nullable', 'date'],
            'semester_ends_at' => ['nullable', 'date', 'after_or_equal:semester_starts_at'],
        ]);

        $total = array_sum($data['grade_weights']);

        if ($total !== 100) {
            return back()->withErrors([
                'grade_weights' => 'Grade weights must total 100%.',
            ]);
        }

        $currentTeam->update([
            'grade_weights' => $data['grade_weights'],
            'semester_starts_at' => $data['semester_starts_at'] ?? null,
            'semester_ends_at' => $data['semester_ends_at'] ?? null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Grade weights saved.'),
        ]);

        return back();
    }
}
