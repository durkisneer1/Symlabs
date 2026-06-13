<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Member = 'member';

    /**
     * @deprecated Classroom teacher/student access now lives on team memberships.
     */
    case Teacher = 'teacher';

    /**
     * @deprecated Classroom teacher/student access now lives on team memberships.
     */
    case Student = 'student';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Admin',
            self::Member, self::Teacher, self::Student => 'Member',
        };
    }

    public function isAdmin(): bool
    {
        return $this === self::Admin;
    }

    public function isMember(): bool
    {
        return ! $this->isAdmin();
    }
}
