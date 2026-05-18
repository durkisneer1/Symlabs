import type { ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BarChart3, CheckCircle2, Clock, GraduationCap } from 'lucide-react';
import { Cell, Pie, PieChart } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
  const completion = summary.completion_percentage ?? 0;
  const completionData = [
    { status: 'completed', value: completion, fill: 'var(--color-completed)' },
    {
      status: 'remaining',
      value: Math.max(100 - completion, 0),
      fill: 'var(--color-remaining)',
    },
  ];
  return (
    <>
      <Head title={`${student.name} | Progress`} />

      <main className="space-y-6 p-4">
        <div className="space-y-4">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/${team.slug}/roster`}>
              <ArrowLeft /> Roster
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
            label="Score Average"
            value={
              summary.overall_grade === null
                ? '--'
                : `${summary.overall_grade}%`
            }
          />
          <MetricCard
            icon={<Clock />}
            label="Last worked"
            value={formatDate(summary.last_worked_at)}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Completion Mix</CardTitle>
              <CardDescription>
                Completed coursework versus what remains open.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <ChartContainer
                  config={completionChartConfig}
                  className="mx-auto aspect-square max-h-64"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={completionData}
                      dataKey="value"
                      nameKey="status"
                      innerRadius={62}
                      outerRadius={86}
                      strokeWidth={0}
                    >
                      {completionData.map((entry) => (
                        <Cell key={entry.status} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold">
                    {summary.completion_percentage === null
                      ? '--'
                      : `${summary.completion_percentage}%`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    complete
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <StudentWorkTabs assignments={assignments} summary={summary} />
        </div>
      </main>
    </>
  );
}

StudentAnalytics.layout = (props: { team?: Team; student?: Student }) => ({
  breadcrumbs: [
    {
      title: props.team?.name ?? 'Classroom',
      href: props.team ? `/${props.team.slug}/roster` : '/dashboard',
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
  icon: ReactNode;
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

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="border bg-muted/40 p-3">
      <p className="text-sm font-medium">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

const completionChartConfig = {
  completed: {
    label: 'Completed',
    color: 'var(--primary)',
  },
  remaining: {
    label: 'Remaining',
    color: 'var(--muted)',
  },
} satisfies ChartConfig;

function StudentWorkTabs({
  assignments,
  summary,
}: {
  assignments: StudentAssignment[];
  summary: Summary;
}) {
  return (
    <Tabs defaultValue="coursework">
      <TabsList>
        <TabsTrigger value="coursework">Coursework</TabsTrigger>
        <TabsTrigger value="signals">Signals</TabsTrigger>
      </TabsList>

      <TabsContent value="coursework">
        <Card>
          <CardHeader>
            <CardTitle>Coursework</CardTitle>
            <CardDescription>
              Started assignments, completion status, and score data will
              appear here as students work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="whitespace-normal">
                        <div className="font-medium">{assignment.title}</div>
                        <div className="text-muted-foreground">
                          {assignment.type_label}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(assignment.due_at)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            assignment.status === 'completed'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assignment.score === null ||
                        assignment.max_score === null
                          ? '--'
                          : `${assignment.score}/${assignment.max_score}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No coursework has been assigned in this classroom yet.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="signals">
        <Card>
          <CardHeader>
            <CardTitle>Learning Signals</CardTitle>
            <CardDescription>
              These become more useful once chapter activities, homework
              attempts, and quizzes start producing events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Signal label="Needs more attempts" value="--" />
              <Signal label="Recent momentum" value="--" />
              <Signal
                label="Last worked"
                value={formatDate(summary.last_worked_at)}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
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
