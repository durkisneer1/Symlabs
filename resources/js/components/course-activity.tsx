import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, File, Folder } from 'lucide-react';
import CodeBlock from '@/components/code-block';
import InlineCodeText from '@/components/inline-code-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type {
  CodeFlowActivity,
  CourseActivity,
  CssPlaygroundActivity,
  FileTreeActivity,
  FileTreeNode,
  HtmlPlaygroundActivity,
  QuickCheckActivity,
  RecapActivity,
} from '@/types/course-activities';

export default function CourseActivityBlock({
  activity,
  onComplete,
}: {
  activity: CourseActivity;
  onComplete?: () => void;
}) {
  if (activity.type === 'recap') {
    return (
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="h-px flex-1 bg-border" />
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--page-accent,var(--accent-cyan))]" />
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="activity-card">
          <Recap activity={activity} />
        </div>
      </div>
    );
  }

  return (
    <div className="activity-card">
      {activity.type === 'quick-check' ? (
        <QuickCheck activity={activity} onComplete={onComplete} />
      ) : null}
      {activity.type === 'file-tree' ? <FileTree activity={activity} /> : null}
      {activity.type === 'code-flow' ? <CodeFlow activity={activity} /> : null}
      {activity.type === 'css-playground' ? (
        <CssPlayground activity={activity} onComplete={onComplete} />
      ) : null}
      {activity.type === 'html-playground' ? (
        <HtmlPlayground activity={activity} onComplete={onComplete} />
      ) : null}
    </div>
  );
}

