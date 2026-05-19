<?php

namespace App\Http\Controllers\Teams;

use App\Enums\AssignmentType;
use App\Enums\TeamPermission;
use App\Http\Controllers\Controller;
use App\Models\Assignments\Assignment;
use App\Models\Assignments\Submission;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ChapterProgressController extends Controller
{
    /**
     * Mark a chapter reading assignment complete after all activities are done.
     */
    public function complete(Request $request, Team $currentTeam): RedirectResponse
    {
        abort_unless($request->user()?->hasTeamPermission($currentTeam, TeamPermission::TakeAssignments), 403);
        abort_unless($currentTeam->semesterIsActive(), 403);

        $data = $request->validate([
            'assignment_id' => ['required', 'integer'],
            'course_slug' => ['required', 'string', 'max:32'],
            'chapter_slug' => ['required', 'string', 'max:120'],
            'activity_count' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        $assignment = Assignment::query()
            ->where('team_id', $currentTeam->id)
            ->where('id', $data['assignment_id'])
            ->where('type', AssignmentType::ChapterReading->value)
            ->where('course_slug', $data['course_slug'])
            ->firstOrFail();

        abort_unless($this->assignmentIncludesChapter($assignment, $data['chapter_slug']), 404);

        Submission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'user_id' => $request->user()->id,
            ],
            [
                'status' => 'completed',
                'attempts_count' => 1,
                'score' => $data['activity_count'],
                'max_score' => $data['activity_count'],
                'submitted_at' => now(),
            ],
        );

        return back();
    }

    protected function assignmentIncludesChapter(Assignment $assignment, string $chapterSlug): bool
    {
        $chapterSlugs = $assignment->settings['chapter_slugs'] ?? [];

        return is_array($chapterSlugs) && in_array($chapterSlug, $chapterSlugs, true);
    }
}
