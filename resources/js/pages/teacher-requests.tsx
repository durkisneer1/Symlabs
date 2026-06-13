import { type FormEvent } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { BadgeCheck, ShieldQuestion, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type RequestUser = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'teacher' | 'student';
};

type TeacherAccountRequest = {
  id: number;
  institution: string;
  instructor_title: string;
  course_name: string;
  expected_student_count: number | null;
  proof: string;
  status: 'pending' | 'approved' | 'denied';
  admin_notes: string | null;
  created_at: string | null;
  reviewed_at: string | null;
  requester: RequestUser | null;
  reviewer: RequestUser | null;
  team: {
    id: number;
    name: string;
    slug: string;
  } | null;
};

type Props = {
  teacherAccountRequests: TeacherAccountRequest[];
};

export default function TeacherRequests({ teacherAccountRequests }: Props) {
  const { auth } = usePage().props;
  const isAdmin = auth.user.role === 'admin';

  return (
    <>
      <Head title="Classroom Requests" />

      <main className="toy-pink min-h-[calc(100vh-5rem)] space-y-6 p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {isAdmin ? 'Admin review' : 'Classroom approval'}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Classroom Requests
          </h1>
          <div className="ink-accent-rule mt-3" />
        </div>

        {isAdmin ? (
          <AdminRequests requests={teacherAccountRequests} />
        ) : (
          <StudentRequest requests={teacherAccountRequests} />
        )}
      </main>
    </>
  );
}

