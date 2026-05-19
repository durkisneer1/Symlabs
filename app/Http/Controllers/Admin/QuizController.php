<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SaveQuizRequest;
use App\Enums\UserRole;
use App\Models\Quizzes\Quiz;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    private const COURSES = [
        'html' => 'HTML',
        'css' => 'CSS',
        'php' => 'PHP',
        'mysql' => 'MySQL',
    ];

    /**
     * Display the reusable quiz bank.
     */
    public function index(Request $request): Response
    {
        $this->authorizeAdmin($request);

        $selectedCourse = $request->query('course');
        $selectedCourse = array_key_exists($selectedCourse, self::COURSES)
            ? $selectedCourse
            : $this->defaultCourse();

        return Inertia::render('admin/quizzes/index', [
            'selectedCourse' => $selectedCourse,
            'courses' => $this->courses(),
            'quizzes' => Quiz::query()
                ->withCount('questions')
                ->where('course_slug', $selectedCourse)
                ->orderBy('course_slug')
                ->orderBy('title')
                ->get(['id', 'course_slug', 'title', 'description', 'question_count', 'created_at', 'updated_at']),
        ]);
    }

    /**
     * Show the form for creating a quiz.
     */
    public function create(Request $request): Response
    {
        $this->authorizeAdmin($request);

        return Inertia::render('admin/quizzes/edit', [
            'courses' => $this->courses(),
            'quiz' => null,
        ]);
    }

    /**
     * Store a newly created quiz.
     */
    public function store(SaveQuizRequest $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        Quiz::create($request->validated());

        return to_route('admin.quizzes.index');
    }

    /**
     * Show the form for editing a quiz.
     */
    public function edit(Request $request, Quiz $quiz): Response
    {
        $this->authorizeAdmin($request);
        $quiz->loadCount('questions')->load([
            'questions' => fn ($query) => $query->with('options')->orderBy('position'),
        ]);

        return Inertia::render('admin/quizzes/edit', [
            'courses' => $this->courses(),
            'quiz' => [
                ...$quiz->only([
                'id',
                'course_slug',
                'slug',
                'title',
                'description',
                'question_count',
                'time_limit_minutes',
                ]),
                'questions_count' => $quiz->questions_count,
                'questions' => $quiz->questions->map(fn ($question) => [
                    'id' => $question->id,
                    'course_slug' => $question->course_slug,
                    'chapter_slug' => $question->chapter_slug,
                    'type' => $question->type,
                    'topic' => $question->topic,
                    'difficulty' => $question->difficulty,
                    'prompt' => $question->prompt,
                    'answer_pattern' => $question->answer_pattern,
                    'position' => $question->position,
                    'options' => $question->options
                        ->sortBy('position')
                        ->values()
                        ->map(fn ($option) => [
                            'id' => $option->id,
                            'text' => $option->text,
                            'match_text' => $option->match_text,
                            'is_correct' => $option->is_correct,
                            'position' => $option->position,
                        ]),
                ]),
            ],
        ]);
    }

    /**
     * Update the specified quiz.
     */
    public function update(SaveQuizRequest $request, Quiz $quiz): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $quiz->update($request->validated());

        return to_route('admin.quizzes.index');
    }

    /**
     * Remove the specified quiz.
     */
    public function destroy(Request $request, Quiz $quiz): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $quiz->delete();

        return to_route('admin.quizzes.index');
    }

    protected function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === UserRole::Admin, 403);
    }

    /**
     * Get supported course options for quiz metadata.
     *
     * @return array<int, array{value: string, label: string}>
     */
    protected function courses(): array
    {
        return collect(self::COURSES)
            ->map(fn (string $label, string $value) => [
                'value' => $value,
                'label' => $label,
            ])
            ->sortBy('label')
            ->values()
            ->all();
    }

    protected function defaultCourse(): string
    {
        return $this->courses()[0]['value'];
    }
}
