import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { SiteFooter } from '@/components/site-footer';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
}: AppLayoutProps) {
  return (
    <AppShell variant="sidebar">
      <AppSidebar />
      <AppContent variant="sidebar" className="overflow-x-hidden">
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        {children}
        <SiteFooter
          className="mt-10 px-4 py-6 md:px-6"
          innerClassName="max-w-none"
        />
      </AppContent>
    </AppShell>
  );
}
