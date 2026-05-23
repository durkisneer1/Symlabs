import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, LifeBuoy, Search, Send, UserCog } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type SupportTeacher = {
  id: number;
  name: string;
  email: string;
  role: 'teacher';
  classrooms: {
    id: number;
    name: string;
    slug: string;
    students_count: number;
  }[];
  created_at: string | null;
};

type TicketUser = {
  id: number;
  name: string;
  email: string;
  role?: 'teacher' | 'student' | 'admin';
};

type SupportTicket = {
  id: number;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  admin_response: string | null;
  created_at: string | null;
  responded_at: string | null;
  requester: TicketUser | null;
  respondent: TicketUser | null;
};

type Props = {
  supportTickets: SupportTicket[];
  supportTeachers: SupportTeacher[];
};

export default function Support({ supportTickets, supportTeachers }: Props) {
  const { auth } = usePage().props;
  const isAdmin = auth.user.role === 'admin';

  return (
    <>
      <Head title="Support" />

      <main className="min-h-[calc(100vh-5rem)] space-y-6 p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {isAdmin ? 'Admin console' : 'Teacher help'}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
          <div className="ink-accent-rule mt-3" />
        </div>

        {isAdmin ? (
          <AdminSupport tickets={supportTickets} teachers={supportTeachers} />
        ) : (
          <TeacherSupport tickets={supportTickets} />
        )}
      </main>
    </>
  );
}

