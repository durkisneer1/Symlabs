import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Quiz = {
  id: number;
  course_slug: string;
  title: string;
  description: string | null;
  question_count: number;
  questions_count: number;
};

type CourseOption = {
  value: string;
  label: string;
};

type Props = {
  quizzes: Quiz[];
  courses: CourseOption[];
  selectedCourse: string;
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
            <h1 className="text-2xl font-semibold tracking-tight">Quiz Bank</h1>
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
          {courses.map((course) => (
            <Link
              key={course.value}
              href={`${baseUrl}?course=${encodeURIComponent(course.value)}`}
              className={`app-card-link border px-3 py-1.5 text-sm font-medium ${
                selectedCourse === course.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground hover:bg-muted/50'
              }`}
            >
              {course.label}
            </Link>
          ))}
        </div>

        <div className="overflow-hidden border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Title</th>
                <th className="px-3 py-2 font-medium">Course</th>
                <th className="px-3 py-2 font-medium">Questions</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2">
                    <p className="font-medium">{quiz.title}</p>
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
                  <td className="px-3 py-2">{quiz.questions_count}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`${baseUrl}/${quiz.id}/edit`}>
                          <Pencil />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => router.delete(`${baseUrl}/${quiz.id}`)}
                      >
                        <Trash2 />
                        <span className="sr-only">Delete quiz</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 ? (
                <tr>
                  <td
                    className="px-3 py-8 text-center text-muted-foreground"
                    colSpan={4}
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
