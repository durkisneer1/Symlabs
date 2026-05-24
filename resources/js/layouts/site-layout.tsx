import { Link, usePage } from '@inertiajs/react';
import { Braces, CodeXml, Database, Menu, Palette } from 'lucide-react';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import AppearanceMenu from '@/components/appearance-menu';
import { dashboard, login } from '@/routes';

const lessonItems = [
  {
    title: 'HTML',
    href: '/courses/html',
    description: 'Build the page skeleton.',
    icon: CodeXml,
    className: 'toy-yellow',
  },
  {
    title: 'CSS',
    href: '/courses/css',
    description: 'Shape layouts and surfaces.',
    icon: Palette,
    className: 'toy-cyan',
  },
  {
    title: 'PHP',
    href: '/courses/php',
    description: 'Make pages think and respond.',
    icon: Braces,
    className: 'toy-purple',
  },
  {
    title: 'MySQL',
    href: '/courses/mysql',
    description: 'Store and retrieve data.',
    icon: Database,
    className: 'toy-green',
  },
];

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth, currentTeam } = usePage().props;
  const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/dashboard';
  const [isLessonsOpen, setIsLessonsOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center p-6 text-foreground lg:p-8">
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
            {/* Desktop Lessons Dropdown */}
            <NavigationMenuItem className="hidden md:flex">
              <NavigationMenuTrigger>Lessons</NavigationMenuTrigger>
              <NavigationMenuContent
                className="p-3"
                style={{ width: '28rem', maxWidth: 'calc(100vw - 3rem)' }}
              >
                <div className="grid grid-cols-2 gap-3">
                  {lessonItems.map((item) => (
                    <NavigationMenuLink key={item.title} asChild>
                      <Link
                        href={item.href}
                        className={`toy-surface toy-surface-link ${item.className} min-h-32 flex-col items-start justify-between gap-3 p-4`}
                      >
                        <span className="ink-accent-icon">
                          <item.icon className="size-5" />
                        </span>
                        <span>
                          <span className="block text-base font-semibold">
                            {item.title}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* Mobile Lessons Sheet */}
            <Sheet open={isLessonsOpen} onOpenChange={setIsLessonsOpen}>
              <SheetTrigger asChild>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} cursor-pointer md:hidden`}
                >
                  Lessons
                </NavigationMenuLink>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
                <SheetHeader>
                  <h2 className="text-lg font-semibold">Lessons</h2>
                </SheetHeader>
                <div className="flex flex-col gap-3 py-4">
                  {lessonItems.map((item) => (
                    <SheetClose asChild key={item.title}>
                      <Link
                        href={item.href}
                        className={`toy-surface toy-surface-link ${item.className} flex flex-col items-start justify-between gap-3 p-4`}
                      >
                        <span className="ink-accent-icon">
                          <item.icon className="size-5" />
                        </span>
                        <span>
                          <span className="block text-base font-semibold">
                            {item.title}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </NavigationMenuList>
          <NavigationMenuList className="items-center gap-1">
            <AppearanceMenu />
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
