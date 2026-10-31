/**
 * Parse PDF / Word study materials into a Coursera-style curriculum outline:
 * Module (H1) → Lesson (H2) → body text (H3 treated as section titles inside lesson).
 */

export type CurriculumLesson = {
  title: string;
  summary?: string;
  textContent: string;
  contentType: 'RICH_TEXT' | 'PDF' | 'DOC';
  assetUrl?: string;
  displayOrder: number;
  durationMinutes: number;
};

export type CurriculumModule = {
  title: string;
  description?: string;
  displayOrder: number;
  lessons: CurriculumLesson[];
};

export type CurriculumOutline = {
  modules: CurriculumModule[];
  sourceName: string;
  headingCount: number;
};

type HeadingBlock = {
  level: 1 | 2 | 3;
  title: string;
  body: string[];
};

function cleanTitle(raw: string) {
  return raw.replace(/\s+/g, ' ').replace(/^[\d.]+\s*/, '').trim().slice(0, 200) || 'Untitled section';
}

function estimateMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(5, Math.min(60, Math.ceil(words / 200)));
}

/** Build modules/lessons from ordered heading blocks. */
export function blocksToCurriculum(
  blocks: HeadingBlock[],
  sourceName: string,
  assetUrl?: string,
  contentType: 'PDF' | 'DOC' = 'PDF'
): CurriculumOutline {
  if (blocks.length === 0) {
    return {
      sourceName,
      headingCount: 0,
      modules: [
        {
          title: 'Module 1: Course Readings',
          description: `Parsed from ${sourceName}`,
          displayOrder: 1,
          lessons: [
            {
              title: sourceName.replace(/\.[^.]+$/, '') || 'Study reading',
              summary: 'Full document reading',
              textContent: '',
              contentType,
              assetUrl,
              displayOrder: 1,
              durationMinutes: 15,
            },
          ],
        },
      ],
    };
  }

  const modules: CurriculumModule[] = [];
  let currentModule: CurriculumModule | null = null;
  let currentLesson: CurriculumLesson | null = null;
  let moduleOrder = 0;
  let lessonOrder = 0;

  const flushLesson = () => {
    if (!currentLesson || !currentModule) return;
    currentLesson.durationMinutes = estimateMinutes(currentLesson.textContent);
    if (!currentLesson.summary) {
      currentLesson.summary = currentLesson.textContent.slice(0, 160).replace(/\s+/g, ' ').trim();
    }
    currentModule.lessons.push(currentLesson);
    currentLesson = null;
  };

  const ensureModule = (title: string) => {
    flushLesson();
    moduleOrder += 1;
    lessonOrder = 0;
    currentModule = {
      title,
      description: `From ${sourceName}`,
      displayOrder: moduleOrder,
      lessons: [],
    };
    modules.push(currentModule);
  };

  const ensureLesson = (title: string) => {
    if (!currentModule) {
      ensureModule(`Module ${moduleOrder + 1}`);
    }
    flushLesson();
    lessonOrder += 1;
    currentLesson = {
      title,
      textContent: '',
      contentType: 'RICH_TEXT',
      assetUrl,
      displayOrder: lessonOrder,
      durationMinutes: 10,
    };
  };

  for (const block of blocks) {
    if (block.level === 1) {
      ensureModule(cleanTitle(block.title));
      if (block.body.length) {
        ensureLesson('Overview');
        currentLesson!.textContent = block.body.join('\n\n').trim();
      }
      continue;
    }

    if (block.level === 2) {
      ensureLesson(cleanTitle(block.title));
      if (block.body.length) {
        currentLesson!.textContent = block.body.join('\n\n').trim();
      }
      continue;
    }

    // H3 → subsection inside current lesson
    if (!currentLesson) {
      ensureLesson(cleanTitle(block.title));
    }
    const section = `### ${cleanTitle(block.title)}\n\n${block.body.join('\n\n')}`.trim();
    currentLesson!.textContent = [currentLesson!.textContent, section].filter(Boolean).join('\n\n');
  }

  flushLesson();

  // Drop empty modules; ensure every module has at least one lesson
  const normalized = modules
    .map((m) => ({
      ...m,
      lessons: m.lessons.filter((l) => l.title),
    }))
    .filter((m) => m.lessons.length > 0);

  if (normalized.length === 0) {
    return blocksToCurriculum([], sourceName, assetUrl, contentType);
  }

  // Attach original file as a downloadable item on the first module
  if (assetUrl) {
    normalized[0].lessons.push({
      title: `Download: ${sourceName}`,
      summary: 'Original source document',
      textContent: '',
      contentType,
      assetUrl,
      displayOrder: normalized[0].lessons.length + 1,
      durationMinutes: 5,
    });
  }

  return {
    sourceName,
    headingCount: blocks.length,
    modules: normalized,
  };
}

