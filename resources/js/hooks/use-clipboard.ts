// Credit: https://usehooks-ts.com/
import { useState } from 'react';

export type CopiedValue = string | null;
export type CopyFn = (text: string) => Promise<boolean>;
export type UseClipboardReturn = [CopiedValue, CopyFn];

export function useClipboard(): UseClipboardReturn {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);

        return true;
      } catch (error) {
        console.warn('Clipboard API copy failed', error);
      }
    }

    try {
      copyWithTextarea(text);
      setCopiedText(text);

      return true;
    } catch (error) {
      console.warn('Fallback copy failed', error);
      setCopiedText(null);

      return false;
    }
  };

  return [copiedText, copy];
}

function copyWithTextarea(text: string) {
  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const didCopy = document.execCommand('copy');

  document.body.removeChild(textarea);

  if (!didCopy) {
    throw new Error('document.execCommand("copy") returned false.');
  }
}
