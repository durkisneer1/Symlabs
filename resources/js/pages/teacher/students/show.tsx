import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BarChart3, CheckCircle2, Clock, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Team } from '@/types';

type Student = {
  id: number;
  name: string;
  email: string;
};

type Summary = {
  assigned_count: number;
  completed_count: number;
  completion_percentage: number | null;
  overall_grade: number | null;
  last_worked_at: string | null;
};

type StudentAssignment = {
  id: number;
  type: string;
  type_label: string;
  title: string;
  due_at: string | null;
  status: string;
  completed_at: string | null;
  score: number | null;
  max_score: number | null;
};

type Props = {
  team: Team;
  student: Student;
  summary: Summary;
  assignments: StudentAssignment[];
};

export default function StudentAnalytics({
  team,
  student,
  summary,
  assignments,
}: Props) {
  return (
    <>
      <Head title={`${student.name} | Progress`} />

      <main className="space-y-6 p-4">
        <div className="space-y-4">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/${team.slug}/dashboard`}>
              <ArrowLeft /> Dashboard
            </Link>
          </Button>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {team.name}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {student.name}
            </h1>
            <p className="text-sm text-muted-foreground">{student.email}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            icon={<GraduationCap />}
            label="Assigned"
            value={`${summary.assigned_count}`}
          />
          <MetricCard
            icon={<CheckCircle2 />}
            label="Completed"
            value={`${summary.completed_count}`}
          />
          <MetricCard
            icon={<BarChart3 />}
            label="Completion"
            value={
              summary.completion_percentage === null
                ? '--'
                : `${summary.completion_percentage}%`
            }
          />
          <MetricCard
            icon={<Clock />}
            label="Last worked"
            value={formatDate(summary.last_worked_at)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coursework</CardTitle>
            <CardDescription>
              Started assignments, completion status, and score data will appear
              here as students work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length > 0 ? (
              <div className="divide-y border">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="grid gap-3 p-3 md:grid-cols-[minmax(0,1fr)_120px_140px_120px]"
                  >
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.type_label}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Due
                      </p>
                      <p className="mt-1 text-sm">
                        {formatDate(assignment.due_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Status
                      </p>
                      <Badge
                        className="mt-1"
                        variant={
                          assignment.status === 'completed'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Result
                      </p>
                      <p className="mt-1 text-sm">
                        {assignment.score === null ||
                        assignment.max_score === null
                          ? '--'
                          : `${assignment.score}/${assignment.max_score}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No coursework has been assigned in this classroom yet.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}

StudentAnalytics.layout = (props: { team?: Team; student?: Student }) => ({
  breadcrumbs: [
    {
      title: props.team?.name ?? 'Classroom',
      href: props.team ? `/${props.team.slug}/dashboard` : '/dashboard',
    },
    {
      title: props.student?.name ?? 'Student',
      href: '#',
    },
  ],
});

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-3 text-muted-foreground [&_svg]:size-5">{icon}</div>
        <CardTitle>{value}</CardTitle>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return '--';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}
