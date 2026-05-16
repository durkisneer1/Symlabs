import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Quiz = {
  id: number;
  course_slug: string;
  slug: string;
  title: string;
  description: string | null;
  question_count: number;
  time_limit_minutes: number;
  questions_count: number;
};

type CourseOption = {
  value: string;
  label: string;
};

type Props = {
  quiz: Quiz | null;
  courses: CourseOption[];
};

export default function AdminQuizEdit({ quiz, courses }: Props) {
  const baseUrl = '/admin/quizzes';
  const isEditing = quiz !== null;
  const questionsCount = quiz?.questions_count ?? 0;
  const form = useForm({
    course_slug: quiz?.course_slug ?? 'html',
    title: quiz?.title ?? '',
    description: quiz?.description ?? '',
    question_count: quiz?.question_count ?? 10,
    time_limit_minutes: quiz?.time_limit_minutes ?? 30,
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isEditing) {
      form.put(`${baseUrl}/${quiz.id}`);
      return;
    }

    form.post(baseUrl);
  };

  const generatedSlug = `${form.data.course_slug} ${form.data.title}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const requestedQuestions = formNumber(form.data.question_count);
  const isInvalidQuestionCount =
    questionsCount > 0 && requestedQuestions > questionsCount;

  return (
    <>
      <Head title={isEditing ? `Edit ${quiz.title}` : 'New Quiz'} />

      <form className="max-w-2xl space-y-6 p-4" onSubmit={submit}>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEditing ? 'Edit Quiz' : 'New Quiz'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure reusable quiz metadata. Questions and options will come
            next.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.data.title}
            onChange={(event) => form.setData('title', event.target.value)}
            required
          />
          <InputError message={form.errors.title} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="course_slug">Course</Label>
          <select
            id="course_slug"
            className="h-8 w-full border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
            value={form.data.course_slug}
            onChange={(event) =>
              form.setData('course_slug', event.target.value)
            }
            required
          >
            {courses.map((course) => (
              <option key={course.value} value={course.value}>
                {course.label}
              </option>
            ))}
          </select>
          <InputError message={form.errors.course_slug} />
          <p className="text-xs text-muted-foreground">
            Generated slug: {generatedSlug || 'course-title'}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className={cn(
              'min-h-24 w-full border border-input bg-transparent px-2.5 py-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50',
            )}
            value={form.data.description}
            onChange={(event) =>
              form.setData('description', event.target.value)
            }
          />
          <InputError message={form.errors.description} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="question_count">Questions per attempt</Label>
            <Input
              id="question_count"
              type="number"
              min={1}
              max={questionsCount || undefined}
              value={form.data.question_count}
              onChange={(event) =>
                form.setData('question_count', Number(event.target.value))
              }
              required
            />
            <InputError message={form.errors.question_count} />
            {isInvalidQuestionCount ? (
              <p className="text-xs text-destructive">
                This quiz asks for {requestedQuestions} questions per attempt,
                but only {questionsCount} questions exist.
              </p>
            ) : null}
            {isEditing && questionsCount === 0 ? (
              <p className="text-xs text-destructive">
                This quiz has no questions yet. Add questions before teachers
                use it.
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="time_limit_minutes">Time limit minutes</Label>
            <Input
              id="time_limit_minutes"
              type="number"
              min={1}
              value={form.data.time_limit_minutes}
              onChange={(event) =>
                form.setData('time_limit_minutes', Number(event.target.value))
              }
              required
            />
            <InputError message={form.errors.time_limit_minutes} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={form.processing}>
            Save quiz
          </Button>
          <Button asChild variant="outline">
            <Link href={baseUrl}>Cancel</Link>
          </Button>
        </div>
      </form>
    </>
  );
}

AdminQuizEdit.layout = (props: { quiz?: Quiz | null }) => ({
  breadcrumbs: [
    {
      title: 'Quiz Bank',
      href: '/admin/quizzes',
    },
    {
      title: props.quiz?.title ?? 'New Quiz',
      href: '#',
    },
  ],
});

function formNumber(value: number | string) {
  return Number(value || 0);
}
