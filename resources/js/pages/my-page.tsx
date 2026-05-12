import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function MyPage() {
    return (
        <>
            <Head title="My Page" />
            <main className="flex min-h-screen items-center justify-center bg-background p-6">
                <Card className="w-full max-w-sm">
                    <CardContent>
                        <Button>Save</Button>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
