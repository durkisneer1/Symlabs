import { Head, Link, router, usePage } from '@inertiajs/react';
import {
  ClipboardList,
  GraduationCap,
  LibraryBig,
  MessageSquareText,
  Pencil,
  School,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { accept as acceptInvitation } from '@/routes/invitations';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import type {
  Assignment,
  ClassroomQuestion,
  Team,
  TeamInvitation,
  TeamStudent,
} from '@/types';

export default function Dashboard() {
  const {
    auth,
    currentTeam,
    currentTeamAssignments,
    currentTeamQuestions,
    currentTeamStudents,
    pendingTeamInvitations,
    teams,
  } = usePage().props;
  const accountRole = auth.user.role;
  const classroomRole = currentTeam?.role;
  const isAdmin = accountRole === 'admin';
  const canManageCurrentClassroom =
    classroomRole === 'teacher' || classroomRole === 'admin';

  return (
    <>
      <Head title="Overview" />

      <div className="min-h-[calc(100vh-5rem)] space-y-6 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {currentTeam?.name ?? roleLabel(accountRole)}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          </div>
        </div>

        {isAdmin && !currentTeam ? <AdminDashboard /> : null}
        {canManageCurrentClassroom ? (
          <TeacherDashboard
            assignments={currentTeamAssignments}
            currentTeam={currentTeam}
            questions={currentTeamQuestions}
            students={currentTeamStudents}
            teams={teams}
          />
        ) : null}
        {!isAdmin && (!currentTeam || classroomRole === 'student') ? (
          <StudentDashboard
            assignments={currentTeamAssignments}
            currentTeam={currentTeam}
            pendingInvitations={pendingTeamInvitations}
            questions={currentTeamQuestions}
            teams={teams}
          />
        ) : null}
      </div>
    </>
  );
}

function AdminDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Link
        href="/admin/quizzes"
        className="app-panel app-card-link toy-purple group p-4"
      >
        <span className="ink-accent-icon mb-8">
          <LibraryBig className="size-5" />
        </span>
        <h2 className="font-medium">Quiz Bank</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create reusable chapter quizzes for teachers to include in their
          classes.
        </p>
      </Link>
      <Link
        href="/admin/users"
        className="app-panel app-card-link toy-green group p-4"
      >
        <span className="ink-accent-icon mb-8">
          <ShieldCheck className="size-5" />
        </span>
        <h2 className="font-medium">Users</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Invite trusted admins and remove obvious bot accounts.
        </p>
      </Link>
    </div>
  );
}

