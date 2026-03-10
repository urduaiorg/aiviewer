// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://aiviewer.ai',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        // Add lastmod to all sitemap entries for crawl efficiency
        item.lastmod = new Date().toISOString();
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