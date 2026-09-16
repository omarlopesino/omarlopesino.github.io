export const routes = {
  home: { en: '/', es: '/es/' },
  blog: { en: '/blog', es: '/es/blog' },
  blogArchive: { en: '/blog/archive', es: '/es/blog/archivo'},
  about: { en: '/about-me', es: '/es/sobre-mi' },
} as const;

export type RouteKey = keyof typeof routes;

export type Alternate = { lang: string; path: string };

export function getAlternates(key: RouteKey): Alternate[] {
  return Object.entries(routes[key]).map(([lang, path]) => ({ lang, path }));
}
