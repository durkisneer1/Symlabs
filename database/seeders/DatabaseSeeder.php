<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Quizzes\Quiz;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $questions = [
            [
                'topic' => 'elements',
                'difficulty' => 'easy',
                'prompt' => 'What does HTML primarily describe?',
                'position' => 0,
                'options' => [
                    ['text' => 'The structure and meaning of webpage content', 'is_correct' => true, 'position' => 0],
                    ['text' => 'The visual style of a webpage', 'is_correct' => false, 'position' => 1],
                    ['text' => 'Server database queries', 'is_correct' => false, 'position' => 2],
                    ['text' => 'Browser memory usage', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'elements',
                'difficulty' => 'easy',
                'prompt' => 'Which tag creates a paragraph?',
                'position' => 1,
                'options' => [
                    ['text' => '<p>', 'is_correct' => true, 'position' => 0],
                    ['text' => '<h1>', 'is_correct' => false, 'position' => 1],
                    ['text' => '<a>', 'is_correct' => false, 'position' => 2],
                    ['text' => '<ul>', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'elements',
                'difficulty' => 'easy',
                'prompt' => 'Which element creates the most important heading on a page?',
                'position' => 2,
                'options' => [
                    ['text' => '<h1>', 'is_correct' => true, 'position' => 0],
                    ['text' => '<head>', 'is_correct' => false, 'position' => 1],
                    ['text' => '<title>', 'is_correct' => false, 'position' => 2],
                    ['text' => '<strong>', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'elements',
                'difficulty' => 'easy',
                'prompt' => 'Which element represents a list item?',
                'position' => 3,
                'options' => [
                    ['text' => '<li>', 'is_correct' => true, 'position' => 0],
                    ['text' => '<ul>', 'is_correct' => false, 'position' => 1],
                    ['text' => '<ol>', 'is_correct' => false, 'position' => 2],
                    ['text' => '<item>', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'elements',
                'difficulty' => 'medium',
                'prompt' => 'In <p>Hello</p>, what is Hello?',
                'position' => 4,
                'options' => [
                    ['text' => 'Text content', 'is_correct' => true, 'position' => 0],
                    ['text' => 'An attribute', 'is_correct' => false, 'position' => 1],
                    ['text' => 'A tag name', 'is_correct' => false, 'position' => 2],
                    ['text' => 'A document type', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'elements',
                'difficulty' => 'medium',
                'prompt' => 'Which element is void and does not need a closing tag?',
                'position' => 5,
                'options' => [
                    ['text' => '<img>', 'is_correct' => true, 'position' => 0],
                    ['text' => '<p>', 'is_correct' => false, 'position' => 1],
                    ['text' => '<a>', 'is_correct' => false, 'position' => 2],
                    ['text' => '<section>', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'attributes',
                'difficulty' => 'easy',
                'prompt' => 'Which attribute gives a link its destination?',
                'position' => 6,
                'options' => [
                    ['text' => 'href', 'is_correct' => true, 'position' => 0],
                    ['text' => 'src', 'is_correct' => false, 'position' => 1],
                    ['text' => 'alt', 'is_correct' => false, 'position' => 2],
                    ['text' => 'class', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'attributes',
                'difficulty' => 'easy',
                'prompt' => 'Which attribute points an image element to an image file?',
                'position' => 7,
                'options' => [
                    ['text' => 'src', 'is_correct' => true, 'position' => 0],
                    ['text' => 'href', 'is_correct' => false, 'position' => 1],
                    ['text' => 'title', 'is_correct' => false, 'position' => 2],
                    ['text' => 'for', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'attributes',
                'difficulty' => 'easy',
                'prompt' => 'Which attribute provides replacement text for an image?',
                'position' => 8,
                'options' => [
                    ['text' => 'alt', 'is_correct' => true, 'position' => 0],
                    ['text' => 'src', 'is_correct' => false, 'position' => 1],
                    ['text' => 'href', 'is_correct' => false, 'position' => 2],
                    ['text' => 'id', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'attributes',
                'difficulty' => 'medium',
                'prompt' => 'Which example shows a valid attribute on an opening tag?',
                'position' => 9,
                'options' => [
                    ['text' => '<a href="/home">Home</a>', 'is_correct' => true, 'position' => 0],
                    ['text' => '<a>/home href Home</a>', 'is_correct' => false, 'position' => 1],
                    ['text' => '<href a="/home">Home</href>', 'is_correct' => false, 'position' => 2],
                    ['text' => '<a><href>/home</href>Home</a>', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'attributes',
                'difficulty' => 'medium',
                'prompt' => 'What should useful alt text describe?',
                'position' => 10,
                'options' => [
                    ['text' => 'The meaningful content or function of the image', 'is_correct' => true, 'position' => 0],
                    ['text' => 'The image file extension only', 'is_correct' => false, 'position' => 1],
                    ['text' => 'The image width in pixels', 'is_correct' => false, 'position' => 2],
                    ['text' => 'The CSS color of nearby text', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'document',
                'difficulty' => 'easy',
                'prompt' => 'Which declaration tells the browser to use modern HTML parsing?',
                'position' => 11,
                'options' => [
                    ['text' => '<!doctype html>', 'is_correct' => true, 'position' => 0],
                    ['text' => '<html5>', 'is_correct' => false, 'position' => 1],
                    ['text' => '<document html>', 'is_correct' => false, 'position' => 2],
                    ['text' => '<?html version="5">', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'document',
                'difficulty' => 'easy',
                'prompt' => 'Which element contains the visible page content?',
                'position' => 12,
                'options' => [
                    ['text' => '<body>', 'is_correct' => true, 'position' => 0],
                    ['text' => '<head>', 'is_correct' => false, 'position' => 1],
                    ['text' => '<title>', 'is_correct' => false, 'position' => 2],
                    ['text' => '<meta>', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'document',
                'difficulty' => 'easy',
                'prompt' => 'Which element contains metadata such as the page title and character set?',
                'position' => 13,
                'options' => [
                    ['text' => '<head>', 'is_correct' => true, 'position' => 0],
                    ['text' => '<body>', 'is_correct' => false, 'position' => 1],
                    ['text' => '<main>', 'is_correct' => false, 'position' => 2],
                    ['text' => '<footer>', 'is_correct' => false, 'position' => 3],
                ],
            ],
            [
                'topic' => 'document',
                'difficulty' => 'medium',
                'prompt' => 'Which element sets the text shown in the browser tab?',
                'position' => 14,
                'options' => [
                    ['text' => '<title>', 'is_correct' => true, 'position' => 0],
                    ['text' => '<h1>', 'is_correct' => false, 'position' => 1],
                    ['text' => '<header>', 'is_correct' => false, 'position' => 2],
                    ['text' => '<caption>', 'is_correct' => false, 'position' => 3],
                ],
            ],
        ];

        // User::factory(10)->create();

        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@ink.edu',
                'role' => UserRole::Admin,
            ],
            [
                'name' => 'Teacher User',
                'email' => 'teacher@ink.edu',
                'role' => UserRole::Teacher,
            ],
            [
                'name' => 'Student User',
                'email' => 'student@ink.edu',
                'role' => UserRole::Student,
            ],
        ];

        foreach ($users as $user) {
            User::factory()->create($user);
        }

        $quiz = Quiz::create([
            'course_slug' => 'html',
            'slug' => 'markup-lang-quiz',
            'title' => 'Elements and Tags Quiz',
            'description' => 'Ten questions selected from a larger bank. Questions are selected and graded on the server.',
            'question_count' => 1,
            'time_limit_minutes' => 15,
        ]);

        foreach ($questions as $questionData) {
            $options = $questionData['options'];
            unset($questionData['options']);

            $question = $quiz->questions()->create([
                'course_slug' => 'html',
                'chapter_slug' => 'elements-and-tags',
                'type' => 'multiple_choice',
                'answer_pattern' => null,
                ...$questionData,
            ]);

            $question->options()->createMany($options);
        }
    }
}
