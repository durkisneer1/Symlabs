import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Quiz = {
  id: number;
  course_slug: string;
  slug: string;
  title: string;
  description: string | null;
  question_count: number;
  time_limit_minutes: number;
  questions_count: number;
  assignments_count: number;
};

type CourseOption = {
  value: string;
  label: string;
};

type Props = {
  quizzes: Quiz[];
  courses: CourseOption[];
  selectedCourse: string | null;
};

export default function AdminQuizzesIndex({
  quizzes,
  courses,
  selectedCourse,
}: Props) {
  const baseUrl = '/admin/quizzes';

  return (
    <>
      <Head title="Quiz Bank" />

      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Quiz Bank
            </h1>
            <p className="text-sm text-muted-foreground">
              Reusable quizzes that classroom teachers can assign later.
            </p>
          </div>
          <Button asChild>
            <Link href={`${baseUrl}/create`}>
              <Plus /> New quiz
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant={selectedCourse ? 'outline' : 'default'}>
            <Link href={baseUrl}>All courses</Link>
          </Button>
          {courses.map((course) => (
            <Button
              key={course.value}
              asChild
              size="sm"
              variant={selectedCourse === course.value ? 'default' : 'outline'}
            >
              <Link
                href={`${baseUrl}?course=${encodeURIComponent(course.value)}`}
              >
                {course.label}
              </Link>
            </Button>
          ))}
        </div>

        <div className="overflow-hidden border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Title</th>
                <th className="px-3 py-2 font-medium">Course</th>
                <th className="px-3 py-2 font-medium">Slug</th>
                <th className="px-3 py-2 font-medium">Questions</th>
                <th className="px-3 py-2 font-medium">Limit</th>
                <th className="px-3 py-2 font-medium">Assignments</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2">
                    <Link
                      href={`${baseUrl}/${quiz.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {quiz.title}
                    </Link>
                    {quiz.question_count > quiz.questions_count ? (
                      <p className="text-xs text-destructive">
                        Invalid: asks for {quiz.question_count} questions, but
                        only {quiz.questions_count} exist.
                      </p>
                    ) : null}
                    {quiz.description ? (
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {quiz.description}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {quiz.course_slug}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {quiz.slug}
                  </td>
                  <td className="px-3 py-2">{quiz.questions_count}</td>
                  <td className="px-3 py-2">
                    {quiz.question_count} in {quiz.time_limit_minutes} min
                  </td>
                  <td className="px-3 py-2">{quiz.assignments_count}</td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => router.delete(`${baseUrl}/${quiz.id}`)}
                    >
                      <Trash2 />
                      <span className="sr-only">Delete quiz</span>
                    </Button>
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 ? (
                <tr>
                  <td
                    className="px-3 py-8 text-center text-muted-foreground"
                    colSpan={7}
                  >
                    No quizzes yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

AdminQuizzesIndex.layout = {
  breadcrumbs: [
    {
      title: 'Quiz Bank',
      href: '/admin/quizzes',
    },
  ],
};
