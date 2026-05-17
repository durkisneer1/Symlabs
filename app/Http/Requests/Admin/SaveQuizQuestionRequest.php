<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SaveQuizQuestionRequest extends FormRequest
{
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
        return [
            'course_slug' => ['required', 'string', 'in:html,css,php,mysql'],
            'chapter_slug' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:multiple_choice,true_false,fill_blank,matching'],
            'topic' => ['required', 'string', 'max:255'],
            'difficulty' => ['required', 'string', 'in:easy,medium,hard'],
            'prompt' => ['required', 'string'],
            'answer_pattern' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'integer', 'min:0'],
            'options' => ['nullable', 'array'],
            'options.*.text' => ['nullable', 'string', 'max:255'],
            'options.*.match_text' => ['nullable', 'string', 'max:255'],
            'options.*.is_correct' => ['nullable', 'boolean'],
            'options.*.position' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $type = $this->string('type')->toString();
            $options = collect($this->input('options', []));

            if ($type === 'fill_blank') {
                if (blank($this->input('answer_pattern'))) {
                    $validator->errors()->add('answer_pattern', 'Enter a regex pattern for the accepted answer.');
                }

                return;
            }

            if ($type === 'matching') {
                if ($options->count() < 2) {
                    $validator->errors()->add('options', 'Add at least two matching pairs.');
                }

                if ($options->count() > 6) {
                    $validator->errors()->add('options', 'Matching questions can have at most six pairs.');
                }

                $options->each(function (array $option, int $index) use ($validator) {
                    if (blank($option['text'] ?? null) || blank($option['match_text'] ?? null)) {
                        $validator->errors()->add("options.{$index}.text", 'Each matching pair needs a term and definition.');
                    }
                });

                return;
            }

            $minimumOptions = $type === 'true_false' ? 2 : 2;
            $maximumOptions = $type === 'true_false' ? 2 : 6;

            if ($options->count() < $minimumOptions || $options->count() > $maximumOptions) {
                $message = $type === 'true_false'
                    ? 'True/false questions need exactly two options.'
                    : 'Multiple choice questions need between two and six options.';

                $validator->errors()->add('options', $message);
            }

            $options->each(function (array $option, int $index) use ($validator) {
                if (blank($option['text'] ?? null)) {
                    $validator->errors()->add("options.{$index}.text", 'Each answer option needs text.');
                }
            });

            $correctOptions = $options
                ->filter(fn (array $option) => filter_var($option['is_correct'] ?? false, FILTER_VALIDATE_BOOL))
                ->count();

            if ($correctOptions !== 1) {
                $validator->errors()->add('options', 'Choose exactly one correct option.');
            }
        });
    }
}
