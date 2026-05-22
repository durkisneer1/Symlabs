import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ChapterSectionNav, { sectionId } from '@/components/chapter-section-nav';
import CourseContentBlockRenderer from '@/components/course-content-block';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { findHtmlChapter, htmlCourse } from '@/data/html-course';
import type { Assignment } from '@/types';
import type {
  CourseActivityBlock as CourseActivityContentBlock,
  CourseContentBlock,
} from '@/types/course-content';

type Props = {
  chapterSlug: string;
};

export default function HtmlChapter({ chapterSlug }: Props) {
  const { auth, currentTeam, currentTeamAssignments } = usePage().props;
  const chapter = findHtmlChapter(chapterSlug) ?? htmlCourse.chapters[0];
  const chapterIndex = htmlCourse.chapters.findIndex(
    (candidate) => candidate.slug === chapter.slug,
  );
  const previousChapter = htmlCourse.chapters[chapterIndex - 1] ?? null;
  const nextChapter = htmlCourse.chapters[chapterIndex + 1] ?? null;
  const navItems = chapter.content.map((block) => navItemFor(block));
  const completableActivities = useMemo(
    () =>
      (chapter.content as CourseContentBlock[])
        .filter(isCompletableActivityBlock)
        .map((block) => activityId(block.activity.title)),
    [chapter.content],
  );
  const assignedChapterReading = findAssignedChapterReading({
    assignments: currentTeamAssignments,
    chapterSlug: chapter.slug,
    courseSlug: 'html',
  });
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(
    () =>
      assignedChapterReading?.status === 'completed'
        ? new Set(completableActivities)
        : new Set(),
  );
  const submittedCompletion = useRef(
    assignedChapterReading?.status === 'completed',
  );
  const completeActivity = useCallback((id: string) => {
    setCompletedActivities((current) => {
      if (current.has(id)) {
        return current;
      }

      return new Set([...current, id]);
    });
  }, []);
  const chapterProgress = buildChapterProgress({
    completedActivities,
    totalActivities: completableActivities.length,
    visible:
      auth.user?.role === 'student' &&
      Boolean(currentTeam) &&
      currentTeam?.semesterActive !== false &&
      Boolean(assignedChapterReading),
  });

  useEffect(() => {
    setCompletedActivities(
      assignedChapterReading?.status === 'completed'
        ? new Set(completableActivities)
        : new Set(),
    );
    submittedCompletion.current =
      assignedChapterReading?.status === 'completed';
  }, [
    assignedChapterReading?.id,
    assignedChapterReading?.status,
    completableActivities,
  ]);

  useEffect(() => {
    if (
      !currentTeam ||
      !assignedChapterReading ||
      submittedCompletion.current ||
      completableActivities.length === 0 ||
      completedActivities.size < completableActivities.length
    ) {
      return;
    }

    submittedCompletion.current = true;
    router.post(
      `/${currentTeam.slug}/chapter-progress/complete`,
      {
        assignment_id: assignedChapterReading.id,
        course_slug: 'html',
        chapter_slug: chapter.slug,
        activity_count: completableActivities.length,
      },
      {
        preserveScroll: true,
      },
    );
  }, [
    assignedChapterReading,
    chapter.slug,
    completableActivities.length,
    completedActivities.size,
    currentTeam,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem('symlabs:last-html-chapter', chapter.slug);
    document.cookie = `symlabs_last_html_chapter=${chapter.slug}; path=/; max-age=31536000; samesite=lax`;
  }, [chapter.slug]);

  return (
    <>
      <Head title={`${chapter.title} | HTML`} />

      <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="space-y-8">
          <div className="space-y-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/courses/html">
                <ArrowLeft /> HTML Course
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

          {chapter.content.length > 0 ? (
            <div className="space-y-6">
              {chapter.content.map((block) => (
                <CourseContentBlockRenderer
                  key={contentKey(block)}
                  block={block}
                  id={sectionId(blockTitle(block))}
                  codeLanguage="html"
                  onActivityComplete={
                    isCompletableActivityBlock(block)
                      ? () => completeActivity(activityId(block.activity.title))
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  This chapter has a placeholder in the course outline, but its
                  lesson content is not written yet.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <Separator />

          <nav className="flex flex-wrap justify-between gap-2">
            {previousChapter ? (
              <Button asChild variant="outline">
                <Link href={`/courses/html/${previousChapter.slug}`}>
                  <ArrowLeft /> {previousChapter.title}
                </Link>
              </Button>
            ) : (
              <span />
            )}
            {nextChapter ? (
              <Button asChild>
                <Link href={`/courses/html/${nextChapter.slug}`}>
                  {nextChapter.title} <ArrowRight />
                </Link>
              </Button>
            ) : null}
          </nav>
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
    id: sectionId(blockTitle(block)),
    title: blockTitle(block),
    depth: block.type === 'activity' ? 1 : 0,
  };
}

function blockTitle(block: CourseContentBlock) {
  return block.type === 'activity' ? block.activity.title : block.title;
}

function contentKey(block: CourseContentBlock) {
  return `${block.type}-${blockTitle(block)}`;
}

function buildChapterProgress({
  completedActivities,
  totalActivities,
  visible,
}: {
  completedActivities: Set<string>;
  totalActivities: number;
  visible: boolean;
}) {
  return {
    visible,
    title: 'Classroom Progress',
    completed: completedActivities.size,
    total: totalActivities,
  };
}

function findAssignedChapterReading({
  assignments,
  chapterSlug,
  courseSlug,
}: {
  assignments: Assignment[];
  chapterSlug: string;
  courseSlug: string;
}) {
  return assignments.find(
    (assignment) =>
      assignment.type === 'chapter_reading' &&
      assignment.course_slug === courseSlug &&
      includesChapter(assignment, chapterSlug),
  );
}

function includesChapter(assignment: Assignment, chapterSlug: string) {
  const chapterSlugs = assignment.settings.chapter_slugs;

  return (
    Array.isArray(chapterSlugs) &&
    chapterSlugs.some((slug) => String(slug) === chapterSlug)
  );
}

function isCompletableActivityBlock(
  block: CourseContentBlock,
): block is CourseActivityContentBlock {
  return (
    block.type === 'activity' &&
    ['html-playground', 'css-playground', 'quick-check'].includes(
      block.activity.type,
    )
  );
}

function activityId(title: string) {
  return sectionId(title);
}
