import React, { useState } from 'react';

const QUESTION_WEIGHTS = {
  role: 4,
  goal: 4,
  technical: 2,
  budget: 2,
  team: 1,
  privacy: 2,
};

const QUIZ_QUESTIONS = [
  {
    id: 'role',
    question: 'What kind of work are you optimizing?',
    options: [
      { id: 'developers', label: 'Developer', description: 'Shipping code, agents, debugging, or product engineering.' },
      { id: 'designers', label: 'Designer', description: 'Wireframes, visuals, layouts, and creative production.' },
      { id: 'marketers', label: 'Marketer', description: 'Campaigns, content, SEO, and launch execution.' },
      { id: 'teachers', label: 'Teacher', description: 'Lesson planning, classroom materials, and explanation.' },
      { id: 'students', label: 'Student', description: 'Research, studying, writing, and project support.' },
      { id: 'small-business', label: 'Small Business', description: 'Customer support, operations, and growth tasks.' },
      { id: 'researchers', label: 'Researcher', description: 'Literature review, synthesis, and analysis-heavy work.' },
    ],
  },
  {
    id: 'goal',
    question: 'What is the main outcome you need right now?',
    optionsByRole: {
      developers: [
        { id: 'ship-code', label: 'Ship code faster', description: 'Speed up writing, refactoring, and code review.' },
        { id: 'build-ui', label: 'Build UI faster', description: 'Move quickly from ideas to working frontends.' },
        { id: 'agent-workflows', label: 'Run agent workflows', description: 'Work across bigger repos and multi-step tasks.' },
      ],
      designers: [
        { id: 'wireframes', label: 'Create wireframes', description: 'Go from concept to interface structure quickly.' },
        { id: 'visuals', label: 'Generate visuals', description: 'Produce image concepts, assets, and explorations.' },
        { id: 'video', label: 'Produce video', description: 'Edit, storyboard, or generate short-form video.' },
      ],
      marketers: [
        { id: 'campaigns', label: 'Launch campaigns', description: 'Plan messaging, channels, and assets.' },
        { id: 'longform', label: 'Write long-form content', description: 'Build blogs, guides, and strategic copy.' },
        { id: 'seo', label: 'Improve SEO output', description: 'Optimize briefs, outlines, and content structure.' },
      ],
      teachers: [
        { id: 'lessons', label: 'Plan lessons faster', description: 'Build lesson plans, activities, and pacing.' },
        { id: 'materials', label: 'Create teaching materials', description: 'Generate handouts, explanations, and examples.' },
        { id: 'feedback', label: 'Draft feedback', description: 'Respond to student work more efficiently.' },
      ],
      students: [
        { id: 'research', label: 'Research better', description: 'Find, compare, and synthesize sources quickly.' },
        { id: 'study', label: 'Study smarter', description: 'Turn notes into structured learning tools.' },
        { id: 'writing', label: 'Improve writing', description: 'Draft, revise, and clarify academic writing.' },
      ],
      'small-business': [
        { id: 'support', label: 'Handle customer support', description: 'Reply faster and standardize common answers.' },
        { id: 'operations', label: 'Automate operations', description: 'Reduce repetitive admin and workflow friction.' },
        { id: 'analysis', label: 'Analyze the business', description: 'Use AI to interpret data and find decisions.' },
      ],
      researchers: [
        { id: 'literature', label: 'Review literature', description: 'Scan papers, compare findings, and extract themes.' },
        { id: 'synthesis', label: 'Synthesize evidence', description: 'Turn large inputs into structured summaries.' },
        { id: 'data', label: 'Reason through data', description: 'Work through analysis and interpretation faster.' },
      ],
    },
  },
  {
    id: 'technical',
    question: 'How hands-on do you want to be?',
    options: [
      { id: 'beginner', label: 'Low setup', description: 'I want strong defaults and minimal technical friction.' },
      { id: 'intermediate', label: 'Moderate setup', description: 'I can handle some configuration if the payoff is real.' },
      { id: 'advanced', label: 'High control', description: 'I am comfortable with APIs, agent loops, and more tuning.' },
    ],
  },
  {
    id: 'budget',
    question: 'What budget feels realistic?',
    options: [
      { id: 'free', label: 'Free or near-free', description: 'Stay lean and only pay if there is a clear ROI.' },
      { id: 'standard', label: '$10-$30/mo', description: 'Standard paid tools are fine if they save real time.' },
      { id: 'premium', label: '$50+/mo', description: 'I will pay for speed, team workflow, or top-end quality.' },
    ],
  },
  {
    id: 'team',
    question: 'Are you choosing for yourself or for a team?',
    options: [
      { id: 'solo', label: 'Mostly solo', description: 'I am the main user and speed is the priority.' },
      { id: 'team', label: 'Team workflow', description: 'Shared standards and collaboration matter.' },
    ],
  },
  {
    id: 'privacy',
    question: 'How sensitive is the work?',
    options: [
      { id: 'standard', label: 'Standard sensitivity', description: 'Useful automation matters more than strict controls.' },
      { id: 'sensitive', label: 'Sensitive data', description: 'I need stronger caution around what gets uploaded.' },
    ],
  },
];

