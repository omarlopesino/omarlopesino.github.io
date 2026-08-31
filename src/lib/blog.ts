import type { GetStaticPaths } from "astro";
import { getCollection, getEntry, type CollectionEntry, type CollectionKey, type DataEntryMap } from "astro:content";
import type { Alternate } from "@/i18n/routes";
import { ui } from "@/i18n/ui";
import { useTranslations, useUrl } from "@/i18n/utils";
import type { PostInterface, Term } from "@/types";

export function staticPaths(type: CollectionKey, language: string) : GetStaticPaths {
  return async () => {
    const posts = await getCollection(type, ({data}) => {
      return data.language == language;
    });

    return posts.map(entry => ({
      params: { id: entry.data.slug },
      props: { entry },
    }));
  };
}

export async function getContentAlternates(type : keyof DataEntryMap, entry : {language: string, cid: string}) {
  return await Promise.all(
    await getCollection(type, ({data}) => {
      return data.cid == entry.cid
  }));
}

export async function getContentAlternateUrls(type : keyof DataEntryMap, entry : {language: string, cid: string}) : Promise<Alternate[]> {
  return (await getContentAlternates(type, entry))
    .map(
    (entry) => {
      const lang = entry.data.language as keyof typeof ui;
      const pathSegment = ui[lang][`${type}.path`];
      return {
        'lang': lang,
        'path': '/' + lang + '/' + pathSegment + '/' + entry.data.slug,
      };
    }
  );
}

export async function getPostCategory(post: CollectionEntry<'blog'>) {
  return (await getEntry('category', post.data.category + '/' + post.data.language))?.data;
}

export async function getPostTags(post: CollectionEntry<'blog'>) {
  const tags = await Promise.all(post.data.tags.map((tag) => getEntry('tag', tag + '/' + post.data.language)));
  return tags.map((tag) => tag?.data).filter((tag): tag is NonNullable<typeof tag> => Boolean(tag));
}

export async function getEmbed(cid: string, language: string) {
  const entry = await getEntry('embed', cid + '/' + language);
  if (!entry) {
    throw new Error(`Missing embed entry: ${cid}/${language}`);
  }
  return entry;
}

export async function toPostInterface(post: CollectionEntry<'blog'>) : Promise<PostInterface> {
  return {
    title: post.data.title,
    description: post.data.description,
    url: post.data.url,
    pubDate: post.data.pubDate,
    image: post.data.image,
    category: await getPostCategory(post),
    tags: await getPostTags(post),
  } as PostInterface;
}

// Posts carrying a term, newest first. Post frontmatter references a bare cid, so the
// term's own cid is what the reference id must match.
export async function getTermPosts(type: 'tag' | 'category', term: {cid: string, language: string}) : Promise<PostInterface[]> {
  const posts = await getCollection('blog', ({data}) => {
    if (data.language != term.language) {
      return false;
    }

    return type == 'category'
      ? data.category == term.cid
      : data.tags.some((tag) => tag == term.cid);
  });

  return await Promise.all(
    posts
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
      .map(toPostInterface)
  );
}

// Posts a post points at, in the order its frontmatter lists them. `recommended` holds bare cids,
// but a blog entry's id is keyed on its slug, which is translated — so unlike a tag or a category
// the id cannot be rebuilt from the cid and the entries have to be matched on cid instead.
export async function getRecommendedPosts(post: CollectionEntry<'blog'>) : Promise<PostInterface[]> {
  const cids = post.data.recommended ?? [];

  if (cids.length == 0) {
    return [];
  }

  const posts = await getCollection('blog', ({data}) => {
    return data.language == post.data.language && cids.includes(data.cid);
  });

  return await Promise.all(
    cids
      .map((cid) => posts.find((entry) => entry.data.cid == cid))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .map(toPostInterface)
  );
}

// Posts per page on every listing: the blog, a term, a year.
export const POSTS_PER_PAGE = 15;

const byNewest = (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) =>
  b.data.pubDate.getTime() - a.data.pubDate.getTime();

export async function getLangPosts(language: string) : Promise<PostInterface[]> {
  const posts = await getCollection('blog', ({data}) => data.language == language);

  return await Promise.all(posts.sort(byNewest).map(toPostInterface));
}

// The years that have posts, newest first. Read in UTC to match useFormatDate, so a post never
// counts towards the year before the one its date shows.
export async function getYears(language: string) : Promise<{year: number, count: number}[]> {
  const posts = await getCollection('blog', ({data}) => data.language == language);

  const counts = new Map<number, number>();
  for (const post of posts) {
    const year = post.data.pubDate.getUTCFullYear();
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year);
}

export async function getYearPosts(language: string, year: number) : Promise<PostInterface[]> {
  const posts = await getCollection('blog', ({data}) => {
    return data.language == language && data.pubDate.getUTCFullYear() == year;
  });

  return await Promise.all(posts.sort(byNewest).map(toPostInterface));
}

export function blogPaths(language: string) : GetStaticPaths {
  return async ({ paginate }) => {
    return paginate(await getLangPosts(language), { pageSize: POSTS_PER_PAGE });
  };
}

export function termPaths(type: 'tag' | 'category', language: string) : GetStaticPaths {
  return async ({ paginate }) => {
    const terms = await getCollection(type, ({data}) => data.language == language);

    const paths = await Promise.all(terms.map(async (entry) => paginate(
      await getTermPosts(type, entry.data),
      { params: { id: entry.data.slug }, props: { entry }, pageSize: POSTS_PER_PAGE },
    )));

    return paths.flat();
  };
}

export function yearPaths(language: string) : GetStaticPaths {
  return async ({ paginate }) => {
    const years = await getYears(language);

    const paths = await Promise.all(years.map(async ({ year }) => paginate(
      await getYearPosts(language, year),
      { params: { year: String(year) }, pageSize: POSTS_PER_PAGE },
    )));

    return paths.flat();
  };
}

// A year has no collection entry, so its translations are built from the route segment each
// language uses rather than looked up by cid.
export function getYearAlternateUrls(year: number | string) : Alternate[] {
  return (Object.keys(ui) as (keyof typeof ui)[]).map((lang) => ({
    lang,
    path: '/' + lang + '/' + ui[lang]['archive.path'] + '/' + year,
  }));
}

// Alternates for one page of a paginated route. Layout builds the canonical URL from the alternate
// matching the page's own language, so past page one they have to carry the page number too.
export function pageAlternates(alternates: Alternate[], currentPage: number) : Alternate[] {
  if (currentPage <= 1) {
    return alternates;
  }

  return alternates.map(({ lang, path }) => ({ lang, path: `${path.replace(/\/$/, '')}/${currentPage}` }));
}

// The trail from the blog down to one post. Google reads it twice — as the visible breadcrumb and
// as BreadcrumbList — so both come from here.
export function postTrail(lang: keyof typeof ui, category: Term, title: string) : { label: string; href?: string }[] {
  const t = useTranslations(lang);
  const localizedUrl = useUrl(lang);

  return [
    { label: t('nav.blog'), href: localizedUrl(t('blog.path')) },
    { label: category.name, href: localizedUrl(t('category.path') + '/' + category.slug) },
    { label: title },
  ];
}
