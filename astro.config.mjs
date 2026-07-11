// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { shouldIncludeInSitemap } from './src/utils/indexPolicy.ts';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://aiviewer.ai',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      filter(url) {
        return shouldIncludeInSitemap(url);
      },
      serialize(item) {
        const url = item.url;

        // ── Priority based on URL depth and importance ──
        if (url.endsWith('aiviewer.ai/')) {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (
          url.includes('/tools/') && !url.replace('https://aiviewer.ai/tools/', '').includes('/') ||
          url.includes('/guides/') && !url.replace('https://aiviewer.ai/guides/', '').includes('/') ||
          url.includes('/playbooks/') && !url.replace('https://aiviewer.ai/playbooks/', '').includes('/') ||
          url.includes('/compare/') && !url.replace('https://aiviewer.ai/compare/', '').includes('/') ||
          url.includes('/finder/')
        ) {
          // Hub/index pages — high priority
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (url.includes('/tools/') || url.includes('/guides/')) {
          // Individual tool reviews and guides — core content
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (url.includes('/compare/') || url.includes('/models/')) {
          // Comparison and model pages — data-driven
          item.priority = 0.7;
          item.changefreq = 'weekly';
        } else if (url.includes('/playbooks/') || url.includes('/prompts/') || url.includes('/reports/')) {
          // Supporting content
          item.priority = 0.6;
          item.changefreq = 'monthly';
        } else if (url.includes('/tags/') || url.includes('/changes/')) {
          // Taxonomy and feed pages
          item.priority = 0.4;
          item.changefreq = 'weekly';
        } else {
          // Static pages (about, advertise, glossary, etc.)
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }

        return item;
      },
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        // Pagefind JS is generated post-build — tell Rollup to skip resolving it
        external: (id) => id.includes('/pagefind/'),
      }
    }
  },
});
