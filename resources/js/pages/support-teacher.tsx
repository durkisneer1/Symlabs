import { Head, Link } from '@inertiajs/react';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Gauge,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type SupportTeacher = {
  id: number;
  name: string;
  email: string;
  created_at: string | null;
};

type ClassroomStudent = {
  id: number;
  name: string;
  email: string;
  started_assignments_count: number;
  completion_percentage: number | null;
  overall_grade: number | null;
  last_worked_at: string | null;
};

type ClassroomAssignment = {
  id: number;
  title: string;
  type: 'chapter_reading' | 'homework' | 'quiz';
  course_slug: string;
  opens_at: string | null;
  due_at: string | null;
  points: string | number | null;
  submissions_count: number;
  completed_submissions_count: number;
};

type SupportClassroom = {
  id: number;
  name: string;
  slug: string;
  semester_starts_at: string | null;
  semester_ends_at: string | null;
  semester_active: boolean;
  grade_weights: {
    chapter_reading: number;
    homework: number;
    quiz: number;
  };
  average_class_score: number | null;
  students: ClassroomStudent[];
  assignments: ClassroomAssignment[];
};

type Props = {
  supportTeacher: SupportTeacher;
  classrooms: SupportClassroom[];
};

export default function SupportTeacher({ supportTeacher, classrooms }: Props) {
  return (
    <>
      <Head title={`${supportTeacher.name} Course Summary`} />

      <main className="min-h-[calc(100vh-5rem)] space-y-6 bg-muted/30 p-4">
        <div className="space-y-3">
          <Link
            href="/support"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Support
          </Link>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {supportTeacher.email}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {supportTeacher.name}
            </h1>
            <div className="ink-accent-rule mt-3" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            icon={<BookOpen className="size-5" />}
            value={classrooms.length}
            label={classrooms.length === 1 ? 'Classroom' : 'Classrooms'}
          />
          <MetricCard
            icon={<Users className="size-5" />}
            value={classrooms.reduce(
              (total, classroom) => total + classroom.students.length,
              0,
            )}
            label="Students"
          />
          <MetricCard
            icon={<Gauge className="size-5" />}
            value={formatPercent(averageClassScore(classrooms))}
            label="Average class score"
          />
        </div>

        {classrooms.length > 0 ? (
          <div className="space-y-4">
            {classrooms.map((classroom) => (
              <ClassroomSummary key={classroom.id} classroom={classroom} />
            ))}
          </div>
        ) : (
          <div className="app-panel p-4 text-sm text-muted-foreground">
            This teacher does not have any classrooms yet.
          </div>
        )}
      </main>
    </>
  );
}

function MetricCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="app-card p-4">
      <span className="ink-accent-icon mb-4">{icon}</span>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ClassroomSummary({ classroom }: { classroom: SupportClassroom }) {
  return (
    <section className="app-panel">
      <div className="app-panel-header">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-medium">{classroom.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {classroom.students.length}{' '}
              {classroom.students.length === 1 ? 'student' : 'students'} ·{' '}
              {classroom.assignments.length}{' '}
              {classroom.assignments.length === 1
                ? 'assignment'
                : 'assignments'}
            </p>
          </div>
          <Badge variant={classroom.semester_active ? 'secondary' : 'outline'}>
            {classroom.semester_active ? 'active' : 'inactive'}
          </Badge>
        </div>
      </div>

      <div className="space-y-4 p-3">
        <div className="grid gap-3 md:grid-cols-3">
          <SummaryBlock
            icon={<CalendarDays className="size-4" />}
            label="Semester"
            value={`${formatDate(classroom.semester_starts_at)} - ${formatDate(
              classroom.semester_ends_at,
            )}`}
          />
          <SummaryBlock
            icon={<Gauge className="size-4" />}
            label="Average class score"
            value={formatPercent(classroom.average_class_score)}
          />
          <SummaryBlock
            icon={<ClipboardList className="size-4" />}
            label="Weights"
            value={`Reading ${classroom.grade_weights.chapter_reading}% · Homework ${classroom.grade_weights.homework}% · Quiz ${classroom.grade_weights.quiz}%`}
          />
        </div>

        <StudentTable classroom={classroom} />
        <AssignmentTable assignments={classroom.assignments} />
      </div>
    </section>
  );
}

function SummaryBlock({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border bg-background p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </div>
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
  );
}

function StudentTable({ classroom }: { classroom: SupportClassroom }) {
  if (classroom.students.length === 0) {
    return (
      <div className="border bg-background p-4 text-sm text-muted-foreground">
        No students have joined this classroom yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Students</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Completion</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Last active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classroom.students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="whitespace-normal">
                <Link
                  href={`/${classroom.slug}/students/${student.id}`}
                  className="font-medium hover:text-primary"
                >
                  {student.name}
                </Link>
                <div className="text-muted-foreground">{student.email}</div>
              </TableCell>
              <TableCell>{student.started_assignments_count}</TableCell>
              <TableCell>
                <div className="min-w-32 space-y-1">
                  <Progress value={student.completion_percentage ?? 0} />
                  <span className="text-muted-foreground">
                    {formatPercent(student.completion_percentage)}
                  </span>
                </div>
              </TableCell>
              <TableCell>{formatPercent(student.overall_grade)}</TableCell>
              <TableCell>{formatDate(student.last_worked_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AssignmentTable({
  assignments,
}: {
  assignments: ClassroomAssignment[];
}) {
  if (assignments.length === 0) {
    return (
      <div className="border bg-background p-4 text-sm text-muted-foreground">
        No coursework has been assigned in this classroom yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Assignments</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Completed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="whitespace-normal font-medium">
                {assignment.title}
              </TableCell>
              <TableCell>{assignmentTypeLabel(assignment.type)}</TableCell>
              <TableCell>{formatDate(assignment.due_at)}</TableCell>
              <TableCell>{assignment.points ?? '--'}</TableCell>
              <TableCell>
                {assignment.completed_submissions_count}/
                {assignment.submissions_count}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function assignmentTypeLabel(type: ClassroomAssignment['type']) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function averageClassScore(classrooms: SupportClassroom[]) {
  const scores = classrooms
    .map((classroom) => classroom.average_class_score)
    .filter((score): score is number => score !== null);

  if (scores.length === 0) {
    return null;
  }

  return scores.reduce((total, score) => total + score, 0) / scores.length;
}

function formatPercent(value: number | null) {
  return value === null ? '--' : `${Math.round(value)}%`;
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

SupportTeacher.layout = {
  breadcrumbs: [
    {
      title: 'Support',
      href: '/support',
    },
  ],
};