function StudentRequest({ requests }: { requests: TeacherAccountRequest[] }) {
  const form = useForm({
    institution: '',
    instructor_title: '',
    course_name: '',
    expected_student_count: '',
    proof: '',
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.post('/teacher-requests', {
      preserveScroll: true,
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[28rem_minmax(0,1fr)]">
      <section className="max-w-3xl space-y-3">
        <div className="flex items-start gap-3">
          <div className="ink-accent-icon mt-0.5">
            <ShieldQuestion className="size-5" />
          </div>
          <div>
            <h2 className="font-medium">Request a Classroom</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share the course you teach and proof that you should manage its
              classroom.
            </p>
          </div>
        </div>

        <form className="space-y-3" onSubmit={submit}>
          <Input
            value={form.data.course_name}
            onChange={(event) =>
              form.setData('course_name', event.target.value)
            }
            placeholder="Course name, e.g. CSCI 1301"
            required
          />
          {form.errors.course_name ? (
            <p className="text-sm text-destructive">
              {form.errors.course_name}
            </p>
          ) : null}
          <Input
            value={form.data.institution}
            onChange={(event) =>
              form.setData('institution', event.target.value)
            }
            placeholder="Institution"
            required
          />
          {form.errors.institution ? (
            <p className="text-sm text-destructive">
              {form.errors.institution}
            </p>
          ) : null}
          <Input
            value={form.data.instructor_title}
            onChange={(event) =>
              form.setData('instructor_title', event.target.value)
            }
            placeholder="Instructor title"
            required
          />
          <Input
            value={form.data.expected_student_count}
            onChange={(event) =>
              form.setData('expected_student_count', event.target.value)
            }
            placeholder="Expected student count (optional)"
            type="number"
            min={1}
          />
          {form.errors.expected_student_count ? (
            <p className="text-sm text-destructive">
              {form.errors.expected_student_count}
            </p>
          ) : null}
          {form.errors.instructor_title ? (
            <p className="text-sm text-destructive">
              {form.errors.instructor_title}
            </p>
          ) : null}
          <Textarea
            className="min-h-36 bg-background text-sm"
            value={form.data.proof}
            onChange={(event) => form.setData('proof', event.target.value)}
            placeholder="Paste a faculty profile URL, institutional email context, teacher ID details, department page, or other verification details."
            required
          />
          {form.errors.proof ? (
            <p className="text-sm text-destructive">{form.errors.proof}</p>
          ) : null}
          <Button type="submit" disabled={form.processing}>
            Submit request
          </Button>
        </form>
      </section>

      <section className="app-panel">
        <div className="app-panel-header">
          <h2 className="font-medium">Your Requests</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Admin decisions and created classrooms will appear here.
          </p>
        </div>
        <RequestList requests={requests} />
      </section>
    </div>
  );
}

function AdminRequests({ requests }: { requests: TeacherAccountRequest[] }) {
  return (
    <section className="app-panel">
      <div className="app-panel-header">
        <span className="ink-accent-icon mb-4">
          <BadgeCheck className="size-5" />
        </span>
        <h2 className="font-medium">Pending Classroom Reviews</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Approving a request creates the classroom and enrolls the requester as
          its teacher.
        </p>
      </div>
      <RequestList requests={requests} admin />
    </section>
  );
}

function RequestList({
  requests,
  admin = false,
}: {
  requests: TeacherAccountRequest[];
  admin?: boolean;
}) {
  if (requests.length === 0) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        No classroom requests yet.
      </p>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {requests.map((request) =>
        admin ? (
          <AdminRequestCard key={request.id} request={request} />
        ) : (
          <RequestCard key={request.id} request={request} />
        ),
      )}
    </div>
  );
}

function RequestCard({ request }: { request: TeacherAccountRequest }) {
  return (
    <article className="app-card space-y-3 p-4">
      <RequestHeader request={request} />
      {request.team ? (
        <p className="text-sm text-muted-foreground">
          Created classroom: {request.team.name}
        </p>
      ) : null}
      <ProofBlock request={request} />
      {request.admin_notes ? (
        <div className="border-t border-border/70 pt-3">
          <p className="text-xs font-medium text-muted-foreground">
            Admin notes
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {request.admin_notes}
          </p>
        </div>
      ) : null}
    </article>
  );
}

function AdminRequestCard({ request }: { request: TeacherAccountRequest }) {
  const form = useForm({
    status: request.status === 'approved' ? 'approved' : 'denied',
    admin_notes: request.admin_notes ?? '',
  });

  const submit = (status: 'approved' | 'denied') => {
    form.transform((data) => ({
      ...data,
      status,
    }));
    form.put(`/teacher-requests/${request.id}`, {
      preserveScroll: true,
    });
  };

  return (
    <article className="app-card space-y-3 p-4">
      <RequestHeader request={request} />
      {request.requester ? (
        <p className="text-xs text-muted-foreground">
          Requested by {request.requester.name} - {request.requester.email}
        </p>
      ) : null}
      <ProofBlock request={request} />

      <div className="space-y-2 border-t border-border/70 pt-3">
        <Textarea
          className="min-h-20 bg-background text-sm"
          value={form.data.admin_notes}
          onChange={(event) => form.setData('admin_notes', event.target.value)}
          placeholder="Optional notes for the requester"
        />
        {form.errors.admin_notes ? (
          <p className="text-sm text-destructive">{form.errors.admin_notes}</p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => submit('approved')}
            disabled={form.processing || request.status === 'approved'}
          >
            <BadgeCheck />
            Approve
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => submit('denied')}
            disabled={form.processing || request.status === 'denied'}
          >
            <XCircle />
            Deny
          </Button>
        </div>
      </div>
    </article>
  );
}

function RequestHeader({ request }: { request: TeacherAccountRequest }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-medium">{request.course_name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {request.instructor_title} at {request.institution} -{' '}
          {formatDate(request.created_at)}
        </p>
        {request.expected_student_count ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Expected students: {request.expected_student_count}
          </p>
        ) : null}
      </div>
      <Badge variant={request.status === 'pending' ? 'outline' : 'secondary'}>
        {request.status}
      </Badge>
    </div>
  );
}

function ProofBlock({ request }: { request: TeacherAccountRequest }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">
        Teaching proof
      </p>
      <p className="mt-1 text-sm whitespace-pre-wrap">{request.proof}</p>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

TeacherRequests.layout = {
  breadcrumbs: [
    {
      title: 'Classroom Requests',
      href: '/teacher-requests',
    },
  ],
};
