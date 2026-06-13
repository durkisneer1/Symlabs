import { Link, usePage } from '@inertiajs/react';
import {
  ClipboardList,
  LifeBuoy,
  LayoutGrid,
  LibraryBig,
  MessageSquareText,
  Settings2,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, home } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
  const page = usePage();
  const currentTeam = page.props.currentTeam;
  const accountRole = page.props.auth.user.role;
  const classroomRole = currentTeam?.role;
  const isAdmin = accountRole === 'admin';
  const hasTeacherClassroom = (page.props.teams ?? []).some(
    (team) => team.role === 'teacher',
  );
  const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/dashboard';

  const mainNavItems: NavItem[] = [
    {
      title: 'Overview',
      href: dashboardUrl,
      icon: LayoutGrid,
      className: 'toy-cyan',
    },
  ];

  if (classroomRole === 'student' && currentTeam) {
    mainNavItems.push({
      title: 'Work',
      href: `/${currentTeam.slug}/work`,
      icon: ClipboardList,
      className: 'toy-cyan',
    });
  }

  if (!isAdmin) {
    mainNavItems.push({
      title: 'Request Classroom',
      href: '/teacher-requests',
      icon: UserPlus,
      className: 'toy-pink',
    });
  }

  if (
    (classroomRole === 'teacher' || classroomRole === 'admin') &&
    currentTeam
  ) {
    mainNavItems.push({
      title: 'Roster',
      href: `/${currentTeam.slug}/roster`,
      icon: Users,
      className: 'toy-green',
    });
    mainNavItems.push({
      title: 'Classroom',
      href: `/${currentTeam.slug}/classroom`,
      icon: Settings2,
      className: 'toy-yellow',
    });
  }

  if (currentTeam) {
    mainNavItems.push({
      title: 'Q&A',
      href: `/${currentTeam.slug}/questions`,
      icon: MessageSquareText,
      className: 'toy-pink',
    });
  }

  if (hasTeacherClassroom) {
    mainNavItems.push({
      title: 'Support',
      href: '/support',
      icon: LifeBuoy,
      className: 'toy-purple',
    });
  }

  if (isAdmin) {
    mainNavItems.push(
      {
        title: 'Quiz Bank',
        href: '/admin/quizzes',
        icon: LibraryBig,
        className: 'toy-purple',
      },
      {
        title: 'Users',
        href: '/admin/users',
        icon: ShieldCheck,
        className: 'toy-green',
      },
      {
        title: 'Support',
        href: '/support',
        icon: LifeBuoy,
        className: 'toy-purple',
      },
      {
        title: 'Classroom Requests',
        href: '/teacher-requests',
        icon: UserPlus,
        className: 'toy-pink',
      },
    );
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="app-logo-button">
              <Link href={home()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {page.props.teams.length > 0 ? (
          <SidebarMenu className="classroom-switcher-menu">
            <SidebarMenuItem>
              <TeamSwitcher />
            </SidebarMenuItem>
          </SidebarMenu>
        ) : null}
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
