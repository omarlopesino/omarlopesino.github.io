import type { APIContext } from 'astro';
import { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { getLangPosts } from '@/lib/blog';
import { SITE } from '@/lib/seo';

// An index of the writing for language models, generated from the same posts the feeds use so the
// two cannot drift apart.
export const GET = async ({ site, url }: APIContext) => {
  const origin = site ?? new URL(url.origin);
  const languages = Object.keys(ui) as (keyof typeof ui)[];

  const sections = await Promise.all(
    languages.map(async (lang) => {
      const t = useTranslations(lang);
      const posts = await getLangPosts(lang);

      return [
        `## ${ui[lang]['nav.blog']} (${lang})`,
        '',
        `${t('feed.description')} Feed: ${new URL(`${lang}/${t('feed.path')}`, origin).href}`,
        '',
        ...posts.map((post) => `- [${post.title}](${new URL(post.url.slice(1), origin).href}): ${post.description}`),
      ].join('\n');
    }),
  );

  const body = [`# ${SITE.name}`, `> ${ui.en['about.intro']}`, ...sections].join('\n\n') + '\n';

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
