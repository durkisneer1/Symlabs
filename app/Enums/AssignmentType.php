<?php

namespace App\Enums;

enum AssignmentType: string
{
    case ChapterReading = 'chapter_reading';
    case Homework = 'homework';
    case Quiz = 'quiz';

    public function label(): string
    {
        return match ($this) {
            self::ChapterReading => 'Chapter Reading',
            self::Homework => 'Homework',
            self::Quiz => 'Quiz',
        };
    }
}
