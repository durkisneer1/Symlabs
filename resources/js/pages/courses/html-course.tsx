import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
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

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12">
        <section className="space-y-6">
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
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Chapters</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Follow the sequence or jump directly to a chapter.
            </p>
          </div>

          <div className="relative space-y-3 before:absolute before:left-5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
            {htmlCourse.chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/courses/html/${chapter.slug}`}
                className="group relative grid gap-3 pl-14"
              >
                <span className="absolute left-0 top-4 z-10 flex size-10 items-center justify-center border bg-background text-sm font-medium">
                  {chapter.number}
                </span>
                <Card className="transition-colors group-hover:bg-muted/50">
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

  const stored = window.localStorage.getItem('inkbooks:last-html-chapter');

  if (stored) {
    return stored;
  }

  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('inkbooks_last_html_chapter='))
    ?.split('=')[1] ?? null;
}
