export type UseCaseLink = {
  label: string;
  href: string;
  type: 'Guide' | 'Playbook' | 'Tool' | 'Compare';
  summary: string;
};

export type UseCase = {
  slug: string;
  navLabel: string;
  title: string;
  description: string;
  audience: string;
  promise: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  quickWins: string[];
  starterPrompts: string[];
  featuredLinks: UseCaseLink[];
  toolLinks: UseCaseLink[];
};

export const useCases: UseCase[] = [
  {
    slug: 'free-ai-tools',
    navLabel: 'Free Tools',
    title: 'Free AI tools that are worth your time',
    description: 'Start with useful AI tools before paying for subscriptions. We focus on tools normal people can test quickly.',
    audience: 'Beginners, students, freelancers, creators, and small teams trying AI on a budget.',
    promise: 'Find a free tool, understand the limit, and try one practical workflow today.',
    primaryCta: { label: 'Browse free tools', href: '/guides/best-free-ai-tools-2026/' },
    secondaryCta: { label: 'Learn prompt basics', href: '/guides/how-to-write-ai-prompts/' },
    quickWins: [
      'Pick one general assistant for writing, research, and planning.',
      'Use one creative tool for images, slides, or video drafts.',
      'Check mobile access and free-plan limits before building a workflow.',
    ],
    starterPrompts: [
      'List five free AI tools I can use on mobile for studying and content creation.',
      'Build a zero-budget AI workflow for a new freelancer.',
      'Compare free plans for ChatGPT, Claude, Gemini, and Perplexity for daily work.',
    ],
    featuredLinks: [
      {
        label: 'Best Free AI Tools 2026',
        href: '/guides/best-free-ai-tools-2026/',
        type: 'Guide',
        summary: 'A beginner-friendly list of useful free tools and where each one fits.',
      },
      {
        label: 'How to Write Better AI Prompts',
        href: '/guides/how-to-write-ai-prompts/',
        type: 'Guide',
        summary: 'A practical framework for clearer instructions, useful context, constraints, and verification.',
      },
      {
        label: 'Current AI Subscription Prices',
        href: '/guides/ai-pricing-comparison-2026/',
        type: 'Guide',
        summary: 'A July 2026 fact-check of free, $20, and high-capacity plans across major providers.',
      },
    ],
    toolLinks: [
      { label: 'ChatGPT', href: '/tools/chatgpt/', type: 'Tool', summary: 'General-purpose assistant for writing, planning, and learning.' },
      { label: 'Google AI Studio', href: '/tools/google-ai-studio/', type: 'Tool', summary: 'Useful free access point for testing Gemini models.' },
      { label: 'Canva AI', href: '/tools/canva-ai/', type: 'Tool', summary: 'Fast design help for social posts, presentations, and graphics.' },
    ],
  },
  {
    slug: 'students',
    navLabel: 'Students',
    title: 'AI tools for students who need help learning, writing, and presenting',
    description: 'Use AI as a study assistant, research helper, note organizer, and presentation coach without losing your own thinking.',
    audience: 'High school, college, university, and self-taught learners.',
    promise: 'Turn a messy assignment into a plan, notes, draft, checklist, and presentation outline.',
    primaryCta: { label: 'Learn prompt basics', href: '/guides/how-to-write-ai-prompts/' },
    secondaryCta: { label: 'Browse evaluated tools', href: '/tools/' },
    quickWins: [
      'Summarize long readings into key ideas and questions.',
      'Turn class notes into flashcards, quizzes, and study plans.',
      'Draft outlines before writing essays or presentations.',
    ],
    starterPrompts: [
      'Explain this topic like I am a first-year student, then quiz me on it.',
      'Turn these notes into a study plan for the next seven days.',
      'Help me outline an essay, but do not write the final answer for me.',
    ],
    featuredLinks: [
      {
        label: 'Best AI Tools for Students 2026',
        href: '/guides/best-ai-tools-for-students-2026/',
        type: 'Guide',
        summary: 'The best tools for studying, research, writing, presentations, and organization.',
      },
      {
        label: 'Student Research Paper Workflow',
        href: '/playbooks/student-research-paper-workflow/',
        type: 'Playbook',
        summary: 'A step-by-step workflow from topic to research questions and outline.',
      },
      {
        label: 'How to Write AI Prompts',
        href: '/guides/how-to-write-ai-prompts/',
        type: 'Guide',
        summary: 'A plain-language prompt guide for getting better answers.',
      },
    ],
    toolLinks: [
      { label: 'NotebookLM', href: '/tools/notebooklm/', type: 'Tool', summary: 'Study uploaded notes and sources with grounded answers.' },
      { label: 'ChatGPT', href: '/tools/chatgpt/', type: 'Tool', summary: 'Explain concepts, draft outlines, and practice questions.' },
      { label: 'Gamma AI', href: '/tools/gamma-ai/', type: 'Tool', summary: 'Turn notes into clean presentations and documents.' },
    ],
  },
  {
    slug: 'teachers',
    navLabel: 'Teachers',
    title: 'AI tools for teachers who need practical classroom support',
    description: 'Plan lessons, build quizzes, adapt reading levels, and create classroom materials while staying thoughtful about student privacy and academic integrity.',
    audience: 'Teachers, tutors, trainers, and education leaders.',
    promise: 'Save planning time without handing your judgment to a tool.',
    primaryCta: { label: 'Learn prompt basics', href: '/guides/how-to-write-ai-prompts/' },
    secondaryCta: { label: 'Explore Google AI Studio', href: '/tools/google-ai-studio/' },
    quickWins: [
      'Create differentiated lesson plans from one topic.',
      'Generate exit tickets, rubrics, and practice questions.',
      'Record a quick lesson walkthrough with captions and live screen notes.',
      'Rewrite materials for different reading levels.',
    ],
    starterPrompts: [
      'Create a 45-minute lesson plan for this topic with objectives, activities, and assessment.',
      'Turn this reading into three versions: beginner, standard, and advanced.',
      'Make a quiz with answer key and explain why each answer is correct.',
    ],
    featuredLinks: [
      {
        label: 'How to Write Better AI Prompts',
        href: '/guides/how-to-write-ai-prompts/',
        type: 'Guide',
        summary: 'Prompt patterns for lesson planning, differentiation, questions, and classroom preparation.',
      },
      {
        label: 'Google AI Studio',
        href: '/tools/google-ai-studio/',
        type: 'Tool',
        summary: 'A free workspace for experimenting with Gemini on non-sensitive teaching materials.',
      },
      {
        label: 'Review Methodology',
        href: '/review-methodology/',
        type: 'Guide',
        summary: 'How AIViewer distinguishes research-based evaluation from documented hands-on testing.',
      },
    ],
    toolLinks: [
      { label: 'OurScreen', href: '/tools/ourscreen/', type: 'Tool', summary: 'Record lesson videos on Mac with local-first captions, auto zoom, Screen Draw, and Explain.' },
      { label: 'Google AI Studio', href: '/tools/google-ai-studio/', type: 'Tool', summary: 'Experiment with Gemini for lesson and resource drafting.' },
      { label: 'NotebookLM', href: '/tools/notebooklm/', type: 'Tool', summary: 'Work from provided class notes and source material.' },
    ],
  },
  {
    slug: 'creators',
    navLabel: 'Creators',
    title: 'AI tools for creators making videos, posts, thumbnails, and scripts',
    description: 'Plan content faster, generate visuals, draft captions, and turn one idea into multiple formats.',
    audience: 'YouTubers, short-form video creators, newsletter writers, and social media teams.',
    promise: 'Move from idea to script, thumbnail, caption, and repurposed post faster.',
    primaryCta: { label: 'Compare video tools', href: '/guides/best-ai-video-generator-2026-sora-runway-veo-pika-and-kling-compared/' },
    secondaryCta: { label: 'Compare image tools', href: '/guides/midjourney-vs-dalle-vs-stable-diffusion/' },
    quickWins: [
      'Turn a topic into a hook, script, title, and description.',
      'Create thumbnail concepts before opening a design tool.',
      'Repurpose one video into posts, captions, and email copy.',
    ],
    starterPrompts: [
      'Turn this idea into a 60-second video script with hook, scenes, and CTA.',
      'Create five thumbnail concepts for this video title.',
      'Repurpose this transcript into a LinkedIn post, Instagram caption, and newsletter intro.',
    ],
    featuredLinks: [
      {
        label: 'Content Creators Video Production',
        href: '/playbooks/content-creators-video-production/',
        type: 'Playbook',
        summary: 'A full workflow for scripting, assets, editing support, and publishing.',
      },
      {
        label: 'Best AI Video Generator 2026',
        href: '/guides/best-ai-video-generator-2026-sora-runway-veo-pika-and-kling-compared/',
        type: 'Guide',
        summary: 'Compare Sora, Runway, Veo, Pika, and Kling for practical video work.',
      },
      {
        label: 'Midjourney vs DALL-E vs Stable Diffusion',
        href: '/guides/midjourney-vs-dalle-vs-stable-diffusion/',
        type: 'Guide',
        summary: 'Pick the right image tool for thumbnails, graphics, and creative assets.',
      },
    ],
    toolLinks: [
      { label: 'OurScreen', href: '/tools/ourscreen/', type: 'Tool', summary: 'Record Mac tutorials with auto zoom, camera framing, captions, and local-first editing.' },
      { label: 'Canva AI', href: '/tools/canva-ai/', type: 'Tool', summary: 'Create social graphics, decks, and visual assets.' },
      { label: 'Runway', href: '/tools/runway-gen45/', type: 'Tool', summary: 'Generate and edit AI video clips.' },
    ],
  },
  {
    slug: 'small-business',
    navLabel: 'Business',
    title: 'AI tools for small business owners who need practical help now',
    description: 'Use AI for customer replies, marketing copy, operations, research, and simple automation without hiring a full team.',
    audience: 'Small business owners, operators, founders, and local service businesses.',
    promise: 'Pick tools that help with daily work instead of chasing AI hype.',
    primaryCta: { label: 'Start business guide', href: '/guides/best-ai-tools-for-small-business-2026/' },
    secondaryCta: { label: 'Customer service playbook', href: '/playbooks/small-business-ai-customer-service/' },
    quickWins: [
      'Draft customer replies and FAQs from real questions.',
      'Generate local ads, service descriptions, and social posts.',
      'Summarize calls, invoices, and operating notes into next steps.',
    ],
    starterPrompts: [
      'Create a polite customer reply for this complaint and suggest a resolution.',
      'Write five local Facebook ad angles for this service.',
      'Turn these messy notes into an operations checklist my team can follow.',
    ],
    featuredLinks: [
      {
        label: 'Best AI Tools for Small Business 2026',
        href: '/guides/best-ai-tools-for-small-business-2026/',
        type: 'Guide',
        summary: 'A practical shortlist for owners who need marketing, writing, and operations help.',
      },
      {
        label: 'AI Subscription Prices 2026',
        href: '/guides/ai-pricing-comparison-2026/',
        type: 'Guide',
        summary: 'How small teams can use AI without overcomplicating operations.',
      },
      {
        label: 'Small Business AI Customer Service',
        href: '/playbooks/small-business-ai-customer-service/',
        type: 'Playbook',
        summary: 'A workflow for better replies, FAQs, and service consistency.',
      },
    ],
    toolLinks: [
      { label: 'ChatGPT', href: '/tools/chatgpt/', type: 'Tool', summary: 'General assistant for marketing, replies, and planning.' },
      { label: 'Notion AI', href: '/tools/notion-ai/', type: 'Tool', summary: 'Organize company knowledge and draft internal docs.' },
      { label: 'Gamma AI', href: '/tools/gamma-ai/', type: 'Tool', summary: 'Create proposals, documents, and presentations.' },
    ],
  },
  {
    slug: 'job-seekers',
    navLabel: 'Job Seekers',
    title: 'AI tools for resumes, interviews, and job search prep',
    description: 'Use AI to improve your resume, prepare interview answers, rewrite cover letters, and organize applications.',
    audience: 'Job seekers, students entering the workforce, career switchers, and freelancers.',
    promise: 'Create better job materials without sounding generic or fake.',
    primaryCta: { label: 'Start resume playbook', href: '/playbooks/job-seekers-ai-resume-optimization/' },
    secondaryCta: { label: 'Learn prompt basics', href: '/guides/how-to-write-ai-prompts/' },
    quickWins: [
      'Rewrite resume bullets with clearer impact.',
      'Practice interview answers with follow-up questions.',
      'Tailor a cover letter to a job post without copying it blindly.',
    ],
    starterPrompts: [
      'Rewrite these resume bullets to be clearer and more results-focused.',
      'Interview me for this job description and give feedback after each answer.',
      'Compare my resume to this job post and list the strongest gaps to fix.',
    ],
    featuredLinks: [
      {
        label: 'Job Seekers AI Resume Optimization',
        href: '/playbooks/job-seekers-ai-resume-optimization/',
        type: 'Playbook',
        summary: 'A step-by-step workflow for resumes, cover letters, and interview prep.',
      },
      {
        label: 'AI and Jobs 2026',
        href: '/guides/ai-and-jobs-2026/',
        type: 'Guide',
        summary: 'How AI is changing work and what job seekers should learn next.',
      },
      {
        label: 'How to Write AI Prompts',
        href: '/guides/how-to-write-ai-prompts/',
        type: 'Guide',
        summary: 'Prompt patterns for getting clearer, more useful career help.',
      },
    ],
    toolLinks: [
      { label: 'ChatGPT', href: '/tools/chatgpt/', type: 'Tool', summary: 'Draft and improve resumes, answers, and job-search plans.' },
      { label: 'Claude', href: '/tools/claude-ai/', type: 'Tool', summary: 'Strong writing assistant for thoughtful edits and tone.' },
      { label: 'Wispr Flow', href: '/tools/wispr-flow/', type: 'Tool', summary: 'Dictate rough ideas and turn them into clearer drafts.' },
    ],
  },
];

export const useCaseMap = Object.fromEntries(useCases.map((useCase) => [useCase.slug, useCase])) as Record<string, UseCase>;
