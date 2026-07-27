import { access, readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const publicRoot = join(projectRoot, 'public');
const contentRoot = join(projectRoot, 'src/content');
const imageProvenancePath = join(projectRoot, 'src/data/editorial-image-provenance.json');
const failures = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return nested.flat();
}

function fail(message) {
  failures.push(message);
}

async function read(relativePath) {
  return readFile(join(dist, relativePath), 'utf8');
}

function isNoindex(html) {
  return /<meta name="robots" content="noindex, follow"\s*\/?\s*>/.test(html);
}

function hasAdsense(html) {
  return html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
let noindexCount = 0;
let indexableCount = 0;
let monetizedCount = 0;

let imageProvenance = [];
try {
  imageProvenance = JSON.parse(await readFile(imageProvenancePath, 'utf8'));
} catch (error) {
  fail(`editorial image provenance: invalid or unreadable JSON (${error.message})`);
}

if (!Array.isArray(imageProvenance)) {
  fail('editorial image provenance: expected a JSON array');
  imageProvenance = [];
}

const provenanceAssets = new Set();
for (const [index, record] of imageProvenance.entries()) {
  const label = `editorial image provenance entry ${index + 1}`;
  const requiredFields = [
    'asset',
    'page',
    'altText',
    'width',
    'height',
    'createdAt',
    'workflow',
    'renderer',
    'prompt',
    'materialEdits',
    'disclosure',
    'reviewNotes',
  ];

  for (const field of requiredFields) {
    const value = record?.[field];
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      fail(`${label}: missing ${field}`);
    }
  }

  if (typeof record?.asset === 'string') {
    if (!record.asset.startsWith('/') || record.asset.includes('..')) {
      fail(`${label}: asset must be a safe root-relative path`);
    } else {
      if (provenanceAssets.has(record.asset)) {
        fail(`${label}: duplicate asset ${record.asset}`);
      }
      provenanceAssets.add(record.asset);
      try {
        await access(join(publicRoot, record.asset.slice(1)));
      } catch {
        fail(`${label}: asset does not exist in public (${record.asset})`);
      }
    }
  }

  if (typeof record?.page === 'string') {
    if (!record.page.startsWith('/') || record.page.includes('..')) {
      fail(`${label}: page must be a safe root-relative path`);
    } else {
      const pagePath = record.page === '/'
        ? 'index.html'
        : `${record.page.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
      try {
        const pageHtml = await read(pagePath);
        const pageBody = pageHtml.slice(Math.max(0, pageHtml.indexOf('<body')));
        if (typeof record?.asset === 'string' && !pageBody.includes(record.asset)) {
          fail(`${label}: declared asset is not used on ${record.page}`);
        }
      } catch {
        fail(`${label}: page is not present in the release artifact (${record.page})`);
      }
    }
  }

  for (const dimension of ['width', 'height']) {
    if (!Number.isInteger(record?.[dimension]) || record[dimension] <= 0) {
      fail(`${label}: ${dimension} must be a positive integer`);
    }
  }
  if (typeof record?.altText === 'string' && !/ai-generated|illustration/i.test(record.altText)) {
    fail(`${label}: altText must identify the generated or illustrative nature of the asset`);
  }
  if (typeof record?.disclosure === 'string' && !/ai-generated|illustration/i.test(record.disclosure)) {
    fail(`${label}: disclosure must identify the AI-generated or illustrative nature of the asset`);
  }
}

const contentFiles = (await walk(contentRoot)).filter((file) => /\.(?:md|mdx)$/.test(file));
for (const file of contentFiles) {
  const source = await readFile(file, 'utf8');
  if (!/^\s*tasks:\s*\[[^\]]*["']image-generation["'][^\]]*\]/m.test(source)) continue;

  const contentPath = relative(contentRoot, file);
  const coverImage = source.match(/^coverImage:\s*["']([^"']+)["']/m)?.[1];
  if (!coverImage) {
    fail(`${contentPath}: image-generation is disclosed but coverImage is missing`);
  } else if (!provenanceAssets.has(coverImage)) {
    fail(`${contentPath}: generated cover has no editorial image provenance record (${coverImage})`);
  }
}

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const path = relative(dist, file);
  const noindex = isNoindex(html);
  const adsense = hasAdsense(html);
  const mainTags = [...html.matchAll(/<main\b/g)];

  if (mainTags.length !== 1) {
    fail(`${path}: expected exactly one main landmark, found ${mainTags.length}`);
  } else {
    const mainStart = mainTags[0].index;
    const mainEnd = html.indexOf('</main>', mainStart);
    for (const landmark of ['header', 'footer']) {
      const landmarkIndex = html.indexOf(`<${landmark}`);
      if (landmarkIndex > mainStart && (mainEnd === -1 || landmarkIndex < mainEnd)) {
        fail(`${path}: ${landmark} is nested inside the main landmark`);
      }
    }
  }
  if (!html.includes('<header')) fail(`${path}: page is missing the global header`);
  if (!html.includes('<footer')) fail(`${path}: page is missing the global footer`);

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      fail(`${path}: invalid JSON-LD (${error.message})`);
    }
  }

  if (noindex) {
    noindexCount += 1;
    if (!/<html[^>]*data-pagefind-ignore="all"/.test(html)) {
      fail(`${path}: noindex page is not excluded from Pagefind`);
    }
    if (adsense) fail(`${path}: noindex page loads AdSense`);
  } else {
    indexableCount += 1;
  }

  if (adsense) monetizedCount += 1;
}

const requiredNoindex = [
  'compare/index.html',
  'free-ai-tools/index.html',
  'models/index.html',
  'prompts/index.html',
  'playbooks/index.html',
  'reports/index.html',
];

for (const path of requiredNoindex) {
  const html = await read(path);
  if (!isNoindex(html)) fail(`${path}: expected noindex, follow`);
  if (hasAdsense(html)) fail(`${path}: excluded page loads AdSense`);
}

const requiredMonetized = [
  'index.html',
  'guides/ai-pricing-comparison-2026/index.html',
  'guides/weekly-ai-update-july-11-2026/index.html',
  'tools/google-ai-studio/index.html',
];

for (const path of requiredMonetized) {
  const html = await read(path);
  if (isNoindex(html)) fail(`${path}: expected indexable page`);
  if (!hasAdsense(html)) fail(`${path}: eligible editorial page does not load AdSense`);
}

const downloadPage = await read('download/index.html');
for (const unsupportedClaim of ['pravatar.cc', '10,000+ professionals', 'battle-tested']) {
  if (downloadPage.toLowerCase().includes(unsupportedClaim.toLowerCase())) {
    fail(`download/index.html: contains unsupported proof or endorsement (${unsupportedClaim})`);
  }
}
if (!downloadPage.includes("join AIViewer's newsletter")) {
  fail('download/index.html: newsletter opt-in is not disclosed beside the form');
}
try {
  await access(join(dist, 'assets/2026-ultimate-ai-prompt-cheat-sheet.md'));
} catch {
  fail('download/index.html: promised prompt template asset is missing');
}

const weeklyUpdate = await read('guides/weekly-ai-update-july-11-2026/index.html');
if (!weeklyUpdate.includes('July 11, 2026')) fail('weekly update: visible publication date is missing or shifted by timezone');
if (weeklyUpdate.includes('July 10, 2026')) fail('weekly update: visible publication date shifted to July 10');
if (weeklyUpdate.includes('>Jul 5</span>')) fail('weekly update: release timeline shifted one day backward');
for (const date of ['Jul 6', 'Jul 7', 'Jul 8', 'Jul 9']) {
  if (!weeklyUpdate.includes(`>${date}</span>`)) fail(`weekly update: release timeline is missing ${date}`);
}
if (!weeklyUpdate.includes('Primary sources checked')) fail('weekly update: source verification section is missing');
if (!weeklyUpdate.includes('AI-assisted')) fail('weekly update: AI-assistance disclosure is missing');

const provenComparison = await read('compare/qwen-qwen3-14b-vs-qwen-qwen3-5-9b/index.html');
if (!isNoindex(provenComparison)) fail('legacy comparison: expected noindex until original analysis is added');
if (hasAdsense(provenComparison)) fail('proven comparison: comparison pages must remain unmonetized');

for (const removedPath of [
  'compare/qwen-qwen3-14b-vs-qwen-qwen3-32b/index.html',
  'tools/anything-ai/index.html',
  'tools/chatgpt/index.html',
  'tools/ourscreen/index.html',
  'guides/ai-and-jobs-2026/index.html',
  'guides/best-ai-tools-for-small-business-2026/index.html',
  'guides/best-free-ai-tools-2026/index.html',
  'guides/claude-fable-5-mythos-5-explained/index.html',
  'guides/gpt-5-6-sol-explained-openai-new-model/index.html',
  'guides/how-to-use-google-ai-studio/index.html',
  'guides/how-to-write-ai-prompts/index.html',
  'guides/midjourney-vs-dalle-vs-stable-diffusion/index.html',
  'guides/what-is-multimodal-ai/index.html',
  'models/google-gemma-4-31b-it/index.html',
  'playbooks/student-research-paper-workflow/index.html',
  'prompts/write-lesson-plan/index.html',
  'reports/state-of-ai-education/index.html',
  'tags/ai/index.html',
]) {
  try {
    await access(join(dist, removedPath));
    fail(`${removedPath}: excluded legacy page should not be in the release artifact`);
  } catch {
    // Expected: excluded legacy content is no longer generated.
  }
}

const toolPages = htmlFiles.filter((file) => relative(dist, file).startsWith('tools/'));
for (const file of toolPages) {
  const html = await readFile(file, 'utf8');
  const path = relative(dist, file);
  if (html.includes('aggregateRating')) fail(`${path}: contains unsupported aggregateRating schema`);
  if (/"@type"\s*:\s*"Review"/.test(html)) fail(`${path}: contains unsupported Review schema`);
}

const homepage = await read('index.html');
for (const hiddenHub of ['/compare/', '/models/', '/playbooks/', '/reports/', '/students/', '/teachers/', '/free-ai-tools/']) {
  if (homepage.includes(`href="${hiddenHub}"`)) fail(`index.html: links prominently to excluded hub ${hiddenHub}`);
}
for (const trustPath of [
  '/editorial-standards/',
  '/review-methodology/',
  '/ai-use/',
  '/corrections/',
  '/disclosure/',
  '/ownership-and-funding/',
  '/privacy/',
  '/terms/',
  '/contact/',
]) {
  if (!homepage.includes(`href="${trustPath}"`)) {
    fail(`index.html: global footer is missing trust link ${trustPath}`);
  }
}
if (!homepage.includes('Subscription data is handled under our')) {
  fail('index.html: newsletter form is missing its nearby privacy notice');
}

const sitemap = await read('sitemap-0.xml');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
for (const url of sitemapUrls) {
  const relativePath = url.pathname === '/' ? 'index.html' : `${url.pathname.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
  try {
    await access(join(dist, relativePath));
    const html = await read(relativePath);
    if (isNoindex(html)) fail(`sitemap-0.xml: contains noindex URL ${url.pathname}`);
  } catch {
    // Non-HTML endpoints such as RSS are allowed in the sitemap if the integration emits them.
  }
}

const adsTxt = (await read('ads.txt')).trim();
if (adsTxt !== 'google.com, pub-8532451951782012, DIRECT, f08c47fec0942fa0') {
  fail('ads.txt: publisher authorization line is missing or altered');
}

const headers = await read('_headers');
if (!headers.includes('https://subscribe-forms.beehiiv.com')) fail('_headers: Beehiiv form endpoint is blocked by CSP');
if (!/frame-src[^;]*https:\/\/www\.youtube-nocookie\.com/.test(headers)) {
  fail('_headers: privacy-enhanced YouTube embeds are blocked by frame-src');
}
if (!/child-src[^;]*https:\/\/www\.youtube-nocookie\.com/.test(headers)) {
  fail('_headers: privacy-enhanced YouTube embeds are blocked by child-src');
}

const redirects = await read('_redirects');
const redirectRules = redirects
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => {
    const [source, target, status] = line.split(/\s+/);
    return { source, target, status };
  });
const redirectSources = new Set(redirectRules.map(({ source }) => source));
const redirectMap = new Map(redirectRules.map(({ source, target }) => [source, target]));
const redirectStatusMap = new Map(redirectRules.map(({ source, status }) => [source, status]));

for (const { source, status } of redirectRules) {
  if (!['200', '301', '302', '303', '307', '308'].includes(status)) {
    fail(`_redirects: ${source} has missing or unsupported status ${status ?? '(none)'}`);
  }
}

if (redirectMap.get('/guides/gpt-5-6-sol-explained-openai-new-model/') !== '/guides/weekly-ai-update-july-11-2026/') {
  fail('_redirects: retired GPT-5.6 preview does not consolidate into the current weekly update');
}

const canonicalVideoGuide = '/video-lessons/';
for (const source of [
  '/guides/best-ai-video-generators/',
  '/guides/best-ai-video-generators',
]) {
  if (redirectMap.get(source) !== canonicalVideoGuide || redirectStatusMap.get(source) !== '301') {
    fail(`_redirects: ${source} must permanently consolidate into ${canonicalVideoGuide}`);
  }
}

const relativeFiles = new Set(files.map((file) => relative(dist, file)));

function hasRedirect(pathname) {
  if (redirectSources.has(pathname)) return true;
  const alternate = pathname.endsWith('/') ? pathname.slice(0, -1) : `${pathname}/`;
  return redirectSources.has(alternate);
}

function hasBuiltTarget(pathname) {
  if (pathname === '/') return relativeFiles.has('index.html');
  const clean = pathname.replace(/^\//, '');
  if (relativeFiles.has(clean)) return true;
  const indexPath = `${clean.replace(/\/$/, '')}/index.html`;
  return relativeFiles.has(indexPath);
}

function builtHtmlPath(pathname) {
  if (pathname === '/') return relativeFiles.has('index.html') ? 'index.html' : null;
  const clean = pathname.replace(/^\//, '');
  if (clean.endsWith('.html') && relativeFiles.has(clean)) return clean;
  const indexPath = `${clean.replace(/\/$/, '')}/index.html`;
  return relativeFiles.has(indexPath) ? indexPath : null;
}

function redirectFor(pathname) {
  if (redirectMap.has(pathname)) return redirectMap.get(pathname);
  const alternate = pathname.endsWith('/') ? pathname.slice(0, -1) : `${pathname}/`;
  return redirectMap.get(alternate);
}

for (const [source, initialTarget] of redirectMap) {
  if (!initialTarget?.startsWith('/')) continue;
  const seen = new Set([source]);
  let target = initialTarget;

  while (redirectFor(target)) {
    if (seen.has(target)) {
      fail(`_redirects: redirect cycle from ${source} through ${target}`);
      break;
    }
    seen.add(target);
    target = redirectFor(target);
  }

  if (!hasBuiltTarget(target)) {
    fail(`_redirects: ${source} ultimately targets missing route ${target}`);
  }
}

async function validateDirectIndexableRoute(pathname, source) {
  if (hasRedirect(pathname)) {
    fail(`${source}: links through redirect ${pathname}`);
    return;
  }

  const htmlPath = builtHtmlPath(pathname);
  if (!htmlPath) {
    fail(`${source}: links to missing route ${pathname}`);
    return;
  }

  const html = await read(htmlPath);
  if (isNoindex(html)) fail(`${source}: links to noindex route ${pathname}`);
}

const finderPage = await read('finder/index.html');
const decodedFinderPage = finderPage
  .replaceAll('&quot;', '"')
  .replaceAll('&amp;', '&');
const serializedFinderUrls = [...decodedFinderPage.matchAll(/"url":\[0,"([^"]+)"\]/g)]
  .map((match) => match[1]);
const finderComponentUrl = finderPage.match(/component-url="([^"]*\/ToolFinder\.[^"]+\.js)"/)?.[1];

for (const url of serializedFinderUrls) {
  if (url.startsWith('/') && !url.startsWith('//')) continue;
  try {
    if (new URL(url).protocol !== 'https:') {
      fail(`finder recommendations: external destination must use HTTPS (${url})`);
    }
  } catch {
    fail(`finder recommendations: invalid destination URL ${url}`);
  }
}

if (!finderComponentUrl) {
  fail('finder/index.html: ToolFinder client bundle is missing');
} else {
  const finderComponent = await read(finderComponentUrl.replace(/^\//, ''));
  const literalFinderRoutes = [...finderComponent.matchAll(/href:"(\/[^"]+)"/g)]
    .map((match) => match[1]);
  const finderInternalRoutes = new Set(
    [...serializedFinderUrls, ...literalFinderRoutes]
      .filter((url) => url.startsWith('/') && !url.startsWith('//'))
      .map((url) => url.split(/[?#]/)[0])
  );

  for (const pathname of finderInternalRoutes) {
    await validateDirectIndexableRoute(pathname, 'finder recommendations');
  }
}

const compareHub = await read('compare/index.html');
const declaredComparisonCount = Number(compareHub.match(/data-comparison-count="(\d+)"/)?.[1]);
const comparisonCardTags = [...compareHub.matchAll(/<a\b[^>]*data-comparison-card[^>]*>/g)]
  .map((match) => match[0]);
const comparisonCardUrls = comparisonCardTags
  .map((tag) => tag.match(/\bhref="([^"]+)"/)?.[1])
  .filter(Boolean);
const indexableComparisonPaths = [];

for (const file of htmlFiles) {
  const path = relative(dist, file);
  if (!path.startsWith('compare/') || path === 'compare/index.html') continue;
  const html = await readFile(file, 'utf8');
  if (!isNoindex(html)) indexableComparisonPaths.push(path);
}

if (!Number.isInteger(declaredComparisonCount)) {
  fail('compare/index.html: missing machine-readable comparison count');
} else {
  if (declaredComparisonCount !== comparisonCardUrls.length) {
    fail(`compare/index.html: declares ${declaredComparisonCount} comparisons but renders ${comparisonCardUrls.length} cards`);
  }
  if (declaredComparisonCount !== indexableComparisonPaths.length) {
    fail(`compare/index.html: declares ${declaredComparisonCount} comparisons but ${indexableComparisonPaths.length} detail pages are indexable`);
  }
}

for (const pathname of comparisonCardUrls) {
  await validateDirectIndexableRoute(pathname, 'compare/index.html');
}

const brokenInternalLinks = new Map();
const brokenInternalAssets = new Map();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (isNoindex(html)) continue;
  const source = relative(dist, file);

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const rawHref = match[1];
    if (!rawHref.startsWith('/') || rawHref.startsWith('//')) continue;
    const pathname = rawHref.split(/[?#]/)[0];
    if (!pathname || pathname.startsWith('/_astro/') || pathname.startsWith('/pagefind/')) continue;
    if (!hasBuiltTarget(pathname) && !hasRedirect(pathname)) {
      if (!brokenInternalLinks.has(pathname)) brokenInternalLinks.set(pathname, new Set());
      brokenInternalLinks.get(pathname).add(source);
    }
  }

  const localAssetCandidates = [
    ...[...html.matchAll(/<(?:img|source)\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]),
    ...[...html.matchAll(/<meta\b[^>]*property="og:image"[^>]*content="([^"]+)"/g)].map((match) => match[1]),
  ];

  for (const rawAsset of localAssetCandidates) {
    let pathname = rawAsset.split(/[?#]/)[0];
    if (/^https?:\/\//.test(pathname)) {
      const url = new URL(pathname);
      if (url.hostname !== 'aiviewer.ai' && url.hostname !== 'www.aiviewer.ai') continue;
      pathname = url.pathname;
    }
    if (!pathname.startsWith('/') || pathname.startsWith('//') || pathname.startsWith('/_astro/')) continue;
    if (!hasBuiltTarget(pathname)) {
      if (!brokenInternalAssets.has(pathname)) brokenInternalAssets.set(pathname, new Set());
      brokenInternalAssets.get(pathname).add(source);
    }
  }
}

for (const [pathname, sources] of brokenInternalLinks) {
  const examples = [...sources].slice(0, 3).join(', ');
  const remaining = sources.size > 3 ? `, +${sources.size - 3} more` : '';
  fail(`broken internal link ${pathname}: referenced by ${sources.size} indexable page(s) (${examples}${remaining})`);
}

for (const [pathname, sources] of brokenInternalAssets) {
  const examples = [...sources].slice(0, 3).join(', ');
  const remaining = sources.size > 3 ? `, +${sources.size - 3} more` : '';
  fail(`broken internal image ${pathname}: referenced by ${sources.size} indexable page(s) (${examples}${remaining})`);
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages: ${indexableCount} indexable, ${noindexCount} noindex, ${monetizedCount} AdSense-eligible.`);
console.log(`Validated ${sitemapUrls.length} sitemap URLs, internal links and images, ${imageProvenance.length} image provenance record(s), redirects, schema integrity, ads.txt, and newsletter CSP.`);
