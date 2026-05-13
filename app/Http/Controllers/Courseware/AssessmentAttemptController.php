<?php

namespace App\Http\Controllers\Courseware;

use App\Courseware\AssessmentEngine;
use App\Courseware\CoursewareRepository;
use App\Http\Controllers\Controller;
use App\Models\CoursewareActivityLog;
use App\Models\CoursewareAttempt;
use App\Models\CoursewareItemSetting;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentAttemptController extends Controller
{
    public function __construct(
        private readonly AssessmentEngine $assessment,
        private readonly CoursewareRepository $courseware,
    ) {
        //
    }

    /**
     * Start a homework or quiz attempt.
     */
    public function store(Request $request, Team $current_team, string $type, string $content): RedirectResponse
    {
        $currentTeam = $current_team;
        abort_unless(in_array($type, ['homework', 'quiz'], true), 404);
        $this->ensureEnabled($currentTeam, $type, $content);

        $attempt = $this->assessment->start($currentTeam, $request->user(), $type, $content, $request);

        CoursewareActivityLog::query()->create([
            'team_id' => $currentTeam->id,
            'user_id' => $request->user()->id,
            'courseware_attempt_id' => $attempt->id,
            'event' => 'courseware.attempt_started',
            'metadata' => [
                'content_type' => $type,
                'content_id' => $content,
                'attempt_number' => $attempt->attempt_number,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return to_route('courseware.attempts.show', [
            'current_team' => $currentTeam,
            'attempt' => $attempt,
        ]);
    }

    /**
     * Show an assessment attempt.
     */
    public function show(Request $request, Team $current_team, CoursewareAttempt $attempt): Response
    {
        $currentTeam = $current_team;
        abort_unless($attempt->team_id === $currentTeam->id, 404);
        abort_unless($attempt->user_id === $request->user()->id, 403);

        return Inertia::render('courseware/attempt', [
            'attempt' => $this->assessment->sanitizeAttempt($attempt),
        ]);
    }

    /**
     * Submit answers for an assessment attempt.
     */
    public function submit(Request $request, Team $current_team, CoursewareAttempt $attempt): RedirectResponse
    {
        $currentTeam = $current_team;
        abort_unless($attempt->team_id === $currentTeam->id, 404);
        abort_unless($attempt->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*' => ['nullable'],
        ]);

        $attempt = $this->assessment->submit($attempt, $validated['answers'], $request);

        CoursewareActivityLog::query()->create([
            'team_id' => $currentTeam->id,
            'user_id' => $request->user()->id,
            'courseware_attempt_id' => $attempt->id,
            'event' => 'courseware.attempt_submitted',
            'metadata' => [
                'content_type' => $attempt->content_type,
                'content_id' => $attempt->content_id,
                'score' => $attempt->score,
                'max_score' => $attempt->max_score,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return to_route('courseware.attempts.show', [
            'current_team' => $currentTeam,
            'attempt' => $attempt,
        ]);
    }

    /**
     * Show a preview page before starting an assessment.
     */
    public function preview(Team $current_team, string $type, string $content): Response
    {
        $currentTeam = $current_team;
        abort_unless(in_array($type, ['homework', 'quiz'], true), 404);
        $this->ensureEnabled($currentTeam, $type, $content);

        $item = $this->courseware->find($type, $content);

        return Inertia::render('courseware/assessment-preview', [
            'assessment' => [
                'id' => $item['id'],
                'type' => $type,
                'title' => $item['title'],
                'description' => $item['description'] ?? null,
                'questionCount' => $type === 'quiz'
                    ? $item['question_count']
                    : count($item['problems']),
                'timeLimitMinutes' => $item['time_limit_minutes'] ?? null,
            ],
        ]);
    }

    private function ensureEnabled(Team $team, string $type, string $id): void
    {
        $enabled = CoursewareItemSetting::query()
            ->whereBelongsTo($team)
            ->where('content_type', $type)
            ->where('content_id', $id)
            ->value('enabled');

        abort_if($enabled === false, 404);
    }
}
