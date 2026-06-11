import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function TooManyRequests() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <Head title="Too many requests" />

      <section className="w-full max-w-md text-center">
        <p className="text-sm font-semibold text-muted-foreground">429</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-normal">
          You are moving a little fast.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Please wait a few minutes and try again.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Return home</Link>
        </Button>
      </section>
    </main>
  );
}