function TeacherDashboard({
  assignments,
  currentTeam,
  questions,
  students,
  teams,
}: {
  assignments: Assignment[];
  currentTeam: Team | null;
  questions: ClassroomQuestion[];
  students: TeamStudent[];
  teams: Team[];
}) {
  if (!currentTeam) {
    return (
      <div className="app-panel p-4">
        <School className="mb-4 size-6 text-muted-foreground" />
        <h2 className="font-medium">Classrooms</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {teams.length > 0
            ? 'Choose a classroom from the switcher to manage assignments and students.'
            : 'No classrooms yet. Create one when you are ready to teach a class.'}
        </p>
      </div>
    );
  }
  const averageGrade = average(
    students
      .map((student) => student.overall_grade)
      .filter((grade): grade is number => grade !== null),
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href={`/${currentTeam.slug}/roster`}
          className="app-panel app-card-link toy-green block p-4"
        >
          <span className="ink-accent-icon mb-4">
            <Users className="size-5" />
          </span>
          <p className="text-2xl font-semibold">{students.length}</p>
          <p className="text-sm text-muted-foreground">
            {students.length === 1 ? 'Student' : 'Students'}
          </p>
        </Link>
        <div className="app-panel toy-yellow p-4">
          <span className="ink-accent-icon mb-4">
            <GraduationCap className="size-5" />
          </span>
          <p className="text-2xl font-semibold">
            {averageGrade === null ? '--' : `${averageGrade}%`}
          </p>
          <p className="text-sm text-muted-foreground">
            Average grade once assignments exist
          </p>
        </div>
        <Link
          href={`/${currentTeam.slug}/questions`}
          className="app-panel app-card-link toy-pink block p-4"
        >
          <span className="ink-accent-icon mb-4">
            <MessageSquareText className="size-5" />
          </span>
          <p className="text-2xl font-semibold">{questions.length}</p>
          <p className="text-sm text-muted-foreground">
            {questions.filter((question) => question.response).length} answered
          </p>
        </Link>
      </div>

      <div className="app-panel">
        <div className="app-panel-header flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-medium">Assigned Coursework</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Work students can complete inside this classroom.
            </p>
          </div>
          <Button asChild>
            <Link href={`/${currentTeam.slug}/coursework/create`}>
              Assign Coursework
            </Link>
          </Button>
        </div>

        {assignments.length > 0 ? (
          <div className="space-y-2 p-3">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="app-row app-row-link grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_120px_140px_140px_120px]"
              >
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {assignment.type_label}
                    {assignment.assignable
                      ? `: ${assignment.assignable.title}`
                      : ''}
                  </p>
                </div>
                <Metric
                  label="Course"
                  value={assignment.course_slug.toUpperCase()}
                />
                <Metric label="Due" value={formatDate(assignment.due_at)} />
                <Metric
                  label={assignment.type === 'quiz' ? 'Grades' : 'Progress'}
                  value={
                    assignment.type === 'quiz'
                      ? assignment.settings.grades_published
                        ? 'Published'
                        : 'Hidden'
                      : assignment.type === 'chapter_reading'
                        ? 'Complete / incomplete'
                        : 'Percentage'
                  }
                />
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {assignment.type === 'quiz' &&
                  !assignment.settings.grades_published ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        router.post(
                          `/${currentTeam.slug}/coursework/${assignment.id}/publish-grades`,
                          {},
                          { preserveScroll: true },
                        )
                      }
                    >
                      Publish grades
                    </Button>
                  ) : null}
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={`/${currentTeam.slug}/coursework/${assignment.id}/edit`}
                      className="gap-1"
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-4 text-sm text-muted-foreground">
            No coursework assigned yet. Add a chapter reading, homework set, or
            quiz when you are ready.
          </p>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
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

function StudentDashboard({
  assignments,
  currentTeam,
  pendingInvitations,
  questions,
  teams,
}: {
  assignments: Assignment[];
  currentTeam: Team | null;
  pendingInvitations: TeamInvitation[];
  questions: ClassroomQuestion[];
  teams: Team[];
}) {
  const completedAssignments = assignments.filter(
    (assignment) => assignment.status === 'completed',
  ).length;
  const answeredQuestions = questions.filter(
    (question) => question.response,
  ).length;
  const gradeAverage = currentTeam
    ? studentGrade(assignments, currentTeam.gradeWeights)
    : null;

  return (
    <div className="space-y-4">
      {pendingInvitations.length > 0 ? (
        <div className="app-panel p-4">
          <School className="mb-4 size-6 text-muted-foreground" />
          <h2 className="font-medium">Classroom Invitations</h2>
          <div className="mt-4 space-y-2">
            {pendingInvitations.map((invitation) => (
              <div
                key={invitation.code}
                className="app-row flex flex-wrap items-center justify-between gap-3 p-3"
              >
                <div>
                  <p className="font-medium">
                    {invitation.team?.name ?? 'Classroom invitation'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Invited by {invitation.inviter?.name ?? 'a teacher'} as{' '}
                    {invitation.role_label.toLowerCase()}
                  </p>
                </div>
                <Link
                  href={acceptInvitation(invitation.code)}
                  className="border bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                >
                  Accept
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {currentTeam ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href={`/${currentTeam.slug}/work`}
            className="app-panel app-card-link toy-cyan block p-4"
          >
            <span className="ink-accent-icon mb-4">
              <ClipboardList className="size-5" />
            </span>
            <p className="text-2xl font-semibold">{assignments.length}</p>
            <p className="text-sm text-muted-foreground">
              {completedAssignments} completed
            </p>
          </Link>
          <Link
            href={`/${currentTeam.slug}/questions`}
            className="app-panel app-card-link toy-pink block p-4"
          >
            <span className="ink-accent-icon mb-4">
              <MessageSquareText className="size-5" />
            </span>
            <p className="text-2xl font-semibold">{questions.length}</p>
            <p className="text-sm text-muted-foreground">
              {answeredQuestions} answered
            </p>
          </Link>
          <div className="app-panel toy-yellow p-4">
            <span className="ink-accent-icon mb-4">
              <GraduationCap className="size-5" />
            </span>
            <p className="text-2xl font-semibold">
              {gradeAverage === null ? '--' : `${gradeAverage}%`}
            </p>
            <p className="text-sm text-muted-foreground">Current grade</p>
          </div>
        </div>
      ) : (
        <div className="app-panel p-4">
          <School className="mb-4 size-6 text-muted-foreground" />
          <h2 className="font-medium">Classroom</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {teams.length > 0
              ? 'Choose a classroom from the switcher to view your work.'
              : 'No classrooms yet. Join a classroom when your teacher invites you.'}
          </p>
        </div>
      )}
    </div>
  );
}

function roleLabel(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function average(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  );
}

function studentGrade(
  assignments: Assignment[],
  weights:
    | {
        chapter_reading?: number;
        homework?: number;
        quiz?: number;
      }
    | null
    | undefined,
) {
  const resolvedWeights = {
    chapter_reading: weights?.chapter_reading ?? 20,
    homework: weights?.homework ?? 35,
    quiz: weights?.quiz ?? 45,
  };
  let weightedScore = 0;
  let activeWeight = 0;

  (['chapter_reading', 'homework', 'quiz'] as const).forEach((type) => {
    const typedAssignments = assignments.filter(
      (assignment) => assignment.type === type,
    );

    if (typedAssignments.length === 0) {
      return;
    }

    const categoryAverage = average(
      typedAssignments.map((assignment) => assignmentPercentage(assignment)),
    );

    if (categoryAverage === null) {
      return;
    }

    weightedScore += categoryAverage * resolvedWeights[type];
    activeWeight += resolvedWeights[type];
  });

  return activeWeight > 0 ? Math.round(weightedScore / activeWeight) : null;
}

function assignmentPercentage(assignment: Assignment) {
  if (assignment.type === 'chapter_reading') {
    return assignment.status === 'completed' ? 100 : 0;
  }

  if (assignment.max_score && Number(assignment.max_score) > 0) {
    return (Number(assignment.score ?? 0) / Number(assignment.max_score)) * 100;
  }

  return assignment.status === 'completed' ? 100 : 0;
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
  breadcrumbs: [
    {
      title: 'Overview',
      href: props.currentTeam
        ? dashboard(props.currentTeam.slug)
        : '/dashboard',
    },
  ],
});
