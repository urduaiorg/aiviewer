const NOINDEX_PREFIXES = [
  '/compare/',
  '/models/',
  '/opportunities/',
  '/tags/',
  '/prompts/',
  '/playbooks/',
  '/reports/',
];

// Search Console, last 28 days ending 2026-07-09: these 20 comparisons
// generated 98 clicks at a combined 2.5% CTR. They remain available during
// the transition, but only the five strongest are indexable. All comparison
// pages stay unmonetized and the other ~7,800 routes are not built.
const COMPARISON_BUILD_PATHS = new Set([
  '/compare/qwen-qwen3-14b-vs-qwen-qwen3-5-9b/',
  '/compare/qwen-qwen3-5-35b-a3b-vs-qwen-qwen3-next-80b-a3b-instruct-free/',
  '/compare/qwen-qwen3-5-9b-vs-qwen-qwen3-coder-30b-a3b-instruct/',
  '/compare/google-gemma-4-31b-it-vs-qwen-qwen3-coder-next/',
  '/compare/google-gemma-4-26b-a4b-it-vs-openai-gpt-oss-20b/',
  '/compare/openai-gpt-oss-120b-exacto-vs-qwen-qwen3-6-plus-free/',
  '/compare/openai-gpt-oss-120b-vs-qwen-qwen3-5-35b-a3b/',
  '/compare/qwen-qwen3-5-9b-vs-qwen-qwen3-8b/',
  '/compare/deepseek-deepseek-r1-distill-llama-70b-vs-google-gemma-4-31b-it/',
  '/compare/google-gemma-4-26b-a4b-it-vs-qwen-qwen3-14b/',
  '/compare/google-gemma-4-31b-it-vs-mistralai-mistral-small-3-2-24b-instruct/',
  '/compare/google-gemma-4-31b-it-vs-openai-gpt-oss-120b/',
  '/compare/qwen-qwen3-30b-a3b-vs-qwen-qwen3-coder-next/',
  '/compare/google-gemma-4-31b-it-vs-openai-gpt-oss-20b/',
  '/compare/qwen-qwen2-5-coder-7b-instruct-vs-qwen-qwen3-5-9b/',
  '/compare/meta-llama-llama-3-3-70b-instruct-vs-openai-gpt-oss-120b-free/',
  '/compare/mistralai-mistral-small-2603-vs-openai-gpt-oss-120b/',
  '/compare/google-gemma-4-31b-it-vs-meta-llama-llama-3-3-70b-instruct-free/',
  '/compare/qwen-qwen3-5-27b-vs-qwen-qwen3-coder/',
  '/compare/google-gemma-4-31b-it-vs-qwen-qwen3-32b/',
]);

const INDEXABLE_COMPARISON_PATHS = new Set([
  '/compare/qwen-qwen3-14b-vs-qwen-qwen3-5-9b/',
  '/compare/qwen-qwen3-5-35b-a3b-vs-qwen-qwen3-next-80b-a3b-instruct-free/',
  '/compare/qwen-qwen3-5-9b-vs-qwen-qwen3-coder-30b-a3b-instruct/',
  '/compare/google-gemma-4-31b-it-vs-qwen-qwen3-coder-next/',
  '/compare/google-gemma-4-26b-a4b-it-vs-openai-gpt-oss-20b/',
]);

