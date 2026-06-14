import type { CourseActivity } from '@/types/course-activities';
import type { CourseImageBlock } from '@/types/course-content';

export const cssActivities = {} satisfies Record<string, CourseActivity>;

export const cssImages = {} satisfies Record<
  string,
  Omit<CourseImageBlock, 'type' | 'id'>
>;
