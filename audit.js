const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('aiviewer/src/content/**/*.mdx');

const outdatedRegex = /(GPT-3\.5|GPT-4\b|GPT-4o|Claude 3\b|Claude 3\.5|Claude 3 Opus|Claude 3 Sonnet)/ig;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  let issues = [];
  
  // 1. Check outdated models
  let match;
  while ((match = outdatedRegex.exec(content)) !== null) {
    issues.push(`Outdated model reference: ${match[0]}`);
  }
  
  // 2. Check frontmatter description
  const descMatch = content.match(/description:\s*"([^"]+)"/);
  if (descMatch) {
    const desc = descMatch[1];
    if (/^(A |An |This |In this |Here )/i.test(desc)) {
      issues.push(`Weak description: ${desc}`);
    }
  } else {
    issues.push(`Missing description`);
  }
  
  // 3. Check FAQs
  if (content.includes('## Frequently Asked Questions')) {
    const faqSection = content.split('## Frequently Asked Questions')[1];
    const qCount = (faqSection.match(/### /g) || []).length;
    if (qCount < 4) {
      issues.push(`Only ${qCount} FAQs found (need at least 4)`);
    }
  } else {
    issues.push(`Missing FAQ section`);
  }
  
  // 4. Check internal links (basic check)
  if (!content.includes('](/') && !content.includes('.astro')) {
    issues.push(`Potentially missing internal links`);
  }
  
  // 5. Check H2s
  const h2s = (content.match(/^## .*$/gm) || []).filter(h2 => h2 !== '## Frequently Asked Questions');
  const nonQuestionH2s = h2s.filter(h2 => !h2.includes('?'));
  if (nonQuestionH2s.length > 0) {
    issues.push(`Non-question H2s found: ${nonQuestionH2s.join(', ')}`);
  }
  
  if (issues.length > 0) {
    console.log(`\n--- ${file} ---`);
    issues.forEach(i => console.log(`- ${i}`));
  }
}
