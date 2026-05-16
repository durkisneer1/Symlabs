import { Head, Link, usePage } from '@inertiajs/react';
import { GraduationCap, LibraryBig, School } from 'lucide-react';
import { dashboard } from '@/routes';
import type { Team } from '@/types';

type ViewAs = 'teacher' | 'student';

export default function Dashboard() {
  const { auth, currentTeam, teams } = usePage().props;
  const params = new URLSearchParams(
    typeof window === 'undefined' ? '' : window.location.search,
  );
  const requestedView = params.get('view_as');
  const viewAs: ViewAs | null =
    auth.user.role === 'admin' &&
    (requestedView === 'teacher' || requestedView === 'student')
      ? requestedView
      : null;
  const effectiveRole = viewAs ?? auth.user.role;

  return (
    <>
      <Head title="Dashboard" />

      <div className="space-y-6 p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {currentTeam?.name ?? roleLabel(effectiveRole)}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Dashboard
            </h1>
          </div>

          {auth.user.role === 'admin' ? (
            <div className="flex gap-2">
              <Link
                href="/dashboard"
                className={viewAs === null ? activeToggle : inactiveToggle}
              >
                Admin
              </Link>
              <Link
                href="/dashboard?view_as=teacher"
                className={
                  viewAs === 'teacher' ? activeToggle : inactiveToggle
                }
              >
                Teacher
              </Link>
              <Link
                href="/dashboard?view_as=student"
                className={
                  viewAs === 'student' ? activeToggle : inactiveToggle
                }
              >
                Student
              </Link>
            </div>
          ) : null}
        </div>

        {effectiveRole === 'admin' ? <AdminDashboard /> : null}
        {effectiveRole === 'teacher' ? (
          <TeacherDashboard teams={teams} />
        ) : null}
        {effectiveRole === 'student' ? (
          <StudentDashboard currentTeam={currentTeam} teams={teams} />
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
        className="group border p-4 transition-colors hover:bg-muted/50"
      >
        <LibraryBig className="mb-8 size-6 text-muted-foreground group-hover:text-foreground" />
        <h2 className="font-medium">Quiz Bank</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create reusable chapter quizzes for teachers to include in their
          classes.
        </p>
      </Link>
    </div>
  );
}

function TeacherDashboard({ teams }: { teams: Team[] }) {
  return (
    <div className="border p-4">
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

function StudentDashboard({
  currentTeam,
  teams,
}: {
  currentTeam: Team | null;
  teams: Team[];
}) {
  return (
    <div className="border p-4">
      <GraduationCap className="mb-4 size-6 text-muted-foreground" />
      <h2 className="font-medium">Classroom Work</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {currentTeam
          ? `You are viewing ${currentTeam.name}. Assigned course work will appear here.`
          : teams.length > 0
            ? 'Choose a classroom from the switcher to view assigned work.'
            : 'No classrooms yet. Join a classroom when your teacher invites you.'}
      </p>
    </div>
  );
}

function roleLabel(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

const activeToggle =
  'border bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground';
const inactiveToggle =
  'border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted';

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
  breadcrumbs: [
    {
      title: 'Dashboard',
      href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/dashboard',
    },
  ],
});
