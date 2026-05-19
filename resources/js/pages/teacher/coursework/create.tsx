import { type FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AssignmentType, Team } from '@/types';

type CourseOption = {
  value: string;
  label: string;
};

type ContentOption = {
  value: string;
  label: string;
};

type QuizOption = {
  id: number;
  course_slug: string;
  title: string;
  description: string | null;
  question_count: number;
  questions_count: number;
  time_limit_minutes: number;
};

type Props = {
  team: Team;
  assignment?: CourseworkAssignment;
  courses: CourseOption[];
  chapters: Record<string, ContentOption[]>;
  homeworkSets: Record<string, ContentOption[]>;
  quizzes: QuizOption[];
};

type CourseworkAssignment = {
  id: number;
  type: AssignmentType;
  course_slug: string;
  title: string;
  opens_at: string;
  due_at: string;
  quiz_id: string;
  chapter_slugs: string[];
  homework_slug: string;
  question_count: number;
  difficulty: string;
  attempts_allowed: number;
};

export default function CreateCoursework({
  team,
  assignment,
  courses,
  chapters,
  homeworkSets,
  quizzes,
}: Props) {
  const initialType = assignment?.type ?? ('quiz' as AssignmentType);
  const initialCourseSlug = assignment?.course_slug ?? 'html';
  const initialQuiz = quizzes.find(
    (quiz) => quiz.course_slug === initialCourseSlug,
  );
  const initialHomework = homeworkSets[initialCourseSlug]?.[0]?.value ?? '';
  const form = useForm({
    type: initialType,
    course_slug: initialCourseSlug,
    title: assignment?.title ?? '',
    opens_at: assignment?.opens_at ?? '',
    due_at: assignment?.due_at ?? '',
    quiz_id:
      assignment?.quiz_id ?? (initialType === 'quiz' && initialQuiz ? `${initialQuiz.id}` : ''),
    chapter_slugs: assignment?.chapter_slugs ?? ([] as string[]),
    homework_slug:
      assignment?.homework_slug ??
      (initialType === 'homework' ? initialHomework : ''),
    question_count: assignment?.question_count ?? 1,
    difficulty: assignment?.difficulty ?? 'any',
    attempts_allowed: assignment?.attempts_allowed ?? 1,
  });
  const isEditing = Boolean(assignment);

  const courseChapters = chapters[form.data.course_slug] ?? [];
  const courseHomework = homeworkSets[form.data.course_slug] ?? [];
  const courseQuizzes = quizzes.filter(
    (quiz) => quiz.course_slug === form.data.course_slug,
  );
  const defaultHomeworkSlug = courseHomework[0]?.value ?? '';
  const defaultQuizId = courseQuizzes[0] ? `${courseQuizzes[0].id}` : '';
  const selectedQuiz = courseQuizzes.find(
    (quiz) => quiz.id === Number(form.data.quiz_id),
  );
  const hasErrors = Object.keys(form.errors).length > 0;
  const errorMessages = Object.values(form.errors);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (assignment) {
      form.put(`/${team.slug}/coursework/${assignment.id}`, {
        preserveScroll: true,
      });

      return;
    }

    form.post(`/${team.slug}/coursework`, {
      preserveScroll: true,
    });
  };

  const setType = (type: AssignmentType) => {
    form.setData({
      ...form.data,
      type,
      attempts_allowed: type === 'quiz' ? 1 : 3,
      homework_slug: type === 'homework' ? defaultHomeworkSlug : '',
      quiz_id: type === 'quiz' ? defaultQuizId : '',
      question_count:
        type === 'quiz'
          ? Math.min(
              form.data.question_count,
              courseQuizzes.find((quiz) => `${quiz.id}` === defaultQuizId)
                ?.questions_count || 1,
            )
          : form.data.question_count,
    });
  };

  const setCourse = (courseSlug: string) => {
    const nextHomework = homeworkSets[courseSlug]?.[0]?.value ?? '';
    const nextQuiz = quizzes.find((quiz) => quiz.course_slug === courseSlug);

    form.setData({
      ...form.data,
      course_slug: courseSlug,
      quiz_id: form.data.type === 'quiz' && nextQuiz ? `${nextQuiz.id}` : '',
      chapter_slugs: [],
      homework_slug: form.data.type === 'homework' ? nextHomework : '',
      question_count: Math.min(
        form.data.question_count,
        nextQuiz?.questions_count || 1,
      ),
    });
  };

  const toggleChapter = (chapterSlug: string) => {
    form.setData(
      'chapter_slugs',
      form.data.chapter_slugs.includes(chapterSlug)
        ? form.data.chapter_slugs.filter((slug) => slug !== chapterSlug)
        : [...form.data.chapter_slugs, chapterSlug],
    );
  };

  return (
    <>
      <Head title={isEditing ? 'Edit Coursework' : 'Assign Coursework'} />

      <form className="max-w-3xl space-y-6 p-4" onSubmit={submit}>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEditing ? 'Edit Coursework' : 'Assign Coursework'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose classroom work for {team.name}.
          </p>
        </div>

        {hasErrors ? (
          <div className="border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <p className="font-medium">Coursework was not assigned yet.</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errorMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Type</Label>
            <Select
              value={form.data.type}
              onValueChange={(value) => setType(value as AssignmentType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chapter_reading">Chapter reading</SelectItem>
                <SelectItem value="homework">Homework</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
              </SelectContent>
            </Select>
            <InputError message={form.errors.type} />
          </div>

          <div className="grid gap-2">
            <Label>Course</Label>
            <Select value={form.data.course_slug} onValueChange={setCourse}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.value} value={course.value}>
                    {course.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={form.errors.course_slug} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Title</Label>
          <Input
            value={form.data.title}
            onChange={(event) => form.setData('title', event.target.value)}
            required
          />
          <InputError message={form.errors.title} />
        </div>

        <p className="border bg-muted p-3 text-sm text-muted-foreground">
          {descriptionFor(form.data.type)}
        </p>

        {form.data.type === 'chapter_reading' ? (
          <div className="space-y-2">
            <Label>Chapters</Label>
            <div className="grid gap-2 border p-3">
              {courseChapters.map((chapter) => (
                <label key={chapter.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={form.data.chapter_slugs.includes(chapter.value)}
                    onCheckedChange={() => toggleChapter(chapter.value)}
                  />
                  <span className="text-sm">{chapter.label}</span>
                </label>
              ))}
            </div>
            <InputError message={form.errors.chapter_slugs} />
          </div>
        ) : null}

        {form.data.type === 'homework' ? (
          <div className="grid gap-2">
            <Label>Homework set</Label>
            <Select
              value={form.data.homework_slug}
              onValueChange={(value) => form.setData('homework_slug', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose homework" />
              </SelectTrigger>
              <SelectContent>
                {courseHomework.map((homework) => (
                  <SelectItem key={homework.value} value={homework.value}>
                    {homework.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={form.errors.homework_slug} />
          </div>
        ) : null}

        {form.data.type === 'quiz' ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Quiz bank</Label>
              <Select
                value={form.data.quiz_id}
                onValueChange={(value) => {
                  const quiz = courseQuizzes.find(
                    (candidate) => candidate.id === Number(value),
                  );

                  form.setData({
                    ...form.data,
                    quiz_id: value,
                    question_count: Math.min(
                      form.data.question_count,
                      quiz?.questions_count || 1,
                    ),
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose quiz" />
                </SelectTrigger>
                <SelectContent>
                  {courseQuizzes.map((quiz) => (
                    <SelectItem key={quiz.id} value={`${quiz.id}`}>
                      {quiz.title} ({quiz.questions_count} questions)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={form.errors.quiz_id} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Questions</Label>
                <Input
                  type="number"
                  min={1}
                  max={selectedQuiz?.questions_count || undefined}
                  value={form.data.question_count}
                  onChange={(event) =>
                    form.setData('question_count', Number(event.target.value))
                  }
                />
                <InputError message={form.errors.question_count} />
              </div>

              <div className="grid gap-2">
                <Label>Difficulty</Label>
                <Select
                  value={form.data.difficulty}
                  onValueChange={(value) => form.setData('difficulty', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <InputError message={form.errors.difficulty} />
              </div>

              <AttemptsInput
                value={form.data.attempts_allowed}
                error={form.errors.attempts_allowed}
                onChange={(value) => form.setData('attempts_allowed', value)}
              />
            </div>
          </div>
        ) : null}

        {form.data.type === 'homework' ? (
          <AttemptsInput
            value={form.data.attempts_allowed}
            error={form.errors.attempts_allowed}
            onChange={(value) => form.setData('attempts_allowed', value)}
          />
        ) : null}

        <DateRangeField
          opensAt={form.data.opens_at}
          dueAt={form.data.due_at}
          opensError={form.errors.opens_at}
          dueError={form.errors.due_at}
          onChange={(opensAt, dueAt) =>
            form.setData({
              ...form.data,
              opens_at: opensAt,
              due_at: dueAt,
            })
          }
        />

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={form.processing}>
            {isEditing ? 'Save coursework' : 'Assign coursework'}
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${team.slug}/dashboard`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </>
  );
}

function DateRangeField({
  opensAt,
  dueAt,
  opensError,
  dueError,
  onChange,
}: {
  opensAt: string;
  dueAt: string;
  opensError?: string;
  dueError?: string;
  onChange: (opensAt: string, dueAt: string) => void;
}) {
  const selected: DateRange = {
    from: dateFromDateTime(opensAt),
    to: dateFromDateTime(dueAt),
  };
  const opensTime = timeFromDateTime(opensAt, '08:00');
  const dueTime = timeFromDateTime(dueAt, '23:59');

  const setRange = (range: DateRange | undefined) => {
    const nextOpensAt = range?.from
      ? composeDateTime(range.from, opensTime)
      : '';
    const nextDueAt = range?.to ? composeDateTime(range.to, dueTime) : '';

    onChange(nextOpensAt, nextDueAt);
  };

  const setOpensTime = (time: string) => {
    const opensDate = dateFromDateTime(opensAt);

    if (!opensDate) {
      return;
    }

    onChange(composeDateTime(opensDate, time), dueAt);
  };

  const setDueTime = (time: string) => {
    const dueDate = dateFromDateTime(dueAt);

    if (!dueDate) {
      return;
    }

    onChange(opensAt, composeDateTime(dueDate, time));
  };

  return (
    <div className="grid gap-2">
      <Label>Availability</Label>
      <div className="border">
        <div className="flex items-center gap-2 border-b p-2 text-sm text-muted-foreground">
          <CalendarIcon className="size-4" />
          {availabilityLabel(opensAt, dueAt)}
        </div>
        <Calendar
          className="w-full"
          mode="range"
          defaultMonth={selected.from}
          numberOfMonths={2}
          selected={selected}
          onSelect={setRange}
        />
        <div className="grid gap-3 border-t p-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="opens-time">Opens time</Label>
            <Input
              id="opens-time"
              type="time"
              value={opensTime}
              disabled={!selected.from}
              onChange={(event) => setOpensTime(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="due-time">Due time</Label>
            <Input
              id="due-time"
              type="time"
              value={dueTime}
              disabled={!selected.to}
              onChange={(event) => setDueTime(event.target.value)}
            />
          </div>
        </div>
      </div>
      <InputError message={opensError} />
      <InputError message={dueError} />
    </div>
  );
}

function dateFromDateTime(value: string) {
  const datePart = value.slice(0, 10);

  if (!datePart) {
    return undefined;
  }

  return new Date(`${datePart}T00:00:00`);
}

function timeFromDateTime(value: string, fallback: string) {
  const timePart = value.match(/T(\d{2}:\d{2})/)?.[1];

  return timePart ?? fallback;
}

function composeDateTime(date: Date, time: string) {
  return `${format(date, 'yyyy-MM-dd')}T${time}`;
}

function availabilityLabel(opensAt: string, dueAt: string) {
  const opensDate = dateFromDateTime(opensAt);
  const dueDate = dateFromDateTime(dueAt);

  if (!opensDate && !dueDate) {
    return 'No date range selected';
  }

  if (opensDate && !dueDate) {
    return `Opens ${format(opensDate, 'PP')} at ${timeFromDateTime(opensAt, '08:00')}`;
  }

  if (!opensDate || !dueDate) {
    return 'Incomplete date range';
  }

  return `${format(opensDate, 'PP')} ${timeFromDateTime(opensAt, '08:00')} to ${format(dueDate, 'PP')} ${timeFromDateTime(dueAt, '23:59')}`;
}

function AttemptsInput({
  value,
  error,
  onChange,
}: {
  value: number;
  error?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label>Attempts</Label>
      <Input
        type="number"
        min={1}
        max={10}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <InputError message={error} />
    </div>
  );
}

function descriptionFor(type: AssignmentType) {
  if (type === 'chapter_reading') {
    return 'Read the chapter and complete participation activities.';
  }

  if (type === 'homework') {
    return 'Answer these homework questions.';
  }

  return 'Take the quiz.';
}

CreateCoursework.layout = (props: {
  team?: Team;
  assignment?: CourseworkAssignment;
}) => ({
  breadcrumbs: [
    {
      title: 'Dashboard',
      href: props.team ? `/${props.team.slug}/dashboard` : '/dashboard',
    },
    {
      title: props.assignment ? 'Edit Coursework' : 'Assign Coursework',
      href: '#',
    },
  ],
});
