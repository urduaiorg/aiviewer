/**
 * comparisonVerdict — Compare 2 models on 5 published specification fields
 *
 * Dimensions: price, context, capability breadth, output capacity, recency
 * Confidence: strong (>25% gap), moderate (10-25%), marginal (<10%)
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
}

interface DimensionScore {
  label: string;
  valueA: string;
  valueB: string;
  advantageSlug: string | null;
  gap: number;
}

export interface Verdict {
  winner: string | null;
  winnerName: string;
  confidence: 'strong' | 'moderate' | 'marginal';
  verdictText: string;
  bestForA: string[];
  bestForB: string[];
  dimensionScores: DimensionScore[];
}

function formatPrice(value?: number | null): string {
  if (value == null) return 'TBD';
  if (value < 1) return `$${value.toFixed(2)}/M tokens`;
  return `$${value.toFixed(0)}/M tokens`;
}

function formatCtx(value?: number | null): string {
  if (value == null) return 'N/A';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M tokens`;
  return `${Math.round(value / 1000)}K tokens`;
}

function formatTokens(value?: number | null): string {
  if (value == null) return 'N/A';
  return `${Math.round(value / 1000)}K tokens`;
}

function capCount(m: Model): number {
  let count = 0;
  if (m.supportsToolUse) count++;
  if (m.supportsVision) count++;
  if (m.supportsAudio) count++;
  if (m.supportsReasoning) count++;
  return count;
}

function normalizedGap(a: number, b: number): number {
  const max = Math.max(a, b);
  if (max === 0) return 0;
  return Math.abs(a - b) / max;
}

export function generateVerdict(modelA: Model, modelB: Model): Verdict {
  const dimensions: DimensionScore[] = [];

  // 1. Price (lower is better)
  const priceA = modelA.outputPricePerMillion ?? Infinity;
  const priceB = modelB.outputPricePerMillion ?? Infinity;
  const priceGap = (priceA !== Infinity && priceB !== Infinity) ? normalizedGap(priceA, priceB) : 0;
  dimensions.push({
    label: 'Price',
    valueA: formatPrice(modelA.outputPricePerMillion),
    valueB: formatPrice(modelB.outputPricePerMillion),
    advantageSlug: priceGap > 0.05 ? (priceA < priceB ? modelA.slug : modelB.slug) : null,
    gap: priceGap,
  });

  // 2. Context window (higher is better)
  const ctxA = modelA.contextWindow ?? 0;
  const ctxB = modelB.contextWindow ?? 0;
  const ctxGap = normalizedGap(ctxA, ctxB);
  dimensions.push({
    label: 'Context Window',
    valueA: formatCtx(modelA.contextWindow),
    valueB: formatCtx(modelB.contextWindow),
    advantageSlug: ctxGap > 0.05 ? (ctxA > ctxB ? modelA.slug : modelB.slug) : null,
    gap: ctxGap,
  });

  // 3. Capabilities (more is better)
  const capsA = capCount(modelA);
  const capsB = capCount(modelB);
  const capsGap = normalizedGap(capsA, capsB);
  dimensions.push({
    label: 'Capabilities',
    valueA: `${capsA}/4`,
    valueB: `${capsB}/4`,
    advantageSlug: capsGap > 0.05 ? (capsA > capsB ? modelA.slug : modelB.slug) : null,
    gap: capsGap,
  });

  // 4. Output capacity (higher is better)
  const outA = modelA.maxOutputTokens ?? 0;
  const outB = modelB.maxOutputTokens ?? 0;
  const outGap = normalizedGap(outA, outB);
  dimensions.push({
    label: 'Max Output',
    valueA: formatTokens(modelA.maxOutputTokens),
    valueB: formatTokens(modelB.maxOutputTokens),
    advantageSlug: outGap > 0.05 ? (outA > outB ? modelA.slug : modelB.slug) : null,
    gap: outGap,
  });

  // 5. Release date (newer is context, not proof that a model is better)
  const dateA = modelA.releaseDate ? new Date(modelA.releaseDate).getTime() : 0;
  const dateB = modelB.releaseDate ? new Date(modelB.releaseDate).getTime() : 0;
  dimensions.push({
    label: 'Release Date',
    valueA: modelA.releaseDate ? new Date(modelA.releaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A',
    valueB: modelB.releaseDate ? new Date(modelB.releaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A',
    advantageSlug: null,
    gap: 0,
  });

  // Tally
  let winsA = 0;
  let winsB = 0;
  let totalGap = 0;
  for (const dim of dimensions) {
    if (dim.advantageSlug === modelA.slug) { winsA++; totalGap += dim.gap; }
    else if (dim.advantageSlug === modelB.slug) { winsB++; totalGap += dim.gap; }
  }

  const avgGap = dimensions.length > 0 ? totalGap / dimensions.length : 0;
  const confidence: Verdict['confidence'] = avgGap > 0.25 ? 'strong' : avgGap > 0.1 ? 'moderate' : 'marginal';

  let winner: string | null = null;
  let winnerName = '';
  if (winsA > winsB) { winner = modelA.slug; winnerName = modelA.name; }
  else if (winsB > winsA) { winner = modelB.slug; winnerName = modelB.name; }

  const bestForA: string[] = [];
  const bestForB: string[] = [];
  if (priceA < priceB && priceGap > 0.1) bestForA.push('Budget-conscious workflows');
  if (priceB < priceA && priceGap > 0.1) bestForB.push('Budget-conscious workflows');
  if (ctxA > ctxB && ctxGap > 0.1) bestForA.push('Long document processing');
  if (ctxB > ctxA && ctxGap > 0.1) bestForB.push('Long document processing');
  if (capsA > capsB) bestForA.push('Multi-modal tasks');
  if (capsB > capsA) bestForB.push('Multi-modal tasks');
  if (outA > outB && outGap > 0.1) bestForA.push('Long-form content generation');
  if (outB > outA && outGap > 0.1) bestForB.push('Long-form content generation');

  let verdictText: string;
  if (!winner) {
    verdictText = `${modelA.name} and ${modelB.name} are closely matched across the listed pricing, context, and capability fields. Output quality, reliability, latency, and provider fit still need workflow-specific evaluation.`;
  } else {
    const loser = winner === modelA.slug ? modelB : modelA;
    const winnerModel = winner === modelA.slug ? modelA : modelB;
    const advantages = dimensions.filter(d => d.advantageSlug === winner).map(d => d.label.toLowerCase());
    const loserAdvantages = dimensions.filter(d => d.advantageSlug === loser.slug).map(d => d.label.toLowerCase());
    verdictText = `${winnerModel.name} has an advantage in more of the listed fields, including ${advantages.join(' and ')}.${loserAdvantages.length > 0 ? ` ${loser.name} has listed advantages in ${loserAdvantages.join(' and ')}.` : ''} This specification readout is not a hands-on quality benchmark or a universal recommendation.`;
  }

  return { winner, winnerName, confidence, verdictText, bestForA, bestForB, dimensionScores: dimensions };
}
