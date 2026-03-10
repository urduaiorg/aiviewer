export interface Env {
  DB: D1Database;
  OPENROUTER_API_KEY?: string;
}

interface OpenRouterModel {
  id: string;
  name?: string;
  description?: string;
  created?: number | string;
  context_length?: number;
  architecture?: {
    input_modalities?: string[];
    output_modalities?: string[];
  };
  pricing?: {
    prompt?: string;
    completion?: string;
    input_cache_read?: string;
  };
  top_provider?: {
    max_completion_tokens?: number;
  };
  supported_parameters?: string[];
}

interface ProviderMeta {
  label: string;
  websiteUrl: string;
}

type QueryRecord = Record<string, unknown>;

const TRACKED_PROVIDERS: Record<string, ProviderMeta> = {
  openai: { label: "OpenAI", websiteUrl: "https://openai.com/" },
  anthropic: { label: "Anthropic", websiteUrl: "https://www.anthropic.com/" },
  google: { label: "Google", websiteUrl: "https://ai.google/" },
  "x-ai": { label: "xAI", websiteUrl: "https://x.ai/" },
  mistralai: { label: "Mistral", websiteUrl: "https://mistral.ai/" },
  qwen: { label: "Qwen", websiteUrl: "https://chat.qwen.ai/" },
  perplexity: { label: "Perplexity", websiteUrl: "https://www.perplexity.ai/" },
  moonshotai: { label: "Kimi / Moonshot AI", websiteUrl: "https://www.moonshot.ai/" },
  meta: { label: "Meta", websiteUrl: "https://ai.meta.com/" },
  "meta-llama": { label: "Meta", websiteUrl: "https://ai.meta.com/" },
  deepseek: { label: "DeepSeek", websiteUrl: "https://www.deepseek.com/" },
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const JSON_HEADERS = {
  ...CORS_HEADERS,
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(refreshCatalog(env));
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    try {
      await ensureSchema(env.DB);

      const url = new URL(request.url);
      const pathname = url.pathname.replace(/\/+$/, "") || "/";

      if (pathname === "/api/health" && request.method === "GET") {
        return json({
          success: true,
          status: "ok",
          timestamp: new Date().toISOString(),
        });
      }

      if (request.method !== "GET") {
        return json({ success: false, error: "Method not allowed" }, 405);
      }

      await bootstrapCatalogIfEmpty(env);

      if (pathname === "/api/dashboard") {
        const dashboard = await getDashboard(env.DB);
        return json({ success: true, dashboard });
      }

      if (pathname === "/api/models") {
        const provider = url.searchParams.get("provider");
        const limit = getLimit(url.searchParams.get("limit"), 50, 100);
        const models = await getModels(env.DB, { provider, limit });
        return json({ success: true, models, filters: { provider, limit } });
      }

      if (pathname.startsWith("/api/models/")) {
        const identifier = decodeURIComponent(pathname.slice("/api/models/".length));
        if (!identifier) {
          return json({ success: false, error: "Model slug is required" }, 400);
        }

        const model = await getModelDetail(env.DB, identifier);
        if (!model) {
          return json({ success: false, error: "Model not found" }, 404);
        }

        return json({ success: true, model });
      }

      if (pathname === "/api/releases") {
        const provider = url.searchParams.get("provider");
        const limit = getLimit(url.searchParams.get("limit"), 12, 50);
        const releases = await getLatestReleases(env.DB, { provider, limit });
        return json({ success: true, releases, filters: { provider, limit } });
      }

      if (pathname === "/api/providers") {
        const providers = await getProviders(env.DB);
        return json({ success: true, providers });
      }

      if (pathname === "/api/compare") {
        const modelsParam = url.searchParams.get("models");
        const ids = (modelsParam ?? "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
          .slice(0, 3);

        if (ids.length === 0) {
          return json({ success: false, error: "Provide up to 3 model slugs or ids via ?models=" }, 400);
        }

        const comparison = await getComparison(env.DB, ids);
        return json({ success: true, models: comparison });
      }

      return json({ success: false, error: "Not found" }, 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return json({ success: false, error: message }, 500);
    }
  },
};

async function refreshCatalog(env: Env) {
  await ensureSchema(env.DB);

  const response = await fetch(OPENROUTER_MODELS_URL, {
    headers: env.OPENROUTER_API_KEY
      ? { Authorization: `Bearer ${env.OPENROUTER_API_KEY}` }
      : undefined,
  });

  if (!response.ok) {
    throw new Error(`OpenRouter catalog request failed with ${response.status}`);
  }

  const payload = (await response.json()) as { data?: OpenRouterModel[] };
  const models = Array.isArray(payload.data) ? payload.data : [];
  const trackedModels = models.filter((model) => inferProvider(model.id) !== null);

  for (const model of trackedModels) {
    await upsertTrackedModel(env.DB, model);
  }
}

async function bootstrapCatalogIfEmpty(env: Env) {
  const result = await env.DB.prepare("SELECT COUNT(*) AS count FROM models").first<{ count: number | string }>();
  const count = Number(result?.count ?? 0);

  if (count === 0) {
    await refreshCatalog(env);
  }
}

async function ensureSchema(db: D1Database) {
  const tableInfo = await db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
      AND name IN ('models', 'benchmarks', 'release_events', 'pricing_snapshots', 'capability_snapshots')
  `).all<QueryRecord>();

  const existingTables = new Set((tableInfo.results ?? []).map((row) => String(row.name)));
  const requiredTables = ["models", "benchmarks", "release_events", "pricing_snapshots", "capability_snapshots"];
  const missingTables = requiredTables.filter((tableName) => !existingTables.has(tableName));

  if (missingTables.length > 0) {
    throw new Error(`Database schema is missing required tables: ${missingTables.join(", ")}. Run the D1 schema migration first.`);
  }
}

async function upsertTrackedModel(db: D1Database, model: OpenRouterModel) {
  const provider = inferProvider(model.id);

  if (!provider) {
    return;
  }

  const modelName = model.name?.trim() || readableModelName(model.id);
  const slug = slugify(`${provider.slug}-${model.id.split("/").pop() ?? model.id}`);
  const description = model.description?.trim() || "";
  const contextWindow = numberOrNull(model.context_length);
  const announcedAt = normalizeDate(model.created);
  const sourceUrl = `https://openrouter.ai/api/v1/models`;
  const modelFamily = inferModelFamily(model.id, modelName);

  await db.prepare(`
    INSERT INTO models (
      id,
      slug,
      name,
      provider,
      provider_label,
      model_family,
      release_date,
      context_window,
      description,
      url,
      announced_at,
      first_seen_at,
      last_seen_at,
      is_active,
      last_updated
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      name = excluded.name,
      provider = excluded.provider,
      provider_label = excluded.provider_label,
      model_family = excluded.model_family,
      release_date = COALESCE(excluded.release_date, models.release_date),
      context_window = excluded.context_window,
      description = excluded.description,
      url = excluded.url,
      announced_at = COALESCE(excluded.announced_at, models.announced_at),
      last_seen_at = CURRENT_TIMESTAMP,
      is_active = 1,
      last_updated = CURRENT_TIMESTAMP
  `).bind(
    model.id,
    slug,
    modelName,
    provider.slug,
    provider.label,
    modelFamily,
    announcedAt,
    contextWindow,
    description,
    sourceUrl,
    announcedAt,
  ).run();

  await db.prepare(`
    INSERT OR IGNORE INTO release_events (
      model_id,
      event_type,
      title,
      summary,
      source_url,
      released_at
    )
    VALUES (?, 'release', ?, ?, ?, ?)
  `).bind(
    model.id,
    `${modelName} entered the tracked catalog`,
    description,
    sourceUrl,
    announcedAt ?? new Date().toISOString(),
  ).run();

  await db.prepare(`
    INSERT INTO pricing_snapshots (
      model_id,
      input_price_per_million,
      output_price_per_million,
      cached_input_price_per_million,
      currency,
      source_url
    )
    VALUES (?, ?, ?, ?, 'USD', ?)
  `).bind(
    model.id,
    parsePricePerMillion(model.pricing?.prompt),
    parsePricePerMillion(model.pricing?.completion),
    parsePricePerMillion(model.pricing?.input_cache_read),
    sourceUrl,
  ).run();

  await db.prepare(`
    INSERT INTO capability_snapshots (
      model_id,
      context_window,
      max_output_tokens,
      supports_tool_use,
      supports_vision,
      supports_audio,
      supports_reasoning,
      source_url
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    model.id,
    contextWindow,
    numberOrNull(model.top_provider?.max_completion_tokens),
    booleanFlag(supportsToolUse(model)),
    booleanFlag(supportsVision(model)),
    booleanFlag(supportsAudio(model)),
    booleanFlag(supportsReasoning(model)),
    sourceUrl,
  ).run();
}

async function getDashboard(db: D1Database) {
  const summary = await getSummary(db);
  const providers = await getProviders(db);
  const releases = await getLatestReleases(db, { limit: 8 });
  const models = await getModels(db, { limit: 24 });

  return {
    summary,
    providers,
    latestReleases: releases,
    models,
    sources: [
      {
        label: "OpenRouter Models API",
        purpose: "Catalog metadata, pricing, context windows, and capability snapshots",
      },
      {
        label: "AIViewer benchmark table",
        purpose: "Optional benchmark snapshots when available; scores are not blended into a single universal rank",
      },
    ],
  };
}

async function getSummary(db: D1Database) {
  const query = `
    WITH latest_pricing AS (
      SELECT
        model_id,
        input_price_per_million,
        ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY recorded_at DESC, id DESC) AS rn
      FROM pricing_snapshots
    ),
    benchmarked AS (
      SELECT DISTINCT model_id FROM benchmarks
    )
    SELECT
      COUNT(*) AS total_models,
      COUNT(DISTINCT provider) AS total_providers,
      SUM(
        CASE
          WHEN datetime(COALESCE(release_date, announced_at, first_seen_at, last_seen_at)) >= datetime('now', '-30 day')
          THEN 1
          ELSE 0
        END
      ) AS recent_launches,
      MIN(CASE WHEN latest_pricing.rn = 1 THEN latest_pricing.input_price_per_million END) AS lowest_input_price_per_million,
      MAX(COALESCE(last_seen_at, last_updated)) AS last_synced_at,
      COUNT(benchmarked.model_id) AS benchmarked_models
    FROM models
    LEFT JOIN latest_pricing ON latest_pricing.model_id = models.id
    LEFT JOIN benchmarked ON benchmarked.model_id = models.id
    WHERE COALESCE(is_active, 1) = 1
  `;

  const result = await db.prepare(query).first<QueryRecord>();

  return {
    totalModels: Number(result?.total_models ?? 0),
    totalProviders: Number(result?.total_providers ?? 0),
    recentLaunches: Number(result?.recent_launches ?? 0),
    lowestInputPricePerMillion: numberOrNull(result?.lowest_input_price_per_million),
    lastSyncedAt: stringOrNull(result?.last_synced_at),
    benchmarkedModels: Number(result?.benchmarked_models ?? 0),
  };
}

async function getProviders(db: D1Database) {
  const query = `
    SELECT
      provider,
      COALESCE(provider_label, provider) AS provider_label,
      COUNT(*) AS model_count,
      MAX(datetime(COALESCE(release_date, announced_at, first_seen_at, last_seen_at))) AS latest_release_at
    FROM models
    WHERE COALESCE(is_active, 1) = 1
    GROUP BY provider, provider_label
    ORDER BY model_count DESC, provider_label ASC
  `;

  const result = await db.prepare(query).all<QueryRecord>();

  return (result.results ?? []).map((row) => ({
    provider: String(row.provider),
    providerLabel: String(row.provider_label),
    modelCount: Number(row.model_count ?? 0),
    latestReleaseAt: stringOrNull(row.latest_release_at),
    websiteUrl: TRACKED_PROVIDERS[String(row.provider)]?.websiteUrl ?? null,
  }));
}

async function getModels(
  db: D1Database,
  options: { provider?: string | null; limit?: number } = {},
) {
  const params: (string | number)[] = [];
  let whereClause = "WHERE COALESCE(m.is_active, 1) = 1";

  if (options.provider) {
    whereClause += " AND m.provider = ?";
    params.push(options.provider);
  }

  params.push(options.limit ?? 24);

  const query = `
    WITH latest_pricing AS (
      SELECT
        model_id,
        input_price_per_million,
        output_price_per_million,
        cached_input_price_per_million,
        currency,
        recorded_at,
        ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY recorded_at DESC, id DESC) AS rn
      FROM pricing_snapshots
    ),
    latest_capability AS (
      SELECT
        model_id,
        context_window,
        max_output_tokens,
        supports_tool_use,
        supports_vision,
        supports_audio,
        supports_reasoning,
        recorded_at,
        ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY recorded_at DESC, id DESC) AS rn
      FROM capability_snapshots
    ),
    latest_benchmark AS (
      SELECT
        model_id,
        benchmark_name,
        score,
        recorded_at,
        ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY recorded_at DESC, id DESC) AS rn
      FROM benchmarks
    )
    SELECT
      m.id,
      COALESCE(m.slug, REPLACE(m.id, '/', '-')) AS slug,
      m.name,
      m.provider,
      COALESCE(m.provider_label, m.provider) AS provider_label,
      m.model_family,
      m.description,
      COALESCE(m.release_date, m.announced_at, m.first_seen_at) AS release_date,
      COALESCE(latest_capability.context_window, m.context_window) AS context_window,
      latest_capability.max_output_tokens,
      latest_capability.supports_tool_use,
      latest_capability.supports_vision,
      latest_capability.supports_audio,
      latest_capability.supports_reasoning,
      latest_pricing.input_price_per_million,
      latest_pricing.output_price_per_million,
      latest_pricing.cached_input_price_per_million,
      latest_pricing.currency,
      latest_benchmark.benchmark_name,
      latest_benchmark.score AS benchmark_score,
      COALESCE(m.last_seen_at, m.last_updated) AS last_seen_at
    FROM models m
    LEFT JOIN latest_pricing ON latest_pricing.model_id = m.id AND latest_pricing.rn = 1
    LEFT JOIN latest_capability ON latest_capability.model_id = m.id AND latest_capability.rn = 1
    LEFT JOIN latest_benchmark ON latest_benchmark.model_id = m.id AND latest_benchmark.rn = 1
    ${whereClause}
    ORDER BY
      datetime(COALESCE(m.release_date, m.announced_at, m.first_seen_at, m.last_seen_at)) DESC,
      (latest_benchmark.score IS NULL) ASC,
      latest_benchmark.score DESC,
      COALESCE(latest_capability.context_window, m.context_window, 0) DESC
    LIMIT ?
  `;

  const result = await db.prepare(query).bind(...params).all<QueryRecord>();
  return (result.results ?? []).map(normalizeModelRow);
}

async function getLatestReleases(
  db: D1Database,
  options: { provider?: string | null; limit?: number } = {},
) {
  const params: (string | number)[] = [];
  let whereClause = "WHERE COALESCE(m.is_active, 1) = 1";

  if (options.provider) {
    whereClause += " AND m.provider = ?";
    params.push(options.provider);
  }

  params.push(options.limit ?? 8);

  const query = `
    WITH latest_pricing AS (
      SELECT
        model_id,
        input_price_per_million,
        output_price_per_million,
        ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY recorded_at DESC, id DESC) AS rn
      FROM pricing_snapshots
    ),
    latest_capability AS (
      SELECT
        model_id,
        context_window,
        ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY recorded_at DESC, id DESC) AS rn
      FROM capability_snapshots
    )
    SELECT
      re.model_id,
      COALESCE(m.slug, REPLACE(m.id, '/', '-')) AS slug,
      m.name,
      m.provider,
      COALESCE(m.provider_label, m.provider) AS provider_label,
      re.event_type,
      re.title,
      re.summary,
      re.source_url,
      re.released_at,
      COALESCE(latest_capability.context_window, m.context_window) AS context_window,
      latest_pricing.input_price_per_million,
      latest_pricing.output_price_per_million
    FROM release_events re
    INNER JOIN models m ON m.id = re.model_id
    LEFT JOIN latest_pricing ON latest_pricing.model_id = m.id AND latest_pricing.rn = 1
    LEFT JOIN latest_capability ON latest_capability.model_id = m.id AND latest_capability.rn = 1
    ${whereClause}
    ORDER BY re.released_at DESC, re.id DESC
    LIMIT ?
  `;

  const result = await db.prepare(query).bind(...params).all<QueryRecord>();
  const rows = result.results ?? [];

  if (rows.length > 0) {
    return rows.map((row) => ({
      modelId: String(row.model_id),
      slug: String(row.slug),
      name: String(row.name),
      provider: String(row.provider),
      providerLabel: String(row.provider_label),
      eventType: String(row.event_type),
      title: String(row.title),
      summary: stringOrNull(row.summary),
      sourceUrl: stringOrNull(row.source_url),
      releasedAt: stringOrNull(row.released_at),
      contextWindow: numberOrNull(row.context_window),
      inputPricePerMillion: numberOrNull(row.input_price_per_million),
      outputPricePerMillion: numberOrNull(row.output_price_per_million),
    }));
  }

  const fallback = await db.prepare(`
    SELECT
      id AS model_id,
      COALESCE(slug, REPLACE(id, '/', '-')) AS slug,
      name,
      provider,
      COALESCE(provider_label, provider) AS provider_label,
      description AS summary,
      release_date,
      context_window
    FROM models
    WHERE COALESCE(is_active, 1) = 1
    ORDER BY datetime(COALESCE(release_date, announced_at, first_seen_at, last_seen_at)) DESC
    LIMIT ?
  `).bind(options.limit ?? 8).all<QueryRecord>();

  return (fallback.results ?? []).map((row) => ({
    modelId: String(row.model_id),
    slug: String(row.slug),
    name: String(row.name),
    provider: String(row.provider),
    providerLabel: String(row.provider_label),
    eventType: "release",
    title: `${String(row.name)} is in the tracked catalog`,
    summary: stringOrNull(row.summary),
    sourceUrl: null,
    releasedAt: stringOrNull(row.release_date),
    contextWindow: numberOrNull(row.context_window),
    inputPricePerMillion: null,
    outputPricePerMillion: null,
  }));
}

async function getComparison(db: D1Database, ids: string[]) {
  const placeholders = ids.map(() => "?").join(", ");
  const query = `
    WITH latest_pricing AS (
      SELECT
        model_id,
        input_price_per_million,
        output_price_per_million,
        cached_input_price_per_million,
        currency,
        ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY recorded_at DESC, id DESC) AS rn
      FROM pricing_snapshots
    ),
    latest_capability AS (
      SELECT
        model_id,
        context_window,
        max_output_tokens,
        supports_tool_use,
        supports_vision,
        supports_audio,
        supports_reasoning,
        ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY recorded_at DESC, id DESC) AS rn
      FROM capability_snapshots
    ),
    latest_benchmark AS (
      SELECT
        model_id,
        benchmark_name,
        score,
        ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY recorded_at DESC, id DESC) AS rn
      FROM benchmarks
    )
    SELECT
      m.id,
      COALESCE(m.slug, REPLACE(m.id, '/', '-')) AS slug,
      m.name,
      m.provider,
      COALESCE(m.provider_label, m.provider) AS provider_label,
      m.model_family,
      m.description,
      COALESCE(m.release_date, m.announced_at, m.first_seen_at) AS release_date,
      COALESCE(latest_capability.context_window, m.context_window) AS context_window,
      latest_capability.max_output_tokens,
      latest_capability.supports_tool_use,
      latest_capability.supports_vision,
      latest_capability.supports_audio,
      latest_capability.supports_reasoning,
      latest_pricing.input_price_per_million,
      latest_pricing.output_price_per_million,
      latest_pricing.cached_input_price_per_million,
      latest_pricing.currency,
      latest_benchmark.benchmark_name,
      latest_benchmark.score AS benchmark_score,
      COALESCE(m.last_seen_at, m.last_updated) AS last_seen_at
    FROM models m
    LEFT JOIN latest_pricing ON latest_pricing.model_id = m.id AND latest_pricing.rn = 1
    LEFT JOIN latest_capability ON latest_capability.model_id = m.id AND latest_capability.rn = 1
    LEFT JOIN latest_benchmark ON latest_benchmark.model_id = m.id AND latest_benchmark.rn = 1
    WHERE m.id IN (${placeholders}) OR m.slug IN (${placeholders})
  `;

  const result = await db.prepare(query).bind(...ids, ...ids).all<QueryRecord>();
  return (result.results ?? []).map(normalizeModelRow);
}

async function getModelDetail(db: D1Database, identifier: string) {
  const model = (await getComparison(db, [identifier]))[0];

  if (!model) {
    return null;
  }

  const releaseHistoryQuery = `
    SELECT
      event_type,
      title,
      summary,
      source_url,
      released_at
    FROM release_events
    WHERE model_id = ?
    ORDER BY released_at DESC, id DESC
    LIMIT 8
  `;

  const pricingHistoryQuery = `
    SELECT
      input_price_per_million,
      output_price_per_million,
      cached_input_price_per_million,
      currency,
      recorded_at
    FROM pricing_snapshots
    WHERE model_id = ?
    ORDER BY recorded_at DESC, id DESC
    LIMIT 8
  `;

  const relatedModelsQuery = `
    WITH latest_pricing AS (
      SELECT
        model_id,
        input_price_per_million,
        output_price_per_million,
        cached_input_price_per_million,
        currency,
        ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY recorded_at DESC, id DESC) AS rn
      FROM pricing_snapshots
    ),
    latest_capability AS (
      SELECT
        model_id,
        context_window,
        max_output_tokens,
        supports_tool_use,
        supports_vision,
        supports_audio,
        supports_reasoning,
        ROW_NUMBER() OVER (PARTITION BY model_id ORDER BY recorded_at DESC, id DESC) AS rn
      FROM capability_snapshots
    )
    SELECT
      m.id,
      COALESCE(m.slug, REPLACE(m.id, '/', '-')) AS slug,
      m.name,
      m.provider,
      COALESCE(m.provider_label, m.provider) AS provider_label,
      m.model_family,
      m.description,
      COALESCE(m.release_date, m.announced_at, m.first_seen_at) AS release_date,
      COALESCE(latest_capability.context_window, m.context_window) AS context_window,
      latest_capability.max_output_tokens,
      latest_capability.supports_tool_use,
      latest_capability.supports_vision,
      latest_capability.supports_audio,
      latest_capability.supports_reasoning,
      latest_pricing.input_price_per_million,
      latest_pricing.output_price_per_million,
      latest_pricing.cached_input_price_per_million,
      latest_pricing.currency,
      NULL AS benchmark_name,
      NULL AS benchmark_score,
      COALESCE(m.last_seen_at, m.last_updated) AS last_seen_at
    FROM models m
    LEFT JOIN latest_pricing ON latest_pricing.model_id = m.id AND latest_pricing.rn = 1
    LEFT JOIN latest_capability ON latest_capability.model_id = m.id AND latest_capability.rn = 1
    WHERE COALESCE(m.is_active, 1) = 1
      AND m.provider = ?
      AND m.id != ?
    ORDER BY datetime(COALESCE(m.release_date, m.announced_at, m.first_seen_at, m.last_seen_at)) DESC
    LIMIT 4
  `;

  const capabilityHistoryQuery = `
    SELECT
      context_window,
      max_output_tokens,
      supports_tool_use,
      supports_vision,
      supports_audio,
      supports_reasoning,
      recorded_at
    FROM capability_snapshots
    WHERE model_id = ?
    ORDER BY recorded_at DESC, id DESC
    LIMIT 6
  `;

  const [releaseHistoryResult, pricingHistoryResult, relatedModelsResult, capabilityHistoryResult] = await Promise.all([
    db.prepare(releaseHistoryQuery).bind(model.id).all<QueryRecord>(),
    db.prepare(pricingHistoryQuery).bind(model.id).all<QueryRecord>(),
    db.prepare(relatedModelsQuery).bind(model.provider, model.id).all<QueryRecord>(),
    db.prepare(capabilityHistoryQuery).bind(model.id).all<QueryRecord>(),
  ]);

  return {
    ...model,
    providerWebsiteUrl: TRACKED_PROVIDERS[model.provider]?.websiteUrl ?? null,
    strengths: buildModelStrengths(model),
    watchouts: buildModelWatchouts(model),
    releaseHistory: (releaseHistoryResult.results ?? []).map((row) => ({
      eventType: String(row.event_type),
      title: String(row.title),
      summary: stringOrNull(row.summary),
      sourceUrl: stringOrNull(row.source_url),
      releasedAt: stringOrNull(row.released_at),
    })),
    pricingHistory: (pricingHistoryResult.results ?? []).map((row) => ({
      inputPricePerMillion: numberOrNull(row.input_price_per_million),
      outputPricePerMillion: numberOrNull(row.output_price_per_million),
      cachedInputPricePerMillion: numberOrNull(row.cached_input_price_per_million),
      currency: stringOrNull(row.currency) ?? "USD",
      recordedAt: stringOrNull(row.recorded_at),
    })),
    capabilityHistory: (capabilityHistoryResult.results ?? []).map((row) => ({
      contextWindow: numberOrNull(row.context_window),
      maxOutputTokens: numberOrNull(row.max_output_tokens),
      supportsToolUse: Number(row.supports_tool_use ?? 0) === 1,
      supportsVision: Number(row.supports_vision ?? 0) === 1,
      supportsAudio: Number(row.supports_audio ?? 0) === 1,
      supportsReasoning: Number(row.supports_reasoning ?? 0) === 1,
      recordedAt: stringOrNull(row.recorded_at),
    })),
    relatedModels: (relatedModelsResult.results ?? []).map(normalizeModelRow),
  };
}

function buildModelStrengths(model: ReturnType<typeof normalizeModelRow>) {
  const strengths: string[] = [];

  if ((model.contextWindow ?? 0) >= 500_000) {
    strengths.push("Built for long-context research, coding, and document-heavy workflows.");
  }
  if (model.supportsToolUse) {
    strengths.push("Supports tool use, which makes it a stronger fit for agentic workflows.");
  }
  if (model.supportsVision || model.supportsAudio) {
    const modalities = [model.supportsVision ? "vision" : null, model.supportsAudio ? "audio" : null]
      .filter(Boolean)
      .join(" + ");
    strengths.push(`Offers ${modalities} capability in addition to standard text workflows.`);
  }
  if ((model.inputPricePerMillion ?? Number.POSITIVE_INFINITY) <= 0.5) {
    strengths.push("Low input pricing makes it attractive for high-volume or always-on usage.");
  }
  if (model.supportsReasoning) {
    strengths.push("Reasoning-oriented capability makes it better suited to multi-step work.");
  }

  if (strengths.length === 0) {
    strengths.push("A general-purpose frontier model with current catalog coverage in AIViewer.");
  }

  return strengths.slice(0, 4);
}

function buildModelWatchouts(model: ReturnType<typeof normalizeModelRow>) {
  const watchouts: string[] = [];

  if ((model.outputPricePerMillion ?? 0) >= 20) {
    watchouts.push("Premium output pricing can make long generations expensive.");
  }
  if (!model.supportsToolUse) {
    watchouts.push("No tool-use flag is currently tracked for this model.");
  }
  if (!model.supportsVision && !model.supportsAudio) {
    watchouts.push("This model currently looks text-first in the tracked capability snapshot.");
  }
  if ((model.contextWindow ?? 0) > 0 && (model.contextWindow ?? 0) < 128_000) {
    watchouts.push("Context window is more limited than the longest-context frontier models.");
  }

  if (watchouts.length === 0) {
    watchouts.push("Benchmark coverage is still limited, so compare it using task fit, pricing, and capability data too.");
  }

  return watchouts.slice(0, 3);
}

function normalizeModelRow(row: QueryRecord) {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    provider: String(row.provider),
    providerLabel: String(row.provider_label),
    modelFamily: stringOrNull(row.model_family),
    description: stringOrNull(row.description),
    releaseDate: stringOrNull(row.release_date),
    contextWindow: numberOrNull(row.context_window),
    maxOutputTokens: numberOrNull(row.max_output_tokens),
    supportsToolUse: Number(row.supports_tool_use ?? 0) === 1,
    supportsVision: Number(row.supports_vision ?? 0) === 1,
    supportsAudio: Number(row.supports_audio ?? 0) === 1,
    supportsReasoning: Number(row.supports_reasoning ?? 0) === 1,
    inputPricePerMillion: numberOrNull(row.input_price_per_million),
    outputPricePerMillion: numberOrNull(row.output_price_per_million),
    cachedInputPricePerMillion: numberOrNull(row.cached_input_price_per_million),
    currency: stringOrNull(row.currency) ?? "USD",
    benchmarkName: stringOrNull(row.benchmark_name),
    benchmarkScore: numberOrNull(row.benchmark_score),
    lastSeenAt: stringOrNull(row.last_seen_at),
  };
}

function inferProvider(modelId: string) {
  const providerSlug = modelId.split("/")[0];
  const meta = TRACKED_PROVIDERS[providerSlug];

  if (!meta) {
    return null;
  }

  return {
    slug: providerSlug,
    label: meta.label,
  };
}

function inferModelFamily(modelId: string, modelName: string) {
  const tail = modelId.split("/").pop() ?? modelName;
  return tail.replace(/[-_]/g, " ").trim();
}

function readableModelName(modelId: string) {
  const tail = modelId.split("/").pop() ?? modelId;
  return tail
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function parsePricePerMillion(raw?: string) {
  if (raw === undefined || raw === null || raw === "") {
    return null;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.round(parsed * 1_000_000 * 1000) / 1000;
}

function normalizeDate(value?: string | number) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    const milliseconds = numeric > 100_000_000_000 ? numeric : numeric * 1000;
    return new Date(milliseconds).toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function supportsToolUse(model: OpenRouterModel) {
  return (model.supported_parameters ?? []).some((value) => value.toLowerCase().includes("tool"));
}

function supportsVision(model: OpenRouterModel) {
  return hasModality(model, "image");
}

function supportsAudio(model: OpenRouterModel) {
  return hasModality(model, "audio");
}

function supportsReasoning(model: OpenRouterModel) {
  return (model.supported_parameters ?? []).some((value) => value.toLowerCase().includes("reason"));
}

function hasModality(model: OpenRouterModel, modality: string) {
  const values = [
    ...(model.architecture?.input_modalities ?? []),
    ...(model.architecture?.output_modalities ?? []),
  ];
  return values.some((value) => value.toLowerCase().includes(modality));
}

function booleanFlag(value: boolean) {
  return value ? 1 : 0;
}

function getLimit(raw: string | null, fallback: number, max: number) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.min(Math.floor(parsed), max);
}

function numberOrNull(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function stringOrNull(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  return String(value);
}

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS,
  });
}
