export type TeamRole = 'admin' | 'teacher' | 'student';

export type Team = {
  id: number;
  name: string;
  slug: string;
  isPersonal: boolean;
  role?: TeamRole;
  roleLabel?: string;
  isCurrent?: boolean;
  viewModes?: RoleOption[];
  gradeWeights?: {
    chapter_reading?: number;
    homework?: number;
    quiz?: number;
  } | null;
  semesterStartsAt?: string | null;
  semesterEndsAt?: string | null;
  semesterActive?: boolean;
};

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  role: TeamRole;
  role_label: string;
};

export type TeamInvitation = {
  code: string;
  email: string;
  role: TeamRole;
  role_label: string;
  team?: Pick<Team, 'id' | 'name' | 'slug'>;
  inviter?: {
    name: string;
  };
  expires_at?: string | null;
  created_at: string;
};

export type TeamStudent = {
  id: number;
  name: string;
  email: string;
  role_label: string;
  joined_at: string | null;
  last_active_at: string | null;
  started_assignments_count: number;
  completion_percentage: number | null;
  overall_grade: number | null;
};

export type TeamPermissions = {
  canUpdateTeam: boolean;
  canDeleteTeam: boolean;
  canAddMember: boolean;
  canUpdateMember: boolean;
  canRemoveMember: boolean;
  canCreateInvitation: boolean;
  canCancelInvitation: boolean;
  canAssignCoursework: boolean;
  canViewStudentProgress: boolean;
  canTakeAssignments: boolean;
  canViewAsTeacher: boolean;
  canViewAsStudent: boolean;
};

export type RoleOption = {
  value: TeamRole;
  label: string;
};
