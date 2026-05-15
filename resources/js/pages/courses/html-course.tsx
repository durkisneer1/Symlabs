import { Head } from '@inertiajs/react';

export default function HtmlCourse() {
  return (
    <>
      <Head title="HTML Course" />

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-16">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Course</p>
          <h1 className="text-4xl font-semibold tracking-tight">HTML</h1>
          <p className="max-w-2xl text-muted-foreground">
            Learn the structure of web pages: elements, attributes, semantic
            markup, forms, and accessible document flow.
          </p>
        </div>
      </section>
    </>
  );
}
