import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import CodeBlock from '@/components/code-block';
import CourseActivityBlock from '@/components/course-activity';
import InlineCodeText from '@/components/inline-code-text';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';
import type {
  CourseContentBlock,
  CourseSubheading,
} from '@/types/course-content';

export default function CourseContentBlockRenderer({
  block,
  id,
  codeLanguage,
  onActivityComplete,
}: {
  block: CourseContentBlock;
  id: string;
  codeLanguage: 'css' | 'html' | 'php';
  onActivityComplete?: () => void;
}) {
  const { resolvedAppearance } = useAppearance();

  if (block.type === 'activity') {
    return (
      <section id={id} className="scroll-mt-24">
        <CourseActivityBlock
          activity={block.activity}
          onComplete={onActivityComplete}
        />
      </section>
    );
  }

  if (block.type === 'image') {
    const imageSrc =
      resolvedAppearance === 'dark' && block.darkSrc
        ? block.darkSrc
        : block.src;

    return (
      <figure id={id} className="scroll-mt-24">
        <img
          src={imageSrc}
          alt={block.alt}
          className="max-h-115 w-full object-contain"
          loading="lazy"
        />
        {block.caption ? (
          <figcaption className="mt-3 text-sm text-muted-foreground">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{block.title}</h2>
      {block.markdown ? (
        <ReactMarkdown
          components={markdownComponents(
            codeLanguage,
            block.type === 'section' ? block.subheadings : undefined,
          )}
        >
          {block.markdown}
        </ReactMarkdown>
      ) : null}
      {block.body?.map((paragraph) => (
        <p key={paragraph} className="leading-7 text-muted-foreground">
          <InlineCodeText text={paragraph} />
        </p>
      ))}
      {block.example ? (
        <CodeBlock code={block.example} language={codeLanguage} />
      ) : null}
      {block.examples?.map((example, index) => (
        <CodeBlock
          key={`${example.language ?? codeLanguage}-${index}`}
          code={example.code}
          language={example.language ?? codeLanguage}
        />
      ))}
    </section>
  );
}

function markdownComponents(
  defaultCodeLanguage: 'css' | 'html' | 'php',
  subheadings: CourseSubheading[] = [],
): Components {
  let subheadingIndex = 0;

  return {
    a: ({ children, href, rel, target, title }) => (
      <a
        href={href}
        rel={rel}
        target={target}
        title={title}
        className="font-medium text-foreground underline underline-offset-4"
      >
        {children}
      </a>
    ),
    code: ({ children, className }) => {
      const code = String(children).replace(/\n$/, '');
      const language = markdownCodeLanguage(className) ?? defaultCodeLanguage;

      if (className?.startsWith('language-')) {
        return <CodeBlock code={code} language={language} />;
      }

      return (
        <code className="border bg-muted px-1 py-0.5 text-[0.95em]">
          {children}
        </code>
      );
    },
    h3: ({ children }) => (
      <h3
        id={subheadings[subheadingIndex++]?.id}
        className="scroll-mt-24 pt-2 text-lg font-semibold tracking-tight"
      >
        {renderDefinitionSyntax(children)}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        id={subheadings[subheadingIndex++]?.id}
        className="scroll-mt-24 pt-2 font-semibold tracking-tight"
      >
        {renderDefinitionSyntax(children)}
      </h4>
    ),
    li: ({ children }) => (
      <li className="pl-1 leading-7 text-muted-foreground">
        {renderDefinitionSyntax(children)}
      </li>
    ),
    ol: ({ children }) => (
      <ol className="ml-5 list-decimal space-y-1">{children}</ol>
    ),
    p: ({ children }) => (
      <p className="leading-7 text-muted-foreground">
        {renderDefinitionSyntax(children)}
      </p>
    ),
    pre: ({ children }) => <>{children}</>,
    ul: ({ children }) => (
      <ul className="ml-5 list-disc space-y-1">{children}</ul>
    ),
  };
}

function renderDefinitionSyntax(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === 'string') {
      return renderDefinitionText(child);
    }

    if (!isValidElement(child) || shouldSkipDefinitionSyntax(child)) {
      return child;
    }

    const element = child as ReactElement<{ children?: ReactNode }>;

    if (!element.props.children) {
      return element;
    }

    return cloneElement(element, {
      children: renderDefinitionSyntax(element.props.children),
    });
  });
}

function shouldSkipDefinitionSyntax(element: ReactElement) {
  return (
    typeof element.type === 'string' &&
    ['a', 'code', 'pre'].includes(element.type)
  );
}

function renderDefinitionText(text: string): ReactNode {
  const pattern = /\{([^|{}\n]+)\|([^{}\n]+)\}/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const [raw, term, definition] = match;
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    nodes.push(
      <DefinitionTerm
        key={`${term}-${index}`}
        term={term.trim()}
        definition={definition.trim()}
      />,
    );
    lastIndex = index + raw.length;
  }

  if (nodes.length === 0) {
    return text;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function DefinitionTerm({
  term,
  definition,
}: {
  term: string;
  definition: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <abbr
          className="cursor-help text-foreground underline decoration-dotted underline-offset-4"
          title={definition}
          tabIndex={0}
        >
          {term}
        </abbr>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{definition}</TooltipContent>
    </Tooltip>
  );
}

function markdownCodeLanguage(className?: string) {
  const language = className?.match(/language-([a-z0-9-]+)/i)?.[1];

  if (
    language === 'css' ||
    language === 'html' ||
    language === 'php' ||
    language === 'markup'
  ) {
    return language;
  }

  return undefined;
}
