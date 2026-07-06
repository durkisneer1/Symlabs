import type { CourseActivity } from '@/types/course-activities';
import type { CourseImageBlock } from '@/types/course-content';

export const htmlActivities = {
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
        question: 'What are HTTP, TCP or UDP, IP, and network hardware each doing?',
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
} satisfies Record<string, CourseActivity>;

export const htmlImages = {
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
