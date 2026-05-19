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
  role: 'admin' | 'teacher' | 'student';
};

type TeacherAccountRequest = {
  id: number;
  institution: string;
  instructor_title: string;
  proof: string;
  status: 'pending' | 'approved' | 'denied';
  admin_notes: string | null;
  created_at: string | null;
  reviewed_at: string | null;
  requester: RequestUser | null;
  reviewer: RequestUser | null;
};

type Props = {
  teacherAccountRequests: TeacherAccountRequest[];
};

export default function TeacherRequests({
  teacherAccountRequests,
}: Props) {
  const { auth } = usePage().props;
  const isAdmin = auth.user.role === 'admin';

  return (
    <>
      <Head title="Teacher Requests" />

      <main className="min-h-[calc(100vh-5rem)] space-y-6 bg-muted/30 p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {isAdmin ? 'Admin review' : 'Account upgrade'}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Teacher Requests
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

function StudentRequest({
  requests,
}: {
  requests: TeacherAccountRequest[];
}) {
  const form = useForm({
    institution: '',
    instructor_title: '',
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
            <ShieldQuestion className="size-5 text-black" />
          </div>
          <div>
            <h2 className="font-medium">Request Teacher Access</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share proof that you are employed by an educational institution as
              an instructor.
            </p>
          </div>
        </div>

        <form className="space-y-3" onSubmit={submit}>
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
          {form.errors.instructor_title ? (
            <p className="text-sm text-destructive">
              {form.errors.instructor_title}
            </p>
          ) : null}
          <Textarea
            className="min-h-36 bg-background text-sm"
            value={form.data.proof}
            onChange={(event) => form.setData('proof', event.target.value)}
            placeholder="Paste a faculty profile URL, institutional email context, department page, or other verification details."
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
            Admin decisions will appear here.
          </p>
        </div>
        <RequestList requests={requests} />
      </section>
    </div>
  );
}

function AdminRequests({
  requests,
}: {
  requests: TeacherAccountRequest[];
}) {
  return (
    <section className="app-panel">
      <div className="app-panel-header">
        <span className="ink-accent-icon mb-4">
          <BadgeCheck className="size-5 text-black" />
        </span>
        <h2 className="font-medium">Pending Teacher Reviews</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Approving a request upgrades the regular account into a teacher
          account.
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
        No teacher requests yet.
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
          <p className="text-sm text-destructive">
            {form.errors.admin_notes}
          </p>
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
        <h2 className="font-medium">{request.institution}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {request.instructor_title} - {formatDate(request.created_at)}
        </p>
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
        Employment proof
      </p>
      <p className="mt-1 whitespace-pre-wrap text-sm">{request.proof}</p>
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
      title: 'Teacher Requests',
      href: '/teacher-requests',
    },
  ],
};
