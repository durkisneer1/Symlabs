export type AssignmentType = 'chapter_reading' | 'homework' | 'quiz';

export type Assignment = {
  id: number;
  type: AssignmentType;
  type_label: string;
  course_slug: string;
  title: string;
  description: string | null;
  settings: Record<string, unknown>;
  actions: Array<{
    label: string;
    href: string;
  }>;
  opens_at: string | null;
  due_at: string | null;
  points: number;
  status: string;
  attempts_used: number;
  attempts_allowed: number;
  grade_visible: boolean;
  score: string | number | null;
  max_score: string | number | null;
  completed_at: string | null;
  assignable: {
    id: number;
    title: string;
  } | null;
};
