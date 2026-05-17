import { type FormEvent } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { GraduationCap, LibraryBig, MessageSquareText, School, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { accept as acceptInvitation } from '@/routes/invitations';
import { dashboard } from '@/routes';
import type {
  Assignment,
  ClassroomQuestion,
  Team,
  TeamInvitation,
  TeamStudent,
} from '@/types';

type ViewAs = 'teacher' | 'student';

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

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border p-4">
          <School className="mb-4 size-6 text-muted-foreground" />
          <h2 className="font-medium">{currentTeam.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Active classroom
          </p>
        </div>
        <div className="border p-4">
          <Users className="mb-4 size-6 text-muted-foreground" />
          <p className="text-2xl font-semibold">{students.length}</p>
          <p className="text-sm text-muted-foreground">
            {students.length === 1 ? 'Student' : 'Students'}
          </p>
        </div>
        <div className="border p-4">
          <GraduationCap className="mb-4 size-6 text-muted-foreground" />
          <p className="text-2xl font-semibold">--</p>
          <p className="text-sm text-muted-foreground">
            Average grade once assignments exist
          </p>
        </div>
      </div>

      <TeacherQuestions team={currentTeam} questions={questions} />

      <div className="border">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
          <div>
            <h2 className="font-medium">Assigned Coursework</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Work students can complete inside this classroom.
            </p>
          </div>
          <Link
            href={`/${currentTeam.slug}/coursework/create`}
            className="border bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          >
            Assign Coursework
          </Link>
        </div>

        {assignments.length > 0 ? (
          <div className="divide-y">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_120px_140px_100px]"
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
                <Metric label="Course" value={assignment.course_slug.toUpperCase()} />
                <Metric label="Due" value={formatDate(assignment.due_at)} />
                <Metric
                  label="Progress"
                  value={
                    assignment.type === 'chapter_reading'
                      ? 'Complete / incomplete'
                      : 'Percentage'
                  }
                />
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

      <div className="border">
        <div className="border-b p-4">
          <h2 className="font-medium">Students</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Roster and early progress signals for this classroom.
          </p>
        </div>

        {students.length > 0 ? (
          <div className="divide-y">
            {students.map((student) => (
              <Link
                key={student.id}
                href={`/${currentTeam.slug}/students/${student.id}`}
                className="grid gap-3 p-4 transition-colors hover:bg-muted/50 md:grid-cols-[minmax(0,1fr)_160px_140px_120px]"
              >
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {student.email}
                  </p>
                </div>
                <Metric label="Last worked" value="Not tracked yet" />
                <Metric
                  label="Started"
                  value={`${student.started_assignments_count} assignments`}
                />
                <Metric
                  label="Completion"
                  value={
                    student.completion_percentage === null
                      ? '--'
                      : `${student.completion_percentage}%`
                  }
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="p-4 text-sm text-muted-foreground">
            No students have joined this classroom yet. Invited students will
            appear here after accepting.
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
  return (
    <div className="space-y-4">
      {pendingInvitations.length > 0 ? (
        <div className="border p-4">
          <School className="mb-4 size-6 text-muted-foreground" />
          <h2 className="font-medium">Classroom Invitations</h2>
          <div className="mt-4 divide-y border">
            {pendingInvitations.map((invitation) => (
              <div
                key={invitation.code}
                className="flex flex-wrap items-center justify-between gap-3 p-3"
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

      <div className="border p-4">
        <GraduationCap className="mb-4 size-6 text-muted-foreground" />
        <h2 className="font-medium">Classroom Work</h2>
        {currentTeam && assignments.length > 0 ? (
          <div className="mt-4 divide-y border">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-3">
                <p className="font-medium">{assignment.title}</p>
                <p className="text-sm text-muted-foreground">
                  {assignment.description}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {assignment.type_label} | Due {formatDate(assignment.due_at)}
                </p>
                {assignment.actions.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {assignment.actions.map((action) => (
                      <Button key={action.href} asChild variant="outline" size="sm">
                        <Link href={action.href}>{action.label}</Link>
                      </Button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">
            {currentTeam
              ? `You are viewing ${currentTeam.name}. Assigned coursework will appear here.`
              : teams.length > 0
                ? 'Choose a classroom from the switcher to view assigned work.'
                : 'No classrooms yet. Join a classroom when your teacher invites you.'}
          </p>
        )}
      </div>

      {currentTeam ? (
        <StudentQuestions team={currentTeam} questions={questions} />
      ) : null}
    </div>
  );
}

function StudentQuestions({
  team,
  questions,
}: {
  team: Team;
  questions: ClassroomQuestion[];
}) {
  const form = useForm({
    question: '',
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.post(`/${team.slug}/questions`, {
      preserveScroll: true,
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="border p-4">
      <MessageSquareText className="mb-4 size-6 text-muted-foreground" />
      <h2 className="font-medium">Ask An Anonymous Question</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your teacher can respond without seeing your name. Only you can see the
        response tied to your question.
      </p>

      <form className="mt-4 space-y-3" onSubmit={submit}>
        <textarea
          className="min-h-24 w-full border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
          value={form.data.question}
          onChange={(event) => form.setData('question', event.target.value)}
          required
        />
        {form.errors.question ? (
          <p className="text-sm text-destructive">{form.errors.question}</p>
        ) : null}
        <Button type="submit" disabled={form.processing}>
          Send question
        </Button>
      </form>

      {questions.length > 0 ? (
        <div className="mt-4 divide-y border">
          {questions.map((question) => (
            <div key={question.id} className="space-y-3 p-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  You asked
                </p>
                <p className="mt-1 text-sm">{question.question}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Teacher response
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {question.response ?? 'No response yet.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TeacherQuestions({
  team,
  questions,
}: {
  team: Team;
  questions: ClassroomQuestion[];
}) {
  return (
    <div className="border">
      <div className="border-b p-4">
        <h2 className="font-medium">Anonymous Questions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Students can ask without revealing who they are.
        </p>
      </div>

      {questions.length > 0 ? (
        <div className="divide-y">
          {questions.map((question) => (
            <TeacherQuestionResponse
              key={question.id}
              question={question}
              team={team}
            />
          ))}
        </div>
      ) : (
        <p className="p-4 text-sm text-muted-foreground">
          No anonymous questions yet.
        </p>
      )}
    </div>
  );
}

function TeacherQuestionResponse({
  question,
  team,
}: {
  question: ClassroomQuestion;
  team: Team;
}) {
  const form = useForm({
    response: question.response ?? '',
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.post(`/${team.slug}/questions/${question.id}/respond`, {
      preserveScroll: true,
    });
  };

  return (
    <div className="space-y-3 p-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Anonymous student asked
        </p>
        <p className="mt-1 text-sm">{question.question}</p>
      </div>

      <form className="space-y-2" onSubmit={submit}>
        <textarea
          className="min-h-20 w-full border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
          value={form.data.response}
          onChange={(event) => form.setData('response', event.target.value)}
          required
        />
        {form.errors.response ? (
          <p className="text-sm text-destructive">{form.errors.response}</p>
        ) : null}
        <Button type="submit" size="sm" disabled={form.processing}>
          {question.response ? 'Update response' : 'Send response'}
        </Button>
      </form>
    </div>
  );
}

function roleLabel(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
  breadcrumbs: [
    {
      title: 'Dashboard',
      href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/dashboard',
    },
  ],
});
