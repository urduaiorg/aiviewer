/**
 * comparisonPairs — Generate canonical model comparison pairs from snapshot data.
 *
 * Tiers models by output pricing, then produces:
 *   - same-tier cross-provider pairs (Claude Opus vs GPT-5.4 Pro)
 *   - same-provider sibling pairs (GPT-5.4 vs GPT-5.4 Pro)
 *
 * Alphabetical slug ordering ensures one canonical URL per pair.
 */

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

interface SnapshotModel {
  slug: string;
  name: string;
  provider: string;
  providerLabel: string;
  outputPricePerMillion?: number | null;
  inputPricePerMillion?: number | null;
  releaseDate?: string | null;
}

/** Pricing tier thresholds (output price per million tokens) */
const TIER_THRESHOLDS = {
  flagship: 10,  // ≥ $10/M
  mid: 2,        // $2-10/M
  // budget: < $2/M
} as const;

function getTier(outputPrice: number | null | undefined): 'flagship' | 'mid' | 'budget' {
  if (outputPrice == null) return 'mid'; // default for unpriced models
  if (outputPrice >= TIER_THRESHOLDS.flagship) return 'flagship';
  if (outputPrice >= TIER_THRESHOLDS.mid) return 'mid';
  return 'budget';
}

/** Canonical slug order: alphabetical so A-vs-B === B-vs-A */
function canonicalOrder(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export function generateComparisonPairs(models: SnapshotModel[]): ComparisonPair[] {
  const pairs = new Map<string, ComparisonPair>();

  // Group models by tier
  const byTier: Record<string, SnapshotModel[]> = { flagship: [], mid: [], budget: [] };
  for (const m of models) {
    byTier[getTier(m.outputPricePerMillion)].push(m);
  }

  // Group models by provider
  const byProvider = new Map<string, SnapshotModel[]>();
  for (const m of models) {
    const list = byProvider.get(m.provider) || [];
    list.push(m);
    byProvider.set(m.provider, list);
  }

  // 1. Same-tier cross-provider pairs
  for (const [tier, tierModels] of Object.entries(byTier)) {
    for (let i = 0; i < tierModels.length; i++) {
      for (let j = i + 1; j < tierModels.length; j++) {
        const a = tierModels[i];
        const b = tierModels[j];
        if (a.provider === b.provider) continue; // skip same-provider (handled below)

        const [slugA, slugB] = canonicalOrder(a.slug, b.slug);
        const key = `${slugA}--${slugB}`;
        if (pairs.has(key)) continue;

        const modelA = slugA === a.slug ? a : b;
        const modelB = slugA === a.slug ? b : a;

        pairs.set(key, {
          slugA,
          slugB,
          nameA: modelA.name,
          nameB: modelB.name,
          providerA: modelA.provider,
          providerB: modelB.provider,
          tier: tier as ComparisonPair['tier'],
          pairType: 'cross-provider',
        });
      }
    }
  }

  // 2. Same-provider sibling pairs
  for (const [, providerModels] of byProvider) {
    if (providerModels.length < 2) continue;

    // Sort by release date descending so we prefer recent pairings
    const sorted = [...providerModels].sort((a, b) => {
      const da = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const db = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return db - da;
    });

    // Only pair models within 2 positions of each other to avoid explosion
    for (let i = 0; i < sorted.length; i++) {
      const limit = Math.min(i + 3, sorted.length);
      for (let j = i + 1; j < limit; j++) {
        const a = sorted[i];
        const b = sorted[j];
        const [slugA, slugB] = canonicalOrder(a.slug, b.slug);
        const key = `${slugA}--${slugB}`;
        if (pairs.has(key)) continue;

        const modelA = slugA === a.slug ? a : b;
        const modelB = slugA === a.slug ? b : a;

        pairs.set(key, {
          slugA,
          slugB,
          nameA: modelA.name,
          nameB: modelB.name,
          providerA: modelA.provider,
          providerB: modelB.provider,
          tier: getTier(modelA.outputPricePerMillion),
          pairType: 'same-provider',
        });
      }
    }
  }

  return [...pairs.values()];
}

/** Get pairs grouped by tier for the hub page */
export function getPairsByTier(pairs: ComparisonPair[]) {
  return {
    flagship: pairs.filter((p) => p.tier === 'flagship'),
    mid: pairs.filter((p) => p.tier === 'mid'),
    budget: pairs.filter((p) => p.tier === 'budget'),
  };
}

/** Build URL-safe comparison slug: model-a-vs-model-b */
export function comparisonSlug(slugA: string, slugB: string): string {
  const [a, b] = canonicalOrder(slugA, slugB);
  return `${a}-vs-${b}`;
}
