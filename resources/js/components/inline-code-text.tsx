type InlineCodeTextProps = {
  text: string;
};

export default function InlineCodeText({ text }: InlineCodeTextProps) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={index}
              className="border bg-muted px-1 py-0.5 text-[0.95em]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        return part;
      })}
    </>
  );
}
