<?php

namespace App\Courseware;

use Illuminate\Support\Collection;
use RuntimeException;

class CoursewareRepository
{
    /**
     * Get all courseware files.
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function courses(): Collection
    {
        return collect(glob(resource_path('courseware/*.json')) ?: [])
            ->map(fn (string $path) => $this->decode($path))
            ->values();
    }

    /**
     * Get all chapters with resolved item summaries.
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function chapters(): Collection
    {
        return $this->courses()
            ->flatMap(function (array $course) {
                return collect($course['chapters'] ?? [])
                    ->map(fn (array $chapter) => [
                        ...$chapter,
                        'course_id' => $course['id'],
                        'course_title' => $course['title'],
                        'items' => collect($chapter['items'] ?? [])
                            ->map(fn (array $item) => $this->summary($course, $item['type'], $item['id']))
                            ->values()
                            ->all(),
                    ]);
            })
            ->values();
    }

    /**
     * Find one content item by type and ID.
     *
     * @return array<string, mixed>
     */
    public function find(string $type, string $id): array
    {
        foreach ($this->courses() as $course) {
            $bucket = $this->bucket($type);

            if (isset($course[$bucket][$id])) {
                return [
                    ...$course[$bucket][$id],
                    'id' => $id,
                    'type' => $type,
                    'course_id' => $course['id'],
                    'course_title' => $course['title'],
                    'version' => $course['version'],
                ];
            }
        }

        abort(404);
    }

    /**
     * Get a content item summary.
     *
     * @return array<string, mixed>
     */
    private function summary(array $course, string $type, string $id): array
    {
        $item = $course[$this->bucket($type)][$id] ?? null;

        if (! $item) {
            throw new RuntimeException("Missing {$type} courseware item [{$id}].");
        }

        return [
            'id' => $id,
            'type' => $type,
            'title' => $item['title'],
            'description' => $item['description'] ?? null,
        ];
    }

    /**
     * Decode one JSON course file.
     *
     * @return array<string, mixed>
     */
    private function decode(string $path): array
    {
        $decoded = json_decode((string) file_get_contents($path), associative: true);

        if (! is_array($decoded)) {
            throw new RuntimeException("Invalid courseware JSON file [{$path}].");
        }

        return $decoded;
    }

    private function bucket(string $type): string
    {
        return match ($type) {
            'lesson' => 'lessons',
            'homework' => 'homeworks',
            'quiz' => 'quizzes',
            default => throw new RuntimeException("Unsupported courseware type [{$type}]."),
        };
    }
}
