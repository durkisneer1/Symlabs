import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import ChapterSectionNav, { sectionId } from '@/components/chapter-section-nav';
import CodeBlock from '@/components/code-block';
import CourseActivityBlock from '@/components/course-activity';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { findPhpChapter, phpCourse } from '@/data/php-course';

type Props = {
  chapterSlug: string;
};

export default function PhpChapter({ chapterSlug }: Props) {
  const chapter = findPhpChapter(chapterSlug) ?? phpCourse.chapters[0];
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

  return (
    <>
      <Head title={`${chapter.title} | PHP`} />

      <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="space-y-8">
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
                  <p key={paragraph} className="leading-7 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
                {section.example ? (
                  <CodeBlock code={section.example} language="php" />
                ) : null}
              </section>
            ))}
          </div>

          {chapter.activities.map((activity) => (
            <section
              key={`${activity.type}-${activity.title}`}
              id={sectionId(activity.title)}
              className="scroll-mt-6"
            >
              <CourseActivityBlock activity={activity} />
            </section>
          ))}
        </article>

        <aside className="hidden lg:block">
          <ChapterSectionNav items={navItems} />
        </aside>
      </main>
    </>
  );
}
