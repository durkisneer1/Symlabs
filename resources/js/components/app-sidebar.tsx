import { Link, usePage } from '@inertiajs/react';
import {
  ClipboardList,
  LifeBuoy,
  LayoutGrid,
  LibraryBig,
  MessageSquareText,
  Settings2,
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
  const userRole = page.props.auth.user.role;
  const dashboardUrl = currentTeam
    ? dashboard(currentTeam.slug)
    : '/dashboard';

  const mainNavItems: NavItem[] = [
    {
      title: 'Overview',
      href: dashboardUrl,
      icon: LayoutGrid,
    },
  ];

  if (userRole === 'student' && currentTeam) {
    mainNavItems.push({
      title: 'Work',
      href: `/${currentTeam.slug}/work`,
      icon: ClipboardList,
    });
  }

  if (userRole === 'student') {
    mainNavItems.push({
      title: 'Teacher Request',
      href: '/teacher-requests',
      icon: UserPlus,
    });
  }

  if (userRole === 'teacher' && currentTeam) {
    mainNavItems.push({
      title: 'Roster',
      href: `/${currentTeam.slug}/roster`,
      icon: Users,
    });
    mainNavItems.push({
      title: 'Classroom',
      href: `/${currentTeam.slug}/classroom`,
      icon: Settings2,
    });
  }

  if (userRole !== 'admin' && currentTeam) {
    mainNavItems.push({
      title: 'Q&A',
      href: `/${currentTeam.slug}/questions`,
      icon: MessageSquareText,
    });
  }

  if (userRole === 'teacher') {
    mainNavItems.push({
      title: 'Support',
      href: '/support',
      icon: LifeBuoy,
    });
  }

  if (userRole === 'admin') {
    mainNavItems.push(
      {
        title: 'Quiz Bank',
        href: '/admin/quizzes',
        icon: LibraryBig,
      },
      {
        title: 'Support',
        href: '/support',
        icon: LifeBuoy,
      },
      {
        title: 'Teacher Requests',
        href: '/teacher-requests',
        icon: UserPlus,
      },
    );
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={home()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {userRole !== 'admin' ? (
          <SidebarMenu>
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
