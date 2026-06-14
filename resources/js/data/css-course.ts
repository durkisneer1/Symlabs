import { cssActivities, cssImages } from '@/data/css-activities';
import { parseCourseChapterMarkdown } from '@/lib/course-markdown';
import type { CourseChapter } from '@/types/course-content';

export type CssChapter = CourseChapter;

const chapterSources = import.meta.glob<string>('../content/courses/css/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const cssCourse = {
  title: 'CSS',
  description:
    'Learn how stylesheets control color, spacing, typography, layout, motion, and reusable visual systems across web pages.',
  chapters: Object.entries(chapterSources)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, source]) =>
      parseCourseChapterMarkdown({
        source,
        activities: cssActivities,
        images: cssImages,
      }),
    ) satisfies CssChapter[],
};

export function findCssChapter(slug: string) {
  return cssCourse.chapters.find((chapter) => chapter.slug === slug);
}
