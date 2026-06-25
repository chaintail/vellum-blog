// @ts-check
import { defineConfig } from 'astro/config';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.vellum.network',
  // Team-profile routes redirect to Superteam Earn for now. When real profile
  // pages are built (src/pages/team/<slug>.astro), they override these. Bylines
  // link to these internal routes so they auto-update once profiles exist.
  redirects: {
    '/team/liam': 'https://superteam.fun/earn/t/chaintail',
    '/team/mikail': 'https://superteam.fun/earn/t/mikail',
    '/team/claude-do': 'https://superteam.fun/earn/t/claude-do',
  },
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
