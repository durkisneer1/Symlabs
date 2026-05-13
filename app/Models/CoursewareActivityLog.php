<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'team_id',
    'user_id',
    'courseware_attempt_id',
    'event',
    'metadata',
    'ip_address',
    'user_agent',
])]
class CoursewareActivityLog extends Model
{
    /**
     * Get the team that owns this activity event.
     *
     * @return BelongsTo<Team, $this>
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the user who triggered this activity event.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the attempt related to this event.
     *
     * @return BelongsTo<CoursewareAttempt, $this>
     */
    public function attempt(): BelongsTo
    {
        return $this->belongsTo(CoursewareAttempt::class, 'courseware_attempt_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }
}
