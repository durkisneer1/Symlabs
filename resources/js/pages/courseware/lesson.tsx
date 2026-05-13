import { Head, Link, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CoursewareLesson, Team } from '@/types';

type Props = {
    lesson: CoursewareLesson;
};

export default function CoursewareLesson({ lesson }: Props) {
    const currentTeam = usePage().props.currentTeam as Team | null;

    return (
        <>
            <Head title={lesson.title} />

            <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title={lesson.title}
                        description={lesson.description ?? undefined}
                    />
                    {currentTeam ? (
                        <Button variant="outline" asChild>
                            <Link href={`/${currentTeam.slug}/courseware`}>
                                Back
                            </Link>
                        </Button>
                    ) : null}
                </div>

                <div className="space-y-4">
                    {lesson.blocks.map((block, index) => {
                        if (block.type === 'heading') {
                            return (
                                <h2
                                    key={index}
                                    className="text-lg font-semibold"
                                >
                                    {block.text}
                                </h2>
                            );
                        }

                        if (block.type === 'example') {
                            return (
                                <Card key={index}>
                                    <CardContent>
                                        <h3 className="mb-2 font-medium">
                                            {block.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {block.body}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        }

                        return (
                            <p key={index} className="leading-7">
                                {block.text}
                            </p>
                        );
                    })}
                </div>
            </article>
        </>
    );
}

CoursewareLesson.layout = (props: {
    currentTeam?: Team | null;
    lesson?: CoursewareLesson;
}) => ({
    breadcrumbs: [
        {
            title: 'Courseware',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/courseware`
                : '/courseware',
        },
        {
            title: props.lesson?.title ?? 'Lesson',
            href:
                props.currentTeam && props.lesson
                    ? `/${props.currentTeam.slug}/courseware/lessons/${props.lesson.id}`
                    : '#',
        },
    ],
});
