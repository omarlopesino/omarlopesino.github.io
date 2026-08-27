export const routes = {
  home: { en: '/en/', es: '/es/' },
  blog: { en: '/en/blog', es: '/es/blog' },
  blogArchive: { en: '/en/blog/archive', es: '/es/blog/archivo'}
} as const;

export type RouteKey = keyof typeof routes;

export type Alternate = { lang: string; path: string };

export function getAlternates(key: RouteKey): Alternate[] {
  return Object.entries(routes[key]).map(([lang, path]) => ({ lang, path }));
}
