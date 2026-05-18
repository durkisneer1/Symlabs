import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export type ChapterNavItem = {
  id: string;
  title: string;
  depth?: number;
};

export default function ChapterSectionNav({
  items,
}: {
  items: ChapterNavItem[];
}) {
  return (
    <Card className="sticky top-4 bg-card">
      <CardHeader>
        <CardTitle>In This Chapter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-t">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              style={{ paddingLeft: `${(item.depth ?? 0) * 16}px` }}
            >
              {item.title}
            </a>
          ))}
        </div>
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
