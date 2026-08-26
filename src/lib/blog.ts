import type { GetStaticPaths } from "astro";
import { getCollection, getEntry, type CollectionEntry, type CollectionKey, type DataEntryMap } from "astro:content";
import type { Alternate } from "@/i18n/routes";
import { ui } from "@/i18n/ui";
import type { PostInterface } from "@/types";

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
  return (await getEntry('category', post.data.category.id + '/' + post.data.language))?.data;
}

export async function getPostTags(post: CollectionEntry<'blog'>) {
  const tags = await Promise.all(post.data.tags.map((tag) => getEntry('tag', tag.id + '/' + post.data.language)));
  return tags.map((tag) => tag?.data).filter((tag): tag is NonNullable<typeof tag> => Boolean(tag));
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
      ? data.category.id == term.cid
      : data.tags.some((tag) => tag.id == term.cid);
  });

  return await Promise.all(
    posts
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
      .map(toPostInterface)
  );
}
