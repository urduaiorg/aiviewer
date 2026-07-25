import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { shouldNoindexPath } from '../src/utils/indexPolicy.ts';

const root = fileURLToPath(new URL('../src/content/', import.meta.url));

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return nested.flat();
}

function frontmatterValue(source, key) {
  return source.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)`, 'm'))?.[1]?.trim();
}

function readableWordCount(source) {
  return source
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/^import .*;$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[\s\S]*?\}/g, ' ')
    .replace(/[`*_#[\]()|>-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function publicPathForContent(path) {
  const withoutExtension = path.replace(/\.(md|mdx)$/i, '');
  return `/${withoutExtension}/`;
}

const files = (await walk(root)).filter((file) => ['.md', '.mdx'].includes(extname(file)));
const findings = [];
let publishedFileCount = 0;

for (const file of files) {
  const source = await readFile(file, 'utf8');
  if (/^draft:\s*true(?:\s*#.*)?\s*$/m.test(source)) continue;

  publishedFileCount += 1;
  const path = relative(root, file);
  const words = readableWordCount(source);
  const externalLinks = (source.match(/https?:\/\//g) || []).length;
  const h2s = [...source.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim().toLowerCase());
  const duplicateH2s = [...new Set(h2s.filter((heading, index) => h2s.indexOf(heading) !== index))];
  const published = frontmatterValue(source, 'publishedDate');
  const updated = frontmatterValue(source, 'updatedDate');
  const publicPath = publicPathForContent(path);
  const excluded = shouldNoindexPath(publicPath);
  const issues = [];

  if (words < 500) issues.push(`thin:${words}-words`);
  if (externalLinks === 0 && /^(tools|guides|reports)\//.test(path)) issues.push('no-external-sources');
  if (duplicateH2s.length) issues.push(`duplicate-h2:${duplicateH2s.join('|')}`);
  if (published && updated && new Date(updated) < new Date(published)) issues.push('updated-before-published');
  if (/we buy our own subscriptions|we pay for 100%|never accept paid placements/i.test(source)) issues.push('unsupported-editorial-claim');

  if (!excluded && path.startsWith('guides/')) {
    if (words < 900) issues.push(`indexable-guide-below-900-words:${words}`);

    for (const requiredField of [
      'format',
      'publication',
      'factCheckedAt',
      'reviewDueAt',
      'lensSummary',
      'learningOutcome',
      'nextAction',
      'evidence',
      'aiUse',
    ]) {
      if (!new RegExp(`^${requiredField}:`, 'm').test(source)) {
        issues.push(`missing-${requiredField}`);
      }
    }

    if (!/^\s+mode:\s*["']?(primary-sources|mixed-sources|documented-test|creator-source-plus-verification)["']?\s*$/m.test(source)) {
      issues.push('missing-substantive-evidence-mode');
    }

    if (!/^\s+disclosure:\s*["'].{20,}["']\s*$/m.test(source)) {
      issues.push('missing-ai-use-disclosure');
    }

    const reviewDue = frontmatterValue(source, 'reviewDueAt');
    if (reviewDue && new Date(reviewDue).getTime() < Date.now()) {
      issues.push(`review-overdue:${reviewDue}`);
    }
  }

  if (issues.length) findings.push({
    path,
    issues,
    excluded,
  });
}

findings.sort((a, b) => a.path.localeCompare(b.path));
for (const finding of findings) {
  console.log(`${finding.path}\t${finding.issues.join(',')}\t${finding.excluded ? 'excluded-from-index' : 'INDEXABLE'}`);
}

const indexableFindings = findings.filter((finding) => !finding.excluded);
console.log(`\n${findings.length} of ${publishedFileCount} published content files need review (${files.length - publishedFileCount} drafts excluded).`);
console.log(`${indexableFindings.length} flagged content files remain indexable.`);
if (indexableFindings.length > 0) process.exitCode = 1;
