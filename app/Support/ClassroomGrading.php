<?php

namespace App\Support;

use App\Enums\AssignmentType;
use App\Models\Assignments\Assignment;
use App\Models\Assignments\Submission;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Collection;

class ClassroomGrading
{
    public const DEFAULT_WEIGHTS = [
        'chapter_reading' => 20,
        'homework' => 35,
        'quiz' => 45,
    ];

    /**
     * @return array{chapter_reading: int, homework: int, quiz: int}
     */
    public static function weightsFor(Team $team): array
    {
        return [
            'chapter_reading' => (int) ($team->grade_weights['chapter_reading'] ?? self::DEFAULT_WEIGHTS['chapter_reading']),
            'homework' => (int) ($team->grade_weights['homework'] ?? self::DEFAULT_WEIGHTS['homework']),
            'quiz' => (int) ($team->grade_weights['quiz'] ?? self::DEFAULT_WEIGHTS['quiz']),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function summaryFor(Team $team, User $student): array
    {
        $assignments = Assignment::query()
            ->where('team_id', $team->id)
            ->with(['submissions' => fn ($query) => $query->where('user_id', $student->id)])
            ->get();

        return self::summaryFromAssignments($team, $assignments);
    }

    /**
     * @param  Collection<int, Assignment>  $assignments
     * @return array<string, mixed>
     */
    public static function summaryFromAssignments(Team $team, Collection $assignments): array
    {
        $completed = $assignments
            ->filter(fn (Assignment $assignment) => self::submissionFor($assignment)?->status === 'completed')
            ->count();

        $lastWorkedAt = $assignments
            ->map(fn (Assignment $assignment) => self::submissionFor($assignment)?->submitted_at)
            ->filter()
            ->sortDesc()
            ->first();

        return [
            'assigned_count' => $assignments->count(),
            'started_assignments_count' => $assignments
                ->filter(fn (Assignment $assignment) => self::submissionFor($assignment) !== null)
                ->count(),
            'completed_count' => $completed,
            'completion_percentage' => $assignments->count() > 0
                ? round(($completed / $assignments->count()) * 100)
                : null,
            'overall_grade' => self::overallGrade($team, $assignments),
            'last_worked_at' => $lastWorkedAt?->toISOString(),
        ];
    }

    /**
     * @param  Collection<int, Assignment>  $assignments
     */
    protected static function overallGrade(Team $team, Collection $assignments): ?int
    {
        $weights = self::weightsFor($team);
        $weightedScore = 0.0;
        $activeWeight = 0;

        foreach (AssignmentType::cases() as $type) {
            $typeAssignments = $assignments->filter(fn (Assignment $assignment) => $assignment->type === $type);

            if ($typeAssignments->isEmpty()) {
                continue;
            }

            $weight = $weights[$type->value] ?? 0;
            $categoryScores = $typeAssignments
                ->map(fn (Assignment $assignment) => self::assignmentPercentage($assignment))
                ->filter(fn (?float $score) => $score !== null);

            if ($categoryScores->isEmpty()) {
                continue;
            }

            $categoryAverage = $categoryScores
                ->average();

            $weightedScore += $categoryAverage * $weight;
            $activeWeight += $weight;
        }

        return $activeWeight > 0
            ? (int) round($weightedScore / $activeWeight)
            : null;
    }

    protected static function assignmentPercentage(Assignment $assignment): ?float
    {
        $submission = self::submissionFor($assignment);

        if (! $submission) {
            return 0.0;
        }

        if (
            $assignment->type === AssignmentType::Quiz &&
            ! (bool) ($assignment->settings['grades_published'] ?? false)
        ) {
            return null;
        }

        if ($assignment->type === AssignmentType::ChapterReading) {
            return $submission->status === 'completed' ? 100.0 : 0.0;
        }

        if ($submission->max_score && (float) $submission->max_score > 0) {
            return ((float) $submission->score / (float) $submission->max_score) * 100;
        }

        return $submission->status === 'completed' ? 100.0 : 0.0;
    }

    protected static function submissionFor(Assignment $assignment): ?Submission
    {
        return $assignment->submissions->first();
    }
}
