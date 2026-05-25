import { Link, usePage } from '@inertiajs/react';
import {
  Binary,
  Braces,
  CodeXml,
  Database,
  FileCode2,
  LockKeyhole,
  Menu,
  Palette,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
import AppearanceMenu from '@/components/appearance-menu';
import { dashboard, login } from '@/routes';

type LessonItem = {
  title: string;
  href?: string;
  description: string;
  icon: LucideIcon;
  className: string;
  availability?: 'coming-soon' | 'planned';
};

const lessonItems: LessonItem[] = [
  {
    title: 'HTML',
    href: '/courses/html',
    description: "Build the web's skeleton.",
    icon: CodeXml,
    className: 'toy-orange',
  },
  {
    title: 'CSS',
    description: 'Shape layouts and surfaces.',
    icon: Palette,
    className: 'toy-cyan',
    availability: 'coming-soon',
  },
  {
    title: 'PHP',
    description: 'Make pages think and respond.',
    icon: Braces,
    className: 'toy-purple',
    availability: 'coming-soon',
  },
  {
    title: 'MySQL',
    description: 'Store and retrieve data.',
    icon: Database,
    className: 'toy-green',
    availability: 'coming-soon',
  },
  {
    title: 'Python',
    description: 'Automate ideas and scripts.',
    icon: FileCode2,
    className: 'toy-yellow',
    availability: 'planned',
  },
  {
    title: 'C++',
    description: 'Build fast, low-level programs.',
    icon: Binary,
    className: 'toy-black',
    availability: 'planned',
  },
];

function LessonCard({ item }: { item: LessonItem }) {
  const Icon = item.icon;
  const availabilityLabel =
    item.availability === 'coming-soon'
      ? 'Coming Soon'
      : item.availability === 'planned'
        ? 'Planned'
        : null;
  const className = `toy-surface ${item.href ? 'toy-surface-link cursor-pointer' : 'cursor-default'} ${item.className} flex h-32 flex-col items-start justify-between gap-3 p-4`;

  const content = (
    <>
      <span className={availabilityLabel ? 'opacity-50' : undefined}>
        <span className="ink-accent-icon">
          <Icon className="size-5" />
        </span>
      </span>
      <span className={availabilityLabel ? 'opacity-50' : undefined}>
        <span className="block text-base leading-tight font-semibold">
          {item.title}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
          {item.description}
        </span>
      </span>
      {availabilityLabel && (
        <span className="absolute inset-0 z-10 flex items-center justify-center bg-background/45 backdrop-grayscale">
          <span className="inline-flex items-center gap-1.5 border border-foreground/15 bg-background/85 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
            <LockKeyhole className="size-3.5" />
            {availabilityLabel}
          </span>
        </span>
      )}
    </>
  );

  if (item.href) {
    return (
      <Link href={item.href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

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
                  {lessonItems.map((item) =>
                    item.href ? (
                      <NavigationMenuLink key={item.title} asChild>
                        <LessonCard item={item} />
                      </NavigationMenuLink>
                    ) : (
                      <LessonCard key={item.title} item={item} />
                    ),
                  )}
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
              <SheetContent
                side="bottom"
                className="max-h-[90vh] overflow-y-auto"
              >
                <SheetHeader>
                  <h2 className="text-lg font-semibold">Lessons</h2>
                </SheetHeader>
                <div className="flex flex-col gap-3 py-4">
                  {lessonItems.map((item) =>
                    item.href ? (
                      <SheetClose asChild key={item.title}>
                        <LessonCard item={item} />
                      </SheetClose>
                    ) : (
                      <LessonCard key={item.title} item={item} />
                    ),
                  )}
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