const STACK_BLUEPRINTS = [
  {
    id: 'developer-agentic',
    title: 'Agentic engineering stack',
    match: { role: 'developers', goal: 'agent-workflows', technical: 'advanced' },
    primaryToolId: 'cursor-ide',
    secondaryToolId: 'github-copilot',
    cheaperToolId: 'chatgpt',
    playbookId: 'engineer-workflow',
    model: { label: 'Claude Opus 4.6', url: '/models/anthropic-claude-opus-4-6/' },
    fitSummary: 'Best when you need repo-scale reasoning, long sessions, and a tool that can stay inside the codebase instead of just chatting around it.',
    executionNotes: [
      'Use Cursor for repo-wide changes and fast iteration.',
      'Reserve Claude Opus 4.6 for harder planning, architecture, and debugging loops.',
      'Use the engineering playbook to turn one-off wins into a repeatable workflow.',
    ],
    caution: 'If you are working with sensitive code, tighten repository access and avoid pasting secrets or production credentials.',
  },
  {
    id: 'developer-private',
    title: 'Lower-exposure coding stack',
    match: { role: 'developers', privacy: 'sensitive' },
    primaryToolId: 'github-copilot',
    secondaryToolId: 'cursor-ide',
    cheaperToolId: 'chatgpt',
    playbookId: 'software-engineer-ai-workflow',
    model: { label: 'Qwen3 Coder Next', url: '/models/qwen-qwen3-coder-next/' },
    fitSummary: 'This stack favors tighter developer workflow control and more cautious use of model context when the codebase is sensitive.',
    executionNotes: [
      'Keep prompts narrow and task-specific instead of sending broad repository dumps.',
      'Use Copilot for in-editor acceleration and only escalate to deeper tools when the gain is worth it.',
      'Use the playbook to set team rules for what can and cannot be uploaded.',
    ],
    caution: 'Privacy-sensitive work still requires vendor review, internal policy, and human judgment before adoption.',
  },
  {
    id: 'developer-ui',
    title: 'Frontend acceleration stack',
    match: { role: 'developers', goal: 'build-ui' },
    primaryToolId: 'v0-dev',
    secondaryToolId: 'claude-ai',
    cheaperToolId: 'chatgpt',
    playbookId: 'designers-ai-wireframe-to-code',
    model: { label: 'OpenAI GPT-5.4', url: '/models/openai-gpt-5-4/' },
    fitSummary: 'Best when speed matters more than purity and you need to move from prompt to usable interface fast.',
    executionNotes: [
      'Use v0 to generate the first interface pass.',
      'Use GPT-5.4 or Claude to tighten edge cases, copy, and responsiveness.',
      'Use the wireframe-to-code playbook to avoid AI-generated UI drift.',
    ],
    caution: 'Generated UI still needs responsive testing and cleanup before it becomes product code.',
  },
  {
    id: 'designer-wireframes',
    title: 'Interface concept stack',
    match: { role: 'designers', goal: 'wireframes' },
    primaryToolId: 'v0-dev',
    secondaryToolId: 'canva-ai',
    cheaperToolId: 'chatgpt',
    playbookId: 'ui-ux-workflow',
    model: { label: 'OpenAI GPT-5.4', url: '/models/openai-gpt-5-4/' },
    fitSummary: 'Strong fit when you need structured interface ideas, quick layout directions, and faster iteration on product concepts.',
    executionNotes: [
      'Use v0 for layout generation and component direction.',
      'Use Canva AI for lightweight visual polish and presentation assets.',
      'Use the UI/UX playbook to turn rough output into a coherent design process.',
    ],
    caution: 'Do not let generated layouts replace real user flows, constraints, and interaction thinking.',
  },
  {
    id: 'designer-visuals',
    title: 'Creative visual stack',
    match: { role: 'designers', goal: 'visuals' },
    primaryToolId: 'midjourney',
    secondaryToolId: 'canva-ai',
    cheaperToolId: 'chatgpt',
    playbookId: 'content-creators-video-production',
    model: { label: 'Gemini 3.1 Flash Image Preview', url: '/models/google-gemini-3-1-flash-image-preview/' },
    fitSummary: 'Use this when concept exploration, visual range, and rapid asset direction matter more than structured product UI.',
    executionNotes: [
      'Start in Midjourney for concept range and stronger art direction.',
      'Use Canva AI to adapt outputs into practical campaign or brand formats.',
      'Use the creator workflow playbook when these visuals need to feed a content pipeline.',
    ],
    caution: 'Expect iteration. Strong image generation still depends on taste, selection, and human editing.',
  },
  {
    id: 'designer-video',
    title: 'Video production stack',
    match: { role: 'designers', goal: 'video' },
    primaryToolId: 'runway-gen45',
    secondaryToolId: 'midjourney',
    cheaperToolId: 'canva-ai',
    playbookId: 'content-creators-video-production',
    model: { label: 'Gemini 3.1 Flash Image Preview', url: '/models/google-gemini-3-1-flash-image-preview/' },
    fitSummary: 'Best for creators and visual teams who need to move from concept boards into faster short-form production.',
    executionNotes: [
      'Use Midjourney for visual boards and shot direction.',
      'Use Runway for motion, edits, and production-ready iteration.',
      'Use the creator playbook to avoid random experimentation and keep outputs purposeful.',
    ],
    caution: 'AI video is strongest for speed and iteration, not for replacing full creative direction.',
  },
  {
    id: 'marketer-campaigns',
    title: 'Campaign execution stack',
    match: { role: 'marketers', goal: 'campaigns' },
    primaryToolId: 'chatgpt',
    secondaryToolId: 'claude-ai',
    cheaperToolId: 'notion-ai',
    playbookId: 'marketing-workflow',
    model: { label: 'OpenAI GPT-5.4', url: '/models/openai-gpt-5-4/' },
    fitSummary: 'Strong default when you need breadth: messaging, planning, variants, channel copy, and iterative campaign work.',
    executionNotes: [
      'Use ChatGPT as the fast campaign operator.',
      'Use Claude when the draft needs stronger structure or long-form refinement.',
      'Use the marketing workflow playbook to turn output into a repeatable process.',
    ],
    caution: 'AI can speed up campaign work, but positioning still needs strong human judgment and audience insight.',
  },
  {
    id: 'marketer-longform',
    title: 'Long-form content stack',
    match: { role: 'marketers', goal: 'longform' },
    primaryToolId: 'claude-ai',
    secondaryToolId: 'chatgpt',
    cheaperToolId: 'notion-ai',
    playbookId: 'marketers-prompt-engineering-cheat-sheet',
    model: { label: 'Claude Opus 4.6', url: '/models/anthropic-claude-opus-4-6/' },
    fitSummary: 'Use this when depth, structure, and editorial control matter more than pure speed.',
    executionNotes: [
      'Use Claude for first drafts, restructuring, and longer strategic assets.',
      'Use ChatGPT to generate supporting angles, variants, and expansion ideas.',
      'Apply the prompt engineering cheat sheet to keep the output specific instead of generic.',
    ],
    caution: 'Long-form AI content is easy to make and easy to forget. The real edge is specificity and editorial judgment.',
  },
  {
    id: 'marketer-seo',
    title: 'SEO content stack',
    match: { role: 'marketers', goal: 'seo' },
    primaryToolId: 'chatgpt',
    secondaryToolId: 'notion-ai',
    cheaperToolId: 'claude-ai',
    playbookId: 'marketing-workflow',
    model: { label: 'OpenAI GPT-5.4', url: '/models/openai-gpt-5-4/' },
    fitSummary: 'Best when you need briefs, outlines, SERP-aware ideation, and fast iteration on search-facing content.',
    executionNotes: [
      'Use ChatGPT to structure briefs, clusters, and draft scaffolds.',
      'Use Notion AI to keep execution organized across a content calendar.',
      'Layer the workflow playbook on top so SEO work supports actual business goals.',
    ],
    caution: 'Do not confuse SEO quantity with search value. AI makes that failure mode faster.',
  },
  {
    id: 'teacher-lessons',
    title: 'Lesson planning stack',
    match: { role: 'teachers', goal: 'lessons' },
    primaryToolId: 'chatgpt',
    secondaryToolId: 'notion-ai',
    cheaperToolId: 'claude-ai',
    playbookId: 'ai-for-teachers-lesson-planning',
    model: { label: 'OpenAI GPT-5.4', url: '/models/openai-gpt-5-4/' },
    fitSummary: 'This is the practical default for teachers who need plans, explanations, scaffolds, and differentiated materials fast.',
    executionNotes: [
      'Use ChatGPT to generate lesson structures, examples, and activities.',
      'Use Notion AI if you want a cleaner workspace for organizing units and notes.',
      'Follow the teacher playbook so the workflow stays pedagogically grounded.',
    ],
    caution: 'Never treat AI output as classroom-ready by default. Review for accuracy, tone, and age fit.',
  },
  {
    id: 'teacher-materials',
    title: 'Teaching materials stack',
    match: { role: 'teachers', goal: 'materials' },
    primaryToolId: 'notion-ai',
    secondaryToolId: 'chatgpt',
    cheaperToolId: 'claude-ai',
    playbookId: 'ai-for-teachers-lesson-planning',
    model: { label: 'Gemini 3 Flash Preview', url: '/models/google-gemini-3-flash-preview/' },
    fitSummary: 'A good fit if you need reusable notes, explanations, worksheets, and structured classroom material with less friction.',
    executionNotes: [
      'Use Notion AI to organize the material system.',
      'Use ChatGPT when you need stronger generation or explanation support.',
      'Keep the teacher playbook nearby so production speed does not outrun classroom usefulness.',
    ],
    caution: 'Material generation is only valuable if it saves prep time without lowering instructional quality.',
  },
  {
    id: 'student-research',
    title: 'Research support stack',
    match: { role: 'students', goal: 'research' },
    primaryToolId: 'perplexity-ai',
    secondaryToolId: 'chatgpt',
    cheaperToolId: 'claude-ai',
    playbookId: 'student-research-paper-workflow',
    model: { label: 'Gemini 3 Flash Preview', url: '/models/google-gemini-3-flash-preview/' },
    fitSummary: 'Start here if your problem is source discovery, synthesis, and turning messy reading into something structured.',
    executionNotes: [
      'Use Perplexity first for source-aware search and quick synthesis.',
      'Use ChatGPT to turn research into outlines, arguments, and study structure.',
      'Use the research paper workflow so AI helps your process without replacing your thinking.',
    ],
    caution: 'Use AI for synthesis, not for pretending to have read sources you did not verify.',
  },
  {
    id: 'student-study',
    title: 'Study acceleration stack',
    match: { role: 'students', goal: 'study' },
    primaryToolId: 'chatgpt',
    secondaryToolId: 'notion-ai',
    cheaperToolId: 'claude-ai',
    playbookId: 'student-research-paper-workflow',
    model: { label: 'Gemini 3.1 Flash Lite Preview', url: '/models/google-gemini-3-1-flash-lite-preview/' },
    fitSummary: 'Best when you need explanations, flashcards, quizzes, and structured review loops rather than deep source search.',
    executionNotes: [
      'Use ChatGPT to convert notes into practice and explanations.',
      'Use Notion AI if you want that study system to stay organized over time.',
      'Keep your own notes central; AI should accelerate recall, not replace learning.',
    ],
    caution: 'If the goal is understanding, always test yourself without the model after generating study aids.',
  },
  {
    id: 'small-business-support',
    title: 'Customer support stack',
    match: { role: 'small-business', goal: 'support' },
    primaryToolId: 'chatgpt',
    secondaryToolId: 'notion-ai',
    cheaperToolId: 'perplexity-ai',
    playbookId: 'small-business-ai-customer-service',
    model: { label: 'Gemini 3.1 Flash Lite Preview', url: '/models/google-gemini-3-1-flash-lite-preview/' },
    fitSummary: 'This stack fits small teams that need faster replies, stronger consistency, and lower support drag without a huge software budget.',
    executionNotes: [
      'Use ChatGPT to draft macros, help responses, and support flows.',
      'Use Notion AI to centralize support knowledge and repeatable answers.',
      'Use the customer service playbook to standardize where AI helps and where humans take over.',
    ],
    caution: 'Support automation should reduce response time without making the business sound robotic or careless.',
  },
  {
    id: 'small-business-analysis',
    title: 'Business analysis stack',
    match: { role: 'small-business', goal: 'analysis' },
    primaryToolId: 'chatgpt',
    secondaryToolId: 'claude-ai',
    cheaperToolId: 'notion-ai',
    playbookId: 'small-business-ai-customer-service',
    model: { label: 'OpenAI GPT-5.4', url: '/models/openai-gpt-5-4/' },
    fitSummary: 'Best when you need AI to reason over operational data, customer patterns, or business tradeoffs instead of just generating copy.',
    executionNotes: [
      'Use ChatGPT for structured analysis and follow-up reasoning.',
      'Use Claude when the task is more document-heavy or requires cleaner synthesis.',
      'Translate the output into decisions using a simple operational playbook rather than ad hoc prompting.',
    ],
    caution: 'AI can suggest decisions, but it cannot own the real-world consequences of them.',
  },
  {
    id: 'researcher-literature',
    title: 'Literature review stack',
    match: { role: 'researchers', goal: 'literature' },
    primaryToolId: 'perplexity-ai',
    secondaryToolId: 'claude-ai',
    cheaperToolId: 'chatgpt',
    playbookId: 'researchers-ai-literature-review',
    model: { label: 'Claude Opus 4.6', url: '/models/anthropic-claude-opus-4-6/' },
    fitSummary: 'Use this when you need to find papers, compare claims, and keep long-context synthesis coherent.',
    executionNotes: [
      'Use Perplexity for retrieval and source-aware first-pass synthesis.',
      'Use Claude for deeper comparison, framing, and writeups.',
      'Use the literature review playbook so the workflow stays rigorous under time pressure.',
    ],
    caution: 'The bigger the corpus, the more important it is to verify claims against original sources.',
  },
  {
    id: 'fallback',
    title: 'General-purpose default stack',
    match: {},
    primaryToolId: 'chatgpt',
    secondaryToolId: 'claude-ai',
    cheaperToolId: 'notion-ai',
    playbookId: 'marketing-workflow',
    model: { label: 'OpenAI GPT-5.4', url: '/models/openai-gpt-5-4/' },
    fitSummary: 'If your needs are still broad or evolving, start with a strong general-purpose stack before buying niche tools.',
    executionNotes: [
      'Use ChatGPT as the flexible default.',
      'Use Claude when you need stronger structure or longer reasoning.',
      'Pick one playbook and operationalize a workflow before adding more tools.',
    ],
    caution: 'Do not mistake a broad default for the best specialized setup. Once the workflow is clear, tighten the stack.',
  },
];

