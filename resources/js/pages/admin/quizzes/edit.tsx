import { type FormEvent } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
type Difficulty = 'easy' | 'medium' | 'hard';

type Quiz = {
  id: number;
  course_slug: string;
  slug: string;
  title: string;
  description: string | null;
  question_count: number;
  time_limit_minutes: number;
  questions_count: number;
  questions?: QuizQuestion[];
};

type QuizQuestion = {
  id: number;
  course_slug: string;
  chapter_slug: string;
  type: QuestionType;
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  answer_pattern: string | null;
  position: number;
  options: QuizOption[];
};

type QuizOption = {
  id?: number;
  text: string;
  match_text?: string | null;
  is_correct: boolean;
  position: number;
};

type CourseOption = {
  value: string;
  label: string;
};

type ChapterOption = {
  value: string;
  label: string;
};

type QuestionFormData = {
  course_slug: string;
  chapter_slug: string;
  type: QuestionType;
  topic: string;
  difficulty: Difficulty;
  prompt: string;
  answer_pattern: string;
  position: number;
  options: QuizOption[];
};

type Props = {
  quiz: Quiz | null;
  courses: CourseOption[];
};

const courseChapters: Record<string, ChapterOption[]> = {
  html: [
    { value: 'intro-to-html', label: 'Intro to HTML' },
    { value: 'elements-and-tags', label: 'Elements and Tags' },
    { value: 'semantic-html', label: 'Semantic HTML' },
    { value: 'forms-and-inputs', label: 'Forms and Inputs' },
  ],
  css: [
    { value: 'selectors-and-cascade', label: 'Selectors and Cascade' },
    { value: 'box-model', label: 'Box Model' },
    { value: 'layout', label: 'Layout' },
  ],
  php: [
    { value: 'php-basics', label: 'PHP Basics' },
    { value: 'control-flow', label: 'Control Flow' },
    { value: 'forms-and-requests', label: 'Forms and Requests' },
  ],
  mysql: [
    { value: 'tables-and-queries', label: 'Tables and Queries' },
    { value: 'joins', label: 'Joins' },
    { value: 'schema-design', label: 'Schema Design' },
  ],
};

const questionTypes: Array<{ value: QuestionType; label: string }> = [
  { value: 'multiple_choice', label: 'Multiple choice' },
  { value: 'true_false', label: 'True/false' },
  { value: 'fill_blank', label: 'Fill in the blank' },
  { value: 'matching', label: 'Matching' },
];

