<?php

namespace App\Models\Assignments;

use App\Models\User;
use App\Models\Team;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[Fillable([
    'team_id',
    'created_by',
    'course_slug',
    'assignable_type',
    'assignable_id',
    'title',
    'description',
    'opens_at',
    'due_at',
    'points',
])]
class Assignment extends Model
{
    /**
     * Get the classroom/team this assignment belongs to.
     *
     * @return BelongsTo<Team, $this>
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Get the user who created the assignment.
     *
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the assigned item, such as a quiz.
     */
    public function assignable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get submissions for this assignment.
     *
     * @return HasMany<Submission, $this>
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'opens_at' => 'datetime',
            'due_at' => 'datetime',
            'points' => 'decimal:2',
        ];
    }
}
