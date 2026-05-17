import type { Assignment } from '@/types/assignments';
import type { Auth } from '@/types/auth';
import type { ClassroomQuestion } from '@/types/questions';
import type { Team, TeamInvitation, TeamStudent } from '@/types/teams';

declare module '@inertiajs/core' {
  export interface InertiaConfig {
    sharedPageProps: {
      name: string;
      auth: Auth;
      sidebarOpen: boolean;
      currentTeam: Team | null;
      teams: Team[];
      currentTeamAssignments: Assignment[];
      currentTeamQuestions: ClassroomQuestion[];
      currentTeamStudents: TeamStudent[];
      pendingTeamInvitations: TeamInvitation[];
      [key: string]: unknown;
    };
  }
}
