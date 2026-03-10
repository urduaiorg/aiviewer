/**
 * comparisonVerdict — Deterministic scoring engine for model-vs-model comparisons.
 *
 * Scores 2 models on 5 dimensions:
 *   1. Price (lower = better) — input + output weighted average
 *   2. Context window (larger = better)
 *   3. Capability breadth (more features = better)
 *   4. Output capacity (max output tokens)
 *   5. Recency (newer release = better)
 *
 * Returns: winner, confidence level, verdict text, and best-for arrays.
 */

interface ModelData {
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

export interface ComparisonVerdict {
  winner: string | null; // slug of winner, null if tie
  winnerName: string | null;
  confidence: 'strong' | 'moderate' | 'marginal';
  verdictText: string;
  dimensionScores: DimensionScore[];
  bestForA: string[];
  bestForB: string[];
}

interface DimensionScore {
  dimension: string;
  label: string;
  valueA: string;
  valueB: string;
  advantageSlug: string | null;
  gap: number; // percentage gap 0-100
}

function capabilityCount(m: ModelData): number {
  let count = 0;
  if (m.supportsToolUse) count++;
  if (m.supportsVision) count++;
  if (m.supportsAudio) count++;
  if (m.supportsReasoning) count++;
  return count;
}

function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'N/A';
  if (price < 1) return `$${price.toFixed(2)}/M`;
  return `$${price.toFixed(0)}/M`;
}

function formatContext(ctx: number | null | undefined): string {
  if (ctx == null) return 'N/A';
  if (ctx >= 1_000_000) return `${(ctx / 1_000_000).toFixed(1)}M`;
  return `${Math.round(ctx / 1000)}K`;
}

function formatTokens(tokens: number | null | undefined): string {
  if (tokens == null) return 'N/A';
  return `${Math.round(tokens / 1000)}K`;
}

function percentGap(a: number, b: number): number {
  if (a === 0 && b === 0) return 0;
  const max = Math.max(a, b);
  if (max === 0) return 0;
  return Math.abs(a - b) / max * 100;
}

