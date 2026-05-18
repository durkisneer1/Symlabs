<?php

namespace App\Http\Controllers\Teams;

use App\Enums\TeamPermission;
use App\Http\Controllers\Controller;
use App\Models\ClassroomQuestion;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomQuestionController extends Controller
{
    /**
     * Store an anonymous question from a student.
     */
    public function store(Request $request, Team $currentTeam): RedirectResponse
    {
        abort_unless($request->user()?->hasTeamPermission($currentTeam, TeamPermission::TakeAssignments), 403);

        $data = $request->validate([
            'question' => ['required', 'string', 'max:2000'],
        ]);

        ClassroomQuestion::create([
            'team_id' => $currentTeam->id,
            'user_id' => $request->user()->id,
            'question' => $data['question'],
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Question sent.'),
        ]);

        return to_route('questions.index', ['current_team' => $currentTeam->slug]);
    }

    /**
     * Respond to an anonymous student question.
     */
    public function respond(Request $request, Team $currentTeam, ClassroomQuestion $question): RedirectResponse
    {
        abort_unless($question->team_id === $currentTeam->id, 404);
        abort_unless($request->user()?->hasTeamPermission($currentTeam, TeamPermission::ViewStudentProgress), 403);

        $data = $request->validate([
            'response' => ['required', 'string', 'max:2000'],
        ]);

        $question->update([
            'response' => $data['response'],
            'responded_by' => $request->user()->id,
            'responded_at' => now(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Response saved.'),
        ]);

        return to_route('questions.index', ['current_team' => $currentTeam->slug]);
    }

    /**
     * Remove a student's own anonymous question.
     */
    public function destroy(Request $request, Team $currentTeam, ClassroomQuestion $question): RedirectResponse
    {
        abort_unless($question->team_id === $currentTeam->id, 404);
        abort_unless($question->user_id === $request->user()?->id, 403);

        $question->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Question removed.'),
        ]);

        return to_route('questions.index', ['current_team' => $currentTeam->slug]);
    }
}
