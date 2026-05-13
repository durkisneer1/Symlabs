<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'team_id',
    'user_id',
    'content_type',
    'content_id',
    'attempt_number',
    'seed',
    'status',
    'snapshot',
    'answers',
    'score',
    'max_score',
    'ip_address',
    'user_agent',
    'started_at',
    'submitted_at',
])]
class CoursewareAttempt extends Model
{
    /**
     * Get the team that owns this attempt.
     *
     * @return BelongsTo<Team, $this>
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the user who made this attempt.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get activity logs attached to this attempt.
     *
     * @return HasMany<CoursewareActivityLog, $this>
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(CoursewareActivityLog::class);
    }

    /**
     * Determine if this attempt has been submitted.
     */
    public function isSubmitted(): bool
    {
        return $this->status === 'submitted';
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'snapshot' => 'array',
            'answers' => 'array',
            'score' => 'float',
            'max_score' => 'float',
            'started_at' => 'datetime',
            'submitted_at' => 'datetime',
        ];
    }
}
