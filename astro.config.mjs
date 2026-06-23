// @ts-check
import { defineConfig } from 'astro/config';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.vellum.network',
  integrations: [
    mermaid({
      theme: 'neutral',
      autoTheme: false,
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: false,
    },
  },
});
