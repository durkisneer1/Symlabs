import { type FormEvent } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { MessageSquareText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ClassroomQuestion, Team } from '@/types';

export default function ClassroomQuestions() {
  const { auth, currentTeam, currentTeamQuestions } = usePage().props;

  return (
    <>
      <Head title="Q&A" />

      <main className="min-h-[calc(100vh-5rem)] space-y-6 bg-muted/30 p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {currentTeam?.name ?? 'Classroom'}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Q&amp;A</h1>
          <div className="ink-accent-rule mt-3" />
        </div>

        {!currentTeam ? (
          <div className="app-panel p-4 text-sm text-muted-foreground">
            Choose a classroom to use Q&amp;A.
          </div>
        ) : auth.user.role === 'student' ? (
          <StudentQuestions team={currentTeam} questions={currentTeamQuestions} />
        ) : (
          <TeacherQuestions team={currentTeam} questions={currentTeamQuestions} />
        )}
      </main>
    </>
  );
}

function StudentQuestions({
  team,
  questions,
}: {
  team: Team;
  questions: ClassroomQuestion[];
}) {
  const form = useForm({
    question: '',
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.post(`/${team.slug}/questions`, {
      preserveScroll: true,
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="space-y-6">
      <section className="max-w-3xl space-y-3">
        <div className="flex items-start gap-3">
          <div className="ink-accent-icon mt-0.5">
            <MessageSquareText className="size-5" />
          </div>
          <div>
            <h2 className="font-medium">Ask An Anonymous Question</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your teacher can respond without seeing your name. Only you can
              see the response tied to your question.
            </p>
          </div>
        </div>

        <form className="space-y-3" onSubmit={submit}>
          <Textarea
            className="min-h-28 bg-background text-sm"
            value={form.data.question}
            onChange={(event) => form.setData('question', event.target.value)}
            required
          />
          {form.errors.question ? (
            <p className="text-sm text-destructive">{form.errors.question}</p>
          ) : null}
          <Button type="submit" disabled={form.processing}>
            Send question
          </Button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Your Questions
        </h2>
        {questions.length > 0 ? (
          <div className="grid gap-3">
            {questions.map((question) => (
              <div key={question.id} className="app-card space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      You asked
                    </p>
                    <p className="mt-1 text-sm">{question.question}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      router.delete(`/${team.slug}/questions/${question.id}`, {
                        preserveScroll: true,
                      })
                    }
                    aria-label="Delete question"
                  >
                    <Trash2 />
                  </Button>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Teacher response
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {question.response ?? 'No response yet.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="app-panel p-4 text-sm text-muted-foreground">
            No questions yet.
          </p>
        )}
      </section>
    </div>
  );
}

function TeacherQuestions({
  team,
  questions,
}: {
  team: Team;
  questions: ClassroomQuestion[];
}) {
  return (
    <div className="space-y-6">
      <section className="max-w-3xl">
        <div className="flex items-start gap-3">
          <div className="ink-accent-icon mt-0.5">
            <MessageSquareText className="size-5" />
          </div>
          <div>
            <h2 className="font-medium">Anonymous Questions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Students can ask without revealing who they are. Your responses go
              back only to the student who asked.
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Student Questions
        </h2>
        {questions.length > 0 ? (
          <div className="grid gap-3">
            {questions.map((question) => (
              <TeacherQuestionResponse
                key={question.id}
                question={question}
                team={team}
              />
            ))}
          </div>
        ) : (
          <p className="app-panel p-4 text-sm text-muted-foreground">
            No anonymous questions yet.
          </p>
        )}
      </div>
    </div>
  );
}

function TeacherQuestionResponse({
  question,
  team,
}: {
  question: ClassroomQuestion;
  team: Team;
}) {
  const form = useForm({
    response: question.response ?? '',
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.post(`/${team.slug}/questions/${question.id}/respond`, {
      preserveScroll: true,
    });
  };

  return (
    <div className="app-card space-y-3 p-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Anonymous student asked
        </p>
        <p className="mt-1 text-sm">{question.question}</p>
      </div>

      <form className="space-y-2" onSubmit={submit}>
        <Textarea
          className="min-h-20 bg-background text-sm"
          value={form.data.response}
          onChange={(event) => form.setData('response', event.target.value)}
          required
        />
        {form.errors.response ? (
          <p className="text-sm text-destructive">{form.errors.response}</p>
        ) : null}
        <Button type="submit" size="sm" disabled={form.processing}>
          {question.response ? 'Update response' : 'Send response'}
        </Button>
      </form>
    </div>
  );
}

ClassroomQuestions.layout = (props: { currentTeam?: { slug: string } | null }) => ({
  breadcrumbs: [
    {
      title: 'Q&A',
      href: props.currentTeam ? `/${props.currentTeam.slug}/questions` : '#',
    },
  ],
});
