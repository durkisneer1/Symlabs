import { Head, Link, usePage } from '@inertiajs/react';
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardList,
  Code2,
  GraduationCap,
  Sparkles,
  Users,
} from 'lucide-react';
import { dashboard, login } from '@/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export default function Welcome() {
  const { auth, currentTeam } = usePage().props;
  const dashboardUrl = currentTeam ? dashboard(currentTeam.slug) : '/';

  const date = new Date();
  const year = date.getFullYear();

  const courses = [
    {
      title: 'HTML',
      description: 'Semantic markup, forms, links, media, and page structure.',
    },
    {
      title: 'CSS',
      description: 'Selectors, layout, responsive design, and visual systems.',
    },
    {
      title: 'PHP',
      description: 'Server-side fundamentals, forms, sessions, and data flow.',
    },
    {
      title: 'MySQL',
      description: 'Queries, relationships, normalization, and classroom labs.',
    },
  ];

  const teacherValues = [
    {
      icon: BookOpen,
      title: 'Ready-made lessons',
      description:
        'Structured course material that teachers can preview, assign, and adapt for the classroom.',
    },
    {
      icon: ClipboardList,
      title: 'Built-in practice',
      description:
        'Homework and quizzes are tied to the lessons, so practice follows the material students just learned.',
    },
    {
      icon: Users,
      title: 'Classroom friendly',
      description:
        'Students log in only when they have assigned work, while teachers keep the course flow simple.',
    },
  ];

  const heroStats = [
    {
      value: '4',
      label: 'Starter courses',
      detail: 'HTML, CSS, PHP, and MySQL',
    },
    {
      value: '3',
      label: 'Assignment types',
      detail: 'Lessons, homework, and quizzes',
    },
    {
      value: '1+',
      label: 'Contributor',
      detail: 'Open for classroom feedback',
    },
  ];

  return (
    <>
      <Head title="Home" />

      <div className="min-h-screen bg-background text-foreground">
        <header className="mx-auto w-full max-w-7xl px-6 pt-5 lg:px-8">
          <NavigationMenu className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className="flex items-center gap-2 font-heading text-sm font-semibold"
                >
                  <span className="flex size-7 items-center justify-center border bg-primary text-primary-foreground">
                    <Code2 className="size-4" />
                  </span>
                  InkBooks
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-105 gap-2 p-2 md:w-130 md:grid-cols-2">
                    {courses.map((course) => (
                      <li key={course.title}>
                        <NavigationMenuLink
                          href="#courses"
                          className="block h-full border p-3 transition-colors hover:bg-muted/60 focus:bg-muted/60"
                        >
                          <span className="flex items-center justify-between gap-3 text-sm font-medium">
                            {course.title}
                            <Code2 className="size-4 shrink-0 text-muted-foreground" />
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                            {course.description}
                          </span>
                          <span className="mt-3 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                            <span className="border px-1.5 py-0.5">
                              Lessons
                            </span>
                            <span className="border px-1.5 py-0.5">
                              Homework
                            </span>
                            <span className="border px-1.5 py-0.5">
                              Quizzes
                            </span>
                          </span>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuLink href="#teachers">
                  For Teachers
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuLink href="#open-source">
                  Open Source
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuList>
              {auth.user ? (
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={dashboardUrl}>Dashboard</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={login()}>Student Login</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <section className="grid gap-10 py-16 lg:min-h-[calc(100vh-96px)] lg:grid-cols-[1fr_0.86fr] lg:items-center lg:py-20">
            <div>
              <Badge variant="outline" className="mb-5 gap-1.5">
                <Sparkles className="size-3" />
                Free and open courseware
              </Badge>
              <h1 className="max-w-3xl text-5xl leading-tight font-semibold tracking-normal text-balance md:text-7xl">
                Courseware for classrooms that teach code.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                InkBooks gives teachers assignable lessons, homework, and
                quizzes for web development and programming courses without
                putting another subscription between students and learning.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href="#courses">
                    Browse courses
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={auth.user ? dashboardUrl : login()}>
                    {auth.user ? 'Go to dashboard' : 'Student login'}
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="border-2">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>Course library snapshot</CardTitle>
                    <CardDescription>
                      A quick look at what InkBooks is set up to support.
                    </CardDescription>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center border bg-muted">
                    <ChartNoAxesCombined className="size-5" />
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="border p-4">
                      <p className="font-heading text-3xl font-semibold">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm font-medium">{stat.label}</p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {stat.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Course signals</p>
                      <p className="text-xs text-muted-foreground">
                        What each course is designed to include
                      </p>
                    </div>
                    <Badge variant="secondary">FOSS</Badge>
                  </div>
                  <div className="space-y-3">
                    {[
                      ['Lessons', 'Public reading material'],
                      ['Homework', 'Assigned student practice'],
                      ['Quizzes', 'Exam-like checks'],
                    ].map(([label, description]) => (
                      <div key={label}>
                        <div className="mb-1 flex justify-between gap-3 text-xs">
                          <span className="font-medium">{label}</span>
                          <span className="text-right text-muted-foreground">
                            {description}
                          </span>
                        </div>
                        <div className="h-2 bg-muted">
                          <div className="h-full w-full bg-primary" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </header>

        <main className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
          <section id="teachers" className="border-t py-14">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-medium text-muted-foreground">
                For teachers
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-balance">
                Lessons, practice, and assessment in one open classroom tool.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {teacherValues.map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <item.icon className="size-5" />
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          <section id="courses" className="border-t py-14">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-muted-foreground">
                  Course library
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-balance">
                  Start with practical web development courses.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                Each course can include public lesson material plus assignable
                homework and exam-like quizzes for enrolled students.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {courses.map((course) => (
                <Card key={course.title} className="min-h-52">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {course.title}
                      <Code2 className="size-4 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex gap-2">
                    <Badge variant="outline">Lessons</Badge>
                    <Badge variant="outline">Homework</Badge>
                    <Badge variant="outline">Quizzes</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="grid gap-8 border-t py-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Classroom flow
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-balance">
                Built around the way teachers already assign work.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Choose a course and preview the sequence.',
                'Assign lessons, homework, or quizzes to a class.',
                'Students log in to complete the assigned work.',
                'Teachers review submissions and progress.',
              ].map((step) => (
                <div key={step} className="flex gap-3 border p-4">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                  <p className="text-sm leading-6">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="open-source"
            className="grid gap-8 border-t py-14 lg:grid-cols-2 lg:items-center"
          >
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Open source
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-balance">
                Courseware should be shared classroom infrastructure.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                InkBooks is built for schools, clubs, and independent teachers
                who need useful course material without paywalls, seat licenses,
                or locked content.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                ['Free to use', 'No student subscription required.'],
                [
                  'Open to improve',
                  'Lessons can evolve with teacher feedback.',
                ],
                [
                  'Focused on code',
                  'Designed for web and programming classes.',
                ],
              ].map(([title, description]) => (
                <div key={title} className="border p-4">
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t pt-14">
            <div className="flex flex-col justify-between gap-5 border bg-muted/30 p-6 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-5" />
                  <h2 className="text-xl font-semibold">
                    Already assigned work?
                  </h2>
                </div>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  Student accounts are for classrooms using InkBooks lessons,
                  homework, and quizzes.
                </p>
              </div>
              <Button asChild>
                <Link href={auth.user ? dashboardUrl : login()}>
                  {auth.user ? 'Open dashboard' : 'Student login'}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <footer className="mx-auto flex w-full max-w-7xl flex-col gap-2 border-t px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between lg:px-8">
          <p>&copy; {year} InkBooks</p>
          <p>Free courseware for classrooms that teach code.</p>
        </footer>
      </div>
    </>
  );
}