/** Parse DOCX HTML (from mammoth) into heading blocks. */
export function parseHtmlToBlocks(html: string): HeadingBlock[] {
  const blocks: HeadingBlock[] = [];
  const re = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;
  const parts: { index: number; level: 1 | 2 | 3; title: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const title = match[2].replace(/<[^>]+>/g, '').trim();
    if (!title) continue;
    parts.push({
      index: match.index,
      level: Number(match[1]) as 1 | 2 | 3,
      title,
    });
  }

  if (parts.length === 0) {
    const text = html
      .replace(/<\/(p|div|li|br|tr)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
    if (text) {
      return [{ level: 1, title: 'Course Reading', body: [text] }];
    }
    return [];
  }

  for (let i = 0; i < parts.length; i++) {
    const start = parts[i].index;
    const end = i + 1 < parts.length ? parts[i + 1].index : html.length;
    const chunk = html.slice(start, end);
    const withoutHeading = chunk.replace(/<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/i, '');
    const bodyText = withoutHeading
      .replace(/<\/(p|div|li|br|tr)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim();
    blocks.push({
      level: parts[i].level,
      title: parts[i].title,
      body: bodyText ? [bodyText] : [],
    });
  }

  return blocks;
}

/**
 * Heuristic heading detection for plain PDF text.
 * Recognizes: ALL CAPS lines, Chapter/Module/Unit/Section, numbered 1. / 1.1 / 1.1.1
 */
export function parsePlainTextToBlocks(text: string): HeadingBlock[] {
  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l, i, arr) => l.length > 0 || (i > 0 && arr[i - 1].length > 0));

  const isH1 = (line: string) =>
    /^(chapter|module|unit|part|week)\s+[\dIVXLC]+([:.\s-]|$)/i.test(line) ||
    (/^[A-Z0-9][A-Z0-9\s,&:/\-]{8,80}$/.test(line) && !/[.!?]$/.test(line));

  const isH2 = (line: string) =>
    /^\d+\.\s+\S/.test(line) ||
    /^(section|lesson|topic)\s+[\d.]+([:.\s-]|$)/i.test(line) ||
    (/^[A-Z][A-Za-z0-9\s,&:/\-]{6,90}$/.test(line) && line.length < 90 && !/[.!?]$/.test(line));

  const isH3 = (line: string) =>
    /^\d+\.\d+(\.\d+)?\s+\S/.test(line) ||
    /^[a-z]\)\s+\S/i.test(line);

  type Marked = { level: 0 | 1 | 2 | 3; text: string };
  const marked: Marked[] = lines.map((line) => {
    if (line.length < 3) return { level: 0, text: line };
    if (isH1(line)) return { level: 1, text: line };
    if (isH3(line)) return { level: 3, text: line };
    if (isH2(line) && line.split(/\s+/).length <= 14) return { level: 2, text: line };
    return { level: 0, text: line };
  });

  // If almost no headings detected, chunk by blank lines into pseudo-lessons
  const headingCount = marked.filter((m) => m.level > 0).length;
  if (headingCount < 2) {
    const paras = text
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (paras.length === 0) return [];
    const blocks: HeadingBlock[] = [
      {
        level: 1,
        title: 'Module 1: Course Content',
        body: [],
      },
    ];
    paras.forEach((p, idx) => {
      const firstLine = p.split('\n')[0].slice(0, 80);
      blocks.push({
        level: 2,
        title: firstLine.length > 12 ? firstLine : `Reading ${idx + 1}`,
        body: [p],
      });
    });
    return blocks.slice(0, 40); // cap runaway outlines
  }

  const blocks: HeadingBlock[] = [];
  let current: HeadingBlock | null = null;

  for (const item of marked) {
    if (item.level > 0) {
      if (current) blocks.push(current);
      current = { level: item.level as 1 | 2 | 3, title: item.text, body: [] };
    } else if (current) {
      current.body.push(item.text);
    } else {
      current = { level: 1, title: 'Introduction', body: [item.text] };
    }
  }
  if (current) blocks.push(current);

  // Promote lone H2s without H1 into modules every N lessons for Coursera feel
  const hasH1 = blocks.some((b) => b.level === 1);
  if (!hasH1) {
    const regrouped: HeadingBlock[] = [];
    let lessonIdx = 0;
    for (const b of blocks) {
      if (b.level === 2) {
        if (lessonIdx % 4 === 0) {
          regrouped.push({
            level: 1,
            title: `Module ${Math.floor(lessonIdx / 4) + 1}`,
            body: [],
          });
        }
        lessonIdx += 1;
      }
      regrouped.push(b);
    }
    return regrouped;
  }

  return blocks;
}

