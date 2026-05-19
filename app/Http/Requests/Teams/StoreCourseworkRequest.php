<?php

namespace App\Http\Requests\Teams;

use App\Enums\AssignmentType;
use App\Enums\TeamPermission;
use App\Models\Quizzes\Quiz;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreCourseworkRequest extends FormRequest
{
    private const COURSES = ['html', 'css', 'php', 'mysql'];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $team = $this->route('current_team');

        return $team && $this->user()?->hasTeamPermission($team, TeamPermission::AssignCoursework);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $type = $this->string('type')->toString();

        return [
            'type' => ['required', Rule::enum(AssignmentType::class)],
            'course_slug' => ['required', 'string', Rule::in(self::COURSES)],
            'title' => ['required', 'string', 'max:255'],
            'opens_at' => ['nullable', 'date'],
            'due_at' => ['nullable', 'date', 'after_or_equal:opens_at'],
            'points' => ['nullable', 'numeric', 'min:0', 'max:10000'],
            'quiz_id' => [
                Rule::excludeIf($type !== AssignmentType::Quiz->value),
                'required',
                'integer',
                'exists:quizzes,id',
            ],
            'chapter_slugs' => [
                Rule::excludeIf($type !== AssignmentType::ChapterReading->value),
                'required',
                'array',
                'min:1',
            ],
            'chapter_slugs.*' => ['string', 'max:255'],
            'homework_slug' => [
                Rule::excludeIf($type !== AssignmentType::Homework->value),
                'required',
                'string',
                'max:255',
            ],
            'question_count' => [
                Rule::excludeIf($type !== AssignmentType::Quiz->value),
                'required',
                'integer',
                'min:1',
            ],
            'difficulty' => ['nullable', 'string', 'in:any,easy,medium,hard'],
            'attempts_allowed' => ['nullable', 'integer', 'min:1', 'max:10'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'course_slug' => strtolower((string) $this->input('course_slug')),
            'quiz_id' => $this->input('type') === AssignmentType::Quiz->value
                ? $this->input('quiz_id')
                : null,
            'homework_slug' => $this->input('type') === AssignmentType::Homework->value
                ? $this->input('homework_slug')
                : null,
            'chapter_slugs' => $this->input('type') === AssignmentType::ChapterReading->value
                ? $this->input('chapter_slugs')
                : [],
        ]);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $type = $this->string('type')->toString();

            if ($type === AssignmentType::ChapterReading->value && blank($this->input('chapter_slugs'))) {
                $validator->errors()->add('chapter_slugs', 'Choose at least one chapter.');
            }

            if ($type === AssignmentType::Homework->value && blank($this->input('homework_slug'))) {
                $validator->errors()->add('homework_slug', 'Choose a homework set.');
            }

            if ($type !== AssignmentType::Quiz->value) {
                return;
            }

            $quiz = Quiz::withCount('questions')->find($this->input('quiz_id'));

            if (! $quiz) {
                $validator->errors()->add('quiz_id', 'Choose a quiz.');

                return;
            }

            if ($quiz->course_slug !== $this->input('course_slug')) {
                $validator->errors()->add('quiz_id', 'Choose a quiz from the selected course.');
            }

            $questionCount = (int) $this->input('question_count', 1);

            if ($quiz->questions_count > 0 && $questionCount > $quiz->questions_count) {
                $validator->errors()->add(
                    'question_count',
                    "This quiz bank only has {$quiz->questions_count} questions.",
                );
            }
        });
    }
}
