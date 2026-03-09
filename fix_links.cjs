const fs = require('fs');
const path = require('path');

const replacements = {
  'src/content/guides/claude-opus-vs-gpt5.mdx': [
    ['/images/guides/claude-vs-gpt5.jpg', '/images/guides/claude-vs-gpt4o.jpg']
  ],
  'src/content/guides/fine-tuning-vs-rag.mdx': [
    ['/images/guides/rag-vs-finetuning.jpg', '/images/guides/fine-tuning-vs-rag.jpg']
  ],
  'src/content/guides/how-we-test-ai.mdx': [
    ['/images/playbooks/how-we-test-hero.jpg', '/images/guides/getting-started-ai.jpg']
  ],
  'src/content/guides/midjourney-vs-dalle3-vs-stable-diffusion.mdx': [
    ['/images/guides/midjourney-vs-dalle.jpg', '/images/guides/ai-art-generators.jpg']
  ],
  'src/content/guides/understanding-local-llms.mdx': [
    ['/images/guides/local-llms.jpg', '/images/guides/local-llms-guide.jpg'],
    ['[LM Studio](/tools/lm-studio)', 'LM Studio']
  ],
  'src/content/guides/what-is-agentic-ai.mdx': [
    ['/images/guides/agentic-ai-explainer.jpg', '/images/guides/agentic-ai.jpg']
  ],
  'src/content/playbooks/engineer-workflow.mdx': [
    ['/images/playbooks/engineer-workflow.jpg', '/images/playbooks/software-engineer-workflow.jpg']
  ],
  'src/content/playbooks/freelance-workflow.mdx': [
    ['/images/playbooks/freelance-workflow.jpg', '/images/playbooks/freelancer-onboarding.jpg']
  ],
  'src/content/playbooks/legal-workflow.mdx': [
    ['/images/playbooks/legal-workflow.jpg', '/images/playbooks/legal-document-review.jpg']
  ],
  'src/content/playbooks/marketing-workflow.mdx': [
    ['/images/playbooks/marketing-workflow.jpg', '/images/playbooks/marketers-prompt-cheat-sheet.jpg']
  ],
  'src/content/playbooks/ui-ux-workflow.mdx': [
    ['/images/playbooks/ui-ux-design.jpg', '/images/playbooks/designers-wireframe-code.jpg']
  ],
  'src/content/reports/ai-and-democracy.mdx': [
    ['/images/reports/ai-democracy.jpg', '/images/reports/ai-regulation-2026.jpg'],
    ['[our guide on spotting AI deepfakes](/guides/how-to-spot-ai-deepfakes/)', 'our guides on AI tools']
  ],
  'src/content/reports/ai-and-language.mdx': [
    ['/images/reports/ai-language.jpg', '/images/reports/ai-impact-jobs.jpg']
  ],
  'src/content/reports/ai-in-agriculture.mdx': [
    ['/images/reports/ai-agriculture.jpg', '/images/reports/ai-energy-climate.jpg']
  ],
  'src/content/reports/ai-in-global-south.mdx': [
    ['/images/reports/ai-global-south.jpg', '/images/reports/ai-education-global.jpg']
  ],
  'src/content/reports/ai-justice-and-policing.mdx': [
    ['/images/reports/ai-policing.jpg', '/images/reports/ai-regulation-2026.jpg']
  ]
};

for (const [file, rules] of Object.entries(replacements)) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [find, replace] of rules) {
      content = content.split(find).join(replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
}
