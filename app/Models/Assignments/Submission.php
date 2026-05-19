<?php

namespace App\Models\Assignments;

use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'assignment_id',
    'user_id',
    'status',
    'attempts_count',
    'score',
    'max_score',
    'answer_snapshot',
    'submitted_at',
])]
class Submission extends Model
{
    /**
     * Get the assignment this submission belongs to.
     *
     * @return BelongsTo<Assignment, $this>
     */
    public function assignment(): BelongsTo
    {
        return $this->belongsTo(Assignment::class);
    }

    /**
     * Get the student/user who owns this submission.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'score' => 'decimal:2',
            'max_score' => 'decimal:2',
            'attempts_count' => 'integer',
            'answer_snapshot' => 'array',
            'submitted_at' => 'datetime',
        ];
    }
}