export function generateVerdict(modelA: ModelData, modelB: ModelData): ComparisonVerdict {
  const scores: DimensionScore[] = [];
  let aWins = 0;
  let bWins = 0;
  let totalGap = 0;

  // 1. Price (lower = better) — weighted: 30% input, 70% output
  const priceA = ((modelA.inputPricePerMillion ?? 0) * 0.3 + (modelA.outputPricePerMillion ?? 0) * 0.7);
  const priceB = ((modelB.inputPricePerMillion ?? 0) * 0.3 + (modelB.outputPricePerMillion ?? 0) * 0.7);
  const priceGap = percentGap(priceA, priceB);
  const priceAdvantage = priceA < priceB ? modelA.slug : priceB < priceA ? modelB.slug : null;
  if (priceAdvantage === modelA.slug) aWins++;
  else if (priceAdvantage === modelB.slug) bWins++;
  totalGap += priceGap;
  scores.push({
    dimension: 'price',
    label: 'Price',
    valueA: `${formatPrice(modelA.inputPricePerMillion)} in / ${formatPrice(modelA.outputPricePerMillion)} out`,
    valueB: `${formatPrice(modelB.inputPricePerMillion)} in / ${formatPrice(modelB.outputPricePerMillion)} out`,
    advantageSlug: priceAdvantage,
    gap: priceGap,
  });

  // 2. Context window (larger = better)
  const ctxA = modelA.contextWindow ?? 0;
  const ctxB = modelB.contextWindow ?? 0;
  const ctxGap = percentGap(ctxA, ctxB);
  const ctxAdv = ctxA > ctxB ? modelA.slug : ctxB > ctxA ? modelB.slug : null;
  if (ctxAdv === modelA.slug) aWins++;
  else if (ctxAdv === modelB.slug) bWins++;
  totalGap += ctxGap;
  scores.push({
    dimension: 'context',
    label: 'Context Window',
    valueA: formatContext(modelA.contextWindow),
    valueB: formatContext(modelB.contextWindow),
    advantageSlug: ctxAdv,
    gap: ctxGap,
  });

  // 3. Capability breadth
  const capA = capabilityCount(modelA);
  const capB = capabilityCount(modelB);
  const capGap = percentGap(capA, capB);
  const capAdv = capA > capB ? modelA.slug : capB > capA ? modelB.slug : null;
  if (capAdv === modelA.slug) aWins++;
  else if (capAdv === modelB.slug) bWins++;
  totalGap += capGap;
  scores.push({
    dimension: 'capabilities',
    label: 'Capabilities',
    valueA: `${capA}/4 features`,
    valueB: `${capB}/4 features`,
    advantageSlug: capAdv,
    gap: capGap,
  });

  // 4. Output capacity
  const outA = modelA.maxOutputTokens ?? 0;
  const outB = modelB.maxOutputTokens ?? 0;
  const outGap = percentGap(outA, outB);
  const outAdv = outA > outB ? modelA.slug : outB > outA ? modelB.slug : null;
  if (outAdv === modelA.slug) aWins++;
  else if (outAdv === modelB.slug) bWins++;
  totalGap += outGap;
  scores.push({
    dimension: 'output',
    label: 'Max Output',
    valueA: formatTokens(modelA.maxOutputTokens),
    valueB: formatTokens(modelB.maxOutputTokens),
    advantageSlug: outAdv,
    gap: outGap,
  });

  // 5. Recency
  const dateA = modelA.releaseDate ? new Date(modelA.releaseDate).getTime() : 0;
  const dateB = modelB.releaseDate ? new Date(modelB.releaseDate).getTime() : 0;
  const recencyGap = percentGap(dateA, dateB);
  const recAdv = dateA > dateB ? modelA.slug : dateB > dateA ? modelB.slug : null;
  if (recAdv === modelA.slug) aWins++;
  else if (recAdv === modelB.slug) bWins++;
  totalGap += recencyGap;
  scores.push({
    dimension: 'recency',
    label: 'Release Date',
    valueA: modelA.releaseDate ? new Date(modelA.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
    valueB: modelB.releaseDate ? new Date(modelB.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
    advantageSlug: recAdv,
    gap: recencyGap,
  });

  // Determine winner
  const avgGap = totalGap / 5;
  let winner: string | null = null;
  let winnerName: string | null = null;

  if (aWins > bWins) {
    winner = modelA.slug;
    winnerName = modelA.name;
  } else if (bWins > aWins) {
    winner = modelB.slug;
    winnerName = modelB.name;
  }

  // Confidence
  let confidence: ComparisonVerdict['confidence'];
  if (avgGap > 25) confidence = 'strong';
  else if (avgGap > 10) confidence = 'moderate';
  else confidence = 'marginal';

  // Best-for arrays
  const bestForA: string[] = [];
  const bestForB: string[] = [];

  if (priceAdvantage === modelA.slug) bestForA.push('Cost-conscious teams');
  else if (priceAdvantage === modelB.slug) bestForB.push('Cost-conscious teams');

  if (ctxAdv === modelA.slug) bestForA.push('Long-document workflows');
  else if (ctxAdv === modelB.slug) bestForB.push('Long-document workflows');

  if (capAdv === modelA.slug) bestForA.push('Multimodal use cases');
  else if (capAdv === modelB.slug) bestForB.push('Multimodal use cases');

  if (outAdv === modelA.slug) bestForA.push('Long-form generation');
  else if (outAdv === modelB.slug) bestForB.push('Long-form generation');

  if (recAdv === modelA.slug) bestForA.push('Cutting-edge features');
  else if (recAdv === modelB.slug) bestForB.push('Cutting-edge features');

  // Verdict text
  let verdictText: string;
  if (!winner) {
    verdictText = `${modelA.name} and ${modelB.name} are closely matched. The right choice depends on whether you prioritize ${bestForA[0]?.toLowerCase() || 'specific strengths'} or ${bestForB[0]?.toLowerCase() || 'different strengths'}.`;
  } else if (confidence === 'strong') {
    verdictText = `${winnerName} leads clearly, winning on ${aWins > bWins ? aWins : bWins} of 5 dimensions. Choose ${winnerName} unless your workflow specifically requires ${winner === modelA.slug ? modelB.name : modelA.name}'s advantages.`;
  } else if (confidence === 'moderate') {
    verdictText = `${winnerName} has a meaningful edge overall, but ${winner === modelA.slug ? modelB.name : modelA.name} is stronger in specific areas. Your use case determines the right pick.`;
  } else {
    verdictText = `The gap between these models is narrow. ${winnerName} edges ahead slightly, but either is a solid choice depending on your priorities.`;
  }

  return { winner, winnerName, confidence, verdictText, dimensionScores: scores, bestForA, bestForB };
}
