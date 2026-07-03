import type { GetStaticPaths } from "astro";
import { getCollection, type CollectionKey, type DataEntryMap } from "astro:content";
import type { Alternate } from "@/i18n/routes";

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
      return {
        'lang': entry?.data.language  || '',
        'path': '/' + entry?.data.language + '/blog/' + entry?.data.slug,
      };
    }
  );
}
