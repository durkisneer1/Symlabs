import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Team, TeamStudent } from '@/types';

export default function ClassroomRoster() {
  const { currentTeam, currentTeamStudents } = usePage().props;

  return (
    <>
      <Head title="Roster" />

      <main className="min-h-[calc(100vh-5rem)] space-y-6 p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {currentTeam?.name ?? 'Classroom'}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Roster</h1>
          <div className="ink-accent-rule mt-3" />
        </div>

        {!currentTeam ? (
          <div className="app-panel p-4 text-sm text-muted-foreground">
            Choose a classroom to view students.
          </div>
        ) : (
          <RosterTable students={currentTeamStudents} team={currentTeam} />
        )}
      </main>
    </>
  );
}

function RosterTable({
  students,
  team,
}: {
  students: TeamStudent[];
  team: Team;
}) {
  const averageCompletion =
    students.length === 0
      ? null
      : Math.round(
          students.reduce(
            (total, student) => total + (student.completion_percentage ?? 0),
            0,
          ) / students.length,
        );
  const averageGrade = average(
    students
      .map((student) => student.overall_grade)
      .filter((grade): grade is number => grade !== null),
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="app-panel p-4">
          <span className="ink-accent-icon mb-4">
            <Users className="size-5" />
          </span>
          <p className="text-2xl font-semibold">{students.length}</p>
          <p className="text-sm text-muted-foreground">
            {students.length === 1 ? 'Student' : 'Students'}
          </p>
        </div>
        <div className="app-panel p-4">
          <p className="text-2xl font-semibold">
            {averageCompletion === null ? '--' : `${averageCompletion}%`}
          </p>
          <p className="text-sm text-muted-foreground">Average completion</p>
        </div>
        <div className="app-panel p-4">
          <p className="text-2xl font-semibold">
            {averageGrade === null ? '--' : `${averageGrade}%`}
          </p>
          <p className="text-sm text-muted-foreground">Average grade</p>
        </div>
      </div>

      <div className="app-panel">
        <div className="app-panel-header">
          <h2 className="font-medium">Students</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Roster and early progress signals for this classroom.
          </p>
        </div>

        {students.length > 0 ? (
          <div className="p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Last active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="whitespace-normal">
                      <div className="font-medium">{student.name}</div>
                      <div className="text-muted-foreground">
                        {student.email}
                      </div>
                    </TableCell>
                    <TableCell>{student.started_assignments_count}</TableCell>
                    <TableCell>
                      <div className="min-w-32 space-y-1">
                        <Progress value={student.completion_percentage ?? 0} />
                        <span className="text-muted-foreground">
                          {student.completion_percentage === null
                            ? '--'
                            : `${student.completion_percentage}%`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.overall_grade === null
                        ? '--'
                        : `${student.overall_grade}%`}
                    </TableCell>
                    <TableCell>{formatDate(student.last_active_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/${team.slug}/students/${student.id}`}>
                          <Eye />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="p-4 text-sm text-muted-foreground">
            No students have joined {team.name} yet.
          </p>
        )}
      </div>
    </div>
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

function average(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  );
}

ClassroomRoster.layout = (props: { currentTeam?: { slug: string } | null }) => ({
  breadcrumbs: [
    {
      title: 'Roster',
      href: props.currentTeam ? `/${props.currentTeam.slug}/roster` : '#',
    },
  ],
});
