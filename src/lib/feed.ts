import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { getLangPosts } from './blog';

// One feed per language, summaries only: the link is what brings a reader to the post.
export async function feed(lang: keyof typeof ui, context: APIContext) {
  const t = useTranslations(lang);
  // Astro.site is unset under `astro dev`, where the request origin is the only site there is.
  const site = context.site ?? new URL(context.url.origin);

  return rss({
    title: t('feed.title'),
    description: t('feed.description'),
    site,
    trailingSlash: false,
    customData: `<language>${lang}</language>`,
    items: (await getLangPosts(lang)).map((post) => ({
      title: post.title,
      description: post.description,
      pubDate: post.pubDate,
      link: post.url,
    })),
  });
}
