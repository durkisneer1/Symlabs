import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CodeXml } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { htmlCourse } from '@/data/html-course';

const firstChapter = htmlCourse.chapters[0];
const chapterAccentClass = 'toy-orange';

export default function HtmlCourse() {
  const [lastChapterSlug, setLastChapterSlug] = useState<string | null>(null);

  useEffect(() => {
    setLastChapterSlug(readLastChapterSlug());
  }, []);

  const lastChapter = htmlCourse.chapters.find(
    (chapter) => chapter.slug === lastChapterSlug,
  );

  return (
    <>
      <Head title="HTML Course" />

      <main className="html-metro-page toy-orange mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12">
        <section className="html-metro-hero grid gap-6 overflow-hidden p-5 sm:grid-cols-[minmax(0,1fr)_13rem] sm:p-6">
          <div className="relative z-10 space-y-5">
            <div className="space-y-3">
              <Badge variant="outline">Course</Badge>
              <h1 className="text-4xl font-semibold tracking-tight">
                {htmlCourse.title}
              </h1>
              <p className="max-w-2xl text-muted-foreground">
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

          <div className="html-metro-token" aria-hidden="true">
            <CodeXml className="size-14" strokeWidth={2.4} />
            <span>HTML</span>
          </div>
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Chapters</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Follow the sequence or jump directly to a chapter.
            </p>
          </div>

          <div className="relative space-y-3 before:absolute before:top-2 before:left-5 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
            {htmlCourse.chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/courses/html/${chapter.slug}`}
                className="group relative grid gap-3 pl-14"
              >
                <span
                  className={`chapter-marker ${chapterAccentClass} absolute top-4 left-0.5 z-10`}
                >
                  {chapter.number}
                </span>
                <Card
                  className={`html-chapter-card toy-surface toy-surface-link ${chapterAccentClass}`}
                >
                  <CardHeader>
                    <CardTitle>{chapter.title}</CardTitle>
                    <CardDescription>{chapter.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-2">
                    <Badge variant="secondary">{chapter.duration}</Badge>
                    {chapter.content.length === 0 ? (
                      <Badge variant="outline">Coming soon</Badge>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
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
