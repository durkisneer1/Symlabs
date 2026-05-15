import { Head } from '@inertiajs/react';

export default function PhpCourse() {
  return (
    <>
      <Head title="PHP Course" />

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-16">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Course</p>
          <h1 className="text-4xl font-semibold tracking-tight">PHP</h1>
          <p className="max-w-2xl text-muted-foreground">
            Learn server-side programming with variables, functions, forms,
            validation, sessions, routing, and database-backed pages.
          </p>
        </div>
      </section>
    </>
  );
}
