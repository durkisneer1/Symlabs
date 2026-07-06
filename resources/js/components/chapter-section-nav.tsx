import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Image as ImageIcon, PencilRuler } from 'lucide-react';

export type ChapterNavItem = {
  id: string;
  title: string;
  depth?: number;
  kind?: 'section' | 'image' | 'activity';
};

export default function ChapterSectionNav({
  items,
  onNavigate,
  progress,
}: {
  items: ChapterNavItem[];
  onNavigate?: () => void;
  progress?: {
    visible: boolean;
    title: string;
    completed: number;
    total: number;
  };
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const progressValue =
    progress && progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const itemIds = items.map((item) => item.id);

    const updateActiveId = () => {
      const targets = itemIds
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => Boolean(element));

      if (targets.length === 0) {
        return;
      }

      const anchorOffset = 128;
      let currentTarget = targets[0];

      for (const target of targets) {
        if (target.getBoundingClientRect().top > anchorOffset) {
          break;
        }

        currentTarget = target;
      }

      setActiveId(currentTarget.id);
    };

    updateActiveId();
    window.addEventListener('scroll', updateActiveId, { passive: true });
    window.addEventListener('resize', updateActiveId);

    return () => {
      window.removeEventListener('scroll', updateActiveId);
      window.removeEventListener('resize', updateActiveId);
    };
  }, [items]);

  const navIconFor = (item: ChapterNavItem) => {
    if (item.kind === 'activity') {
      return {
        Icon: PencilRuler,
        label: 'Activity',
      };
    }

    if (item.kind === 'image') {
      return {
        Icon: ImageIcon,
        label: 'Image',
      };
    }

    return null;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b px-4 py-4 pr-12">
        <h2 className="font-heading text-base font-medium">In This Chapter</h2>
      </div>
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-4">
        <nav>
          {items.map((item) => {
            const active = item.id === activeId;
            const navIcon = navIconFor(item);
            const Icon = navIcon?.Icon;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => {
                  if (
                    event.defaultPrevented ||
                    event.button !== 0 ||
                    event.metaKey ||
                    event.altKey ||
                    event.ctrlKey ||
                    event.shiftKey
                  ) {
                    return;
                  }

                  event.preventDefault();
                  window.history.pushState(null, '', `#${item.id}`);
                  scrollToChapterAnchor(`#${item.id}`);
                  onNavigate?.();
                }}
                className={cn(
                  'group flex items-center justify-between gap-2 py-1.5 text-left text-sm transition-colors hover:text-foreground',
                  active
                    ? 'font-medium text-[var(--page-accent,var(--accent-orange))]'
                    : 'text-muted-foreground',
                )}
                style={{ paddingLeft: `${(item.depth ?? 0) * 16}px` }}
                aria-current={active ? 'location' : undefined}
              >
                <span className="min-w-0 break-words">{item.title}</span>
                {navIcon && Icon ? (
                  <span
                    className={cn('chapter-nav-activity-icon', 'shrink-0')}
                    title={navIcon.label}
                  >
                    <Icon
                      className="size-3"
                      strokeWidth={2.1}
                      aria-hidden="true"
                    />
                    <span className="sr-only">{navIcon.label}</span>
                  </span>
                ) : null}
              </a>
            );
          })}
        </nav>
        {progress?.visible ? (
          <div className="space-y-3 border-t pt-4">
            <div>
              <p className="text-sm font-medium">{progress.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {progress.completed} of {progress.total} complete
              </p>
            </div>
            <Progress value={progressValue} />
            {progress.total === 0 ? (
              <p className="text-xs text-muted-foreground">
                No classroom work is tied to this chapter yet.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function sectionId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function scrollToChapterAnchor(hash = window.location.hash) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));

  if (!id) {
    return false;
  }

  const target = document.getElementById(id);

  if (!target) {
    return false;
  }

  target.scrollIntoView({ block: 'start' });
  return true;
}