function getQuestionOptions(question, answers) {
  if (question.id === 'goal') {
    return question.optionsByRole[answers.role] || [];
  }
  return question.options;
}

function findBestBlueprint(answers) {
  let bestBlueprint = STACK_BLUEPRINTS[STACK_BLUEPRINTS.length - 1];
  let bestScore = Number.NEGATIVE_INFINITY;
  let bestSpecificity = -1;

  STACK_BLUEPRINTS.forEach((blueprint) => {
    const matchEntries = Object.entries(blueprint.match);
    let score = 0;

    matchEntries.forEach(([key, value]) => {
      const weight = QUESTION_WEIGHTS[key] || 1;
      if (answers[key] === value) {
        score += weight;
      } else {
        score -= weight * 0.75;
      }
    });

    const specificity = matchEntries.length;
    if (score > bestScore || (score === bestScore && specificity > bestSpecificity)) {
      bestScore = score;
      bestBlueprint = blueprint;
      bestSpecificity = specificity;
    }
  });

  return bestBlueprint;
}

function buildMap(entries) {
  return new Map(entries.map((entry) => [entry.id, entry]));
}

function answerLabel(questionId, answerId) {
  const question = QUIZ_QUESTIONS.find((item) => item.id === questionId);
  if (!question || !answerId) return '';

  const options = question.id === 'goal'
    ? Object.values(question.optionsByRole).flat()
    : question.options;

  return options.find((option) => option.id === answerId)?.label || answerId;
}

