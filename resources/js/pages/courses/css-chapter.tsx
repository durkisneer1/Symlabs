import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, ListTree } from 'lucide-react';
import ChapterSectionNav, {
  scrollToChapterAnchor,
  sectionId,
} from '@/components/chapter-section-nav';
import CourseContentBlockRenderer from '@/components/course-content-block';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { cssCourse, findCssChapter } from '@/data/css-course';
import type { Assignment } from '@/types';
import type {
  CourseActivityBlock as CourseActivityContentBlock,
  CourseContentBlock,
} from '@/types/course-content';

type Props = {
  chapterSlug: string;
};

export default function CssChapter({ chapterSlug }: Props) {
  const { currentTeam, currentTeamAssignments } = usePage().props;
  const chapter = findCssChapter(chapterSlug) ?? cssCourse.chapters[0];
  const chapterIndex = cssCourse.chapters.findIndex(
    (candidate) => candidate.slug === chapter.slug,
  );
  const previousChapter = cssCourse.chapters[chapterIndex - 1] ?? null;
  const nextChapter = cssCourse.chapters[chapterIndex + 1] ?? null;
  const navItems = chapter.content.flatMap((block) => navItemsFor(block));
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
    courseSlug: 'css',
  });
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(
    () =>
      assignedChapterReading?.status === 'completed'
        ? new Set(completableActivities)
        : new Set(),
  );
  const [chapterNavOpen, setChapterNavOpen] = useState(false);
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
      currentTeam?.role === 'student' &&
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
        course_slug: 'css',
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

    window.localStorage.setItem('symlabs:last-css-chapter', chapter.slug);
    document.cookie = `symlabs_last_css_chapter=${chapter.slug}; path=/; max-age=31536000; samesite=lax`;
  }, [chapter.slug]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      scrollToChapterAnchor();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [chapter.slug]);

  return (
    <>
      <Head title={`${chapter.title} | CSS`} />

      <main className="toy-cyan mx-auto grid w-full max-w-3xl gap-8 px-0 py-8 sm:px-4 lg:py-10">
        <article className="min-w-0 space-y-8">
          <div className="space-y-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/courses/css">
                <ArrowLeft /> CSS Course
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
                  id={blockId(block)}
                  codeLanguage="css"
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
                <Link href={`/courses/css/${previousChapter.slug}`}>
                  <ArrowLeft /> {previousChapter.title}
                </Link>
              </Button>
            ) : (
              <span />
            )}
            {nextChapter ? (
              <Button asChild>
                <Link href={`/courses/css/${nextChapter.slug}`}>
                  {nextChapter.title} <ArrowRight />
                </Link>
              </Button>
            ) : null}
          </nav>
        </article>
      </main>

      <Drawer open={chapterNavOpen} onOpenChange={setChapterNavOpen}>
        <DrawerTrigger asChild>
          <Button
            className="fixed top-28 right-3 z-40 shadow-lg"
            size="sm"
            variant="outline"
          >
            <ListTree className="size-4" aria-hidden="true" />
            Contents
          </Button>
        </DrawerTrigger>
        <DrawerContent className="toy-cyan">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Chapter contents</DrawerTitle>
            <DrawerDescription>
              Links to sections, images, and activities in this chapter.
            </DrawerDescription>
          </DrawerHeader>
          <ChapterSectionNav
            items={navItems}
            onNavigate={() => setChapterNavOpen(false)}
            progress={chapterProgress}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}

function navItemsFor(block: CourseContentBlock) {
  const item = {
    id: blockId(block),
    title: blockTitle(block),
    depth: blockDepth(block),
    kind: block.type,
  };

  if (block.type !== 'section') {
    return [item];
  }

  return [
    item,
    ...(block.subheadings ?? []).map((subheading) => ({
      id: subheading.id,
      title: subheading.title,
      depth: subheading.depth,
      kind: 'section' as const,
    })),
  ];
}

function blockDepth(block: CourseContentBlock) {
  if (block.type === 'activity') {
    return block.activity.type === 'recap' ? 0 : 1;
  }

  return block.type === 'image' ? 1 : 0;
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
