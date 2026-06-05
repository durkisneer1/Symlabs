import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Image as ImageIcon, PencilRuler } from 'lucide-react';

export type ChapterNavItem = {
  id: string;
  title: string;
  depth?: number;
  kind?: 'section' | 'image' | 'activity';
};

export default function ChapterSectionNav({
  items,
  progress,
}: {
  items: ChapterNavItem[];
  progress?: {
    visible: boolean;
    title: string;
    completed: number;
    total: number;
  };
}) {
  const progressValue =
    progress && progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

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
    <Card className="sticky top-4 bg-card shadow-[0_14px_34px_rgb(0_0_0/0.08)]">
      <CardHeader>
        <CardTitle>In This Chapter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="border-t pt-2">
          {items.map((item) => {
            const navIcon = navIconFor(item);
            const Icon = navIcon?.Icon;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex items-center justify-between gap-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                style={{ paddingLeft: `${(item.depth ?? 0) * 16}px` }}
              >
                <span>{item.title}</span>
                {navIcon && Icon ? (
                  <span
                    className="chapter-nav-activity-icon"
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
        </div>
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
      </CardContent>
    </Card>
  );
}

export function sectionId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