export async function parseDocxBuffer(
  buffer: Buffer,
  sourceName: string,
  assetUrl?: string
): Promise<CurriculumOutline> {
  const mammoth = await import('mammoth');
  const result = await mammoth.convertToHtml({ buffer });
  const blocks = parseHtmlToBlocks(result.value || '');
  return blocksToCurriculum(blocks, sourceName, assetUrl, 'DOC');
}

export async function parsePdfBuffer(
  buffer: Buffer,
  sourceName: string,
  assetUrl?: string
): Promise<CurriculumOutline> {
  let text = '';
  try {
    const { extractText, getDocumentProxy } = await import('unpdf');
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const extracted = await extractText(pdf, { mergePages: true });
    const raw = extracted.text as string | string[];
    text = Array.isArray(raw) ? raw.join('\n') : String(raw || '');
  } catch {
    try {
      const pdfParseMod: any = await import('pdf-parse');
      const pdfParse = pdfParseMod.default || pdfParseMod;
      const data = await pdfParse(buffer);
      text = data?.text || '';
    } catch (err) {
      console.error('PDF parse failed:', err);
      text = '';
    }
  }

  const blocks = parsePlainTextToBlocks(text || '');
  return blocksToCurriculum(blocks, sourceName, assetUrl, 'PDF');
}

export async function parseDocumentBuffer(
  buffer: Buffer,
  sourceName: string,
  assetUrl?: string
): Promise<CurriculumOutline> {
  const lower = sourceName.toLowerCase();
  const urlLower = (assetUrl || '').toLowerCase();
  if (lower.endsWith('.docx') || lower.endsWith('.doc') || urlLower.includes('.docx') || urlLower.includes('.doc')) {
    if (lower.endsWith('.doc') && !lower.endsWith('.docx')) {
      // Legacy .doc: treat as binary-poor; attempt mammoth anyway, fallback empty
      try {
        return await parseDocxBuffer(buffer, sourceName, assetUrl);
      } catch {
        return blocksToCurriculum([], sourceName, assetUrl, 'DOC');
      }
    }
    return parseDocxBuffer(buffer, sourceName, assetUrl);
  }
  return parsePdfBuffer(buffer, sourceName, assetUrl);
}

/** Merge multiple document outlines into one curriculum (modules concatenated). */
export function mergeOutlines(outlines: CurriculumOutline[]): CurriculumOutline {
  if (outlines.length === 0) {
    return { sourceName: 'combined', headingCount: 0, modules: [] };
  }
  if (outlines.length === 1) return outlines[0];

  const modules: CurriculumModule[] = [];
  let order = 0;
  let headings = 0;
  for (const outline of outlines) {
    headings += outline.headingCount;
    for (const mod of outline.modules) {
      order += 1;
      modules.push({
        ...mod,
        title: mod.title.includes(outline.sourceName) ? mod.title : mod.title,
        displayOrder: order,
      });
    }
  }
  return {
    sourceName: outlines.map((o) => o.sourceName).join(', '),
    headingCount: headings,
    modules,
  };
}
