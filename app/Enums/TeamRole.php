<?php

namespace App\Enums;

enum TeamRole: string
{
    case Admin = 'admin';
    case Teacher = 'teacher';
    case Student = 'student';

    /**
     * Get the display label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Admin',
            self::Teacher => 'Teacher',
            self::Student => 'Student',
        };
    }

    /**
     * Get all the permissions for this role.
     *
     * @return array<TeamPermission>
     */
    public function permissions(): array
    {
        return match ($this) {
            self::Admin => TeamPermission::cases(),
            self::Teacher => [
                TeamPermission::UpdateTeam,
                TeamPermission::AddMember,
                TeamPermission::UpdateMember,
                TeamPermission::RemoveMember,
                TeamPermission::CreateInvitation,
                TeamPermission::CancelInvitation,
                TeamPermission::AssignCoursework,
                TeamPermission::ViewStudentProgress,
                TeamPermission::ViewAsStudent,
            ],
            self::Student => [
                TeamPermission::TakeAssignments,
            ],
        };
    }

    /**
     * Determine if the role has the given permission.
     */
    public function hasPermission(TeamPermission $permission): bool
    {
        return in_array($permission, $this->permissions());
    }

    /**
     * Get the hierarchy level for this role.
     * Higher numbers indicate higher privileges.
     */
    public function level(): int
    {
        return match ($this) {
            self::Admin => 3,
            self::Teacher => 2,
            self::Student => 1,
        };
    }

    /**
     * Check if this role is at least as privileged as another role.
     */
    public function isAtLeast(TeamRole $role): bool
    {
        return $this->level() >= $role->level();
    }

    /**
     * Get the roles that can be assigned to classroom members (excludes Admin).
     *
     * @return array<array{value: string, label: string}>
     */
    public static function assignable(): array
    {
        return collect(self::cases())
            ->filter(fn (self $role) => $role !== self::Admin)
            ->map(fn (self $role) => ['value' => $role->value, 'label' => $role->label()])
            ->values()
            ->toArray();
    }

    /**
     * Get the roles this role can temporarily view as.
     *
     * @return array<array{value: string, label: string}>
     */
    public function viewModes(): array
    {
        return collect(self::cases())
            ->filter(fn (self $role) => $this->isAtLeast($role))
            ->map(fn (self $role) => ['value' => $role->value, 'label' => $role->label()])
            ->values()
            ->toArray();
    }

    /**
     * Determine if this role may temporarily view the classroom as another role.
     */
    public function canViewAs(self $role): bool
    {
        return $this !== self::Student && $this->isAtLeast($role);
    }
}
