import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CoursewareAttempt, Team } from '@/types';

type Props = {
    attempt: CoursewareAttempt;
};

export default function CoursewareAttemptPage({ attempt }: Props) {
    const currentTeam = usePage().props.currentTeam as Team | null;
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const submit = () => {
        if (!currentTeam) {
            return;
        }

        router.post(
            `/${currentTeam.slug}/courseware/attempts/${attempt.id}/submit`,
            {
                answers,
            },
        );
    };

    return (
        <>
            <Head title={attempt.snapshot.title} />

            <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title={attempt.snapshot.title}
                        description={attempt.snapshot.description ?? undefined}
                    />
                    <Badge variant="secondary">
                        Attempt {attempt.attemptNumber}
                    </Badge>
                </div>

                {attempt.status === 'submitted' ? (
                    <Card>
                        <CardContent className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Submitted</p>
                                <p className="text-sm text-muted-foreground">
                                    Score: {attempt.score} / {attempt.maxScore}
                                </p>
                            </div>
                            {currentTeam ? (
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        router.visit(
                                            `/${currentTeam.slug}/courseware`,
                                        )
                                    }
                                >
                                    Back to courseware
                                </Button>
                            ) : null}
                        </CardContent>
                    </Card>
                ) : null}

                <div className="space-y-4">
                    {attempt.snapshot.questions.map((question, index) => (
                        <Card key={question.id}>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {index + 1}. {question.prompt}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {question.type === 'multiple_choice' ? (
                                    <div className="grid gap-2">
                                        {question.options?.map((option) => (
                                            <Label
                                                key={option}
                                                className="flex items-center gap-2 rounded-md border p-3"
                                            >
                                                <input
                                                    type="radio"
                                                    name={question.id}
                                                    value={option}
                                                    disabled={
                                                        attempt.status ===
                                                        'submitted'
                                                    }
                                                    checked={
                                                        answers[question.id] ===
                                                        option
                                                    }
                                                    onChange={(event) =>
                                                        setAnswers({
                                                            ...answers,
                                                            [question.id]:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                                {option}
                                            </Label>
                                        ))}
                                    </div>
                                ) : (
                                    <Input
                                        type="number"
                                        step="any"
                                        disabled={
                                            attempt.status === 'submitted'
                                        }
                                        value={answers[question.id] ?? ''}
                                        onChange={(event) =>
                                            setAnswers({
                                                ...answers,
                                                [question.id]:
                                                    event.target.value,
                                            })
                                        }
                                    />
                                )}

                                {attempt.status === 'submitted' &&
                                question.result ? (
                                    <div className="flex items-start gap-2 text-sm">
                                        {question.result.correct ? (
                                            <CheckCircle2 className="mt-0.5 size-4 text-green-600" />
                                        ) : (
                                            <XCircle className="mt-0.5 size-4 text-destructive" />
                                        )}
                                        <div>
                                            <p className="font-medium">
                                                {question.result.correct
                                                    ? 'Correct'
                                                    : 'Incorrect'}
                                            </p>
                                            {attempt.contentType ===
                                            'homework' ? (
                                                <p className="text-muted-foreground">
                                                    Correct answer:{' '}
                                                    {question.correct_answer}
                                                </p>
                                            ) : null}
                                            {question.explanation ? (
                                                <p className="text-muted-foreground">
                                                    {question.explanation}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {attempt.status === 'in_progress' ? (
                    <div className="flex justify-end">
                        <Button onClick={submit}>Submit</Button>
                    </div>
                ) : null}
            </main>
        </>
    );
}
