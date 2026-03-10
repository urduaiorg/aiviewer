/**
 * modelLookup — Slug-based model lookup for ToolFinder integration.
 *
 * Builds a slim lookup map from the model snapshot, enabling
 * the ToolFinder results to show live pricing and capability data.
 */

export interface ModelLookupEntry {
  slug: string;
  name: string;
  provider: string;
  providerLabel: string;
  inputPricePerMillion: number | null;
  outputPricePerMillion: number | null;
  contextWindow: number | null;
  maxOutputTokens: number | null;
  supportsToolUse: boolean;
  supportsVision: boolean;
  supportsAudio: boolean;
  supportsReasoning: boolean;
  releaseDate: string | null;
}

interface SnapshotModel {
  slug: string;
  name: string;
  provider: string;
  providerLabel: string;
  inputPricePerMillion?: number | null;
  outputPricePerMillion?: number | null;
  contextWindow?: number | null;
  maxOutputTokens?: number | null;
  supportsToolUse?: boolean;
  supportsVision?: boolean;
  supportsAudio?: boolean;
  supportsReasoning?: boolean;
  releaseDate?: string | null;
}

/** Build a slug → model lookup map */
export function buildModelLookup(models: SnapshotModel[]): Record<string, ModelLookupEntry> {
  const map: Record<string, ModelLookupEntry> = {};

  for (const m of models) {
    map[m.slug] = {
      slug: m.slug,
      name: m.name,
      provider: m.provider,
      providerLabel: m.providerLabel,
      inputPricePerMillion: m.inputPricePerMillion ?? null,
      outputPricePerMillion: m.outputPricePerMillion ?? null,
      contextWindow: m.contextWindow ?? null,
      maxOutputTokens: m.maxOutputTokens ?? null,
      supportsToolUse: m.supportsToolUse ?? false,
      supportsVision: m.supportsVision ?? false,
      supportsAudio: m.supportsAudio ?? false,
      supportsReasoning: m.supportsReasoning ?? false,
      releaseDate: m.releaseDate ?? null,
    };
  }

  return map;
}

/** Extract model slug from a /models/ URL */
export function slugFromModelUrl(url: string): string | null {
  const match = url.match(/\/models\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

/** Format price for display */
export function formatModelPrice(price: number | null): string {
  if (price === null) return 'N/A';
  if (price < 0.01) return '<$0.01/M';
  if (price < 1) return `$${price.toFixed(2)}/M`;
  return `$${price.toFixed(0)}/M`;
}

/** Format context window for display */
export function formatContextWindow(tokens: number | null): string {
  if (tokens === null) return 'N/A';
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M tokens`;
  return `${Math.round(tokens / 1000)}K tokens`;
}