const NOINDEX_EXACT_PATHS = new Set([
  '/changes/',
  '/creators/',
  '/download/',
  '/finder/',
  '/free-ai-tools/',
  '/job-seekers/',
  '/preview/',
  '/small-business/',
  '/students/',
  '/teachers/',
  '/tools/audio/',
  '/tools/business/',
  '/tools/coding/',
  '/tools/data/',
  '/tools/design/',
  '/tools/education/',
  '/tools/general/',
  '/tools/healthcare/',
  '/tools/language/',
  '/tools/presentation/',
  '/tools/productivity/',
  '/tools/research/',
  '/tools/translation/',
  '/tools/video/',
  '/tools/writing/',
  '/tools/anything-ai/',
  '/tools/cal-com/',
  '/tools/canva-ai/',
  '/tools/chatgpt/',
  '/tools/claude-ai/',
  '/tools/claude-code/',
  '/tools/copilot-cowork/',
  '/tools/cursor-ide/',
  '/tools/elevenlabs/',
  '/tools/gamma-ai/',
  '/tools/github-copilot/',
  '/tools/google-opal/',
  '/tools/google-pomelli/',
  '/tools/google-veo/',
  '/tools/google-vids/',
  '/tools/ideogram/',
  '/tools/meta-vibes/',
  '/tools/midjourney/',
  '/tools/notebooklm/',
  '/tools/notion-ai/',
  '/tools/openai-codex/',
  '/tools/openclaw/',
  '/tools/perplexity-ai/',
  '/tools/perplexity-computer/',
  '/tools/producerai/',
  '/tools/runway-gen45/',
  '/tools/suno-ai/',
  '/tools/udio-ai/',
  '/tools/v0-dev/',
  '/tools/wispr-flow/',
  '/guides/ai-agents-replacing-saas/',
  '/guides/ai-and-jobs-2026/',
  '/guides/ai-for-healthcare-professionals/',
  '/guides/ai-in-2026-state-of-the-industry/',
  '/guides/ai-safety-and-risks-2026/',
  '/guides/ai-tools-for-teachers-2026/',
  '/guides/anthropic-project-glasswing-ai-cybersecurity/',
  '/guides/best-ai-tools-for-small-business-2026/',
  '/guides/best-ai-coding-tools-compared/',
  '/guides/best-ai-image-generators-compared/',
  '/guides/best-ai-music-generators-compared/',
  '/guides/best-ai-tools-for-students-2026/',
  '/guides/best-ai-writing-tools-2026/',
  '/guides/best-ai-video-generator-2026-sora-runway-veo-pika-and-kling-compared/',
  '/guides/best-free-ai-tools-2026/',
  '/guides/chatgpt-vs-claude-2026/',
  '/guides/cursor-vs-github-copilot-2026/',
  '/guides/fine-tuning-vs-rag/',
  '/guides/getting-started-with-ai/',
  '/guides/claude-fable-5-mythos-5-explained/',
  '/guides/google-vids-lyria-veo-free-ai-video/',
  '/guides/google-veo-3-review/',
  '/guides/grok-vs-claude-2026/',
  '/guides/gpt-5-6-sol-explained-openai-new-model/',
  '/guides/how-ai-search-engines-work/',
  '/guides/how-to-write-ai-prompts/',
  '/guides/how-to-use-google-ai-studio/',
  '/guides/midjourney-vs-dalle-vs-stable-diffusion/',
  '/guides/neuro-symbolic-ai-energy-breakthrough-2026/',
  '/guides/openai-vs-anthropic-vs-google-what-the-2026-model-race-means-for-normal-users/',
  '/guides/understanding-local-llms/',
  '/guides/what-is-agentic-ai/',
  '/guides/what-is-multimodal-ai/',
]);

function normalizePath(input: string | URL): string {
  const pathname = input instanceof URL
    ? input.pathname
    : input.startsWith('http://') || input.startsWith('https://')
      ? new URL(input).pathname
      : input;

  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function shouldBuildComparisonPath(input: string | URL): boolean {
  return COMPARISON_BUILD_PATHS.has(normalizePath(input));
}

export function shouldNoindexPath(input: string | URL): boolean {
  const pathname = normalizePath(input);
  if (INDEXABLE_COMPARISON_PATHS.has(pathname)) return false;
  if (NOINDEX_EXACT_PATHS.has(pathname)) return true;
  return NOINDEX_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function shouldIncludeInSitemap(input: string | URL): boolean {
  return !shouldNoindexPath(input);
}
