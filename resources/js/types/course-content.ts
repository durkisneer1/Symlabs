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
  title: string;
  body: string[];
  example?: string;
};

export type CourseImageBlock = {
  type: 'image';
  title: string;
  src: string;
  darkSrc?: string;
  alt: string;
  caption?: string;
};

export type CourseActivityBlock = {
  type: 'activity';
  activity: CourseActivity;
};
