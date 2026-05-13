export type CoursewareItemType = 'lesson' | 'homework' | 'quiz';

export type CoursewareItem = {
    id: string;
    type: CoursewareItemType;
    title: string;
    description?: string | null;
    enabled: boolean;
};

export type CoursewareChapter = {
    id: string;
    title: string;
    description?: string | null;
    course_id: string;
    course_title: string;
    items: CoursewareItem[];
};

export type CoursewareLesson = {
    id: string;
    title: string;
    description?: string | null;
    blocks: Array<
        | { type: 'heading'; text: string }
        | { type: 'paragraph'; text: string }
        | { type: 'example'; title: string; body: string }
    >;
};

export type CoursewareAssessmentPreview = {
    id: string;
    type: 'homework' | 'quiz';
    title: string;
    description?: string | null;
    questionCount: number;
    timeLimitMinutes?: number | null;
};

export type CoursewareQuestion = {
    id: string;
    type: 'numeric' | 'multiple_choice';
    prompt: string;
    options?: string[];
    points: number;
    result?: {
        answer: string | number | null;
        correct: boolean;
        points_earned: number;
    };
    correct_answer?: string | number;
    explanation?: string | null;
};

export type CoursewareAttempt = {
    id: number;
    contentType: 'homework' | 'quiz';
    contentId: string;
    attemptNumber: number;
    status: 'in_progress' | 'submitted';
    score?: number | null;
    maxScore: number;
    startedAt: string;
    submittedAt?: string | null;
    snapshot: {
        title: string;
        description?: string | null;
        time_limit_minutes?: number | null;
        questions: CoursewareQuestion[];
    };
};
