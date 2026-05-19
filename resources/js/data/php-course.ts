import type { CourseChapter } from '@/types/course-content';

export type PhpChapter = CourseChapter;

export const phpCourse = {
  title: 'PHP',
  description:
    'Learn procedural PHP by tracing values, controlling flow, and building small server-side programs.',
  chapters: [
    {
      number: 1,
      slug: 'variables-and-flow',
      title: 'Variables and Flow',
      summary:
        'Trace how variables change as a PHP script runs from top to bottom.',
      duration: '20 min',
      content: [
        {
          type: 'section',
          title: 'Procedural Code Runs In Order',
          body: [
            'A procedural PHP script starts at the top and moves downward one statement at a time.',
            'That makes tracing a powerful habit: read the line, update memory, then predict the output.',
          ],
          example:
            "<?php\n$total = 0;\n$total = $total + 5;\necho $total;\n?>",
        },
        {
          type: 'activity',
          activity: {
            type: 'code-flow',
            title: 'Trace The Script',
            description:
              'Step through each line and watch memory change before the script prints output.',
            steps: [
              {
                label: 'Start total',
                code: '<?php\n$total = 0;',
                note: 'PHP creates a variable named $total and stores 0.',
                memory: [{ name: '$total', value: '0' }],
              },
              {
                label: 'Add five',
                code: '$total = $total + 5;',
                note: 'The right side reads the old value first, then stores the new value back into $total.',
                memory: [{ name: '$total', value: '5' }],
              },
              {
                label: 'Print it',
                code: 'echo $total;\n?>',
                note: 'echo sends the current value to the response.',
                memory: [{ name: '$total', value: '5' }],
                output: '5',
              },
            ],
          },
        },
        {
          type: 'section',
          title: 'Variables Remember Values',
          body: [
            'A variable is a named slot in memory. In PHP, variable names begin with a dollar sign.',
            'When a later line assigns a new value, the old value is replaced.',
          ],
          example: "<?php\n$label = 'HTML';\n$label = 'PHP';\necho $label;\n?>",
        },
        {
          type: 'activity',
          activity: {
            type: 'quick-check',
            title: 'Predict The Output',
            prompt: 'After `$count = $count + 2;`, what changes?',
            choices: [
              'The variable name changes',
              'The old value is replaced',
              'PHP creates an HTML tag',
              'Nothing can change',
            ],
            answer: 'The old value is replaced',
            explanation:
              'Assignment stores a value. The expression reads the old `$count`, adds 2, then stores the result back into `$count`.',
          },
        },
        {
          type: 'activity',
          activity: {
            type: 'recap',
            title: 'Chapter Rehash',
            items: [
              {
                question: 'How does procedural code run?',
                answer:
                  'Usually top to bottom, one statement at a time, unless a control structure changes the path.',
              },
              {
                question: 'What is a variable?',
                answer:
                  'A named memory slot. In PHP, variables begin with `$`, like `$total`.',
              },
            ],
          },
        },
      ],
    },
  ] satisfies PhpChapter[],
};

export function findPhpChapter(slug: string) {
  return phpCourse.chapters.find((chapter) => chapter.slug === slug);
}
