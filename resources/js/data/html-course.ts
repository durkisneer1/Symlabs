import { htmlActivities, htmlImages } from '@/data/html-activities';
import { parseCourseChapterMarkdown } from '@/lib/course-markdown';
import type { CourseChapter } from '@/types/course-content';

export type HtmlChapter = CourseChapter;

const chapterSources = import.meta.glob<string>(
  '../content/courses/html/*.md',
  {
    query: '?raw',
    import: 'default',
    eager: true,
  },
) as Record<string, string>;

export const htmlCourse = {
  title: 'HTML 5',
  description:
    'Learn the structure of web pages: elements, attributes, semantic markup, forms, and accessible document flow.',
  chapters: Object.entries(chapterSources)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, source]) =>
      parseCourseChapterMarkdown({
        source,
        activities: htmlActivities,
        images: htmlImages,
      }),
    ) satisfies HtmlChapter[],
};

export function findHtmlChapter(slug: string) {
  return htmlCourse.chapters.find((chapter) => chapter.slug === slug);
}
