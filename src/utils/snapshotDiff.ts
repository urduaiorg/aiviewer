/**
 * snapshotDiff — Detect changes between model snapshots.
 *
 * Used to power the /changes/ feed, showing:
 *   - New model launches
 *   - Pricing changes
 *   - Capability changes (context window, new features)
 */

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
  lastSeenAt?: string | null;
}

export type ChangeType = 'launch' | 'price-change' | 'capability-change';
export type ChangeMagnitude = 'major' | 'minor' | 'informational';

export interface ChangeEntry {
  slug: string;
  name: string;
  provider: string;
  providerLabel: string;
  changeType: ChangeType;
  magnitude: ChangeMagnitude;
  description: string;
  detail?: string;
  date: string; // ISO date string
}

/** Detect new launches from release dates within a given window */
export function detectRecentLaunches(
  models: SnapshotModel[],
  windowDays = 30
): ChangeEntry[] {
  const cutoff = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
  const changes: ChangeEntry[] = [];

  for (const m of models) {
    if (!m.releaseDate) continue;
    const releaseDate = new Date(m.releaseDate);
    if (releaseDate < cutoff) continue;

    changes.push({
      slug: m.slug,
      name: m.name,
      provider: m.provider,
      providerLabel: m.providerLabel,
      changeType: 'launch',
      magnitude: 'major',
      description: `${m.providerLabel} launched ${m.name}`,
      detail: formatPriceSummary(m),
      date: m.releaseDate,
    });
  }

  return changes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Compare two snapshots and detect pricing + capability changes */
export function diffSnapshots(
  currentModels: SnapshotModel[],
  previousModels: SnapshotModel[]
): ChangeEntry[] {
  const changes: ChangeEntry[] = [];
  const prevMap = new Map(previousModels.map((m) => [m.slug, m]));

  for (const current of currentModels) {
    const prev = prevMap.get(current.slug);
    if (!prev) {
      // New model not in previous snapshot
      changes.push({
        slug: current.slug,
        name: current.name,
        provider: current.provider,
        providerLabel: current.providerLabel,
        changeType: 'launch',
        magnitude: 'major',
        description: `New model added: ${current.name}`,
        date: current.releaseDate || current.lastSeenAt || new Date().toISOString(),
      });
      continue;
    }

    // Price changes
    const priceDiffs = detectPriceChanges(current, prev);
    changes.push(...priceDiffs);

    // Capability changes
    const capDiffs = detectCapabilityChanges(current, prev);
    changes.push(...capDiffs);
  }

  return changes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function detectPriceChanges(current: SnapshotModel, prev: SnapshotModel): ChangeEntry[] {
  const changes: ChangeEntry[] = [];
  const date = current.lastSeenAt || new Date().toISOString();

  if (current.inputPricePerMillion != null && prev.inputPricePerMillion != null) {
    if (current.inputPricePerMillion !== prev.inputPricePerMillion) {
      const pctChange = ((current.inputPricePerMillion - prev.inputPricePerMillion) / prev.inputPricePerMillion) * 100;
      const direction = pctChange < 0 ? 'decreased' : 'increased';
      const magnitude: ChangeMagnitude = Math.abs(pctChange) > 20 ? 'major' : 'minor';

      changes.push({
        slug: current.slug,
        name: current.name,
        provider: current.provider,
        providerLabel: current.providerLabel,
        changeType: 'price-change',
        magnitude,
        description: `${current.name} input price ${direction} by ${Math.abs(pctChange).toFixed(0)}%`,
        detail: `$${prev.inputPricePerMillion}/M → $${current.inputPricePerMillion}/M`,
        date,
      });
    }
  }

  if (current.outputPricePerMillion != null && prev.outputPricePerMillion != null) {
    if (current.outputPricePerMillion !== prev.outputPricePerMillion) {
      const pctChange = ((current.outputPricePerMillion - prev.outputPricePerMillion) / prev.outputPricePerMillion) * 100;
      const direction = pctChange < 0 ? 'decreased' : 'increased';
      const magnitude: ChangeMagnitude = Math.abs(pctChange) > 20 ? 'major' : 'minor';

      changes.push({
        slug: current.slug,
        name: current.name,
        provider: current.provider,
        providerLabel: current.providerLabel,
        changeType: 'price-change',
        magnitude,
        description: `${current.name} output price ${direction} by ${Math.abs(pctChange).toFixed(0)}%`,
        detail: `$${prev.outputPricePerMillion}/M → $${current.outputPricePerMillion}/M`,
        date,
      });
    }
  }

  return changes;
}

function detectCapabilityChanges(current: SnapshotModel, prev: SnapshotModel): ChangeEntry[] {
  const changes: ChangeEntry[] = [];
  const date = current.lastSeenAt || new Date().toISOString();

  // Context window change
  if (current.contextWindow != null && prev.contextWindow != null && current.contextWindow !== prev.contextWindow) {
    const direction = current.contextWindow > prev.contextWindow ? 'expanded' : 'reduced';
    changes.push({
      slug: current.slug,
      name: current.name,
      provider: current.provider,
      providerLabel: current.providerLabel,
      changeType: 'capability-change',
      magnitude: 'major',
      description: `${current.name} context window ${direction}`,
      detail: `${formatTokenCount(prev.contextWindow)} → ${formatTokenCount(current.contextWindow)}`,
      date,
    });
  }

  // New capability flags
  const caps = [
    { key: 'supportsToolUse', label: 'tool use' },
    { key: 'supportsVision', label: 'vision' },
    { key: 'supportsAudio', label: 'audio' },
    { key: 'supportsReasoning', label: 'reasoning' },
  ] as const;

  for (const { key, label } of caps) {
    if (current[key] === true && prev[key] !== true) {
      changes.push({
        slug: current.slug,
        name: current.name,
        provider: current.provider,
        providerLabel: current.providerLabel,
        changeType: 'capability-change',
        magnitude: 'minor',
        description: `${current.name} added ${label} support`,
        date,
      });
    }
  }

  return changes;
}

function formatTokenCount(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  return `${Math.round(tokens / 1000)}K`;
}

function formatPriceSummary(m: SnapshotModel): string {
  const parts: string[] = [];
  if (m.inputPricePerMillion != null) parts.push(`$${m.inputPricePerMillion}/M input`);
  if (m.outputPricePerMillion != null) parts.push(`$${m.outputPricePerMillion}/M output`);
  if (m.contextWindow != null) parts.push(`${formatTokenCount(m.contextWindow)} context`);
  return parts.join(' · ') || '';
}
