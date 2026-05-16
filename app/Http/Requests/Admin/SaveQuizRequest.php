<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use Illuminate\Validation\Rule;

class SaveQuizRequest extends FormRequest
{
    private const COURSES = ['html', 'css', 'php', 'mysql'];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === UserRole::Admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $quiz = $this->route('quiz');

        return [
            'course_slug' => ['required', 'string', Rule::in(self::COURSES)],
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('quizzes', 'title')
                    ->where('course_slug', $this->input('course_slug'))
                    ->ignore($quiz?->id),
            ],
            'description' => ['nullable', 'string'],
            'question_count' => ['required', 'integer', 'min:1'],
            'time_limit_minutes' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'course_slug' => strtolower((string) $this->input('course_slug')),
        ]);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $quiz = $this->route('quiz');

            if (! $quiz) {
                return;
            }

            $questionsCount = $quiz->questions()->count();
            $requestedCount = (int) $this->input('question_count');

            if ($questionsCount > 0 && $requestedCount > $questionsCount) {
                $validator->errors()->add(
                    'question_count',
                    "This quiz only has {$questionsCount} questions.",
                );
            }
        });
    }
}
