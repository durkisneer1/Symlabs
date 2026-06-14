import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Clock3, MapIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cssCourse } from '@/data/css-course';
import type { CssChapter } from '@/data/css-course';

const firstChapter = cssCourse.chapters[0];
const mapModules = [
  {
    title: 'Style Foundations',
    description: 'How stylesheets select elements and apply visual rules.',
    slugs: [
      'styling-web-pages',
      'selectors',
      'combinators-and-pattern-matching',
      'properties',
      'custom-properties',
    ],
  },
  {
    title: 'Text and Spacing',
    description:
      'The typography and box-model tools that shape readable pages.',
    slugs: ['text-formatting', 'the-box-model'],
  },
  {
    title: 'Layout Systems',
    description: 'Modern CSS tools for arranging page content.',
    slugs: ['flexbox', 'grids', 'positioning-elements'],
  },
  {
    title: 'Polish and Forms',
    description: 'Effects, motion, and form styles that improve the interface.',
    slugs: ['special-effects', 'animation', 'styling-forms'],
  },
];

export default function CssCourse() {
  const [lastChapterSlug, setLastChapterSlug] = useState<string | null>(null);

  useEffect(() => {
    setLastChapterSlug(readLastChapterSlug());
  }, []);

  const lastChapter = cssCourse.chapters.find(
    (chapter) => chapter.slug === lastChapterSlug,
  );
  const mapSections = courseModules();

  return (
    <>
      <Head title="CSS Course" />

      <main className="toy-cyan mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-12">
        <section className="toy-surface toy-cyan relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-none px-4 py-10 sm:px-6 lg:py-14">
          <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="space-y-5">
              <div className="space-y-3">
                <Badge variant="outline">Course</Badge>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {cssCourse.title}
                </h1>
                <p className="max-w-2xl text-base/relaxed text-foreground/75">
                  {cssCourse.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {firstChapter ? (
                  <Button asChild>
                    <Link href={`/courses/css/${firstChapter.slug}`}>
                      Start Learning <ArrowRight />
                    </Link>
                  </Button>
                ) : null}
                {lastChapter ? (
                  <Button asChild variant="outline">
                    <Link href={`/courses/css/${lastChapter.slug}`}>
                      Continue: {lastChapter.title}
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <div
              className="relative hidden min-h-64 overflow-hidden border bg-background/70 shadow-sm ring-1 ring-foreground/10 lg:block"
              aria-hidden="true"
            >
              <div className="flex h-8 items-center gap-1.5 border-b bg-muted/70 px-3">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-yellow-400" />
                <span className="size-2.5 rounded-full bg-green-400" />
              </div>
              <div className="grid min-h-56 grid-cols-[9.5rem_1fr]">
                <div className="space-y-3 border-r bg-muted/35 p-4 font-mono text-[0.7rem] leading-5 text-foreground/70">
                  <p>
                    <span className="text-[color-mix(in_oklch,var(--toy-accent)_72%,black)]">
                      .card
                    </span>{' '}
                    {'{'}
                  </p>
                  <p className="pl-3">display: grid;</p>
                  <p className="pl-3">gap: 1rem;</p>
                  <p className="pl-3">padding: 1.5rem;</p>
                  <p className="pl-3">border-radius: .75rem;</p>
                  <p>{'}'}</p>
                </div>
                <div className="grid content-center gap-4 p-5">
                  <div className="rounded-xl border bg-background p-4 shadow-sm">
                    <div className="space-y-3">
                      <span className="block h-5 w-34 rounded-full bg-[color-mix(in_oklch,var(--toy-accent)_32%,white)]" />
                      <div className="space-y-2">
                        <span className="block h-2.5 w-full rounded-full bg-foreground/12" />
                        <span className="block h-2.5 w-11/12 rounded-full bg-foreground/12" />
                        <span className="block h-2.5 w-3/5 rounded-full bg-foreground/12" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <span className="h-10 rounded-md bg-[color-mix(in_oklch,var(--toy-accent)_22%,white)]" />
                        <span className="h-10 rounded-md border border-[color-mix(in_oklch,var(--toy-accent)_36%,var(--border))] bg-background" />
                        <span className="h-10 rounded-md bg-foreground/10" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_4rem] gap-3">
                    <span className="h-9 rounded-full bg-foreground/10" />
                    <span className="h-9 rounded-full bg-[color-mix(in_oklch,var(--toy-accent)_64%,black)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Course Map
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Follow the course by module or jump directly to a chapter.
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-muted text-foreground shadow-sm"
            >
              <MapIcon /> {cssCourse.chapters.length} chapters
            </Badge>
          </div>

          <div className="grid gap-8">
            {mapSections.map((section) => (
              <section key={section.title} className="grid gap-4">
                <div className="grid items-center gap-3 sm:grid-cols-[auto_1fr]">
                  <div className="max-w-sm py-1 pr-4">
                    <h3 className="text-sm font-semibold tracking-[0.16em] text-foreground uppercase">
                      {section.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                  <div className="hidden h-px bg-linear-to-r from-[color-mix(in_oklch,var(--toy-accent)_65%,transparent)] via-border to-transparent sm:block" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.chapters.map((chapter) => {
                    const isLastChapter = chapter.slug === lastChapterSlug;

                    return (
                      <Link
                        key={chapter.slug}
                        href={`/courses/css/${chapter.slug}`}
                        className={`group relative grid min-h-44 gap-3 rounded-lg border bg-background/95 p-4 shadow-sm transition-[background-color,border-color,box-shadow] duration-200 hover:border-[color-mix(in_oklch,var(--toy-accent)_70%,var(--border))] hover:bg-background hover:shadow-md dark:bg-[oklch(0.16_0.006_240)] dark:hover:bg-[oklch(0.18_0.006_240)] ${
                          isLastChapter
                            ? 'ring-2 ring-[color-mix(in_oklch,var(--toy-accent)_42%,transparent)]'
                            : ''
                        }`}
                      >
                        <ChapterNodeContent
                          chapter={chapter}
                          isLastChapter={isLastChapter}
                        />
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function ChapterNodeContent({
  chapter,
  isLastChapter,
}: {
  chapter: CssChapter;
  isLastChapter: boolean;
}) {
  return (
    <>
      <span className="chapter-marker toy-cyan text-white">
        {chapter.number}
      </span>

      <span className="grid gap-1">
        <span className="text-base leading-tight font-semibold">
          {chapter.title}
        </span>
        <span className="text-sm leading-relaxed text-foreground/70">
          {chapter.summary}
        </span>
      </span>

      <span className="flex flex-wrap items-center gap-2 text-muted-foreground">
        <Badge variant="secondary" className="bg-muted text-foreground">
          <Clock3 /> {chapter.duration}
        </Badge>
        {isLastChapter ? <Badge variant="outline">Continue</Badge> : null}
      </span>
    </>
  );
}

function courseModules() {
  const chaptersBySlug = new Map(
    cssCourse.chapters.map((chapter) => [chapter.slug, chapter]),
  );
  const groupedSlugs = new Set(mapModules.flatMap((module) => module.slugs));
  const groupedModules = mapModules
    .map((module) => ({
      ...module,
      chapters: module.slugs
        .map((slug) => chaptersBySlug.get(slug))
        .filter((chapter): chapter is CssChapter => Boolean(chapter)),
    }))
    .filter((module) => module.chapters.length > 0);
  const uncategorized = cssCourse.chapters.filter(
    (chapter) => !groupedSlugs.has(chapter.slug),
  );

  if (uncategorized.length === 0) {
    return groupedModules;
  }

  return [
    ...groupedModules,
    {
      title: 'More CSS',
      description: 'Additional chapters in the course path.',
      slugs: uncategorized.map((chapter) => chapter.slug),
      chapters: uncategorized,
    },
  ];
}

function readLastChapterSlug() {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem('symlabs:last-css-chapter');

  if (stored) {
    return stored;
  }

  return (
    document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('symlabs_last_css_chapter='))
      ?.split('=')[1] ?? null
  );
}
