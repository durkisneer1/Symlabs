import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import ChapterSectionNav, { sectionId } from '@/components/chapter-section-nav';
import CourseContentBlockRenderer from '@/components/course-content-block';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { findPhpChapter, phpCourse } from '@/data/php-course';
import type { Assignment } from '@/types';
import type { CourseContentBlock } from '@/types/course-content';

type Props = {
  chapterSlug: string;
};

export default function PhpChapter({ chapterSlug }: Props) {
  const { currentTeam, currentTeamAssignments } = usePage().props;
  const chapter = findPhpChapter(chapterSlug) ?? phpCourse.chapters[0];
  const navItems = chapter.content.map((block) => navItemFor(block));
  const chapterProgress = buildChapterProgress({
    assignments: currentTeamAssignments,
    chapterSlug: chapter.slug,
    courseSlug: 'php',
    visible:
      currentTeam?.role === 'student' &&
      Boolean(currentTeam) &&
      currentTeam?.semesterActive !== false,
  });

  return (
    <>
      <Head title={`${chapter.title} | PHP`} />

      <main className="toy-purple mx-auto grid w-full max-w-3xl gap-8 px-0 py-8 sm:px-4 lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_280px] lg:py-10">
        <article className="min-w-0 space-y-8">
          <div className="space-y-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/courses/php">
                <ArrowLeft /> PHP Course
              </Link>
            </Button>

            <div className="space-y-3">
              <Badge variant="outline">Chapter {chapter.number}</Badge>
              <h1 className="text-3xl font-semibold tracking-tight">
                {chapter.title}
              </h1>
              <p className="max-w-2xl text-muted-foreground">
                {chapter.summary}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {chapter.content.map((block) => (
              <CourseContentBlockRenderer
                key={contentKey(block)}
                block={block}
                id={blockId(block)}
                codeLanguage="php"
              />
            ))}
          </div>
        </article>

        <aside className="hidden lg:block">
          <ChapterSectionNav items={navItems} progress={chapterProgress} />
        </aside>
      </main>
    </>
  );
}

function navItemFor(block: CourseContentBlock) {
  return {
    id: blockId(block),
    title: blockTitle(block),
    depth: block.type === 'activity' ? 1 : 0,
    kind: block.type,
  };
}

function blockId(block: CourseContentBlock) {
  return block.id ?? sectionId(blockTitle(block));
}

function blockTitle(block: CourseContentBlock) {
  return block.type === 'activity' ? block.activity.title : block.title;
}

function contentKey(block: CourseContentBlock) {
  return block.id ?? `${block.type}-${blockTitle(block)}`;
}

function buildChapterProgress({
  assignments,
  chapterSlug,
  courseSlug,
  visible,
}: {
  assignments: Assignment[];
  chapterSlug: string;
  courseSlug: string;
  visible: boolean;
}) {
  const chapterAssignments = assignments.filter(
    (assignment) =>
      assignment.course_slug === courseSlug &&
      includesChapter(assignment, chapterSlug),
  );
  const completed = chapterAssignments.filter(
    (assignment) => assignment.status === 'completed',
  ).length;

  return {
    visible,
    title: 'Classroom Progress',
    completed,
    total: chapterAssignments.length,
    items: chapterAssignments.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      status: assignment.status,
      due: formatDate(assignment.due_at),
    })),
  };
}

function includesChapter(assignment: Assignment, chapterSlug: string) {
  const chapterSlugs = assignment.settings.chapter_slugs;

  return (
    Array.isArray(chapterSlugs) &&
    chapterSlugs.some((slug) => String(slug) === chapterSlug)
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}
