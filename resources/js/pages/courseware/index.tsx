import { Head, Link, router, usePage } from '@inertiajs/react';
import { BookOpen, ClipboardList, FileQuestion, Power } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CoursewareChapter, CoursewareItem, Team } from '@/types';

type Props = {
    chapters: CoursewareChapter[];
    canManage: boolean;
};

const icons = {
    lesson: BookOpen,
    homework: ClipboardList,
    quiz: FileQuestion,
};

export default function CoursewareIndex({ chapters, canManage }: Props) {
    const currentTeam = usePage().props.currentTeam as Team | null;
    const teamSlug = currentTeam?.slug ?? '';

    const itemHref = (item: CoursewareItem) => {
        if (item.type === 'lesson') {
            return `/${teamSlug}/courseware/lessons/${item.id}`;
        }

        return `/${teamSlug}/courseware/${item.type}/${item.id}`;
    };

    const toggleItem = (item: CoursewareItem) => {
        router.patch(`/${teamSlug}/courseware/toggle`, {
            content_type: item.type,
            content_id: item.id,
            enabled: !item.enabled,
        });
    };

    return (
        <>
            <Head title="Courseware" />

            <div className="flex flex-col gap-6 p-4">
                <Heading
                    title="Courseware"
                    description="Developer-authored curriculum with team-level lesson, homework, and quiz controls."
                />

                {chapters.map((chapter) => (
                    <section key={chapter.id} className="space-y-3">
                        <div>
                            <h2 className="text-lg font-semibold">
                                {chapter.title}
                            </h2>
                            {chapter.description ? (
                                <p className="text-sm text-muted-foreground">
                                    {chapter.description}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            {chapter.items.map((item) => {
                                const Icon = icons[item.type];

                                return (
                                    <Card
                                        key={`${item.type}:${item.id}`}
                                        className={
                                            item.enabled
                                                ? ''
                                                : 'opacity-60 grayscale'
                                        }
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-2">
                                                    <Badge variant="secondary">
                                                        <Icon className="size-3" />
                                                        {item.type}
                                                    </Badge>
                                                    <CardTitle className="text-base">
                                                        {item.title}
                                                    </CardTitle>
                                                </div>
                                                {canManage ? (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            toggleItem(item)
                                                        }
                                                        aria-label={
                                                            item.enabled
                                                                ? `Disable ${item.title}`
                                                                : `Enable ${item.title}`
                                                        }
                                                    >
                                                        <Power className="size-4" />
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {item.description ? (
                                                <p className="text-sm text-muted-foreground">
                                                    {item.description}
                                                </p>
                                            ) : null}
                                            <Button asChild>
                                                <Link href={itemHref(item)}>
                                                    {item.type === 'lesson'
                                                        ? 'Open lesson'
                                                        : 'Start'}
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </>
    );
}

CoursewareIndex.layout = (props: { currentTeam?: Team | null }) => ({
    breadcrumbs: [
        {
            title: 'Courseware',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/courseware`
                : '/courseware',
        },
    ],
});
