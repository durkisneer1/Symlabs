<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'team_id',
    'user_id',
    'question',
    'response',
    'responded_by',
    'responded_at',
])]
class ClassroomQuestion extends Model
{
    /**
     * Get the classroom this question belongs to.
     *
     * @return BelongsTo<Team, $this>
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the student who asked the question.
     *
     * @return BelongsTo<User, $this>
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the teacher who responded.
     *
     * @return BelongsTo<User, $this>
     */
    public function responder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responded_by');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'responded_at' => 'datetime',
        ];
    }
}
