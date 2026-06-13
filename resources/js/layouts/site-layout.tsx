import { Link, usePage } from '@inertiajs/react';
import {
  Binary,
  Braces,
  ChevronDown,
  CodeXml,
  Database,
  FileCode2,
  LockKeyhole,
  Menu,
  Palette,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { BrandWordmark } from '@/components/brand-images';
import { SiteFooter } from '@/components/site-footer';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import AppearanceMenu from '@/components/appearance-menu';
import { cn } from '@/lib/utils';
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
    title: 'HTML 5',
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
    title: 'Python 3',
    description: 'Automate ideas and scripts.',
    icon: FileCode2,
    className: 'toy-yellow',
    availability: 'planned',
  },
  {
    title: 'Modern C++',
    description: 'Build fast, low-level programs.',
    icon: Binary,
    className: 'toy-black',
    availability: 'planned',
  },
];

function LessonCard({
  item,
  onSelect,
}: {
  item: LessonItem;
  onSelect?: () => void;
}) {
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
        <span className="lesson-card-description mt-1 block w-fit max-w-full text-xs leading-relaxed text-muted-foreground">
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
      <Link href={item.href} className={className} onClick={onSelect}>
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
  const [isDesktopLessonsOpen, setIsDesktopLessonsOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col items-center overflow-x-clip px-6 text-foreground lg:px-8">
      <header className="sticky top-0 z-50 -mx-6 w-[calc(100%+3rem)] border-b bg-white/85 px-6 py-2 shadow-sm backdrop-blur supports-backdrop-filter:bg-white/72 lg:-mx-8 lg:w-[calc(100%+4rem)] lg:px-8 dark:bg-black/90 dark:supports-backdrop-filter:bg-black/84">
        <NavigationMenu
          viewport={false}
          className="mx-auto flex w-full max-w-6xl items-center justify-between pr-12 xl:pr-0"
        >
          <NavigationMenuList className="flex-none justify-start">
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} site-home-link h-10 px-0`}
              >
                <Link href="/" aria-label="Home">
                  <BrandWordmark className="h-7 w-auto max-w-36" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>

          <NavigationMenuList className="flex-none items-center justify-end gap-1">
            {/* Desktop Lessons Dropdown */}
            <NavigationMenuItem className="hidden md:flex">
              <DropdownMenu
                open={isDesktopLessonsOpen}
                onOpenChange={setIsDesktopLessonsOpen}
              >
                <DropdownMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'group rounded-lg',
                  )}
                >
                  Lessons
                  <ChevronDown
                    className="relative top-px ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
                    aria-hidden="true"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[28rem] p-3"
                  style={{ maxWidth: 'calc(100vw - 3rem)' }}
                  onMouseLeave={() => setIsDesktopLessonsOpen(false)}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {lessonItems.map((item) =>
                      item.href ? (
                        <LessonCard
                          key={item.title}
                          item={item}
                          onSelect={() => setIsDesktopLessonsOpen(false)}
                        />
                      ) : (
                        <LessonCard key={item.title} item={item} />
                      ),
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
            {/* Mobile Lessons Sheet */}
            <Sheet open={isLessonsOpen} onOpenChange={setIsLessonsOpen}>
              <SheetTrigger asChild>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} cursor-pointer rounded-lg md:hidden`}
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
                        <LessonCard
                          item={item}
                          onSelect={() => setIsLessonsOpen(false)}
                        />
                      </SheetClose>
                    ) : (
                      <LessonCard key={item.title} item={item} />
                    ),
                  )}
                </div>
              </SheetContent>
            </Sheet>
            {auth.user ? (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} rounded-lg`}
                >
                  <Link href={dashboardUrl}>Dashboard</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} rounded-lg`}
                >
                  <Link href={login()}>Log in</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <AppearanceMenu />
        </div>
      </header>

      <main className="w-full flex-1">{children}</main>

      <SiteFooter className="-mx-6 w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]" />
    </div>
  );
}
