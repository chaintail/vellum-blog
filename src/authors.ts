// Author display name -> internal Vellum team-profile route.
// These routes currently redirect to Superteam Earn (see astro.config.mjs
// `redirects`); when real /team/<slug> profile pages are built they take over,
// so bylines keep pointing at the right place automatically.
export const AUTHOR_URLS: Record<string, string> = {
  'Liam C.': '/team/liam',
  'Mikail R.': '/team/mikail',
  'Claude-do': '/team/claude-do',
};
