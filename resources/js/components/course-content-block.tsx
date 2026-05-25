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
  codeLanguage: 'html' | 'php';
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
      <figure id={id} className="activity-card scroll-mt-6 border bg-card p-3">
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
      {block.body.map((paragraph) => (
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
