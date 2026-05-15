import { Head } from '@inertiajs/react';

export default function Welcome() {
  return (
    <>
      <Head title="Home" />
      
      <section className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center py-16">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">Inkbooks</h1>
          <p className="max-w-xl text-muted-foreground">
            Courseware for learning web development with interactive lessons,
            practice, and quizzes.
          </p>
        </div>
      </section>
    </>
  );
}
