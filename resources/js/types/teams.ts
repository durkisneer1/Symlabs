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
  created_at: string;
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
