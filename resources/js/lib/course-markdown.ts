import { sectionId } from '@/components/chapter-section-nav';
import type { CourseActivity } from '@/types/course-activities';
import type {
  CourseChapter,
  CourseCodeExample,
  CourseContentBlock,
  CourseImageBlock,
  CourseSectionBlock,
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
  body: string[];
  examples: CourseCodeExample[];
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
  let paragraph: string[] = [];
  let codeFence: { language?: string; lines: string[] } | null = null;

  const flushParagraph = () => {
    if (!section || paragraph.length === 0) {
      paragraph = [];
      return;
    }

    section.body.push(paragraph.join(' '));
    paragraph = [];
  };

  const flushSection = () => {
    flushParagraph();

    if (
      !section ||
      (section.body.length === 0 && section.examples.length === 0)
    ) {
      section = null;
      return;
    }

    blocks.push({
      type: 'section',
      id: uniqueId(section.title, usedIds),
      title: section.title,
      body: section.body,
      examples: section.examples,
    });
    section = null;
  };

  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    const fenceMatch = line.match(/^```([a-z0-9-]+)?\s*$/i);

    if (fenceMatch) {
      if (codeFence) {
        section ??= { title: 'Example', body: [], examples: [] };
        section.examples.push({
          code: codeFence.lines.join('\n'),
          language: normalizeLanguage(codeFence.language),
        });
        codeFence = null;
      } else {
        flushParagraph();
        codeFence = { language: fenceMatch[1], lines: [] };
      }

      continue;
    }

    if (codeFence) {
      codeFence.lines.push(line);
      continue;
    }

    const headingMatch = line.match(/^##\s+(.+)$/);

    if (headingMatch) {
      flushSection();
      section = { title: headingMatch[1].trim(), body: [], examples: [] };
      continue;
    }

    const activityMatch = line.match(
      /^<Activity\s+id=["']([^"']+)["']\s*\/>$/,
    );

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

    const imageMatch = line.match(/^<Image\s+id=["']([^"']+)["']\s*\/>$/);

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

    if (line.trim() === '') {
      flushParagraph();
      continue;
    }

    section ??= { title: 'Overview', body: [], examples: [] };
    paragraph.push(line.trim());
  }

  if (codeFence) {
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

function normalizeLanguage(language?: string) {
  if (language === 'html' || language === 'php' || language === 'markup') {
    return language;
  }

  return undefined;
}

function stripQuotes(value: string) {
  return value.replace(/^['"]|['"]$/g, '');
}