export default function AdminQuizEdit({ quiz, courses }: Props) {
  const baseUrl = '/admin/quizzes';
  const isEditing = quiz !== null;
  const questionsCount = quiz?.questions_count ?? 0;
  const questions = quiz?.questions ?? [];
  const form = useForm({
    course_slug: quiz?.course_slug ?? 'html',
    title: quiz?.title ?? '',
    description: quiz?.description ?? '',
    question_count: quiz?.question_count ?? 1,
    time_limit_minutes: quiz?.time_limit_minutes ?? 30,
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (isEditing) {
      form.put(`${baseUrl}/${quiz.id}`);
      return;
    }

    form.post(baseUrl);
  };

  const generatedSlug = `${form.data.course_slug} ${form.data.title}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const requestedQuestions = formNumber(form.data.question_count);
  const isInvalidQuestionCount =
    questionsCount > 0 && requestedQuestions > questionsCount;

  return (
    <>
      <Head title={isEditing ? `Edit ${quiz.title}` : 'New Quiz'} />

      <div className="grid gap-6 p-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="max-w-5xl space-y-8">
          <form className="max-w-2xl space-y-6" onSubmit={submit}>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {isEditing ? 'Edit Quiz' : 'New Quiz'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure reusable chapter quiz metadata and manage the question
                bank below.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.data.title}
                onChange={(event) => form.setData('title', event.target.value)}
                required
              />
              <InputError message={form.errors.title} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="course_slug">Course</Label>
              <select
                id="course_slug"
                className={selectClassName}
                value={form.data.course_slug}
                onChange={(event) =>
                  form.setData('course_slug', event.target.value)
                }
                required
              >
                {courses.map((course) => (
                  <option key={course.value} value={course.value}>
                    {course.label}
                  </option>
                ))}
              </select>
              <InputError message={form.errors.course_slug} />
              <p className="text-xs text-muted-foreground">
                Generated slug: {generatedSlug || 'course-title'}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className={textareaClassName}
                value={form.data.description}
                onChange={(event) =>
                  form.setData('description', event.target.value)
                }
              />
              <InputError message={form.errors.description} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="question_count">Questions per attempt</Label>
                <Input
                  id="question_count"
                  type="number"
                  min={1}
                  max={questionsCount || undefined}
                  value={form.data.question_count}
                  onChange={(event) =>
                    form.setData('question_count', Number(event.target.value))
                  }
                  required
                />
                <InputError message={form.errors.question_count} />
                {isInvalidQuestionCount ? (
                  <p className="text-xs text-destructive">
                    This quiz asks for {requestedQuestions} questions per
                    attempt, but only {questionsCount} questions exist.
                  </p>
                ) : null}
                {isEditing && questionsCount === 0 ? (
                  <p className="text-xs text-destructive">
                    This quiz has no questions yet. Add questions before
                    teachers use it.
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time_limit_minutes">Time limit minutes</Label>
                <Input
                  id="time_limit_minutes"
                  type="number"
                  min={1}
                  value={form.data.time_limit_minutes}
                  onChange={(event) =>
                    form.setData(
                      'time_limit_minutes',
                      Number(event.target.value),
                    )
                  }
                  required
                />
                <InputError message={form.errors.time_limit_minutes} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={form.processing}>
                Save quiz
              </Button>
              <Button asChild variant="outline">
                <Link href={baseUrl}>Cancel</Link>
              </Button>
            </div>
          </form>

          {quiz ? (
            <section className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Questions
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add chapter-based questions using multiple choice, true/false,
                  fill-in-the-blank, or matching formats.
                </p>
              </div>

              <QuestionForm
                quizId={quiz.id}
                quizCourseSlug={quiz.course_slug}
                courses={courses}
              />

              <div className="space-y-4">
                {questions.map((question) => (
                  <QuestionForm
                    key={question.id}
                    quizId={quiz.id}
                    quizCourseSlug={quiz.course_slug}
                    courses={courses}
                    question={question}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {quiz ? <QuestionMinimap questions={questions} /> : null}
      </div>
    </>
  );
}

AdminQuizEdit.layout = (props: { quiz?: Quiz | null }) => ({
  breadcrumbs: [
    {
      title: 'Quiz Bank',
      href: '/admin/quizzes',
    },
    {
      title: props.quiz?.title ?? 'New Quiz',
      href: '#',
    },
  ],
});

function QuestionForm({
  quizId,
  quizCourseSlug,
  courses,
  question = null,
}: {
  quizId: number;
  quizCourseSlug: string;
  courses: CourseOption[];
  question?: QuizQuestion | null;
}) {
  const isEditing = question !== null;
  const initialData = questionToFormData(question, quizCourseSlug);
  const form = useForm<QuestionFormData>(initialData);
  const errors = form.errors as Record<string, string | undefined>;
  const chapters = getChapters(form.data.course_slug);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (isEditing) {
      form.put(`/admin/quizzes/${quizId}/questions/${question.id}`, {
        preserveScroll: true,
      });
      return;
    }

    form.post(`/admin/quizzes/${quizId}/questions`, {
      preserveScroll: true,
      onSuccess: () => form.setData(questionToFormData(null, quizCourseSlug)),
    });
  };

  const setQuestionType = (type: QuestionType) => {
    form.setData({
      ...form.data,
      type,
      answer_pattern: type === 'fill_blank' ? form.data.answer_pattern : '',
      options: defaultOptionsForType(type, form.data.options),
    });
  };

  const setQuestionCourse = (courseSlug: string) => {
    form.setData({
      ...form.data,
      course_slug: courseSlug,
      chapter_slug: getChapters(courseSlug)[0]?.value ?? '',
    });
  };

  const setOption = (
    index: number,
    field: keyof QuizOption,
    value: string | boolean | number,
  ) => {
    form.setData(
      'options',
      form.data.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, [field]: value } : option,
      ),
    );
  };

  const markCorrect = (index: number) => {
    form.setData(
      'options',
      form.data.options.map((option, optionIndex) => ({
        ...option,
        is_correct: optionIndex === index,
      })),
    );
  };

  const addOption = () => {
    if (form.data.options.length >= 6) {
      return;
    }

    form.setData('options', [
      ...form.data.options,
      {
        text: '',
        match_text: form.data.type === 'matching' ? '' : null,
        is_correct: false,
        position: form.data.options.length,
      },
    ]);
  };

  const removeOption = (index: number) => {
    const minimum = form.data.type === 'matching' ? 2 : 2;

    if (form.data.options.length <= minimum) {
      return;
    }

    const options = form.data.options
      .filter((_, optionIndex) => optionIndex !== index)
      .map((option, position) => ({ ...option, position }));

    if (!options.some((option) => option.is_correct) && options[0]) {
      options[0].is_correct = true;
    }

    form.setData('options', options);
  };

  return (
    <form
      id={isEditing ? `question-${question.id}` : 'new-question'}
      className="scroll-mt-4 space-y-4 border p-4"
      onSubmit={submit}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium">
            {isEditing ? 'Edit question' : 'New question'}
          </h3>
          {isEditing ? (
            <p className="text-xs text-muted-foreground">
              {questionTypeLabel(question.type)} | Position {question.position}
            </p>
          ) : null}
        </div>
        {isEditing ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() =>
              router.delete(`/admin/quizzes/${quizId}/questions/${question.id}`, {
                preserveScroll: true,
              })
            }
          >
            Delete
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="grid gap-2">
          <Label>Course</Label>
          <select
            className={selectClassName}
            value={form.data.course_slug}
            onChange={(event) => setQuestionCourse(event.target.value)}
          >
            {courses.map((course) => (
              <option key={course.value} value={course.value}>
                {course.label}
              </option>
            ))}
          </select>
          <InputError message={form.errors.course_slug} />
        </div>

        <div className="grid gap-2">
          <Label>Chapter</Label>
          <select
            className={selectClassName}
            value={form.data.chapter_slug}
            onChange={(event) =>
              form.setData('chapter_slug', event.target.value)
            }
          >
            {chapters.map((chapter) => (
              <option key={chapter.value} value={chapter.value}>
                {chapter.label}
              </option>
            ))}
          </select>
          <InputError message={form.errors.chapter_slug} />
        </div>

        <div className="grid gap-2">
          <Label>Question type</Label>
          <select
            className={selectClassName}
            value={form.data.type}
            onChange={(event) =>
              setQuestionType(event.target.value as QuestionType)
            }
          >
            {questionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <InputError message={form.errors.type} />
        </div>

        <div className="grid gap-2">
          <Label>Difficulty</Label>
          <select
            className={selectClassName}
            value={form.data.difficulty}
            onChange={(event) =>
              form.setData('difficulty', event.target.value as Difficulty)
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <InputError message={form.errors.difficulty} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_120px]">
        <div className="grid gap-2">
          <Label>Topic</Label>
          <Input
            value={form.data.topic}
            onChange={(event) => form.setData('topic', event.target.value)}
            required
          />
          <InputError message={form.errors.topic} />
        </div>

        <div className="grid gap-2">
          <Label>Position</Label>
          <Input
            type="number"
            min={0}
            value={form.data.position}
            onChange={(event) =>
              form.setData('position', Number(event.target.value))
            }
          />
          <InputError message={form.errors.position} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Prompt</Label>
        <textarea
          className={textareaClassName}
          value={form.data.prompt}
          onChange={(event) => form.setData('prompt', event.target.value)}
          required
        />
        <InputError message={form.errors.prompt} />
      </div>

      {form.data.type === 'fill_blank' ? (
        <div className="grid gap-2">
          <Label>Accepted answer regex</Label>
          <Input
            value={form.data.answer_pattern}
            onChange={(event) =>
              form.setData('answer_pattern', event.target.value)
            }
            placeholder="^<main>$"
            required
          />
          <InputError message={form.errors.answer_pattern} />
        </div>
      ) : null}

      {form.data.type === 'matching' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <Label>Matching pairs</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={form.data.options.length >= 6}
            >
              Add pair
            </Button>
          </div>

          {form.data.options.map((option, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <Input
                value={option.text}
                onChange={(event) => setOption(index, 'text', event.target.value)}
                placeholder="Term"
                required
              />
              <Input
                value={option.match_text ?? ''}
                onChange={(event) =>
                  setOption(index, 'match_text', event.target.value)
                }
                placeholder="Definition"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => removeOption(index)}
                disabled={form.data.options.length <= 2}
              >
                Remove
              </Button>
              <InputError message={errors[`options.${index}.text`]} />
            </div>
          ))}
          <InputError message={form.errors.options} />
        </div>
      ) : null}

      {form.data.type === 'multiple_choice' ? (
        <ChoiceOptions
          errors={errors}
          groupName={`correct-${question?.id ?? 'new'}`}
          options={form.data.options}
          canAdd={form.data.options.length < 6}
          canRemove={form.data.options.length > 2}
          onAdd={addOption}
          onRemove={removeOption}
          onMarkCorrect={markCorrect}
          onSetOption={setOption}
        />
      ) : null}

      {form.data.type === 'true_false' ? (
        <ChoiceOptions
          errors={errors}
          groupName={`correct-${question?.id ?? 'new'}`}
          options={form.data.options}
          canAdd={false}
          canRemove={false}
          onAdd={addOption}
          onRemove={removeOption}
          onMarkCorrect={markCorrect}
          onSetOption={setOption}
        />
      ) : null}

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={form.processing}>
          {isEditing ? 'Save question' : 'Add question'}
        </Button>
        <InputError message={form.errors.options} />
      </div>
    </form>
  );
}

function ChoiceOptions({
  options,
  errors,
  groupName,
  canAdd,
  canRemove,
  onAdd,
  onRemove,
  onMarkCorrect,
  onSetOption,
}: {
  options: QuizOption[];
  errors: Record<string, string | undefined>;
  groupName: string;
  canAdd: boolean;
  canRemove: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMarkCorrect: (index: number) => void;
  onSetOption: (
    index: number,
    field: keyof QuizOption,
    value: string | boolean | number,
  ) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <Label>Answer options</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          disabled={!canAdd}
        >
          Add option
        </Button>
      </div>

      {options.map((option, index) => (
        <div key={index} className="grid gap-2 md:grid-cols-[auto_1fr_88px_auto]">
          <input
            className="mt-2"
            type="radio"
            name={groupName}
            checked={option.is_correct}
            onChange={() => onMarkCorrect(index)}
            aria-label={`Mark option ${index + 1} correct`}
          />
          <Input
            value={option.text}
            onChange={(event) => onSetOption(index, 'text', event.target.value)}
            required
          />
          <Input
            type="number"
            min={0}
            value={option.position}
            onChange={(event) =>
              onSetOption(index, 'position', Number(event.target.value))
            }
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => onRemove(index)}
            disabled={!canRemove}
          >
            Remove
          </Button>
          <InputError message={errors[`options.${index}.text`]} />
        </div>
      ))}
    </div>
  );
}

function QuestionMinimap({ questions }: { questions: QuizQuestion[] }) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-4 border bg-background">
        <div className="border-b p-3">
          <h2 className="text-sm font-medium">Question Map</h2>
          <p className="text-xs text-muted-foreground">
            {questions.length} {questions.length === 1 ? 'question' : 'questions'}
          </p>
        </div>

        {questions.length > 0 ? (
          <nav className="max-h-[calc(100vh-8rem)] overflow-y-auto">
            {questions.map((question, index) => (
              <a
                key={question.id}
                href={`#question-${question.id}`}
                className="block border-b p-3 text-sm transition-colors hover:bg-muted/50"
              >
                <span className="block font-medium">
                  Q{index + 1}: {truncatePrompt(question.prompt)}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {questionTypeLabel(question.type)}
                </span>
              </a>
            ))}
          </nav>
        ) : (
          <p className="p-3 text-sm text-muted-foreground">
            Added questions will appear here.
          </p>
        )}
      </div>
    </aside>
  );
}

