import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, LogIn, LogOut, Pencil } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { edit, index } from '@/routes/teams';
import type { Team } from '@/types';

type Props = {
  teams: Team[];
};

export default function TeamsIndex({ teams }: Props) {
  const { auth } = usePage().props;
  const isAdmin = auth.user.role === 'admin';

  return (
    <>
      <Head title="Classrooms" />

      <h1 className="sr-only">Classrooms</h1>

      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <Heading
            variant="small"
            title="Classrooms"
            description="Manage your classrooms and classroom memberships"
          />
        </div>

        <div className="space-y-3">
          {teams.map((team) => (
            <div
              key={team.id}
              data-test="team-row"
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{team.name}</span>
                    {team.isPersonal ? (
                      <Badge variant="secondary">Personal</Badge>
                    ) : null}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {team.roleLabel ?? (isAdmin ? 'Not joined' : 'Member')}
                  </span>
                </div>
              </div>

              <TooltipProvider>
                <div className="flex items-center gap-2">
                  {isAdmin && !team.role ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-test="team-join-button"
                          onClick={() =>
                            router.post(`/settings/teams/${team.slug}/join`)
                          }
                        >
                          <LogIn className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Join classroom as admin</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : team.role === 'student' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-test="team-view-button"
                          asChild
                        >
                          <Link href={edit(team.slug)}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View classroom</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : team.role ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-test="team-edit-button"
                          asChild
                        >
                          <Link href={edit(team.slug)}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit classroom</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                  {isAdmin && team.role === 'admin' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-test="team-leave-button"
                          onClick={() =>
                            router.delete(`/settings/teams/${team.slug}/leave`)
                          }
                        >
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Leave classroom</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              </TooltipProvider>
            </div>
          ))}

          {teams.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              You don't belong to any classrooms yet.
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}

TeamsIndex.layout = {
  breadcrumbs: [
    {
      title: 'Classrooms',
      href: index(),
    },
  ],
};
