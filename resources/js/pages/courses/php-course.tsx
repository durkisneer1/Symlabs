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
import { phpCourse } from '@/data/php-course';

const firstChapter = phpCourse.chapters[0];
const chapterAccentClasses = ['toy-purple', 'toy-green', 'toy-yellow', 'toy-cyan'];

export default function PhpCourse() {
  return (
    <>
      <Head title="PHP Course" />

      <main className="toy-purple mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12">
        <section className="space-y-6">
          <div className="space-y-3">
            <Badge variant="outline">Course</Badge>
            <h1 className="text-4xl font-semibold tracking-tight">
              {phpCourse.title}
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              {phpCourse.description}
            </p>
          </div>

          <Button asChild>
            <Link href={`/courses/php/${firstChapter.slug}`}>
              Start Learning <ArrowRight />
            </Link>
          </Button>
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Chapters</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A short demo chapter showing procedural programming activities.
            </p>
          </div>

          <div className="relative space-y-3 before:absolute before:left-5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
            {phpCourse.chapters.map((chapter, index) => (
              <Link
                key={chapter.slug}
                href={`/courses/php/${chapter.slug}`}
                className="group relative grid gap-3 pl-14"
              >
                <span
                  className={`chapter-marker ${chapterAccentClasses[index % chapterAccentClasses.length]} absolute left-0.5 top-4 z-10`}
                >
                  {chapter.number}
                </span>
                <Card
                  className={`toy-surface toy-surface-link ${chapterAccentClasses[index % chapterAccentClasses.length]}`}
                >
                  <CardHeader>
                    <CardTitle>{chapter.title}</CardTitle>
                    <CardDescription>{chapter.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{chapter.duration}</Badge>
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
