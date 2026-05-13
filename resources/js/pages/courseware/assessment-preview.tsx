import { Head, router, usePage } from '@inertiajs/react';
import { ClipboardList, FileQuestion } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CoursewareAssessmentPreview, Team } from '@/types';

type Props = {
    assessment: CoursewareAssessmentPreview;
};

export default function CoursewareAssessmentPreview({ assessment }: Props) {
    const currentTeam = usePage().props.currentTeam as Team | null;
    const Icon = assessment.type === 'quiz' ? FileQuestion : ClipboardList;

    const start = () => {
        if (!currentTeam) {
            return;
        }

        router.post(
            `/${currentTeam.slug}/courseware/${assessment.type}/${assessment.id}/attempts`,
        );
    };

    return (
        <>
            <Head title={assessment.title} />

            <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
                <Heading
                    title={assessment.title}
                    description={assessment.description ?? undefined}
                />

                <Card>
                    <CardHeader>
                        <Badge variant="secondary" className="w-fit">
                            <Icon className="size-3" />
                            {assessment.type}
                        </Badge>
                        <CardTitle>Ready to start?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                            <div>
                                <span className="block font-medium text-foreground">
                                    Questions
                                </span>
                                {assessment.questionCount}
                            </div>
                            <div>
                                <span className="block font-medium text-foreground">
                                    Time limit
                                </span>
                                {assessment.timeLimitMinutes
                                    ? `${assessment.timeLimitMinutes} minutes`
                                    : 'None'}
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Questions are generated on the server. Only the
                            questions for this attempt are sent to your browser.
                        </p>

                        <Button onClick={start}>Start {assessment.type}</Button>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
