<?php

namespace App\Http\Controllers\Teams;

use App\Enums\AssignmentType;
use App\Enums\TeamPermission;
use App\Http\Controllers\Controller;
use App\Models\Assignments\Assignment;
use App\Models\Assignments\Submission;
use App\Models\Quizzes\QuizAttempt;
use App\Models\Quizzes\QuizQuestion;
use App\Models\Team;
use App\Support\HomeworkBank;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssignmentAttemptController extends Controller
{
    /**
     * Show an assigned homework or quiz attempt, or a completed-work review.
     */
    public function show(Request $request, Team $currentTeam, Assignment $assignment): Response
    {
        $this->authorizeStudentAttempt($request, $currentTeam, $assignment);
        abort_unless(in_array($assignment->type, [AssignmentType::Homework, AssignmentType::Quiz], true), 404);

        $submission = $this->submissionFor($request, $assignment);
        $canAttempt = $currentTeam->semesterIsActive() && $this->attemptsRemain($request, $assignment);
        $canReview = $submission !== null && $this->canReview($assignment);
        $wantsReview = $request->query('mode') === 'review';

        abort_unless($canAttempt || $canReview, 403);

        return Inertia::render('student/assignment-attempt', [
            'team' => $request->user()->toUserTeam($currentTeam),
            'assignment' => $this->assignmentPayload($request, $assignment, $currentTeam, $submission, $wantsReview),
            'questions' => $this->questionsPayload($assignment, $wantsReview || ! $canAttempt ? $submission : null),
        ]);
    }

    /**
     * Grade an assigned homework or quiz attempt.
     */
    public function submit(Request $request, Team $currentTeam, Assignment $assignment): RedirectResponse
    {
        $this->authorizeStudentAttempt($request, $currentTeam, $assignment);
        abort_unless($currentTeam->semesterIsActive(), 403);

        abort_unless(in_array($assignment->type, [AssignmentType::Homework, AssignmentType::Quiz], true), 404);
        abort_unless($this->attemptsRemain($request, $assignment), 403);

        $data = $request->validate([
            'answers' => ['required', 'array'],
        ]);

        $result = $this->grade($assignment, $data['answers']);

        $submission = Submission::firstOrNew([
            'assignment_id' => $assignment->id,
            'user_id' => $request->user()->id,
        ]);

        $submission->fill([
            'status' => 'completed',
            'attempts_count' => ($submission->attempts_count ?? 0) + 1,
            'score' => $result['score'],
            'max_score' => $result['max_score'],
            'answer_snapshot' => [
                'answers' => $data['answers'],
                'question_ids' => collect($result['questions'])->pluck('id')->values()->all(),
            ],
            'submitted_at' => now(),
        ]);
        $submission->save();

        if ($assignment->type === AssignmentType::Quiz && $assignment->assignable) {
            QuizAttempt::create([
                'quiz_id' => $assignment->assignable->id,
                'assignment_id' => $assignment->id,
                'user_id' => $request->user()->id,
                'team_id' => $currentTeam->id,
                'started_at' => now(),
                'submitted_at' => now(),
                'score' => $result['score'],
                'max_score' => $result['max_score'],
                'snapshot' => [
                    'answers' => $data['answers'],
                    'questions' => $this->questionsPayload($assignment),
                ],
            ]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Assignment submitted.'),
        ]);

        return to_route('work.index', ['current_team' => $currentTeam->slug]);
    }

    protected function authorizeStudentAttempt(Request $request, Team $currentTeam, Assignment $assignment): void
    {
        abort_unless($assignment->team_id === $currentTeam->id, 404);
        abort_unless($request->user()?->hasTeamPermission($currentTeam, TeamPermission::TakeAssignments), 403);
    }

    /**
     * @return array<string, mixed>
     */
    protected function assignmentPayload(
        Request $request,
        Assignment $assignment,
        Team $currentTeam,
        ?Submission $submission = null,
        bool $wantsReview = false,
    ): array {
        $submission ??= $this->submissionFor($request, $assignment);
        $attemptsAllowed = (int) ($assignment->settings['attempts_allowed'] ?? 1);
        $attemptsUsed = $submission?->attempts_count ?? 0;
        $canAttempt = $currentTeam->semesterIsActive() && $attemptsUsed < $attemptsAllowed;
        $canReview = $submission !== null && $this->canReview($assignment) && ($wantsReview || ! $canAttempt);

        return [
            'id' => $assignment->id,
            'type' => $assignment->type->value,
            'type_label' => $assignment->type->label(),
            'title' => $assignment->title,
            'description' => $assignment->description,
            'course_slug' => $assignment->course_slug,
            'due_at' => $assignment->due_at?->toISOString(),
            'status' => $submission?->status ?? 'assigned',
            'score' => $submission?->score,
            'max_score' => $submission?->max_score,
            'attempts_used' => $attemptsUsed,
            'attempts_allowed' => $attemptsAllowed,
            'attempts_exhausted' => $attemptsUsed >= $attemptsAllowed,
            'can_attempt' => $canAttempt && ! $canReview,
            'can_review' => $canReview,
            'grade_visible' => $this->gradeIsVisible($assignment),
        ];
    }

    protected function attemptsRemain(Request $request, Assignment $assignment): bool
    {
        $submission = $this->submissionFor($request, $assignment);

        return ($submission?->attempts_count ?? 0) < (int) ($assignment->settings['attempts_allowed'] ?? 1);
    }

    protected function submissionFor(Request $request, Assignment $assignment): ?Submission
    {
        return $assignment->submissions()
            ->where('user_id', $request->user()->id)
            ->first();
    }

    protected function canReview(Assignment $assignment): bool
    {
        return $assignment->type === AssignmentType::Homework
            || ($assignment->type === AssignmentType::Quiz && $this->gradeIsVisible($assignment));
    }

    protected function gradeIsVisible(Assignment $assignment): bool
    {
        return $assignment->type !== AssignmentType::Quiz
            || (bool) ($assignment->settings['grades_published'] ?? false);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function questionsPayload(Assignment $assignment, ?Submission $submission = null): array
    {
        $snapshot = $submission?->answer_snapshot ?? [];
        $answers = is_array($snapshot['answers'] ?? null) ? $snapshot['answers'] : [];
        $questionIds = is_array($snapshot['question_ids'] ?? null)
            ? array_map('strval', $snapshot['question_ids'])
            : [];
        $isReview = $submission !== null && $this->canReview($assignment);

        if ($assignment->type === AssignmentType::Homework) {
            $attemptsAllowed = (int) ($assignment->settings['attempts_allowed'] ?? 1);
            $attemptsUsed = $submission?->attempts_count ?? 0;
            $revealCorrectAnswer = $isReview && $attemptsUsed >= $attemptsAllowed;

            $questions = collect(HomeworkBank::questions(
                $assignment->course_slug,
                $assignment->settings['homework_slug'] ?? null,
            ));

            if ($isReview && $questionIds !== []) {
                $questions = $questions
                    ->filter(fn (array $question) => in_array((string) $question['id'], $questionIds, true))
                    ->sortBy(fn (array $question) => array_search((string) $question['id'], $questionIds, true));
            }

            return $questions
                ->map(fn (array $question) => $this->questionPayload(
                    $question,
                    $answers,
                    $isReview,
                    $revealCorrectAnswer,
                ))
                ->values()
                ->all();
        }

        $revealCorrectAnswer = $isReview && $assignment->type === AssignmentType::Quiz;

        $questions = collect($this->quizQuestionsForReview($assignment));

        if ($isReview && $questionIds !== []) {
            $questions = $questions
                ->filter(fn (array $question) => in_array((string) $question['id'], $questionIds, true))
                ->sortBy(fn (array $question) => array_search((string) $question['id'], $questionIds, true));
        }

        return $questions
            ->map(fn (array $question) => $this->questionPayload(
                $question,
                $answers,
                $isReview,
                $revealCorrectAnswer,
            ))
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $question
     * @param  array<string, mixed>  $answers
     * @return array<string, mixed>
     */
    protected function questionPayload(array $question, array $answers, bool $isReview, bool $revealCorrectAnswer): array
    {
        $choices = collect($question['choices'] ?? [])
            ->map(fn (array $choice) => [
                'id' => (string) $choice['id'],
                'text' => $choice['text'],
                'match_text' => $choice['match_text'] ?? null,
            ])
            ->values()
            ->all();

        $payload = [
            'id' => (string) $question['id'],
            'type' => $question['type'],
            'prompt' => $question['prompt'],
            'choices' => $choices,
        ];

        if (! $isReview) {
            return $payload;
        }

        $selectedAnswer = $answers[(string) $question['id']] ?? null;
        $isCorrect = $this->answerIsCorrect($question, $selectedAnswer);
        $selectedChoice = collect($choices)->firstWhere('id', (string) $selectedAnswer);

        return [
            ...$payload,
            'selected_answer' => is_scalar($selectedAnswer) ? (string) $selectedAnswer : null,
            'selected_text' => $selectedChoice['text'] ?? (is_string($selectedAnswer) ? $selectedAnswer : null),
            'is_correct' => $isCorrect,
            'correct_answer' => $revealCorrectAnswer && ! $isCorrect
                ? $this->correctAnswerText($question)
                : null,
        ];
    }

    /**
     * @param  array<string, mixed>  $question
     */
    protected function correctAnswerText(array $question): ?string
    {
        if (isset($question['answer_text']) && is_string($question['answer_text'])) {
            return $question['answer_text'];
        }

        $correctAnswer = (string) ($question['answer'] ?? '');

        return collect($question['choices'] ?? [])
            ->firstWhere('id', $correctAnswer)['text'] ?? null;
    }

    /**
     * @param  array<string, mixed>  $answers
     * @return array{score: int, max_score: int, questions: array<int, array<string, mixed>>}
     */
    protected function grade(Assignment $assignment, array $answers): array
    {
        $questions = $assignment->type === AssignmentType::Homework
            ? HomeworkBank::questions($assignment->course_slug, $assignment->settings['homework_slug'] ?? null)
            : $this->quizQuestionsForGrading($assignment);

        $score = collect($questions)
            ->filter(fn (array $question) => $this->answerIsCorrect($question, $answers[(string) $question['id']] ?? null))
            ->count();

        return [
            'score' => $score,
            'max_score' => count($questions),
            'questions' => $questions,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function quizQuestionsForReview(Assignment $assignment): array
    {
        $quiz = $assignment->assignable;
        $difficulty = $assignment->settings['difficulty'] ?? 'any';
        $questionCount = (int) ($assignment->settings['question_count'] ?? 1);

        return $quiz
            ? $quiz->questions()
                ->with('options')
                ->when($difficulty !== 'any', fn ($query) => $query->where('difficulty', $difficulty))
                ->orderBy('position')
                ->limit($questionCount)
                ->get()
                ->map(fn (QuizQuestion $question) => [
                    'id' => (string) $question->id,
                    'type' => $question->type,
                    'prompt' => $question->prompt,
                    'answer_pattern' => $question->answer_pattern,
                    'answer' => (string) ($question->options->firstWhere('is_correct', true)?->id ?? ''),
                    'choices' => $question->options
                        ->sortBy('position')
                        ->values()
                        ->map(fn ($option) => [
                            'id' => (string) $option->id,
                            'text' => $option->text,
                            'match_text' => $option->match_text,
                        ])
                        ->all(),
                ])
                ->all()
            : [];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function quizQuestionsForGrading(Assignment $assignment): array
    {
        return collect($this->quizQuestionsForReview($assignment))
            ->map(fn (array $question) => [
                'id' => $question['id'],
                'type' => $question['type'],
                'answer_pattern' => $question['answer_pattern'] ?? null,
                'answer' => $question['answer'] ?? '',
            ])
            ->all();
    }

    protected function answerIsCorrect(array $question, mixed $answer): bool
    {
        if (($question['type'] ?? null) === 'short_answer' || ($question['type'] ?? null) === 'fill_blank') {
            $pattern = $question['answer_pattern'] ?? null;

            return is_string($pattern) && is_string($answer) && preg_match($pattern, trim($answer)) === 1;
        }

        return (string) $answer === (string) ($question['answer'] ?? '');
    }
}