function QuickCheck({
  activity,
  onComplete,
}: {
  activity: QuickCheckActivity;
  onComplete?: () => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shuffledChoices, setShuffledChoices] = useState(activity.choices);

  useEffect(() => {
    setShuffledChoices(shuffleChoices(activity.choices));
    setSelectedAnswer(null);
  }, [activity.choices, activity.prompt]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity.title}</CardTitle>
        <CardDescription>
          <InlineCodeText text={activity.prompt} />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          {shuffledChoices.map((choice) => {
            const isSelected = selectedAnswer === choice;
            const isCorrect = choice === activity.answer;

            return (
              <Button
                key={choice}
                type="button"
                variant={isSelected ? 'secondary' : 'outline'}
                className="h-full min-h-11 justify-start py-2 text-left leading-snug whitespace-normal"
                onClick={() => {
                  setSelectedAnswer(choice);
                  if (isCorrect) {
                    onComplete?.();
                  }
                }}
              >
                {isSelected && isCorrect ? <CheckCircle2 /> : null}
                {choice}
              </Button>
            );
          })}
        </div>

        {selectedAnswer ? (
          <p className="text-sm text-muted-foreground">
            {selectedAnswer === activity.answer ? (
              <InlineCodeText text={'Correct! ' + activity.explanation} />
            ) : (
              'Not quite. '
            )}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function shuffleChoices(choices: string[]) {
  const shuffled = [...choices];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentChoice = shuffled[index];

    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = currentChoice;
  }

  return shuffled;
}

function FileTree({ activity }: { activity: FileTreeActivity }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity.title}</CardTitle>
        <CardDescription>{activity.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border bg-muted/40 p-3">
          <TreeNode node={activity.root} depth={0} />
        </div>
      </CardContent>
    </Card>
  );
}

function TreeNode({ node, depth }: { node: FileTreeNode; depth: number }) {
  const Icon = node.kind === 'folder' ? Folder : File;

  return (
    <div>
      <div
        className="flex items-start gap-2 py-1 text-sm"
        style={{ paddingLeft: depth * 18 }}
      >
        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div>
          <span className="font-medium">{node.name}</span>
          {node.note ? (
            <span className="ml-2 text-muted-foreground italic">
              {node.note}
            </span>
          ) : null}
        </div>
      </div>
      {node.children?.map((child) => (
        <TreeNode
          key={`${node.name}-${child.name}`}
          node={child}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

function CodeFlow({ activity }: { activity: CodeFlowActivity }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = activity.steps[stepIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity.title}</CardTitle>
        <CardDescription>{activity.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {activity.steps.map((item, index) => (
            <Button
              key={item.label}
              type="button"
              size="sm"
              variant={index === stepIndex ? 'secondary' : 'outline'}
              onClick={() => setStepIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-3">
            <Badge variant="outline">{step.label}</Badge>
            <CodeBlock code={step.code} language="php" />
            <p className="text-sm leading-6 text-muted-foreground">
              {step.note}
            </p>
          </div>

          <div className="space-y-3">
            <div className="border bg-muted/40 p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Memory
              </p>
              <div className="space-y-2">
                {step.memory.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between border bg-background px-2 py-1.5 text-sm"
                  >
                    <code>{item.name}</code>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            {step.output ? (
              <div className="border bg-background p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Output
                </p>
                <code>{step.output}</code>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CssPlayground({
  activity,
  onComplete,
}: {
  activity: CssPlaygroundActivity;
  onComplete?: () => void;
}) {
  const [css, setCss] = useState(activity.starter);
  const styles = useMemo(
    () => parseDeclarations(css, activity.allowedProperties),
    [activity.allowedProperties, css],
  );
  const solved = activity.target
    .split(';')
    .filter(Boolean)
    .every((declaration) =>
      css.replace(/\s/g, '').includes(declaration.replace(/\s/g, '')),
    );

  useEffect(() => {
    if (solved) {
      onComplete?.();
    }
  }, [onComplete, solved]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity.title}</CardTitle>
        <CardDescription>
          <InlineCodeText text={activity.prompt} />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Textarea
            className="min-h-32 font-mono"
            value={css}
            onChange={(event) => setCss(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Allowed: {activity.allowedProperties.join(', ')}
          </p>
          {solved ? (
            <p className="text-sm text-muted-foreground">
              <CheckCircle2 className="mr-1 inline size-4" />
              {activity.success}
            </p>
          ) : null}
        </div>

        <div className="border bg-muted/40 p-3">
          <div
            className="min-h-44 border bg-white p-3"
            style={{ display: 'flex', ...styles }}
          >
            <div className="ink-accent-icon">A</div>
            <div className="ink-accent-icon">B</div>
            <div className="ink-accent-icon">C</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HtmlPlayground({
  activity,
  onComplete,
}: {
  activity: HtmlPlaygroundActivity;
  onComplete?: () => void;
}) {
  const [markup, setMarkup] = useState(activity.starter);
  const safeMarkup = sanitizeMarkup(markup);
  const normalizedMarkup = markup.toLowerCase();
  const solved =
    activity.answerIncludes.every((snippet) =>
      normalizedMarkup.includes(snippet.toLowerCase()),
    ) &&
    (activity.answerExcludes ?? []).every(
      (snippet) => !normalizedMarkup.includes(snippet.toLowerCase()),
    );

  useEffect(() => {
    if (solved) {
      onComplete?.();
    }
  }, [onComplete, solved]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity.title}</CardTitle>
        <CardDescription>
          <InlineCodeText text={activity.prompt} />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Textarea
            className="min-h-36 font-mono"
            value={markup}
            onChange={(event) => setMarkup(event.target.value)}
          />
          {solved ? (
            <p className="text-sm text-muted-foreground">
              <CheckCircle2 className="mr-1 inline size-4" />
              {activity.success}
            </p>
          ) : null}
        </div>

        <div className="border bg-muted/40 p-3">
          <div className="min-h-28 border bg-background p-4">
            <div dangerouslySetInnerHTML={{ __html: safeMarkup }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Recap({ activity }: { activity: RecapActivity }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity.title}</CardTitle>
        <CardDescription>Open each item for a quick rehash.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {activity.items.map((item, index) => (
          <div key={item.question} className="border">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 p-3 text-left text-sm font-medium"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              {item.question}
              <ChevronRight
                className={`size-4 transition-transform ${openIndex === index ? 'rotate-90' : ''}`}
              />
            </button>
            {openIndex === index ? (
              <p className="border-t bg-muted/40 p-3 text-sm leading-6 text-muted-foreground">
                <InlineCodeText text={item.answer} />
              </p>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function parseDeclarations(css: string, allowedProperties: string[]) {
  return css
    .split(';')
    .map((line) => line.split(':').map((piece) => piece.trim()))
    .filter(([property, value]) => property && value)
    .reduce<Record<string, string>>((styles, [property, value]) => {
      if (allowedProperties.includes(property)) {
        styles[toCamelCase(property)] = value;
      }

      return styles;
    }, {});
}

function toCamelCase(value: string) {
  return value.replace(/-([a-z])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}

function sanitizeMarkup(markup: string) {
  const allowedTags = [
    'p',
    'strong',
    'em',
    'b',
    'i',
    'mark',
    'button',
    'a',
    'h2',
  ];
  const withoutScripts = markup.replace(/<script[\s\S]*?<\/script>/gi, '');

  return withoutScripts.replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (match, tag) => {
    if (!allowedTags.includes(String(tag).toLowerCase())) {
      return '';
    }

    return match
      .replace(/\son\w+="[^"]*"/gi, '')
      .replace(/\son\w+='[^']*'/gi, '');
  });
}
