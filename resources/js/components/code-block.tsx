import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import { cn } from '@/lib/utils';

type CodeBlockProps = {
  code: string;
  language?: 'markup' | 'html' | 'php';
  className?: string;
};

export default function CodeBlock({
  code,
  language = 'markup',
  className,
}: CodeBlockProps) {
  const grammar = Prism.languages[language] ?? Prism.languages.markup;
  const highlighted = Prism.highlight(code, grammar, language);

  return (
    <pre
      className={cn(
        'code-block-sunken overflow-x-auto border bg-muted p-4 text-sm leading-6',
        className,
      )}
    >
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
}
