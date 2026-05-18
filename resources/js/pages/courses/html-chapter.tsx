import { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import CodeBlock from '@/components/code-block';
import ChapterSectionNav, { sectionId } from '@/components/chapter-section-nav';
import CourseActivityBlock from '@/components/course-activity';
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

type Props = {
  chapterSlug: string;
};

export default function HtmlChapter({ chapterSlug }: Props) {
  const chapter = findHtmlChapter(chapterSlug) ?? htmlCourse.chapters[0];
  const chapterIndex = htmlCourse.chapters.findIndex(
    (candidate) => candidate.slug === chapter.slug,
  );
  const previousChapter = htmlCourse.chapters[chapterIndex - 1] ?? null;
  const nextChapter = htmlCourse.chapters[chapterIndex + 1] ?? null;
  const navItems = [
    ...chapter.sections.map((section) => ({
      id: sectionId(section.title),
      title: section.title,
      depth: 0,
    })),
    ...chapter.activities.map((activity) => ({
      id: sectionId(activity.title),
      title: activity.title,
      depth: 1,
    })),
  ];

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem('inkbooks:last-html-chapter', chapter.slug);
    document.cookie = `inkbooks_last_html_chapter=${chapter.slug}; path=/; max-age=31536000; samesite=lax`;
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

          {chapter.sections.length > 0 ? (
            <div className="space-y-6">
              {chapter.sections.map((section) => (
                <section
                  key={section.title}
                  id={sectionId(section.title)}
                  className="scroll-mt-6 space-y-3"
                >
                  <h2 className="text-xl font-semibold tracking-tight">
                    {section.title}
                  </h2>
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="leading-7 text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.example ? (
                    <CodeBlock code={section.example} language="html" />
                  ) : null}
                </section>
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

          {chapter.activities.map((activity) => (
            <section
              key={`${activity.type}-${activity.title}`}
              id={sectionId(activity.title)}
              className="scroll-mt-6"
            >
              <CourseActivityBlock activity={activity} />
            </section>
          ))}

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
          <ChapterSectionNav items={navItems} />
        </aside>
      </main>
    </>
  );
}