export default function ToolFinder({ tools = [], playbooks = [], modelData = {} }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  const toolMap = buildMap(tools);
  const playbookMap = buildMap(playbooks);

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const options = getQuestionOptions(currentQuestion, answers);

  const handleSelect = (questionId, optionId) => {
    const nextAnswers = { ...answers, [questionId]: optionId };
    setAnswers(nextAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((step) => step + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsComplete(false);
  };

  if (isComplete) {
    const blueprint = findBestBlueprint(answers);
    const primaryTool = toolMap.get(blueprint.primaryToolId);
    const secondaryTool = toolMap.get(blueprint.secondaryToolId);
    const cheaperTool = toolMap.get(blueprint.cheaperToolId);
    const playbook = playbookMap.get(blueprint.playbookId);

    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-[var(--shadow-card)] dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                Recommended stack
              </div>
              <h2 className="mt-5 text-3xl font-bold text-zinc-950 dark:text-zinc-50">{blueprint.title}</h2>
              <p className="mt-4 text-base leading-8 text-zinc-600 dark:text-zinc-400">{blueprint.fitSummary}</p>
            </div>
            <button
              onClick={handleReset}
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-indigo-200 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-800 dark:hover:text-indigo-300"
            >
              Retake finder
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {Object.entries(answers).map(([key, value]) => (
              <span key={key} className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                {answerLabel(key, value)}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
            <div className="rounded-[var(--radius-lg)] border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 dark:border-indigo-800 dark:from-indigo-900/20 dark:to-zinc-900">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">Primary tool</div>
              <h3 className="mt-3 text-2xl font-bold text-zinc-950 dark:text-zinc-50">{primaryTool?.name || 'Primary recommendation'}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{primaryTool?.description || 'AIViewer will expand this recommendation as more review coverage is added.'}</p>
              {primaryTool && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs text-indigo-700 dark:border-indigo-800 dark:bg-zinc-900 dark:text-indigo-300">
                    {primaryTool.pricing}
                  </span>
                </div>
              )}
              {primaryTool && (
                <a href={primaryTool.url} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                  Read the tool review
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              )}
            </div>

            <div className="space-y-4">
              <a href={blueprint.model.url} className="block rounded-[var(--radius-lg)] border border-zinc-200 bg-zinc-50/80 p-5 transition-colors hover:border-indigo-200 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-indigo-800">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">Model pick</div>
                <h3 className="mt-3 text-xl font-bold text-zinc-950 dark:text-zinc-50">{blueprint.model.label}</h3>
                {(() => {
                  const slug = blueprint.model.url.match(/\/models\/([^/]+)\/?$/)?.[1];
                  const liveModel = slug && modelData[slug];
                  if (!liveModel) return (
                    <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">Pair the tool recommendation with this model when you need stronger capability fit, pricing context, and release tracking.</p>
                  );
                  return (
                    <>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5">
                          <span className="text-zinc-400">Input</span>
                          <span className="ml-1 font-semibold text-zinc-950 dark:text-zinc-50">
                            {liveModel.inputPricePerMillion != null ? `$${liveModel.inputPricePerMillion < 1 ? liveModel.inputPricePerMillion.toFixed(2) : liveModel.inputPricePerMillion}/M` : 'TBD'}
                          </span>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1.5">
                          <span className="text-zinc-400">Output</span>
                          <span className="ml-1 font-semibold text-zinc-950 dark:text-zinc-50">
                            {liveModel.outputPricePerMillion != null ? `$${liveModel.outputPricePerMillion < 1 ? liveModel.outputPricePerMillion.toFixed(2) : liveModel.outputPricePerMillion}/M` : 'TBD'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {liveModel.contextWindow && (
                          <span className="rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 text-[0.65rem] text-zinc-500 dark:text-zinc-400">
                            {liveModel.contextWindow >= 1000000 ? `${(liveModel.contextWindow / 1000000).toFixed(1)}M ctx` : `${Math.round(liveModel.contextWindow / 1000)}K ctx`}
                          </span>
                        )}
                        {liveModel.supportsReasoning && <span className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 text-[0.65rem] text-indigo-600 dark:text-indigo-400">Reasoning</span>}
                        {liveModel.supportsVision && <span className="rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 px-2 py-0.5 text-[0.65rem] text-amber-600 dark:text-amber-400">Vision</span>}
                        {liveModel.supportsToolUse && <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[0.65rem] text-emerald-600 dark:text-emerald-400">Tool use</span>}
                      </div>
                    </>
                  );
                })()}
              </a>

              {playbook && (
                <a href={playbook.url} className="block rounded-[var(--radius-lg)] border border-zinc-200 bg-zinc-50/80 p-5 transition-colors hover:border-indigo-200 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-indigo-800">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">Playbook</div>
                  <h3 className="mt-3 text-xl font-bold text-zinc-950 dark:text-zinc-50">{playbook.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{playbook.description}</p>
                </a>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {secondaryTool && (
              <div className="rounded-[var(--radius-lg)] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">Runner-up tool</div>
                <h3 className="mt-3 text-xl font-bold text-zinc-950 dark:text-zinc-50">{secondaryTool.name}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{secondaryTool.description}</p>
                <a href={secondaryTool.url} className="mt-4 inline-flex text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                  Open alternative
                </a>
              </div>
            )}

            {cheaperTool && (
              <div className="rounded-[var(--radius-lg)] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">Lower-cost fallback</div>
                <h3 className="mt-3 text-xl font-bold text-zinc-950 dark:text-zinc-50">{cheaperTool.name}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{cheaperTool.description}</p>
                <a href={cheaperTool.url} className="mt-4 inline-flex text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                  Open fallback
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/compare/" className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 px-5 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
              Compare recommended models
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </a>
            <a href="/changes/" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Latest model changes
            </a>
          </div>

          <div className="mt-6 rounded-[var(--radius-lg)] border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">Execution notes</div>
            <div className="mt-5 space-y-3">
              {blueprint.executionNotes.map((note) => (
                <div key={note} className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm leading-7 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  {note}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm leading-7 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-200">
              {blueprint.caution}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[var(--shadow-card)] dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
          <span>{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% complete</span>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-400"
            style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">{currentQuestion.question}</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          AIViewer uses this answer to narrow the stack toward fit, not just popularity.
        </p>
      </div>

      <div className="mt-8 grid gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(currentQuestion.id, option.id)}
            className="group rounded-[var(--radius-lg)] border border-zinc-200 bg-zinc-50/70 p-5 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/70 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-indigo-800 dark:hover:bg-indigo-900/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-zinc-950 transition-colors group-hover:text-indigo-600 dark:text-zinc-50 dark:group-hover:text-indigo-300">
                  {option.label}
                </div>
                <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{option.description}</p>
              </div>
              <svg className="mt-1 h-5 w-5 text-zinc-300 transition-colors group-hover:text-indigo-500 dark:text-zinc-700 dark:group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {currentStep > 0 && (
        <button
          onClick={() => setCurrentStep((step) => step - 1)}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      )}
    </div>
  );
}
