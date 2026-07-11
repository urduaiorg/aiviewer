import { access, readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
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

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const path = relative(dist, file);
  const noindex = isNoindex(html);
  const adsense = hasAdsense(html);

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
  'compare/google-gemma-4-31b-it-vs-openai-gpt-oss-20b/index.html',
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
  'tools/google-ai-studio/index.html',
];

for (const path of requiredMonetized) {
  const html = await read(path);
  if (isNoindex(html)) fail(`${path}: expected indexable page`);
  if (!hasAdsense(html)) fail(`${path}: eligible editorial page does not load AdSense`);
}

const ownedProduct = await read('tools/ourscreen/index.html');
if (hasAdsense(ownedProduct)) fail('tools/ourscreen/index.html: owned product page loads AdSense');

const provenComparison = await read('compare/qwen-qwen3-14b-vs-qwen-qwen3-5-9b/index.html');
if (isNoindex(provenComparison)) fail('proven comparison: expected indexable page');
if (hasAdsense(provenComparison)) fail('proven comparison: comparison pages must remain unmonetized');

for (const removedPath of [
  'compare/qwen-qwen3-14b-vs-qwen-qwen3-32b/index.html',
  'tools/anything-ai/index.html',
  'tools/chatgpt/index.html',
  'guides/ai-and-jobs-2026/index.html',
  'guides/best-ai-tools-for-small-business-2026/index.html',
  'guides/best-ai-video-generator-2026-sora-runway-veo-pika-and-kling-compared/index.html',
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

const redirects = await read('_redirects');
const redirectSources = new Set(
  redirects
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/)[0])
);
const redirectMap = new Map(
  redirects
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [source, target] = line.split(/\s+/);
      return [source, target];
    })
);
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
      fail(`${source}: broken internal link ${pathname}`);
    }
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages: ${indexableCount} indexable, ${noindexCount} noindex, ${monetizedCount} AdSense-eligible.`);
console.log(`Validated ${sitemapUrls.length} sitemap URLs, internal links, redirects, schema integrity, ads.txt, and newsletter CSP.`);
