<?php

namespace App\Models\Quizzes;

use App\Models\Assignments\Assignment;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

#[Fillable([
    'course_slug',
    'slug',
    'title',
    'description',
    'question_count',
    'time_limit_minutes',
])]
class Quiz extends Model
{
    /**
     * Bootstrap the model and its traits.
     */
    protected static function booted(): void
    {
        static::saving(function (Quiz $quiz) {
            $quiz->slug = Str::slug($quiz->course_slug.' '.$quiz->title);
        });

        static::deleting(function (Quiz $quiz) {
            $quiz->assignments()->delete();
        });
    }

    /**
     * Get the questions that belong to this quiz.
     *
     * @return HasMany<QuizQuestion, $this>
     */
    public function questions(): HasMany
    {
        return $this->hasMany(QuizQuestion::class);
    }

    /**
     * Get attempts for this quiz.
     *
     * @return HasMany<QuizAttempt, $this>
     */
    public function attempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    /**
     * Get assignments that use this quiz.
     *
     * @return MorphMany<Assignment, $this>
     */
    public function assignments(): MorphMany
    {
        return $this->morphMany(Assignment::class, 'assignable');
    }
}
