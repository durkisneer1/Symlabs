import { Head, Link, usePage } from '@inertiajs/react';
import {
  ClipboardList,
  GraduationCap,
  LibraryBig,
  MessageSquareText,
  Pencil,
  School,
  Users,
} from 'lucide-react';
import { accept as acceptInvitation } from '@/routes/invitations';
import { dashboard } from '@/routes';
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
  const effectiveRole = auth.user.role;

  return (
    <>
      <Head title="Overview" />

      <div className="min-h-[calc(100vh-5rem)] space-y-6 bg-muted/30 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {currentTeam?.name ?? roleLabel(effectiveRole)}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          </div>
        </div>

        {effectiveRole === 'admin' ? <AdminDashboard /> : null}
        {effectiveRole === 'teacher' ? (
          <TeacherDashboard
            assignments={currentTeamAssignments}
            currentTeam={currentTeam}
            questions={currentTeamQuestions}
            students={currentTeamStudents}
            teams={teams}
          />
        ) : null}
        {effectiveRole === 'student' ? (
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
        className="app-panel group p-4 transition-colors hover:bg-muted/50"
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

  return (
    <div className="space-y-4">
      <div className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href={`/${currentTeam.slug}/roster`}
          className="app-card app-card-link block p-4"
        >
          <span className="ink-accent-icon mb-4">
            <Users className="size-5 text-black" />
          </span>
          <p className="text-2xl font-semibold">{students.length}</p>
          <p className="text-sm text-muted-foreground">
            {students.length === 1 ? 'Student' : 'Students'}
          </p>
        </Link>
        <div className="app-card p-4">
          <span className="ink-accent-icon mb-4">
            <GraduationCap className="size-5 text-black" />
          </span>
          <p className="text-2xl font-semibold">--</p>
          <p className="text-sm text-muted-foreground">
            Average grade once assignments exist
          </p>
        </div>
        <Link
          href={`/${currentTeam.slug}/questions`}
          className="app-card app-card-link block p-4"
        >
          <span className="ink-accent-icon mb-4">
            <MessageSquareText className="size-5 text-black" />
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
          <Link
            href={`/${currentTeam.slug}/coursework/create`}
            className="border bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-[0_6px_18px_rgb(0_0_0/0.12)]"
          >
            Assign Coursework
          </Link>
        </div>

        {assignments.length > 0 ? (
          <div className="space-y-2 p-3">
            {assignments.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/${currentTeam.slug}/coursework/${assignment.id}/edit`}
                className="app-row app-row-link grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_120px_140px_100px_80px]"
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
                  label="Progress"
                  value={
                    assignment.type === 'chapter_reading'
                      ? 'Complete / incomplete'
                      : 'Percentage'
                  }
                />
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Pencil className="size-3.5" />
                  Edit
                </div>
              </Link>
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
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <Link
            href={`/${currentTeam.slug}/work`}
            className="app-card app-card-link block p-4"
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
            className="app-card app-card-link block p-4"
          >
            <span className="ink-accent-icon mb-4">
              <MessageSquareText className="size-5" />
            </span>
            <p className="text-2xl font-semibold">{questions.length}</p>
            <p className="text-sm text-muted-foreground">
              {answeredQuestions} answered
            </p>
          </Link>
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
