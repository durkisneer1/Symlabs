import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export default function Welcome() {
  const { auth, currentTeam } = usePage().props;
  const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

  return (
    <>
      <Head title="Home" />
      <div className="flex flex-col items-center bg-background p-6 text-foreground lg:justify-center lg:p-8">
        <header className="w-full">
          <NavigationMenu className="flex w-full max-w-none items-center justify-between">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/">Home</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Lessons</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink>HTML</NavigationMenuLink>
                  <NavigationMenuLink>CSS</NavigationMenuLink>
                  <NavigationMenuLink>PHP</NavigationMenuLink>
                  <NavigationMenuLink>MySQL</NavigationMenuLink>
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

        <main></main>

        <footer></footer>
      </div>
    </>
  );
}
