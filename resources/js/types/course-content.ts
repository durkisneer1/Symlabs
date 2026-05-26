import type { CourseActivity } from '@/types/course-activities';

export type CourseChapter = {
  number: number;
  slug: string;
  title: string;
  summary: string;
  duration: string;
  content: CourseContentBlock[];
};

export type CourseContentBlock =
  | CourseSectionBlock
  | CourseImageBlock
  | CourseActivityBlock;

export type CourseSectionBlock = {
  type: 'section';
  id?: string;
  title: string;
  markdown?: string;
  body?: string[];
  example?: string;
  examples?: CourseCodeExample[];
};

export type CourseImageBlock = {
  type: 'image';
  id?: string;
  title: string;
  src: string;
  darkSrc?: string;
  alt: string;
};

export type CourseActivityBlock = {
  type: 'activity';
  id?: string;
  activity: CourseActivity;
};

export type CourseCodeExample = {
  code: string;
  language?: 'html' | 'php' | 'markup';
};
