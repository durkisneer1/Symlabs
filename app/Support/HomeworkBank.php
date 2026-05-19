<?php

namespace App\Support;

class HomeworkBank
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public static function questions(string $courseSlug, ?string $homeworkSlug): array
    {
        return self::all()[$courseSlug][$homeworkSlug] ?? [];
    }

    /**
     * @return array<string, array<string, array<int, array<string, mixed>>>>
     */
    protected static function all(): array
    {
        return [
            'html' => [
                'html-elements-practice' => [
                    [
                        'id' => 'html-elements-tag-vs-content',
                        'type' => 'multiple_choice',
                        'prompt' => 'In <p>Hello</p>, which part is the text content?',
                        'choices' => [
                            ['id' => 'a', 'text' => '<p>'],
                            ['id' => 'b', 'text' => 'Hello'],
                            ['id' => 'c', 'text' => '</p>'],
                            ['id' => 'd', 'text' => 'p'],
                        ],
                        'answer' => 'b',
                    ],
                    [
                        'id' => 'html-elements-emphasis',
                        'type' => 'multiple_choice',
                        'prompt' => 'Which answer correctly emphasizes one word inside a paragraph?',
                        'choices' => [
                            ['id' => 'a', 'text' => '<p>Hello <em>HTML</em></p>'],
                            ['id' => 'b', 'text' => '<p>Hello <em>HTML</p>'],
                            ['id' => 'c', 'text' => '<em><p>Hello HTML</em></p>'],
                            ['id' => 'd', 'text' => '<p>Hello HTML<em></p>'],
                        ],
                        'answer' => 'a',
                    ],
                    [
                        'id' => 'html-elements-short-answer',
                        'type' => 'short_answer',
                        'prompt' => 'Write the opening tag for a paragraph element.',
                        'answer_pattern' => '/^<p>$/i',
                        'answer_text' => '<p>',
                    ],
                ],
                'html-attributes-practice' => [
                    [
                        'id' => 'html-attributes-link',
                        'type' => 'multiple_choice',
                        'prompt' => 'Which attribute gives a link its destination?',
                        'choices' => [
                            ['id' => 'a', 'text' => 'src'],
                            ['id' => 'b', 'text' => 'href'],
                            ['id' => 'c', 'text' => 'alt'],
                            ['id' => 'd', 'text' => 'class'],
                        ],
                        'answer' => 'b',
                    ],
                ],
            ],
            'css' => [
                'css-selector-practice' => [
                    [
                        'id' => 'css-selector-class',
                        'type' => 'multiple_choice',
                        'prompt' => 'Which selector targets elements with class="notice"?',
                        'choices' => [
                            ['id' => 'a', 'text' => 'notice'],
                            ['id' => 'b', 'text' => '.notice'],
                            ['id' => 'c', 'text' => '#notice'],
                            ['id' => 'd', 'text' => '<notice>'],
                        ],
                        'answer' => 'b',
                    ],
                ],
            ],
            'php' => [
                'php-control-flow-practice' => [
                    [
                        'id' => 'php-variable-prefix',
                        'type' => 'short_answer',
                        'prompt' => 'What character starts a PHP variable name?',
                        'answer_pattern' => '/^\$$/',
                        'answer_text' => '$',
                    ],
                ],
            ],
            'mysql' => [
                'mysql-select-practice' => [
                    [
                        'id' => 'mysql-select-keyword',
                        'type' => 'short_answer',
                        'prompt' => 'Which SQL keyword reads rows from a table?',
                        'answer_pattern' => '/^select$/i',
                        'answer_text' => 'SELECT',
                    ],
                ],
            ],
        ];
    }
}
