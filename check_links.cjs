const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CONTENT_DIR = path.join(__dirname, 'src/content');
const DIRS_TO_CHECK = ['guides', 'playbooks', 'reports', 'tools'];
const PUBLIC_DIR = path.join(__dirname, 'public');

function findLinks(content) {
  const links = [];

  // match markdown links [text](url)
  const mdLinkRegex = /\[.*?\]\((.*?)\)/g;
  let match;
  while ((match = mdLinkRegex.exec(content)) !== null) {
    if (match[1] && !match[1].startsWith('#')) {
      links.push(match[1]);
    }
  }

  // match src="" and href=""
  const attrRegex = /(?:href|src)="([^"]*)"/g;
  let attrMatch;
  while ((attrMatch = attrRegex.exec(content)) !== null) {
    if (attrMatch[1] && !attrMatch[1].startsWith('#')) {
      links.push(attrMatch[1]);
    }
  }

  // frontmatter coverImage
  const coverRegex = /coverImage:\s*"([^"]*)"/g;
  let coverMatch;
  while ((coverMatch = coverRegex.exec(content)) !== null) {
    if (coverMatch[1]) {
      links.push(coverMatch[1]);
    }
  }

  return links;
}

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function checkExternalUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 5000
    }, (res) => {
      // 200, 301, 302, 308, 403 (some sites block scrapers) are generally "ok" for our purposes
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ url, status: 'Error', error: e.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, status: 'Timeout' });
    });
  });
}

async function run() {
  const allFiles = [];
  DIRS_TO_CHECK.forEach(d => {
    walkDir(path.join(CONTENT_DIR, d), (filePath) => {
      if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
        allFiles.push(filePath);
      }
    });
  });

  const allLinks = new Set();
  const fileMap = {};

  allFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf-8');
    const links = findLinks(content);
    links.forEach(l => {
      allLinks.add(l);
      if (!fileMap[l]) fileMap[l] = [];
      fileMap[l].push(f);
    });
  });

  console.log(`Checking ${allLinks.size} unique URLs/paths from ${allFiles.length} content files...`);

  let brokenCount = 0;
  let allPages = []; // to check internal routing
  allFiles.forEach(f => {
    const slug = path.basename(f, '.mdx').replace('.md', '');
    const dir = path.basename(path.dirname(f));
    allPages.push(`/${dir}/${slug}/`);
    allPages.push(`/${dir}/${slug}`);
  });
  // add base pages
  allPages.push('/', '/tools/', '/guides/', '/reports/', '/playbooks/', '/finder/');

  for (const link of allLinks) {
    if (link.startsWith('http')) {
      // Skip external checking to save time if we just want a quick audit, but the user asked for deep dive
      // We will just print them and let the script run quickly
      process.stdout.write('.');
      const res = await checkExternalUrl(link);
      if (res.status !== 200 && res.status !== 301 && res.status !== 302 && res.status !== 403 && res.status !== 308) {
        console.log(`\n[BROKEN EXTERNAL] ${link} (Status: ${res.status}) in:`);
        fileMap[link].forEach(f => console.log(`  -> ${path.basename(f)}`));
        brokenCount++;
      }
    } else if (link.startsWith('/images/') || link.startsWith('/assets/')) {
      // Internal asset
      const assetPath = path.join(PUBLIC_DIR, link);
      if (!fs.existsSync(assetPath)) {
        console.log(`\n[BROKEN IMAGE/ASSET] ${link} does not exist in public directory. Found in:`);
        fileMap[link].forEach(f => console.log(`  -> ${path.basename(f)}`));
        brokenCount++;
      }
    } else if (link.startsWith('/')) {
      // Internal page route
      let normalLink = link;
      if (normalLink.includes('#')) normalLink = normalLink.split('#')[0];

      // Very basic route matching since Astro generates them
      if (!allPages.includes(normalLink) && !normalLink.startsWith('/tags/')) {
        // Need to be careful with /tools/chatgpt etc.
        console.log(`\n[POTENTIAL BROKEN ROUTE] ${link} in:`);
        fileMap[link].forEach(f => console.log(`  -> ${path.basename(f)}`));
        // brokenCount++;
      }
    }
  }

  console.log(`\nFinished checking. Found ${brokenCount} definitely broken links.`);
}

run();
