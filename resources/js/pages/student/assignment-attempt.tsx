import { type FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import InlineCodeText from '@/components/inline-code-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AssignmentType, Team } from '@/types';

type AttemptAssignment = {
  id: number;
  type: AssignmentType;
  type_label: string;
  title: string;
  description: string | null;
  course_slug: string;
  due_at: string | null;
  status: string;
  score: string | number | null;
  max_score: string | number | null;
  attempts_used: number;
  attempts_allowed: number;
  attempts_exhausted: boolean;
  can_attempt: boolean;
  can_review: boolean;
  grade_visible: boolean;
};

type AttemptQuestion = {
  id: string;
  type: string;
  prompt: string;
  choices: Array<{
    id: string;
    text: string;
    match_text?: string | null;
  }>;
  selected_answer?: string | null;
  selected_text?: string | null;
  is_correct?: boolean | null;
  correct_answer?: string | null;
};

type Props = {
  team: Team;
  assignment: AttemptAssignment;
  questions: AttemptQuestion[];
};

export default function AssignmentAttempt({
  team,
  assignment,
  questions,
}: Props) {
  const form = useForm({
    answers: {} as Record<string, string>,
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.post(`/${team.slug}/coursework/${assignment.id}/attempt`, {
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title={assignment.title} />

      <main className="mx-auto w-full max-w-4xl space-y-6 p-4">
        <div className="space-y-4">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/${team.slug}/work`}>
              <ArrowLeft /> Work
            </Link>
          </Button>

          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="outline">{assignment.type_label}</Badge>
              {assignment.due_at ? (
                <Badge variant="secondary">Due {formatDate(assignment.due_at)}</Badge>
              ) : null}
              <Badge variant="outline">
                {assignment.attempts_used} / {assignment.attempts_allowed}{' '}
                attempts
              </Badge>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {assignment.title}
            </h1>
            {assignment.description ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {assignment.description}
              </p>
            ) : null}
          </div>
        </div>

        {assignment.can_review ? (
          <ReviewView assignment={assignment} questions={questions} />
        ) : assignment.can_attempt ? (
          <form className="space-y-4" onSubmit={submit}>
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                index={index}
                question={question}
                value={form.data.answers[question.id] ?? ''}
                onChange={(value) =>
                  form.setData('answers', {
                    ...form.data.answers,
                    [question.id]: value,
                  })
                }
              />
            ))}
            <InputError message={form.errors.answers} />
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={form.processing || questions.length === 0}
              >
                Submit
              </Button>
              <Button asChild variant="outline">
                <Link href={`/${team.slug}/work`}>Cancel</Link>
              </Button>
            </div>
          </form>
        ) : (
          <div className="app-panel p-4">
            <h2 className="font-medium">Not available</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This assignment cannot be opened right now.
            </p>
          </div>
        )}
      </main>
    </>
  );
}

function ReviewView({
  assignment,
  questions,
}: {
  assignment: AttemptAssignment;
  questions: AttemptQuestion[];
}) {
  return (
    <div className="space-y-4">
      <div className="app-panel p-4">
        <CheckCircle2 className="mb-3 size-6 text-emerald-600" />
        <h2 className="font-medium">Submitted</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Score:{' '}
          {assignment.grade_visible
            ? `${assignment.score ?? '--'} / ${assignment.max_score ?? '--'}`
            : 'Hidden until your teacher publishes quiz grades'}
        </p>
      </div>

      {questions.map((question, index) => (
        <ReviewQuestionCard
          key={question.id}
          index={index}
          question={question}
        />
      ))}
    </div>
  );
}

function ReviewQuestionCard({
  index,
  question,
}: {
  index: number;
  question: AttemptQuestion;
}) {
  const isCorrect = question.is_correct === true;

  return (
    <section className="app-card space-y-4 p-4">
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
        ) : (
          <XCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
        )}
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Question {index + 1}
          </p>
          <h2 className="mt-1 font-medium">
            <InlineCodeText text={question.prompt} />
          </h2>
        </div>
      </div>

      <div className="rounded-md border bg-muted/40 p-3 text-sm">
        <p className="text-xs font-medium text-muted-foreground">
          Your answer
        </p>
        <p className="mt-1">
          {question.selected_text ? (
            <InlineCodeText text={question.selected_text} />
          ) : (
            <span className="text-muted-foreground">No answer submitted</span>
          )}
        </p>
      </div>

      {question.correct_answer ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
          <p className="text-xs font-medium">Correct answer</p>
          <p className="mt-1">
            <InlineCodeText text={question.correct_answer} />
          </p>
        </div>
      ) : null}
    </section>
  );
}

function QuestionCard({
  index,
  question,
  value,
  onChange,
}: {
  index: number;
  question: AttemptQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  const isTextQuestion =
    question.type === 'short_answer' || question.type === 'fill_blank';

  return (
    <section className="app-card space-y-4 p-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Question {index + 1}
        </p>
        <h2 className="mt-1 font-medium">
          <InlineCodeText text={question.prompt} />
        </h2>
      </div>

      {isTextQuestion ? (
        <div className="grid gap-2">
          <Label htmlFor={`question-${question.id}`}>Answer</Label>
          <Input
            id={`question-${question.id}`}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            required
          />
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {question.choices.map((choice) => (
            <Button
              key={choice.id}
              type="button"
              variant={value === choice.id ? 'secondary' : 'outline'}
              className="h-auto justify-start whitespace-normal py-3 text-left"
              onClick={() => onChange(choice.id)}
            >
              <InlineCodeText text={choice.text} />
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

AssignmentAttempt.layout = (props: { team?: Team }) => ({
  breadcrumbs: [
    {
      title: 'Work',
      href: props.team ? `/${props.team.slug}/work` : '#',
    },
    {
      title: 'Attempt',
      href: '#',
    },
  ],
});
