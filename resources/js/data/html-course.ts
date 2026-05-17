export type HtmlChapter = {
  number: number;
  slug: string;
  title: string;
  summary: string;
  duration: string;
  sections: Array<{
    title: string;
    body: string[];
    example?: string;
  }>;
  activity: {
    prompt: string;
    choices: string[];
    answer: string;
    explanation: string;
  };
};

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
      sections: [
        {
          title: 'HTML Describes Meaning',
          body: [
            'HTML is the language browsers use to understand the structure and meaning of a web page.',
            'It does not decide the visual design by itself. A paragraph, heading, link, and image all communicate what a piece of content is, then CSS can decide how that content looks.',
          ],
        },
        {
          title: 'Tags Create Elements',
          body: [
            'A tag is the markup written between angle brackets. Most elements use an opening tag, content, and a closing tag.',
            'The full element includes the tags and everything between them.',
          ],
          example: '<p>This is a paragraph element.</p>',
        },
        {
          title: 'Attributes Add Detail',
          body: [
            'Attributes live inside an opening tag. They provide extra information about an element.',
            'For example, a link needs an href attribute so the browser knows where the link should go.',
          ],
          example: '<a href="/courses/html">Study HTML</a>',
        },
        {
          title: 'Nesting Builds Structure',
          body: [
            'HTML elements can contain other elements. This is called nesting.',
            'Good nesting makes the page easier for browsers, assistive technology, search engines, and future developers to understand.',
          ],
          example: '<article>\n  <h2>Course Update</h2>\n  <p>Chapter one is ready.</p>\n</article>',
        },
      ],
      activity: {
        prompt: 'In `<p>Hello</p>`, what is `Hello`?',
        choices: ['A tag', 'Text content', 'An attribute', 'A file path'],
        answer: 'Text content',
        explanation:
          'The `<p>` and `</p>` pieces are tags. The word between them is the text content of the paragraph element.',
      },
    },
    {
      number: 2,
      slug: 'document-structure',
      title: 'Document Structure',
      summary:
        'Learn the required pieces of an HTML document, including doctype, html, head, title, and body.',
      duration: '30 min',
      sections: [],
      activity: {
        prompt: '',
        choices: [],
        answer: '',
        explanation: '',
      },
    },
    {
      number: 3,
      slug: 'semantic-html',
      title: 'Semantic HTML',
      summary:
        'Use elements like header, main, nav, article, section, and footer to describe page regions clearly.',
      duration: '35 min',
      sections: [],
      activity: {
        prompt: '',
        choices: [],
        answer: '',
        explanation: '',
      },
    },
  ] satisfies HtmlChapter[],
};

export function findHtmlChapter(slug: string) {
  return htmlCourse.chapters.find((chapter) => chapter.slug === slug);
}
