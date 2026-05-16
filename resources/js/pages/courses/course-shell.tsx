import { Head } from '@inertiajs/react';

type Props = {
  course: string;
};

export default function CourseShell({ course }: Props) {
  return (
    <>
      <Head title={`${course} Course`} />

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-16">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Course</p>
          <h1 className="text-4xl font-semibold tracking-tight">{course}</h1>
          <p className="max-w-2xl text-muted-foreground">
            Lessons, assignments, and quizzes for this course will appear here.
          </p>
        </div>
      </section>
    </>
  );
}
