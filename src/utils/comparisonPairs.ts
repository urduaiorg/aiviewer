/**
 * comparisonPairs — Generate canonical model comparison pairs
 *
 * Tiers models by output pricing, then generates meaningful pairs:
 * - Same-tier cross-provider comparisons (most SEO value)
 * - Same-provider sibling comparisons
 * - Alphabetical slug ordering for canonical URLs
 */

interface Model {
  slug: string;
  name: string;
  provider: string;
  providerLabel: string;
  outputPricePerMillion?: number | null;
  inputPricePerMillion?: number | null;
  contextWindow?: number | null;
  maxOutputTokens?: number | null;
  supportsToolUse?: boolean;
  supportsVision?: boolean;
  supportsAudio?: boolean;
  supportsReasoning?: boolean;
  releaseDate?: string | null;
  lastSeenAt?: string | null;
}

export interface ComparisonPair {
  slugA: string;
  slugB: string;
  nameA: string;
  nameB: string;
  providerA: string;
  providerB: string;
  tier: 'flagship' | 'mid' | 'budget';
  pairType: 'cross-provider' | 'same-provider';
}

type Tier = 'flagship' | 'mid' | 'budget';

function getTier(model: Model): Tier {
  const price = model.outputPricePerMillion;
  if (price == null) return 'mid';
  if (price >= 10) return 'flagship';
  if (price >= 2) return 'mid';
  return 'budget';
}

/** Canonical alphabetical slug for a pair — ensures one URL per pair */
export function comparisonSlug(slugA: string, slugB: string): string {
  const [first, second] = slugA < slugB ? [slugA, slugB] : [slugB, slugA];
  return `${first}-vs-${second}`;
}

/** Generate all meaningful comparison pairs from the model catalog */
export function generateComparisonPairs(models: Model[]): ComparisonPair[] {
  const pairs: ComparisonPair[] = [];
  const seen = new Set<string>();

  const byTier: Record<Tier, Model[]> = { flagship: [], mid: [], budget: [] };
  for (const m of models) {
    byTier[getTier(m)].push(m);
  }

  for (const tier of ['flagship', 'mid', 'budget'] as Tier[]) {
    const tierModels = byTier[tier];
    for (let i = 0; i < tierModels.length; i++) {
      for (let j = i + 1; j < tierModels.length; j++) {
        const a = tierModels[i];
        const b = tierModels[j];
        const slug = comparisonSlug(a.slug, b.slug);
        if (seen.has(slug)) continue;
        seen.add(slug);

        const [first, second] = a.slug < b.slug ? [a, b] : [b, a];
        pairs.push({
          slugA: first.slug,
          slugB: second.slug,
          nameA: first.name,
          nameB: second.name,
          providerA: first.providerLabel,
          providerB: second.providerLabel,
          tier,
          pairType: a.provider === b.provider ? 'same-provider' : 'cross-provider',
        });
      }
    }
  }

  pairs.sort((a, b) => {
    if (a.pairType !== b.pairType) return a.pairType === 'cross-provider' ? -1 : 1;
    return comparisonSlug(a.slugA, a.slugB).localeCompare(comparisonSlug(b.slugA, b.slugB));
  });

  return pairs;
}

/** Group pairs by tier for the hub page */
export function getPairsByTier(pairs: ComparisonPair[]): Record<Tier, ComparisonPair[]> {
  const result: Record<Tier, ComparisonPair[]> = { flagship: [], mid: [], budget: [] };
  for (const pair of pairs) {
    result[pair.tier].push(pair);
  }
  return result;
}
