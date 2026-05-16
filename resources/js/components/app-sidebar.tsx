import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, LibraryBig } from 'lucide-react';
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
      title: 'Dashboard',
      href: dashboardUrl,
      icon: LayoutGrid,
    },
  ];

  if (userRole === 'admin') {
    mainNavItems.push(
      {
        title: 'Quiz Bank',
        href: '/admin/quizzes',
        icon: LibraryBig,
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
