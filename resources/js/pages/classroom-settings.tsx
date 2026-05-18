import { Head, usePage } from '@inertiajs/react';
import {
  CalendarClock,
  ClipboardCheck,
  Percent,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const gradeWeights = [
  { label: 'Chapter reading', value: 20 },
  { label: 'Homework', value: 35 },
  { label: 'Quizzes', value: 45 },
];

const classroomTasks = [
  'Review grade weight totals before the semester begins',
  'Set late work and retake expectations',
  'Choose which chapter activities count toward completion',
];

export default function ClassroomSettings() {
  const { auth, currentTeam } = usePage().props;
  const isTeacher = auth.user.role === 'teacher';
  const totalWeight = gradeWeights.reduce(
    (total, weight) => total + weight.value,
    0,
  );

  return (
    <>
      <Head title="Classroom" />

      <main className="min-h-[calc(100vh-5rem)] space-y-6 bg-muted/30 p-4">
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
        ) : !isTeacher ? (
          <div className="app-panel p-4 text-sm text-muted-foreground">
            Classroom setup is available to teachers.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <section className="app-panel">
              <div className="app-panel-header">
                <span className="ink-accent-icon mb-4">
                  <Percent className="size-5 text-black" />
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
                        readOnly
                        className="pr-8"
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
                    <span className="font-medium text-foreground">
                      {totalWeight}%
                    </span>
                  </p>
                  <Button disabled>Save weights</Button>
                </div>
              </div>
            </section>

            <aside className="space-y-4">
              <section className="app-card p-4">
                <span className="ink-accent-icon mb-4">
                  <Settings2 className="size-5 text-black" />
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
                  <ClipboardCheck className="size-5 text-black" />
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
                  <CalendarClock className="size-5 text-black" />
                </span>
                <h2 className="font-medium">Semester Window</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Add start and end dates here once classroom-wide scheduling is
                  backed by the database.
                </p>
              </section>
            </aside>
          </div>
        )}
      </main>
    </>
  );
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
