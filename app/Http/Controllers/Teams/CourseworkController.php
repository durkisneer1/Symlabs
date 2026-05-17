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
            ['value' => 'intro-to-html', 'label' => 'Intro to HTML'],
            ['value' => 'elements-and-tags', 'label' => 'Elements and Tags'],
            ['value' => 'semantic-html', 'label' => 'Semantic HTML'],
        ],
        'css' => [
            ['value' => 'selectors-and-cascade', 'label' => 'Selectors and Cascade'],
            ['value' => 'box-model', 'label' => 'Box Model'],
        ],
        'php' => [
            ['value' => 'php-basics', 'label' => 'PHP Basics'],
            ['value' => 'control-flow', 'label' => 'Control Flow'],
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
