import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Clock3, MapIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { htmlCourse } from '@/data/html-course';
import type { HtmlChapter } from '@/data/html-course';

const firstChapter = htmlCourse.chapters[0];
const mapModules = [
  {
    title: 'Web Foundations',
    description: 'How pages are found, loaded, and written.',
    slugs: ['intro-to-web', 'elements-and-tags'],
  },
  {
    title: 'Page Ingredients',
    description: 'The visible pieces students use to build useful pages.',
    slugs: [
      'text-formatting-and-special-characters',
      'images',
      'links',
      'lists',
    ],
  },
  {
    title: 'Structure and Interaction',
    description: 'Layout meaning, data, forms, and embedded media.',
    slugs: [
      'tables',
      'containers-and-semantic-tags',
      'forms',
      'audio-and-video',
    ],
  },
  {
    title: 'Project Habits',
    description: 'The working practices that make HTML easier to maintain.',
    slugs: ['developer-guidelines-and-best-practices'],
  },
];

export default function HtmlCourse() {
  const [lastChapterSlug, setLastChapterSlug] = useState<string | null>(null);

  useEffect(() => {
    setLastChapterSlug(readLastChapterSlug());
  }, []);

  const lastChapter = htmlCourse.chapters.find(
    (chapter) => chapter.slug === lastChapterSlug,
  );
  const mapSections = courseModules();

  return (
    <>
      <Head title="HTML Course" />

      <main className="html-metro-page toy-orange mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-12">
        <section className="toy-surface toy-orange relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-none px-4 py-10 sm:px-6 lg:py-14">
          <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="space-y-5">
              <div className="space-y-3">
                <Badge variant="outline">Course</Badge>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {htmlCourse.title}
                </h1>
                <p className="max-w-2xl text-base/relaxed text-foreground/75">
                  {htmlCourse.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={`/courses/html/${firstChapter.slug}`}>
                    Start Learning <ArrowRight />
                  </Link>
                </Button>
                {lastChapter ? (
                  <Button asChild variant="outline">
                    <Link href={`/courses/html/${lastChapter.slug}`}>
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
              <div className="grid min-h-56 grid-cols-[7rem_1fr]">
                <div className="space-y-3 border-r bg-muted/35 p-4">
                  <span className="block h-3 w-16 bg-foreground/25" />
                  <span className="block h-3 w-20 bg-foreground/15" />
                  <span className="block h-3 w-14 bg-foreground/15" />
                  <span className="block h-3 w-18 bg-foreground/15" />
                </div>
                <div className="space-y-4 p-5">
                  <span className="block h-7 w-40 bg-foreground/25" />
                  <div className="space-y-2">
                    <span className="block h-2.5 w-full bg-foreground/12" />
                    <span className="block h-2.5 w-11/12 bg-foreground/12" />
                    <span className="block h-2.5 w-4/5 bg-foreground/12" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <span className="h-16 bg-[color-mix(in_oklch,var(--toy-accent)_24%,white)]" />
                    <span className="h-16 bg-[color-mix(in_oklch,var(--accent-cyan)_22%,white)]" />
                    <span className="h-16 bg-[color-mix(in_oklch,var(--accent-purple)_18%,white)]" />
                  </div>
                  <div className="grid grid-cols-[1fr_5rem] gap-3">
                    <span className="h-12 bg-foreground/10" />
                    <span className="h-12 bg-foreground/15" />
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
                Follow the sliced path by module or jump directly to a chapter.
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-muted text-foreground shadow-sm"
            >
              <MapIcon /> {htmlCourse.chapters.length} chapters
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
                        href={`/courses/html/${chapter.slug}`}
                        className={`group relative grid min-h-44 gap-3 rounded-lg border bg-background/95 p-4 shadow-sm transition-[background-color,border-color,box-shadow] duration-200 hover:border-[color-mix(in_oklch,var(--toy-accent)_70%,var(--border))] hover:bg-background hover:shadow-md dark:bg-[oklch(0.16_0.006_240)] dark:hover:bg-[oklch(0.18_0.006_240)] ${
                          isLastChapter
                            ? 'ring-2 ring-[color-mix(in_oklch,var(--toy-accent)_42%,transparent)]'
                            : ''
                        }`}
                        style={{
                          boxShadow:
                            'inset 0 1px 0 rgb(255 255 255 / 0.42), 0 1px 2px rgb(0 0 0 / 0.06)',
                        }}
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
  chapter: HtmlChapter;
  isLastChapter: boolean;
}) {
  return (
    <>
      <span
        className="chapter-marker toy-orange text-white"
        style={{
          textShadow:
            '0 1px 0 rgb(4 50 65 / 0.6), 0 -1px 0 rgb(4 50 65 / 0.4), 1px 0 0 rgb(4 50 65 / 0.4), -1px 0 0 rgb(4 50 65 / 0.4)',
        }}
      >
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
    htmlCourse.chapters.map((chapter) => [chapter.slug, chapter]),
  );
  const groupedSlugs = new Set(mapModules.flatMap((module) => module.slugs));
  const groupedModules = mapModules
    .map((module) => ({
      ...module,
      chapters: module.slugs
        .map((slug) => chaptersBySlug.get(slug))
        .filter((chapter): chapter is HtmlChapter => Boolean(chapter)),
    }))
    .filter((module) => module.chapters.length > 0);
  const uncategorized = htmlCourse.chapters.filter(
    (chapter) => !groupedSlugs.has(chapter.slug),
  );

  if (uncategorized.length === 0) {
    return groupedModules;
  }

  return [
    ...groupedModules,
    {
      title: 'More HTML',
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

  const stored = window.localStorage.getItem('symlabs:last-html-chapter');

  if (stored) {
    return stored;
  }

  return (
    document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('symlabs_last_html_chapter='))
      ?.split('=')[1] ?? null
  );
}
