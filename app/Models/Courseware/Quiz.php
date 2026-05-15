<?php

namespace App\Models\Courseware;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'slug',
    'title',
    'description',
    'question_count',
    'time_limit_minutes',
])]
class Quiz extends Model
{
    /**
     * Get the questions that belong to this quiz.
     *
     * @return HasMany<QuizQuestion, $this>
     */
    public function questions(): HasMany
    {
        return $this->hasMany(QuizQuestion::class);
    }
}
