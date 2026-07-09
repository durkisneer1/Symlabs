import Prism from 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/hooks/use-clipboard';
import { cn } from '@/lib/utils';

type CodeBlockProps = {
  code: string;
  language?: 'css' | 'markup' | 'html' | 'php';
  className?: string;
};

export default function CodeBlock({
  code,
  language = 'markup',
  className,
}: CodeBlockProps) {
  const grammar = Prism.languages[language] ?? Prism.languages.markup;
  const highlighted = Prism.highlight(code, grammar, language);
  const [, copy] = useClipboard();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1600);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copyCode = async () => {
    const didCopy = await copy(code);

    if (didCopy) {
      setCopied(true);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-xs"
        className="absolute top-2 right-2 z-10 bg-background/85 backdrop-blur-sm"
        aria-label={copied ? 'Code copied' : 'Copy code'}
        title={copied ? 'Copied' : 'Copy code'}
        onClick={() => void copyCode()}
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      </Button>
      <pre className="code-block-sunken overflow-x-auto border bg-muted p-4 pr-12 text-sm leading-6">
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
