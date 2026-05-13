<?php

namespace App\Courseware;

use App\Models\CoursewareAttempt;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class AssessmentEngine
{
    public function __construct(private readonly CoursewareRepository $courseware)
    {
        //
    }

    /**
     * Start a homework or quiz attempt.
     */
    public function start(Team $team, User $user, string $type, string $contentId, Request $request): CoursewareAttempt
    {
        abort_unless(in_array($type, ['homework', 'quiz'], true), 404);

        $content = $this->courseware->find($type, $contentId);
        $seed = random_int(1, PHP_INT_MAX);
        $attemptNumber = CoursewareAttempt::query()
            ->whereBelongsTo($team)
            ->whereBelongsTo($user)
            ->where('content_type', $type)
            ->where('content_id', $contentId)
            ->count() + 1;

        $snapshot = $type === 'homework'
            ? $this->homeworkSnapshot($content, $seed)
            : $this->quizSnapshot($content, $seed);

        return CoursewareAttempt::query()->create([
            'team_id' => $team->id,
            'user_id' => $user->id,
            'content_type' => $type,
            'content_id' => $contentId,
            'attempt_number' => $attemptNumber,
            'seed' => $seed,
            'status' => 'in_progress',
            'snapshot' => $snapshot,
            'max_score' => collect($snapshot['questions'])->sum('points'),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'started_at' => now(),
        ]);
    }

    /**
     * Grade and submit an attempt.
     *
     * @param  array<string, mixed>  $answers
     */
    public function submit(CoursewareAttempt $attempt, array $answers, Request $request): CoursewareAttempt
    {
        abort_if($attempt->isSubmitted(), 409);

        $results = collect($attempt->snapshot['questions'])
            ->map(function (array $question) use ($answers) {
                $answer = $answers[$question['id']] ?? null;
                $correct = $this->isCorrect($question, $answer);

                return [
                    'id' => $question['id'],
                    'answer' => $answer,
                    'correct' => $correct,
                    'points_earned' => $correct ? (float) $question['points'] : 0.0,
                ];
            })
            ->values();

        $attempt->update([
            'status' => 'submitted',
            'answers' => [
                'submitted' => $answers,
                'results' => $results->all(),
            ],
            'score' => $results->sum('points_earned'),
            'submitted_at' => now(),
            'ip_address' => $attempt->ip_address ?? $request->ip(),
            'user_agent' => $attempt->user_agent ?? $request->userAgent(),
        ]);

        return $attempt->fresh();
    }

    /**
     * Prepare one attempt for the browser without answer keys.
     *
     * @return array<string, mixed>
     */
    public function sanitizeAttempt(CoursewareAttempt $attempt): array
    {
        $snapshot = $attempt->snapshot;
        $results = collect($attempt->answers['results'] ?? [])->keyBy('id');

        $snapshot['questions'] = collect($snapshot['questions'])
            ->map(function (array $question) use ($attempt, $results) {
                $safe = Arr::except($question, ['answer']);

                if ($attempt->content_type === 'homework' && $attempt->isSubmitted()) {
                    $safe['result'] = $results->get($question['id']);
                    $safe['correct_answer'] = $question['answer'];
                    $safe['explanation'] = $question['explanation'] ?? null;
                }

                return $safe;
            })
            ->values()
            ->all();

        return [
            'id' => $attempt->id,
            'contentType' => $attempt->content_type,
            'contentId' => $attempt->content_id,
            'attemptNumber' => $attempt->attempt_number,
            'status' => $attempt->status,
            'score' => $attempt->score,
            'maxScore' => $attempt->max_score,
            'startedAt' => $attempt->started_at->toISOString(),
            'submittedAt' => $attempt->submitted_at?->toISOString(),
            'snapshot' => $snapshot,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function homeworkSnapshot(array $homework, int $seed): array
    {
        $questions = collect($homework['problems'])
            ->map(fn (array $problem, int $index) => $this->generateHomeworkQuestion($problem, $seed + $index))
            ->values()
            ->all();

        return [
            'type' => 'homework',
            'content_id' => $homework['id'],
            'title' => $homework['title'],
            'description' => $homework['description'] ?? null,
            'version' => $homework['version'],
            'questions' => $questions,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function quizSnapshot(array $quiz, int $seed): array
    {
        $selected = $this->balancedQuizSelection(collect($quiz['questions']), $quiz['question_count'], $seed)
            ->map(fn (array $question, int $index) => $this->prepareQuizQuestion($question, $seed + $index))
            ->values();

        return [
            'type' => 'quiz',
            'content_id' => $quiz['id'],
            'title' => $quiz['title'],
            'description' => $quiz['description'] ?? null,
            'version' => $quiz['version'],
            'time_limit_minutes' => $quiz['time_limit_minutes'] ?? null,
            'questions' => $selected->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function generateHomeworkQuestion(array $problem, int $seed): array
    {
        if ($problem['type'] !== 'linear_equation') {
            throw new \RuntimeException("Unsupported homework problem type [{$problem['type']}].");
        }

        $a = $this->numberFromRange($problem['variables']['a'], $seed, 'a');
        $b = $this->numberFromRange($problem['variables']['b'], $seed, 'b');
        $x = $this->numberFromRange($problem['variables']['x'], $seed, 'x');
        $c = ($a * $x) + $b;
        $operator = $b < 0 ? '-' : '+';
        $absoluteB = abs($b);

        return [
            'id' => $problem['id'],
            'type' => 'numeric',
            'prompt' => "Solve for x: {$a}x {$operator} {$absoluteB} = {$c}",
            'points' => $problem['points'] ?? 1,
            'answer' => $x,
            'explanation' => "Subtract {$b} from both sides, then divide by {$a}.",
        ];
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    private function balancedQuizSelection(Collection $questions, int $count, int $seed): Collection
    {
        return $questions
            ->sortBy(fn (array $question) => crc32($seed.$question['topic'].$question['difficulty'].$question['id']))
            ->groupBy(fn (array $question) => $question['topic'].'|'.$question['difficulty'])
            ->flatMap(fn (Collection $group) => $group->take((int) ceil($count / 4)))
            ->sortBy(fn (array $question) => crc32($seed.$question['id']))
            ->take($count)
            ->values();
    }

    /**
     * @return array<string, mixed>
     */
    private function prepareQuizQuestion(array $question, int $seed): array
    {
        $options = collect($question['options'])
            ->sortBy(fn (string $option) => crc32($seed.$option))
            ->values()
            ->all();

        return [
            'id' => $question['id'],
            'type' => 'multiple_choice',
            'topic' => $question['topic'],
            'difficulty' => $question['difficulty'],
            'prompt' => $question['prompt'],
            'options' => $options,
            'points' => 1,
            'answer' => $question['answer'],
        ];
    }

    private function numberFromRange(array $range, int $seed, string $salt): int
    {
        [$minimum, $maximum] = $range;
        $span = $maximum - $minimum + 1;

        return $minimum + (crc32($seed.$salt) % $span);
    }

    private function isCorrect(array $question, mixed $answer): bool
    {
        if ($question['type'] === 'numeric') {
            return is_numeric($answer) && abs(((float) $answer) - ((float) $question['answer'])) < 0.0001;
        }

        return trim((string) $answer) === trim((string) $question['answer']);
    }
}
