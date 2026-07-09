import type { CourseActivity } from '@/types/course-activities';
import type { CourseImageBlock } from '@/types/course-content';

export const htmlActivities = {
  'make-the-nested-text-bold': {
    type: 'html-playground',
    title: 'Make The Nested Text Bold',
    prompt:
      'Change the italic element into a bold element by replacing both `i` tags with `b` tags.',
    starter: `<p>
  The tiny robot whispered
  <i>beep boop</i>
  before rolling away.
</p>`,
    answerIncludes: ['<b>', '</b>'],
    answerExcludes: ['<i>', '</i>'],
    success:
      'Nice. You changed the nested element from italic formatting to bold formatting.',
  },
  'first-local-html-project': {
    type: 'file-tree',
    title: 'First Local HTML Project',
    description:
      'A tiny local website can start with one project folder and one HTML file inside it.',
    root: {
      name: 'my-first-site',
      kind: 'folder',
      note: 'The project folder',
      children: [
        {
          name: 'index.html',
          kind: 'file',
          note: 'The first page the browser opens',
        },
      ],
    },
  },
  'intro-to-web-recap': {
    type: 'recap',
    title: 'Intro To Web Recap',
    items: [
      {
        question: 'Why was the URL such a useful idea?',
        answer:
          'It gave the web one consistent format for pointing to resources, even though older internet systems used different ways to find things.',
      },
      {
        question:
          'What are HTTP, TCP or UDP, IP, and network hardware each doing?',
        answer:
          'HTTP describes the request, TCP or UDP describes the delivery behavior, IP helps route packets, and network hardware moves the actual signals.',
      },
      {
        question: 'How are domain names, DNS, and IP addresses connected?',
        answer:
          'A domain name is the readable name, DNS looks up where that name points, and an IP address is the kind of address computers use to contact the destination.',
      },
      {
        question: 'What is HTML?',
        answer:
          'HTML is the markup language used to structure webpage content, including text and links to other resources.',
      },
    ],
  },
  'elements-and-tags-recap': {
    type: 'recap',
    title: 'Elements And Tags Recap',
    items: [
      {
        question: 'What is a tag?',
        answer:
          'A tag is an individual piece of markup inside angle brackets, like `<p>` or `</p>`.',
      },
      {
        question: 'What is an element?',
        answer:
          'An element is the complete structure, usually made from an opening tag, content, and a closing tag.',
      },
      {
        question:
          'What does it mean for one element to be nested inside another?',
        answer:
          'It means one element lives inside another element, making it a child of the outer parent element.',
      },
      {
        question: 'What are sibling elements?',
        answer:
          'Sibling elements sit next to each other at the same level in the HTML structure.',
      },
      {
        question: 'What is the DOM?',
        answer:
          'The DOM is the Document Object Model: a tree-like model of the elements in an HTML document.',
      },
    ],
  },
} satisfies Record<string, CourseActivity>;

export const htmlImages = {
  'blank-vscode-project': {
    title: 'Blank VS Code Project',
    src: '/images/courses/html/ch3/blank-vsc.png',
    darkSrc: '/images/courses/html/ch3/blank-vsc-dark.png',
    alt: 'A blank VS Code window with the my-first-site project folder open.',
  },
  'element-anatomy': {
    title: 'Element Anatomy',
    src: '/images/courses/html/element-anatomy.svg',
    darkSrc: '/images/courses/html/element-anatomy-dark.svg',
    alt: 'A paragraph element split into opening tag, text content, and closing tag.',
  },
  'url-anatomy': {
    title: 'URL Anatomy',
    src: '/images/courses/html/url-anatomy.svg',
    darkSrc: '/images/courses/html/url-anatomy-dark.svg',
    alt: 'A URL split into its scheme, domain name, and path.',
  },
} satisfies Record<string, Omit<CourseImageBlock, 'type' | 'id'>>;
