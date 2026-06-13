import { type FormEvent } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
  CalendarClock,
  ClipboardCheck,
  Percent,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const classroomTasks = [
  'Review grade weight totals before the semester begins',
  'Set late work and retake expectations',
  'Choose which chapter activities count toward completion',
];

export default function ClassroomSettings() {
  const { currentTeam } = usePage().props;
  const canManageClassroom =
    currentTeam?.role === 'teacher' || currentTeam?.role === 'admin';
  const form = useForm({
    grade_weights: {
      chapter_reading: currentTeam?.gradeWeights?.chapter_reading ?? 20,
      homework: currentTeam?.gradeWeights?.homework ?? 35,
      quiz: currentTeam?.gradeWeights?.quiz ?? 45,
    },
    semester_starts_at: toDateTimeLocal(currentTeam?.semesterStartsAt),
    semester_ends_at: toDateTimeLocal(currentTeam?.semesterEndsAt),
  });
  const gradeWeights = [
    {
      key: 'chapter_reading' as const,
      label: 'Chapter reading',
      value: form.data.grade_weights.chapter_reading,
    },
    {
      key: 'homework' as const,
      label: 'Homework',
      value: form.data.grade_weights.homework,
    },
    {
      key: 'quiz' as const,
      label: 'Quizzes',
      value: form.data.grade_weights.quiz,
    },
  ];
  const totalWeight = gradeWeights.reduce(
    (total, weight) => total + weight.value,
    0,
  );
  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (!currentTeam) {
      return;
    }

    form.put(`/${currentTeam.slug}/classroom`, {
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title="Classroom" />

      <main className="toy-yellow min-h-[calc(100vh-5rem)] space-y-6 p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {currentTeam?.name ?? 'Classroom'}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Classroom</h1>
          <div className="ink-accent-rule mt-3" />
        </div>

        {!currentTeam ? (
          <div className="app-panel p-4 text-sm text-muted-foreground">
            Choose a classroom to manage its grading setup.
          </div>
        ) : !canManageClassroom ? (
          <div className="app-panel p-4 text-sm text-muted-foreground">
            Classroom setup is available to classroom teachers and admins.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <form className="app-panel" onSubmit={submit}>
              <div className="app-panel-header">
                <span className="ink-accent-icon mb-4">
                  <Percent className="size-5" />
                </span>
                <h2 className="font-medium">Grade Weights</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set the broad scoring recipe for this classroom.
                </p>
              </div>

              <div className="mt-4 space-y-3 p-4 pt-0">
                {gradeWeights.map((weight) => (
                  <div
                    key={weight.label}
                    className="app-row grid gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_8rem]"
                  >
                    <Label
                      htmlFor={`weight-${weight.label}`}
                      className="self-center text-sm font-medium"
                    >
                      {weight.label}
                    </Label>
                    <div className="relative">
                      <Input
                        id={`weight-${weight.label}`}
                        value={weight.value}
                        type="number"
                        min={0}
                        max={100}
                        className="pr-8"
                        onChange={(event) =>
                          form.setData('grade_weights', {
                            ...form.data.grade_weights,
                            [weight.key]: Number(event.target.value),
                          })
                        }
                      />
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                ))}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Current total:{' '}
                    <span
                      className={`font-medium ${totalWeight === 100 ? 'text-foreground' : 'text-destructive'}`}
                    >
                      {totalWeight}%
                    </span>
                  </p>
                  <Button type="submit" disabled={form.processing}>
                    Save weights
                  </Button>
                </div>
                {form.errors.grade_weights ? (
                  <p className="text-sm text-destructive">
                    {form.errors.grade_weights}
                  </p>
                ) : null}
              </div>
            </form>

            <aside className="space-y-4">
              <section className="app-card p-4">
                <span className="ink-accent-icon mb-4">
                  <Settings2 className="size-5" />
                </span>
                <h2 className="font-medium">Assignment Defaults</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <SettingRow label="Late work" value="Allowed until closed" />
                  <SettingRow label="Homework attempts" value="Unlimited" />
                  <SettingRow label="Quiz attempts" value="One attempt" />
                </div>
              </section>

              <section className="app-card p-4">
                <span className="ink-accent-icon mb-4">
                  <ClipboardCheck className="size-5" />
                </span>
                <h2 className="font-medium">Setup Tasks</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {classroomTasks.map((task) => (
                    <li key={task} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="app-card p-4">
                <span className="ink-accent-icon mb-4">
                  <CalendarClock className="size-5" />
                </span>
                <h2 className="font-medium">Semester Window</h2>
                <div className="mt-4 space-y-3">
                  <div className="grid gap-2">
                    <Label htmlFor="semester-start">Starts</Label>
                    <Input
                      id="semester-start"
                      type="datetime-local"
                      value={form.data.semester_starts_at}
                      onChange={(event) =>
                        form.setData('semester_starts_at', event.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="semester-end">Ends</Label>
                    <Input
                      id="semester-end"
                      type="datetime-local"
                      value={form.data.semester_ends_at}
                      onChange={(event) =>
                        form.setData('semester_ends_at', event.target.value)
                      }
                    />
                  </div>
                  {form.errors.semester_ends_at ? (
                    <p className="text-sm text-destructive">
                      {form.errors.semester_ends_at}
                    </p>
                  ) : null}
                </div>
              </section>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

function toDateTimeLocal(value?: string | null) {
  if (!value) {
    return '';
  }

  return value.slice(0, 16);
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

ClassroomSettings.layout = (props: {
  currentTeam?: { slug: string } | null;
}) => ({
  breadcrumbs: [
    {
      title: 'Classroom',
      href: props.currentTeam ? `/${props.currentTeam.slug}/classroom` : '#',
    },
  ],
});
