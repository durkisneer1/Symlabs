import { type FormEvent } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ShieldCheck, Trash2, UserRoundPlus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AdminInvitation = {
  code: string;
  email: string;
  accepted_at: string | null;
  expires_at: string | null;
  created_at: string | null;
  inviter: {
    name: string;
    email: string;
  } | null;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  can_invite_admins: boolean;
  email_verified_at: string | null;
  created_at: string | null;
};

type Props = {
  adminInvitations: AdminInvitation[];
  canInviteAdmins: boolean;
  users: User[];
};

export default function AdminUsers({
  adminInvitations,
  canInviteAdmins,
  users,
}: Props) {
  const { auth } = usePage().props;
  const inviteForm = useForm({
    email: '',
  });

  const submitInvite = (event: FormEvent) => {
    event.preventDefault();
    inviteForm.post('/admin/invitations', {
      preserveScroll: true,
      onSuccess: () => inviteForm.reset(),
    });
  };

  const pendingInvitations = adminInvitations.filter(
    (invitation) => !invitation.accepted_at,
  );

  return (
    <>
      <Head title="Admin Users" />

      <main className="min-h-[calc(100vh-5rem)] space-y-6 bg-muted/30 p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Admin console
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <div className="ink-accent-rule mt-3" />
        </div>

        <div className="grid gap-4 xl:grid-cols-[26rem_minmax(0,1fr)]">
          <section className="space-y-4">
            {canInviteAdmins ? (
              <>
                <div className="app-panel p-4">
                  <span className="ink-accent-icon mb-4">
                    <UserRoundPlus className="size-5 text-black" />
                  </span>
                  <h2 className="font-medium">Invite Admin</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Send a time-limited invitation to an email address you
                    trust.
                  </p>

                  <form className="mt-4 space-y-3" onSubmit={submitInvite}>
                    <Input
                      type="email"
                      value={inviteForm.data.email}
                      onChange={(event) =>
                        inviteForm.setData('email', event.target.value)
                      }
                      placeholder="admin@example.com"
                      required
                    />
                    {inviteForm.errors.email ? (
                      <p className="text-sm text-destructive">
                        {inviteForm.errors.email}
                      </p>
                    ) : null}
                    <Button type="submit" disabled={inviteForm.processing}>
                      Send invite
                    </Button>
                  </form>
                </div>

                <div className="app-panel">
                  <div className="app-panel-header">
                    <h2 className="font-medium">Pending Admin Invitations</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Invitations expire after three days.
                    </p>
                  </div>

                  {pendingInvitations.length > 0 ? (
                    <div className="space-y-2 p-3">
                      {pendingInvitations.map((invitation) => (
                        <div
                          key={invitation.code}
                          className="app-row flex flex-wrap items-center justify-between gap-3 p-3"
                        >
                          <div>
                            <p className="font-medium">{invitation.email}</p>
                            <p className="text-sm text-muted-foreground">
                              Expires {formatDate(invitation.expires_at)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.delete(
                                `/admin/invitations/${invitation.code}`,
                                {
                                  preserveScroll: true,
                                },
                              )
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">
                      No pending admin invitations.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="app-panel p-4">
                <span className="ink-accent-icon mb-4">
                  <ShieldCheck className="size-5 text-black" />
                </span>
                <h2 className="font-medium">Admin Invitations</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Only the original admin account can invite additional admins.
                </p>
              </div>
            )}
          </section>

          <section className="app-panel">
            <div className="app-panel-header flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="ink-accent-icon mb-4">
                  <Users className="size-5 text-black" />
                </span>
                <h2 className="font-medium">Accounts</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Delete obvious bot accounts before verification is fully in
                  place.
                </p>
              </div>
              <Badge variant="outline">{users.length} total</Badge>
            </div>

            <div className="space-y-2 p-3">
              {users.map((user) => (
                <article
                  key={user.id}
                  className="app-row grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_110px_120px_120px]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{user.name}</p>
                      {user.id === auth.user.id ? (
                        <Badge variant="secondary">You</Badge>
                      ) : null}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Metric label="Role" value={roleLabel(user.role)} />
                  <Metric
                    label="Verified"
                    value={user.email_verified_at ? 'Yes' : 'No'}
                  />
                  <div className="flex items-center justify-end">
                    {user.role === 'admin' ? (
                      <Badge variant="secondary">
                        <ShieldCheck />
                        {user.can_invite_admins ? 'Owner' : 'Admin'}
                      </Badge>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete ${user.email}? This cannot be undone.`,
                            )
                          ) {
                            router.delete(`/admin/users/${user.id}`, {
                              preserveScroll: true,
                            });
                          }
                        }}
                      >
                        <Trash2 />
                        Delete
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
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

function roleLabel(role: User['role']) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatDate(value: string | null) {
  if (!value) {
    return 'never';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

AdminUsers.layout = {
  breadcrumbs: [
    {
      title: 'Users',
      href: '/admin/users',
    },
  ],
};
