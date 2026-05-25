import type { CourseActivity } from '@/types/course-activities';
import type { CourseImageBlock } from '@/types/course-content';

export const htmlActivities = {
  'make-markup-change-the-box': {
    type: 'html-playground',
    title: 'Make Markup Change The Box',
    prompt:
      'Edit the line so the preview has a paragraph with emphasized text inside it.',
    starter: '<p>Hello HTML</p>',
    answerIncludes: ['<p>', '<em>', '</em>'],
    success:
      'Nice. The browser parsed your markup and changed the preview structure.',
  },
  'tiny-local-project': {
    type: 'file-tree',
    title: 'A Tiny Local Project',
    description:
      'Even a simple HTML project has a shape. The browser opens the HTML file, and the HTML can point to nearby assets.',
    root: {
      name: 'my-first-site',
      kind: 'folder',
      children: [
        {
          name: 'index.html',
          kind: 'file',
          note: 'the page the browser opens first',
        },
        {
          name: 'images',
          kind: 'folder',
          children: [
            {
              name: 'logo.png',
              kind: 'file',
              note: 'referenced by an <img> tag',
            },
          ],
        },
      ],
    },
  },
  'tiny-layout-challenge': {
    type: 'css-playground',
    title: 'Tiny Layout Challenge',
    prompt:
      'Write one declaration to center the three bubbles horizontally inside the preview box.',
    starter: 'justify-content: ;',
    allowedProperties: ['justify-content', 'align-items', 'gap'],
    target: 'justify-content:center',
    success:
      'That is the Flexbox Froggy idea in miniature: code changes the layout immediately.',
  },
  'qc-tags': {
    type: 'quick-check',
    title: 'Quick Check',
    prompt: 'In `<p>Hello</p>`, what is `Hello`?',
    choices: ['A tag', 'Text content', 'An attribute', 'A file path'],
    answer: 'Text content',
    explanation:
      'The `<p>` and `</p>` pieces are tags. The word between them is the text content of the paragraph element.',
  },
  'chapter-rehash': {
    type: 'recap',
    title: 'Chapter Rehash',
    items: [
      {
        question: 'What is a tag?',
        answer:
          'A tag is the markup between angle brackets, like `<p>` or `</p>`.',
      },
      {
        question: 'What is an element?',
        answer:
          'An element is the complete structure: opening tag, content, and usually a closing tag.',
      },
      {
        question: 'What do attributes do?',
        answer:
          'Attributes add details inside the opening tag, like `href` on an `<a>` element.',
      },
    ],
  },
} satisfies Record<string, CourseActivity>;

export const htmlImages = {
  'element-anatomy': {
    title: 'Element Anatomy',
    src: '/images/courses/html/element-anatomy.svg',
    darkSrc: '/images/courses/html/element-anatomy-dark.svg',
    alt: 'A paragraph element split into opening tag, text content, and closing tag.',
    caption:
      'Most beginner HTML bugs come from mixing up the tag pieces with the complete element.',
  },
} satisfies Record<string, Omit<CourseImageBlock, 'type' | 'id'>>;