function questionToFormData(
  question: QuizQuestion | null,
  quizCourseSlug: string,
): QuestionFormData {
  const courseSlug = question?.course_slug ?? quizCourseSlug;
  const type = question?.type ?? 'multiple_choice';

  return {
    course_slug: courseSlug,
    chapter_slug: question?.chapter_slug ?? getChapters(courseSlug)[0]?.value ?? '',
    type,
    topic: question?.topic ?? '',
    difficulty: question?.difficulty ?? 'easy',
    prompt: question?.prompt ?? '',
    answer_pattern: question?.answer_pattern ?? '',
    position: question?.position ?? 0,
    options: defaultOptionsForType(type, question?.options),
  };
}

function defaultOptionsForType(
  type: QuestionType,
  existingOptions: QuizOption[] = [],
): QuizOption[] {
  if (type === 'fill_blank') {
    return [];
  }

  if (type === 'true_false') {
    const trueOption = existingOptions.find((option) => option.text === 'True');
    const falseOption = existingOptions.find((option) => option.text === 'False');

    return [
      {
        text: 'True',
        match_text: null,
        is_correct: trueOption?.is_correct ?? true,
        position: 0,
      },
      {
        text: 'False',
        match_text: null,
        is_correct: falseOption?.is_correct ?? false,
        position: 1,
      },
    ];
  }

  if (existingOptions.length > 0) {
    return existingOptions.map((option, index) => ({
      text: option.text,
      match_text: type === 'matching' ? option.match_text ?? '' : null,
      is_correct: type === 'matching' ? false : option.is_correct,
      position: option.position ?? index,
    }));
  }

  return Array.from({ length: type === 'matching' ? 2 : 4 }, (_, position) => ({
    text: '',
    match_text: type === 'matching' ? '' : null,
    is_correct: type === 'multiple_choice' && position === 0,
    position,
  }));
}

function getChapters(courseSlug: string): ChapterOption[] {
  return courseChapters[courseSlug] ?? courseChapters.html;
}

function questionTypeLabel(type: QuestionType) {
  return questionTypes.find((questionType) => questionType.value === type)?.label;
}

function truncatePrompt(prompt: string) {
  return prompt.length > 28 ? `${prompt.slice(0, 28).trim()}...` : prompt;
}

function formNumber(value: number | string) {
  return Number(value || 0);
}

const selectClassName =
  'h-8 w-full border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50';

const textareaClassName = cn(
  'min-h-24 w-full border border-input bg-transparent px-2.5 py-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50',
);
