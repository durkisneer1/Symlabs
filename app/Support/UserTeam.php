<?php

namespace App\Support;

readonly class UserTeam
{
    public function __construct(
        public int $id,
        public string $name,
        public string $slug,
        public bool $isPersonal,
        public ?string $role,
        public ?string $roleLabel,
        public ?bool $isCurrent = null,
        public array $viewModes = [],
        public ?array $gradeWeights = null,
        public ?string $semesterStartsAt = null,
        public ?string $semesterEndsAt = null,
        public bool $semesterActive = true,
    ) {
        //
    }
}
