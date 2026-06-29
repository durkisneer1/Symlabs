import { sectionId } from '@/components/chapter-section-nav';
import type { CourseActivity } from '@/types/course-activities';
import type {
  CourseChapter,
  CourseContentBlock,
  CourseImageBlock,
  CourseSubheading,
} from '@/types/course-content';

type CourseImageDefinition = Omit<CourseImageBlock, 'type' | 'id'>;

type ParseChapterOptions = {
  source: string;
  activities: Record<string, CourseActivity>;
  images?: Record<string, CourseImageDefinition>;
};

type ChapterFrontmatter = Omit<CourseChapter, 'content'>;

type SectionDraft = {
  title: string;
  markdownLines: string[];
};

export function parseCourseChapterMarkdown({
  source,
  activities,
  images = {},
}: ParseChapterOptions): CourseChapter {
  const { frontmatter, markdown } = parseFrontmatter(source);
  const content = parseContent(markdown, activities, images);

  return {
    ...frontmatter,
    content,
  };
}

function parseFrontmatter(source: string) {
  if (!source.startsWith('---')) {
    throw new Error('Course chapter markdown must start with frontmatter.');
  }

  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const closingIndex = lines.findIndex(
    (line, index) => index > 0 && line === '---',
  );

  if (closingIndex === -1) {
    throw new Error('Course chapter frontmatter is missing a closing "---".');
  }

  const frontmatter = lines
    .slice(1, closingIndex)
    .reduce<Record<string, string>>((metadata, line) => {
      const separatorIndex = line.indexOf(':');

      if (separatorIndex === -1) {
        return metadata;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      metadata[key] = stripQuotes(value);
      return metadata;
    }, {});

  return {
    frontmatter: requireFrontmatter(frontmatter),
    markdown: lines.slice(closingIndex + 1).join('\n').trim(),
  };
}

function requireFrontmatter(
  metadata: Record<string, string>,
): ChapterFrontmatter {
  const requiredFields = ['number', 'slug', 'title', 'summary', 'duration'];

  for (const field of requiredFields) {
    if (!metadata[field]) {
      throw new Error(`Course chapter frontmatter is missing "${field}".`);
    }
  }

  return {
    number: Number(metadata.number),
    slug: metadata.slug,
    title: metadata.title,
    summary: metadata.summary,
    duration: metadata.duration,
  };
}

function parseContent(
  markdown: string,
  activities: Record<string, CourseActivity>,
  images: Record<string, CourseImageDefinition>,
) {
  const blocks: CourseContentBlock[] = [];
  const usedIds = new Map<string, number>();
  let section: SectionDraft | null = null;
  let inCodeFence = false;

  const flushSection = () => {
    const sectionMarkdown = trimBlankLines(section?.markdownLines ?? []).join(
      '\n',
    );

    if (!section || sectionMarkdown.length === 0) {
      section = null;
      return;
    }

    blocks.push({
      type: 'section',
      id: uniqueId(section.title, usedIds),
      title: section.title,
      subheadings: collectSubheadings(sectionMarkdown, usedIds),
      markdown: sectionMarkdown,
    });
    section = null;
  };

  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    if (line.match(/^```/)) {
      section ??= { title: 'Example', markdownLines: [] };
      section.markdownLines.push(line);
      inCodeFence = !inCodeFence;
      continue;
    }

    const headingMatch = inCodeFence ? null : line.match(/^##\s+(.+)$/);

    if (headingMatch) {
      flushSection();
      section = { title: headingMatch[1].trim(), markdownLines: [] };
      continue;
    }

    const activityMatch = inCodeFence
      ? null
      : line.match(/^<Activity\s+id=["']([^"']+)["']\s*\/>$/);

    if (activityMatch) {
      flushSection();
      const activityId = activityMatch[1];
      const activity = activities[activityId];

      if (!activity) {
        throw new Error(`Unknown course activity "${activityId}".`);
      }

      blocks.push({
        type: 'activity',
        id: uniqueId(activity.title, usedIds),
        activity,
      });
      continue;
    }

    const imageMatch = inCodeFence
      ? null
      : line.match(/^<Image\s+id=["']([^"']+)["']\s*\/>$/);

    if (imageMatch) {
      flushSection();
      const imageId = imageMatch[1];
      const image = images[imageId];

      if (!image) {
        throw new Error(`Unknown course image "${imageId}".`);
      }

      blocks.push({
        type: 'image',
        id: uniqueId(image.title, usedIds),
        ...image,
      });
      continue;
    }

    section ??= { title: 'Overview', markdownLines: [] };
    section.markdownLines.push(line);
  }

  if (inCodeFence) {
    throw new Error('Course chapter markdown has an unclosed code fence.');
  }

  flushSection();

  return blocks;
}

function uniqueId(value: string, usedIds: Map<string, number>) {
  const baseId = sectionId(value) || 'section';
  const count = usedIds.get(baseId) ?? 0;

  usedIds.set(baseId, count + 1);

  return count === 0 ? baseId : `${baseId}-${count + 1}`;
}

function stripQuotes(value: string) {
  return value.replace(/^['"]|['"]$/g, '');
}

function collectSubheadings(markdown: string, usedIds: Map<string, number>) {
  const subheadings: CourseSubheading[] = [];
  let inCodeFence = false;

  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    if (line.match(/^```/)) {
      inCodeFence = !inCodeFence;
      continue;
    }

    const headingMatch = inCodeFence ? null : line.match(/^(#{3,4})\s+(.+)$/);

    if (!headingMatch) {
      continue;
    }

    subheadings.push({
      id: uniqueId(stripMarkdownText(headingMatch[2]), usedIds),
      title: stripMarkdownText(headingMatch[2]),
      depth: headingMatch[1].length === 3 ? 1 : 2,
    });
  }

  return subheadings;
}

function stripMarkdownText(value: string) {
  return value
    .replace(/\{([^|{}\n]+)\|([^{}\n]+)\}/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

function trimBlankLines(lines: string[]) {
  const nextLines = [...lines];

  while (nextLines[0]?.trim() === '') {
    nextLines.shift();
  }

  while (nextLines.at(-1)?.trim() === '') {
    nextLines.pop();
  }

  return nextLines;
}
