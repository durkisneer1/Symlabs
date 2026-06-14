<?php

namespace App\Http\Controllers\Teams;

use App\Enums\AssignmentType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\StoreCourseworkRequest;
use App\Models\Assignments\Assignment;
use App\Models\Quizzes\Quiz;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseworkController extends Controller
{
    private const COURSES = [
        'html' => 'HTML',
        'css' => 'CSS',
        'php' => 'PHP',
        'mysql' => 'MySQL',
    ];

    private const CHAPTERS = [
        'html' => [
            ['value' => 'intro-to-web', 'label' => 'Introduction to Web Dev'],
            ['value' => 'elements-and-tags', 'label' => 'Elements and Tags'],
            ['value' => 'document-structure', 'label' => 'Document Structure'],
            ['value' => 'semantic-html', 'label' => 'Semantic HTML'],
        ],
        'css' => [
            ['value' => 'styling-web-pages', 'label' => 'Styling Web Pages'],
            ['value' => 'selectors', 'label' => 'Selectors'],
            ['value' => 'combinators-and-pattern-matching', 'label' => 'Combinators and Pattern Matching'],
            ['value' => 'properties', 'label' => 'Properties'],
            ['value' => 'custom-properties', 'label' => 'Custom Properties'],
            ['value' => 'text-formatting', 'label' => 'Text Formatting'],
            ['value' => 'the-box-model', 'label' => 'The Box Model'],
            ['value' => 'flexbox', 'label' => 'Flexbox'],
            ['value' => 'grids', 'label' => 'Grids'],
            ['value' => 'positioning-elements', 'label' => 'Positioning Elements'],
            ['value' => 'special-effects', 'label' => 'Special Effects'],
            ['value' => 'animation', 'label' => 'Animation'],
            ['value' => 'styling-forms', 'label' => 'Styling Forms'],
        ],
        'php' => [
            ['value' => 'variables-and-flow', 'label' => 'Variables and Flow'],
        ],
        'mysql' => [
            ['value' => 'tables-and-queries', 'label' => 'Tables and Queries'],
            ['value' => 'joins', 'label' => 'Joins'],
        ],
    ];

    private const HOMEWORK = [
        'html' => [
            ['value' => 'html-elements-practice', 'label' => 'HTML Elements Practice'],
            ['value' => 'html-attributes-practice', 'label' => 'HTML Attributes Practice'],
        ],
        'css' => [
            ['value' => 'css-selector-practice', 'label' => 'CSS Selector Practice'],
        ],
        'php' => [
            ['value' => 'php-control-flow-practice', 'label' => 'PHP Control Flow Practice'],
        ],
        'mysql' => [
            ['value' => 'mysql-select-practice', 'label' => 'MySQL SELECT Practice'],
        ],
    ];

    /**
     * Show the coursework assignment form.
     */
    public function create(Request $request, Team $currentTeam): Response
    {
        abort_unless($request->user()?->toTeamPermissions($currentTeam)->canAssignCoursework, 403);

        return Inertia::render('teacher/coursework/create', [
            'team' => $request->user()->toUserTeam($currentTeam),
            ...$this->formOptions(),
        ]);
    }

    /**
     * Store assigned coursework for the classroom.
     */
    public function store(StoreCourseworkRequest $request, Team $currentTeam): RedirectResponse
    {
        $data = $request->validated();
        $type = AssignmentType::from($data['type']);
        $quiz = $type === AssignmentType::Quiz
            ? Quiz::findOrFail($data['quiz_id'])
            : null;

        Assignment::create([
            'team_id' => $currentTeam->id,
            'created_by' => $request->user()->id,
            'type' => $type,
            'course_slug' => $data['course_slug'],
            'assignable_type' => $quiz ? $quiz->getMorphClass() : null,
            'assignable_id' => $quiz?->id,
            'title' => $data['title'],
            'description' => $this->descriptionFor($type),
            'settings' => $this->settingsFor($type, $data),
            'opens_at' => $data['opens_at'] ?? null,
            'due_at' => $data['due_at'] ?? null,
            'points' => 0,
        ]);

        return to_route('dashboard', ['current_team' => $currentTeam->slug]);
    }

    /**
     * Show the coursework edit form.
     */
    public function edit(Request $request, Team $currentTeam, Assignment $assignment): Response
    {
        abort_unless($request->user()?->toTeamPermissions($currentTeam)->canAssignCoursework, 403);
        abort_unless($assignment->team_id === $currentTeam->id, 404);

        return Inertia::render('teacher/coursework/create', [
            'team' => $request->user()->toUserTeam($currentTeam),
            'assignment' => $this->assignmentPayload($assignment),
            ...$this->formOptions(),
        ]);
    }

    /**
     * Update assigned coursework for the classroom.
     */
    public function update(StoreCourseworkRequest $request, Team $currentTeam, Assignment $assignment): RedirectResponse
    {
        abort_unless($assignment->team_id === $currentTeam->id, 404);

        $data = $request->validated();
        $type = AssignmentType::from($data['type']);
        $quiz = $type === AssignmentType::Quiz
            ? Quiz::findOrFail($data['quiz_id'])
            : null;

        $assignment->update([
            'type' => $type,
            'course_slug' => $data['course_slug'],
            'assignable_type' => $quiz ? $quiz->getMorphClass() : null,
            'assignable_id' => $quiz?->id,
            'title' => $data['title'],
            'description' => $this->descriptionFor($type),
            'settings' => $this->settingsFor($type, $data),
            'opens_at' => $data['opens_at'] ?? null,
            'due_at' => $data['due_at'] ?? null,
            'points' => 0,
        ]);

        return to_route('dashboard', ['current_team' => $currentTeam->slug]);
    }

    public function publishGrades(Request $request, Team $currentTeam, Assignment $assignment): RedirectResponse
    {
        abort_unless($request->user()?->toTeamPermissions($currentTeam)->canAssignCoursework, 403);
        abort_unless($assignment->team_id === $currentTeam->id, 404);
        abort_unless($assignment->type === AssignmentType::Quiz, 404);

        $settings = $assignment->settings ?? [];
        $settings['grades_published'] = true;

        $assignment->update(['settings' => $settings]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Quiz grades published.'),
        ]);

        return back();
    }

    /**
     * Get supported course options.
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
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    protected function formOptions(): array
    {
        return [
            'courses' => $this->courses(),
            'chapters' => self::CHAPTERS,
            'homeworkSets' => self::HOMEWORK,
            'quizzes' => Quiz::query()
                ->withCount('questions')
                ->orderBy('course_slug')
                ->orderBy('title')
                ->get(['id', 'course_slug', 'title', 'description', 'question_count', 'time_limit_minutes'])
                ->map(fn (Quiz $quiz) => [
                    'id' => $quiz->id,
                    'course_slug' => $quiz->course_slug,
                    'title' => $quiz->title,
                    'description' => $quiz->description,
                    'question_count' => $quiz->question_count,
                    'time_limit_minutes' => $quiz->time_limit_minutes,
                    'questions_count' => $quiz->questions_count,
                ]),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function assignmentPayload(Assignment $assignment): array
    {
        return [
            'id' => $assignment->id,
            'type' => $assignment->type->value,
            'course_slug' => $assignment->course_slug,
            'title' => $assignment->title,
            'opens_at' => $assignment->opens_at?->format('Y-m-d\TH:i') ?? '',
            'due_at' => $assignment->due_at?->format('Y-m-d\TH:i') ?? '',
            'quiz_id' => $assignment->type === AssignmentType::Quiz
                ? (string) $assignment->assignable_id
                : '',
            'chapter_slugs' => $assignment->settings['chapter_slugs'] ?? [],
            'homework_slug' => $assignment->settings['homework_slug'] ?? '',
            'question_count' => $assignment->settings['question_count'] ?? 1,
            'difficulty' => $assignment->settings['difficulty'] ?? 'any',
            'attempts_allowed' => $assignment->settings['attempts_allowed']
                ?? ($assignment->type === AssignmentType::Quiz ? 1 : 3),
        ];
    }

    /**
     * Build assignment-type-specific settings.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function settingsFor(AssignmentType $type, array $data): array
    {
        return match ($type) {
            AssignmentType::ChapterReading => [
                'chapter_slugs' => $data['chapter_slugs'] ?? [],
                'tracks_progress' => true,
                'participation_required' => true,
            ],
            AssignmentType::Homework => [
                'homework_slug' => $data['homework_slug'] ?? null,
                'attempts_allowed' => (int) ($data['attempts_allowed'] ?? 3),
            ],
            AssignmentType::Quiz => [
                'question_count' => (int) ($data['question_count'] ?? 1),
                'difficulty' => $data['difficulty'] ?? 'any',
                'attempts_allowed' => (int) ($data['attempts_allowed'] ?? 1),
                'grades_published' => false,
            ],
        };
    }

    protected function descriptionFor(AssignmentType $type): string
    {
        return match ($type) {
            AssignmentType::ChapterReading => 'Read the chapter and complete participation activities.',
            AssignmentType::Homework => 'Answer these homework questions.',
            AssignmentType::Quiz => 'Take the quiz.',
        };
    }
}
