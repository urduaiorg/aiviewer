import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { shouldNoindexPath } from '../utils/indexPolicy';
import { isPublishedGuide } from '../components/editorial/model';

export async function GET(context: any) {
  // Fetch all collections
  const playbooks = await getCollection('playbooks', ({ data }) => !data.draft);
  const tools = await getCollection('tools', ({ data }) => !data.draft);
  const guides = await getCollection('guides', ({ data }) =>
    isPublishedGuide(data) && data.publication.index
  );
  const reports = await getCollection('reports', ({ data }) => !data.draft);
  const prompts = await getCollection('prompts', ({ data }) => !data.draft);

  // Map to RSS items
  const items = [
    ...playbooks.map(p => ({
      title: p.data.title,
      pubDate: p.data.publishedDate,
      description: p.data.description,
      link: `/playbooks/${p.id}/`,
    })),
    ...tools.map(t => ({
      title: `${t.data.title} - AI Tool Profile`,
      pubDate: t.data.publishedDate,
      description: t.data.description,
      link: `/tools/${t.id}/`,
    })),
    ...guides.map(g => ({
      title: g.data.title,
      pubDate: g.data.publishedDate,
      description: g.data.description,
      link: `/guides/${g.id}/`,
    })),
    ...reports.map(r => ({
      title: r.data.title,
      pubDate: r.data.publishedDate,
      description: r.data.description,
      link: `/reports/${r.id}/`,
    })),
    ...prompts.map(p => ({
      title: `${p.data.title} - AI Prompt`,
      pubDate: p.data.publishedDate,
      description: p.data.description,
      link: `/prompts/${p.id}/`,
    })),
  ].filter((item) => !shouldNoindexPath(item.link));

  // Sort by date descending and limit to 20
  items.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
  const recentItems = items.slice(0, 20);

  return rss({
    title: 'AIViewer.ai',
    description: 'Source-aware AI lessons, practical workflows, timely signals, and a small set of transparent tool profiles.',
    site: context.site || 'https://aiviewer.ai',
    items: recentItems,
    customData: `<language>en-us</language>`,
  });
}
