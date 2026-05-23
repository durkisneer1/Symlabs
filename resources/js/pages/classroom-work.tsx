import { Head, Link, usePage } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Assignment, Team } from '@/types';

export default function ClassroomWork() {
  const { currentTeam, currentTeamAssignments } = usePage().props;
  const completed = currentTeamAssignments.filter(
    (assignment) => assignment.status === 'completed',
  ).length;

  return (
    <>
      <Head title="Work" />

      <main className="min-h-[calc(100vh-5rem)] space-y-6 p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {currentTeam?.name ?? 'Classroom'}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Work</h1>
          <div className="ink-accent-rule mt-3" />
        </div>

        {!currentTeam ? (
          <div className="app-panel p-4 text-sm text-muted-foreground">
            Choose a classroom to view your assigned work.
          </div>
        ) : (
          <StudentWork
            assignments={currentTeamAssignments}
            completed={completed}
            team={currentTeam}
          />
        )}
      </main>
    </>
  );
}

function StudentWork({
  assignments,
  completed,
  team,
}: {
  assignments: Assignment[];
  completed: number;
  team: Team;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="app-panel p-4">
          <span className="ink-accent-icon mb-4">
            <ClipboardList className="size-5" />
          </span>
          <p className="text-2xl font-semibold">{assignments.length}</p>
          <p className="text-sm text-muted-foreground">Assigned</p>
        </div>
        <div className="app-panel p-4">
          <p className="text-2xl font-semibold">{completed}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
        <div className="app-panel p-4">
          <p className="text-2xl font-semibold">
            {assignments.length === 0
              ? '--'
              : `${Math.round((completed / assignments.length) * 100)}%`}
          </p>
          <p className="text-sm text-muted-foreground">Completion</p>
        </div>
      </div>

      <div className="app-panel">
        <div className="app-panel-header">
          <h2 className="font-medium">Classroom Work</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Chapter readings complete automatically once every required activity
            is done.
          </p>
        </div>

        {assignments.length > 0 ? (
          <div className="p-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="text-right">Open</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="whitespace-normal">
                      <div className="font-medium">{assignment.title}</div>
                      {assignment.assignable ? (
                        <div className="text-muted-foreground">
                          {assignment.assignable.title}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>{assignment.type_label}</TableCell>
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
                    <TableCell>{gradeLabel(assignment)}</TableCell>
                    <TableCell>
                      {assignment.actions.length > 0 ? (
                        <div className="flex flex-wrap justify-end gap-2">
                          {assignment.actions.map((action) => (
                            <Button
                              key={action.href}
                              asChild
                              size="sm"
                              variant="outline"
                            >
                              <Link href={action.href}>{action.label}</Link>
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <span className="block text-right text-muted-foreground">
                          Soon
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="p-4 text-sm text-muted-foreground">
            No work has been assigned in {team.name} yet.
          </p>
        )}
      </div>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function gradeLabel(assignment: Assignment) {
  if (assignment.status !== 'completed') {
    return '--';
  }

  if (!assignment.grade_visible) {
    return 'Hidden';
  }

  if (assignment.type === 'chapter_reading') {
    return '100%';
  }

  if (assignment.max_score && Number(assignment.max_score) > 0) {
    return `${Math.round((Number(assignment.score ?? 0) / Number(assignment.max_score)) * 100)}%`;
  }

  return '--';
}

ClassroomWork.layout = (props: { currentTeam?: { slug: string } | null }) => ({
  breadcrumbs: [
    {
      title: 'Work',
      href: props.currentTeam ? `/${props.currentTeam.slug}/work` : '#',
    },
  ],
});