function AdminSupport({
  tickets,
  teachers,
}: {
  tickets: SupportTicket[];
  teachers: SupportTeacher[];
}) {
  const [teacherSearch, setTeacherSearch] = useState('');
  const filteredTeachers = useMemo(() => {
    const search = teacherSearch.trim().toLowerCase();

    if (!search) {
      return teachers;
    }

    return teachers.filter((teacher) =>
      [teacher.name, teacher.email].some((value) =>
        value.toLowerCase().includes(search),
      ),
    );
  }, [teacherSearch, teachers]);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <section className="app-panel">
        <div className="app-panel-header">
          <span className="ink-accent-icon mb-4">
            <LifeBuoy className="size-5" />
          </span>
          <h2 className="font-medium">Teacher Tickets</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Named requests from teachers who need admin help.
          </p>
        </div>
        <TicketList tickets={tickets} admin />
      </section>

      <section className="app-panel">
        <div className="app-panel-header">
          <span className="ink-accent-icon mb-4">
            <UserCog className="size-5" />
          </span>
          <h2 className="font-medium">Dashboard Review</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search teachers, then open a course summary for class details.
          </p>
        </div>
        <div className="space-y-3 p-3">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="bg-background pl-9"
              value={teacherSearch}
              onChange={(event) => setTeacherSearch(event.target.value)}
              placeholder="Search name or email"
            />
          </label>

          <div className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
            {filteredTeachers.map((teacher) => (
              <Link
                key={teacher.id}
                href={`/support/teachers/${teacher.id}`}
                className="app-row block p-3 transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher.email}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 size-4 text-muted-foreground" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {teacher.classrooms.length}{' '}
                    {teacher.classrooms.length === 1
                      ? 'classroom'
                      : 'classrooms'}
                  </Badge>
                  <Badge variant="secondary">
                    {teacher.classrooms.reduce(
                      (total, classroom) => total + classroom.students_count,
                      0,
                    )}{' '}
                    students
                  </Badge>
                </div>
              </Link>
            ))}
          </div>

          {teachers.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No teachers yet.
            </p>
          ) : null}
          {teachers.length > 0 && filteredTeachers.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No teachers match that search.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function TeacherSupport({ tickets }: { tickets: SupportTicket[] }) {
  const form = useForm({
    subject: '',
    message: '',
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.post('/support', {
      preserveScroll: true,
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[26rem_minmax(0,1fr)]">
      <section className="max-w-3xl space-y-3">
        <div className="flex items-start gap-3">
          <div className="ink-accent-icon mt-0.5">
            <Send className="size-5" />
          </div>
          <div>
            <h2 className="font-medium">Contact Admins</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask for help with classroom setup, student accounts, grading
              policies, or dashboard issues.
            </p>
          </div>
        </div>

        <form className="space-y-3" onSubmit={submit}>
          <Input
            value={form.data.subject}
            onChange={(event) => form.setData('subject', event.target.value)}
            placeholder="Short subject"
            required
          />
          {form.errors.subject ? (
            <p className="text-sm text-destructive">{form.errors.subject}</p>
          ) : null}
          <Textarea
            className="min-h-32 bg-background text-sm"
            value={form.data.message}
            onChange={(event) => form.setData('message', event.target.value)}
            placeholder="What do you need help with?"
            required
          />
          {form.errors.message ? (
            <p className="text-sm text-destructive">{form.errors.message}</p>
          ) : null}
          <Button type="submit" disabled={form.processing}>
            Send ticket
          </Button>
        </form>
      </section>

      <section className="app-panel">
        <div className="app-panel-header">
          <h2 className="font-medium">Your Tickets</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Admin responses will appear here.
          </p>
        </div>
        <TicketList tickets={tickets} />
      </section>
    </div>
  );
}

function TicketList({
  tickets,
  admin = false,
}: {
  tickets: SupportTicket[];
  admin?: boolean;
}) {
  if (tickets.length === 0) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        No support tickets yet.
      </p>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {tickets.map((ticket) =>
        admin ? (
          <AdminTicket key={ticket.id} ticket={ticket} />
        ) : (
          <TicketCard key={ticket.id} ticket={ticket} />
        ),
      )}
    </div>
  );
}

function TicketCard({ ticket }: { ticket: SupportTicket }) {
  return (
    <article className="app-card space-y-3 p-4">
      <TicketHeader ticket={ticket} />
      <p className="text-sm">{ticket.message}</p>
      <div className="border-t border-border/70 pt-3">
        <p className="text-xs font-medium text-muted-foreground">
          Admin response
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {ticket.admin_response ?? 'No response yet.'}
        </p>
      </div>
    </article>
  );
}

function AdminTicket({ ticket }: { ticket: SupportTicket }) {
  const form = useForm({
    admin_response: ticket.admin_response ?? '',
    status: ticket.status,
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.put(`/support/tickets/${ticket.id}`, {
      preserveScroll: true,
    });
  };

  return (
    <article className="app-card space-y-3 p-4">
      <TicketHeader ticket={ticket} />
      <p className="text-sm">{ticket.message}</p>
      {ticket.requester ? (
        <p className="text-xs text-muted-foreground">
          From {ticket.requester.name} - {ticket.requester.email}
        </p>
      ) : null}

      <form
        className="space-y-2 border-t border-border/70 pt-3"
        onSubmit={submit}
      >
        <Textarea
          className="min-h-20 bg-background text-sm"
          value={form.data.admin_response}
          onChange={(event) =>
            form.setData('admin_response', event.target.value)
          }
          required
        />
        {form.errors.admin_response ? (
          <p className="text-sm text-destructive">
            {form.errors.admin_response}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={form.data.status === 'open' ? 'default' : 'outline'}
            size="sm"
            onClick={() => form.setData('status', 'open')}
          >
            Open
          </Button>
          <Button
            type="button"
            variant={form.data.status === 'resolved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => form.setData('status', 'resolved')}
          >
            Resolved
          </Button>
          <Button type="submit" size="sm" disabled={form.processing}>
            Save response
          </Button>
        </div>
      </form>
    </article>
  );
}

function TicketHeader({ ticket }: { ticket: SupportTicket }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-medium">{ticket.subject}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDate(ticket.created_at)}
        </p>
      </div>
      <Badge variant={ticket.status === 'resolved' ? 'secondary' : 'outline'}>
        {ticket.status}
      </Badge>
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

Support.layout = {
  breadcrumbs: [
    {
      title: 'Support',
      href: '/support',
    },
  ],
};
