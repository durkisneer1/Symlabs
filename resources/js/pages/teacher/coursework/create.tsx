import { type FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
  courses: CourseOption[];
  chapters: Record<string, ContentOption[]>;
  homeworkSets: Record<string, ContentOption[]>;
  quizzes: QuizOption[];
};

export default function CreateCoursework({
  team,
  courses,
  chapters,
  homeworkSets,
  quizzes,
}: Props) {
  const form = useForm({
    type: 'quiz' as AssignmentType,
    course_slug: 'html',
    title: '',
    opens_at: '',
    due_at: '',
    quiz_id: '',
    chapter_slugs: [] as string[],
    homework_slug: '',
    question_count: 1,
    difficulty: 'any',
    attempts_allowed: 1,
  });

  const courseChapters = chapters[form.data.course_slug] ?? [];
  const courseHomework = homeworkSets[form.data.course_slug] ?? [];
  const courseQuizzes = quizzes.filter(
    (quiz) => quiz.course_slug === form.data.course_slug,
  );
  const selectedQuiz = courseQuizzes.find(
    (quiz) => quiz.id === Number(form.data.quiz_id),
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.post(`/${team.slug}/coursework`);
  };

  const setType = (type: AssignmentType) => {
    form.setData({
      ...form.data,
      type,
      attempts_allowed: type === 'quiz' ? 1 : 3,
    });
  };

  const setCourse = (courseSlug: string) => {
    form.setData({
      ...form.data,
      course_slug: courseSlug,
      quiz_id: '',
      chapter_slugs: [],
      homework_slug: '',
      question_count: 1,
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
      <Head title="Assign Coursework" />

      <form className="max-w-3xl space-y-6 p-4" onSubmit={submit}>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Assign Coursework
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose classroom work for {team.name}.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Type</Label>
            <Select value={form.data.type} onValueChange={(value) => setType(value as AssignmentType)}>
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

        <div className="grid gap-4 sm:grid-cols-2">
          <DateField
            label="Opens"
            value={form.data.opens_at}
            error={form.errors.opens_at}
            onChange={(value) => form.setData('opens_at', value)}
          />
          <DateField
            label="Due"
            value={form.data.due_at}
            error={form.errors.due_at}
            onChange={(value) => form.setData('due_at', value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={form.processing}>
            Assign coursework
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${team.slug}/dashboard`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </>
  );
}

function DateField({
  label,
  value,
  error,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const selected = value ? new Date(`${value}T00:00:00`) : undefined;

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="border">
        <div className="flex items-center gap-2 border-b p-2 text-sm text-muted-foreground">
          <CalendarIcon className="size-4" />
          {selected ? format(selected, 'PPP') : 'No date selected'}
        </div>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
        />
      </div>
      <InputError message={error} />
    </div>
  );
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

CreateCoursework.layout = (props: { team?: Team }) => ({
  breadcrumbs: [
    {
      title: 'Dashboard',
      href: props.team ? `/${props.team.slug}/dashboard` : '/dashboard',
    },
    {
      title: 'Assign Coursework',
      href: '#',
    },
  ],
});
