import { Head } from '@inertiajs/react';

export default function MysqlCourse() {
  return (
    <>
      <Head title="MySQL Course" />

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-16">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Course</p>
          <h1 className="text-4xl font-semibold tracking-tight">MySQL</h1>
          <p className="max-w-2xl text-muted-foreground">
            Learn relational data modeling, SQL queries, joins, indexes, and how
            backend applications store and retrieve information.
          </p>
        </div>
      </section>
    </>
  );
}
