<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SaveQuizQuestionRequest;
use App\Enums\UserRole;
use App\Models\Quizzes\Quiz;
use App\Models\Quizzes\QuizQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuizQuestionController extends Controller
{
    /**
     * Store a newly created quiz question.
     */
    public function store(SaveQuizQuestionRequest $request, Quiz $quiz): RedirectResponse
    {
        $this->saveQuestion($request, $quiz);

        return to_route('admin.quizzes.edit', $quiz);
    }

    /**
     * Update the specified quiz question.
     */
    public function update(SaveQuizQuestionRequest $request, Quiz $quiz, QuizQuestion $question): RedirectResponse
    {
        abort_unless($question->quiz_id === $quiz->id, 404);

        $this->saveQuestion($request, $quiz, $question);

        return to_route('admin.quizzes.edit', $quiz);
    }

    /**
     * Remove the specified quiz question.
     */
    public function destroy(Request $request, Quiz $quiz, QuizQuestion $question): RedirectResponse
    {
        abort_unless($request->user()?->role === UserRole::Admin, 403);
        abort_unless($question->quiz_id === $quiz->id, 404);

        $question->delete();

        return to_route('admin.quizzes.edit', $quiz);
    }

    protected function saveQuestion(SaveQuizQuestionRequest $request, Quiz $quiz, ?QuizQuestion $question = null): QuizQuestion
    {
        return DB::transaction(function () use ($request, $quiz, $question) {
            $questionData = $request->safe()->except('options');
            $questionData['position'] ??= $question?->position ?? $quiz->questions()->count();
            $questionData['answer_pattern'] = $questionData['type'] === 'fill_blank'
                ? $questionData['answer_pattern']
                : null;

            $question = $question
                ? tap($question)->update($questionData)
                : $quiz->questions()->create($questionData);

            $question->options()->delete();

            if ($questionData['type'] !== 'fill_blank') {
                $question->options()->createMany(
                    collect($request->validated('options', []))
                        ->values()
                        ->map(fn (array $option, int $index) => [
                            'text' => $option['text'],
                            'match_text' => $questionData['type'] === 'matching'
                                ? $option['match_text']
                                : null,
                            'is_correct' => $questionData['type'] === 'matching'
                                ? false
                                : filter_var($option['is_correct'] ?? false, FILTER_VALIDATE_BOOL),
                            'position' => $option['position'] ?? $index,
                        ])
                        ->all(),
                );
            }

            return $question;
        });
    }
}
