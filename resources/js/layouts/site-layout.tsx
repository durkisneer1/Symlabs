import { Link, usePage } from '@inertiajs/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { dashboard, login } from '@/routes';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth, currentTeam } = usePage().props;
  const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/dashboard';

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-6 text-foreground lg:p-8">
      <header className="w-full">
        <NavigationMenu
          viewport={false}
          className="flex w-full max-w-none items-center justify-between"
        >
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Lessons</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink asChild>
                  <Link href="/courses/html">HTML</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/courses/css">CSS</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/courses/php">PHP</Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/courses/mysql">MySQL</Link>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            {auth.user ? (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={dashboardUrl}>Dashboard</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={login()}>Log in</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="w-full flex-1">{children}</main>

      <footer className="w-full py-6" />
    </div>
  );
}
