import { ui, defaultLang, langPrefix } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  // English is the root, so an unprefixed path has no segment to match.
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function useUrl(lang: keyof typeof ui) {
  return function url(slug = '') {
    return `${langPrefix(lang)}/${slug}`;
  }
}

export function useFormatDate(lang: keyof typeof ui) {
  return function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) {
      throw new Error(`Invalid date: ${date}`);
    }
    return new Intl.DateTimeFormat(lang, {
      dateStyle: 'long',
      // The ISO string (YYYY-MM-DD) is parsed as UTC midnight; format in UTC
      // so the displayed day doesn't shift in negative-offset timezones.
      timeZone: 'UTC',
      ...options,
    }).format(d);
  };
}
