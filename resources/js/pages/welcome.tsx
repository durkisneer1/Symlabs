import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const featureSections = [
  {
    label: '01',
    title: 'Learn first. Sign up only if a class needs it.',
    summary:
      'Courses are open for self-study. An account only matters when your work needs to be attached to a classroom, a teacher, or site administration.',
  },
  {
    label: '02',
    title: 'Student mode records assigned work, not casual browsing.',
    summary:
      'Outside the dashboard, students see nearly the same course experience as everyone else. The difference is that assigned chapters can report progress and attempts.',
  },
  {
    label: '03',
    title: 'Teachers assign chapters and quiz checks from one dashboard.',
    summary: (
      <>
        Teachers assign chapter homework and exam-like quizzes from the
        dashboard. Quiz banks are administrator-provided so{' '}
        <em>answers are not exposed in source code</em>.
      </>
    ),
  },
  {
    label: '04',
    title: 'Web courses first, broader languages next.',
    summary:
      'HTML, CSS, PHP, and SQL come first. Python and C++ follow once the early courses mature, with JavaScript, TypeScript, Rust, quizzes, and learning games further out.',
  },
];

export default function Welcome() {
  return (
    <>
      <Head title="Home" />

      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 py-14 md:grid-cols-[minmax(0,1fr)_minmax(22rem,0.92fr)] md:py-20">
        <div className="max-w-2xl space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Free programming courseware
            </p>
            <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
              Learn programming without buying access to your homework.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              Symlabs pairs short lessons with practice, quizzes, and classroom
              tools. Anyone can learn for free; accounts are only for students,
              teachers, and admins who need classroom workflows.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/courses/html"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Start HTML <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/teacher-requests"
              className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Request teacher tools
            </Link>
          </div>

          <dl className="flex max-w-xl flex-wrap items-center gap-x-8 gap-y-3 pt-2 text-sm">
            {[
              'Free self-study',
              'Recorded class progress',
              'More courses planned',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <CheckCircle2 className="size-4 text-[var(--accent-green)]" />
                <dt>{item}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl ring-1 ring-foreground/10">
            <div className="flex h-9 items-center gap-2 border-b border-border bg-muted/70 px-4">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-yellow-400" />
              <span className="size-3 rounded-full bg-green-400" />
              <span className="ml-2 truncate text-xs text-muted-foreground">
                symlabs.net/courses/html
              </span>
            </div>
            <picture className="dark:hidden">
              <source
                srcSet="/images/home-thumbnail/screenshot-light@0.5x.webp"
                type="image/webp"
              />
              <img
                src="/images/home-thumbnail/screenshot-light@0.5x.png"
                alt="Symlabs course page preview"
                className="aspect-[16/9] w-full object-cover object-top"
                width="960"
                height="540"
              />
            </picture>
            <picture className="hidden dark:block">
              <source
                srcSet="/images/home-thumbnail/screenshot-dark@0.5x.webp"
                type="image/webp"
              />
              <img
                src="/images/home-thumbnail/screenshot-dark@0.5x.png"
                alt="Symlabs course page preview"
                className="aspect-[16/9] w-full object-cover object-top"
                width="960"
                height="540"
              />
            </picture>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-border py-12">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            How Symlabs works
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Free to explore. Structured when assigned.
          </h2>
          <p className="text-muted-foreground">
            Symlabs is useful before a user ever creates an account. Classroom
            accounts add accountability: assigned homework, quizzes, progress,
            and teacher-visible results.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 pb-16 md:grid-cols-2">
        {featureSections.map((section) => (
          <article
            key={section.title}
            className="rounded-lg border border-border bg-card/80 p-5 shadow-sm"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
              {section.label}
            </p>
            <h3 className="mt-3 font-semibold">{section.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {section.summary}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl border-t border-border py-12">
        <div className="rounded-xl border border-border bg-card/80 p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Built by a professor
          </p>
          <p className="mt-3 max-w-4xl text-xl leading-relaxed">
            Symlabs is created by a professor at San Jacinto College who has
            seen students pay too much for courseware just to submit homework.
            The aim is practical classroom software that supports teachers
            without putting another access-code bill in front of students.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 border-t border-border py-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl ring-1 ring-foreground/10">
          <div className="flex h-9 items-center gap-2 border-b border-border bg-muted/70 px-4">
            <span className="size-3 rounded-full bg-red-400" />
            <span className="size-3 rounded-full bg-yellow-400" />
            <span className="size-3 rounded-full bg-green-400" />
            <span className="ml-2 truncate text-xs text-muted-foreground">
              symlabs.net/dashboard/teacher
            </span>
          </div>
          <picture className="dark:hidden">
            <source
              srcSet="/images/dashboard-thumbnail/dashboard-light@0.5x.webp"
              type="image/webp"
            />
            <img
              src="/images/dashboard-thumbnail/dashboard-light@0.5x.png"
              alt="Teacher dashboard preview with student progress and assignment stats"
              className="aspect-[16/9] w-full object-cover object-top"
              width="960"
              height="540"
            />
          </picture>
          <picture className="hidden dark:block">
            <source
              srcSet="/images/dashboard-thumbnail/dashboard-dark@0.5x.webp"
              type="image/webp"
            />
            <img
              src="/images/dashboard-thumbnail/dashboard-dark@0.5x.png"
              alt="Teacher dashboard preview with student progress and assignment stats"
              className="aspect-[16/9] w-full object-cover object-top"
              width="960"
              height="540"
            />
          </picture>
        </div>

        <div className="space-y-3 lg:pl-2">
          <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Teacher visibility
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Spot who needs help while there is still time.
          </h2>
          <p className="text-muted-foreground">
            Student detail pages show completed work, average score, recent
            activity, grades, and attempt history across homework and quizzes.
            The goal is a dashboard teachers can act on before missed practice
            becomes a final grade problem.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl pb-16">
        <div className="rounded-xl border border-border bg-card/80 p-6 shadow-sm">
          <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Learning goal
          </p>
          <p className="mt-3 max-w-4xl text-xl leading-relaxed">
            Each course should help a beginner read, write, and explain the
            language with confidence, not just click through answers. By the end
            of a course, learners should understand when to use the tools they
            practiced and be able to explain their choices.
          </p>
        </div>
      </section>
    </>
  );
}
