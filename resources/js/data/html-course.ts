import type { CourseChapter } from '@/types/course-content';

export type HtmlChapter = CourseChapter;

export const htmlCourse = {
  title: 'HTML',
  description:
    'Learn the structure of web pages: elements, attributes, semantic markup, forms, and accessible document flow.',
  chapters: [
    {
      number: 1,
      slug: 'elements-and-tags',
      title: 'Elements and Tags',
      summary:
        'Start with the core vocabulary of HTML: tags, elements, attributes, nesting, and text content.',
      duration: '25 min',
      content: [
        {
          type: 'section',
          title: 'HTML Describes Meaning',
          body: [
            'HTML is the language browsers use to understand the structure and meaning of a web page.',
            'It does not decide the visual design by itself. A paragraph, heading, link, and image all communicate what a piece of content is, then CSS can decide how that content looks.',
          ],
        },
        {
          type: 'section',
          title: 'Tags Create Elements',
          body: [
            'A tag is the markup written between angle brackets. Most elements use an opening tag, content, and a closing tag.',
            'The full element includes the tags and everything between them.',
          ],
          example: '<p>This is a paragraph element.</p>',
        },
        {
          type: 'image',
          title: 'Element Anatomy',
          src: '/images/courses/html/element-anatomy.svg',
          alt: 'A paragraph element split into opening tag, text content, and closing tag.',
          caption:
            'Most beginner HTML bugs come from mixing up the tag pieces with the complete element.',
        },
        {
          type: 'activity',
          activity: {
            type: 'html-playground',
            title: 'Make Markup Change The Box',
            prompt:
              'Edit the line so the preview has a paragraph with emphasized text inside it.',
            starter: '<p>Hello HTML</p>',
            answerIncludes: ['<p>', '<em>', '</em>'],
            success:
              'Nice. The browser parsed your markup and changed the preview structure.',
          },
        },
        {
          type: 'section',
          title: 'Attributes Add Detail',
          body: [
            'Attributes live inside an opening tag. They provide extra information about an element.',
            'For example, a link needs an href attribute so the browser knows where the link should go.',
          ],
          example: '<a href="/courses/html">Study HTML</a>',
        },
        {
          type: 'section',
          title: 'Nesting Builds Structure',
          body: [
            'HTML elements can contain other elements. This is called nesting.',
            'Good nesting makes the page easier for browsers, assistive technology, search engines, and future developers to understand.',
          ],
          example: '<article>\n  <h2>Course Update</h2>\n  <p>Chapter one is ready.</p>\n</article>',
        },
        {
          type: 'activity',
          activity: {
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
        },
        {
          type: 'activity',
          activity: {
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
        },
        {
          type: 'activity',
          activity: {
            type: 'quick-check',
            title: 'Quick Check',
            prompt: 'In `<p>Hello</p>`, what is `Hello`?',
            choices: ['A tag', 'Text content', 'An attribute', 'A file path'],
            answer: 'Text content',
            explanation:
              'The `<p>` and `</p>` pieces are tags. The word between them is the text content of the paragraph element.',
          },
        },
        {
          type: 'activity',
          activity: {
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
        },
      ],
    },
  ] satisfies HtmlChapter[],
};

export function findHtmlChapter(slug: string) {
  return htmlCourse.chapters.find((chapter) => chapter.slug === slug);
}
