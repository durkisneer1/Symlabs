import ReactMarkdown, { type Components } from 'react-markdown';
import CodeBlock from '@/components/code-block';
import CourseActivityBlock from '@/components/course-activity';
import InlineCodeText from '@/components/inline-code-text';
import { useAppearance } from '@/hooks/use-appearance';
import type { CourseContentBlock } from '@/types/course-content';

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
      <section id={id} className="scroll-mt-6">
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
      <figure id={id} className="scroll-mt-6">
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
    <section id={id} className="scroll-mt-6 space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{block.title}</h2>
      {block.markdown ? (
        <ReactMarkdown components={markdownComponents(codeLanguage)}>
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
): Components {
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
      <h3 className="pt-2 text-lg font-semibold tracking-tight">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="pt-2 font-semibold tracking-tight">{children}</h4>
    ),
    li: ({ children }) => (
      <li className="pl-1 leading-7 text-muted-foreground">{children}</li>
    ),
    ol: ({ children }) => (
      <ol className="ml-5 list-decimal space-y-1">{children}</ol>
    ),
    p: ({ children }) => (
      <p className="leading-7 text-muted-foreground">{children}</p>
    ),
    pre: ({ children }) => <>{children}</>,
    ul: ({ children }) => (
      <ul className="ml-5 list-disc space-y-1">{children}</ul>
    ),
  };
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
