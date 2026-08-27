import type { CollectionEntry } from 'astro:content';
import type { Alternate } from '@/i18n/routes';
import type { Image, Meta, MetaTag, Term } from '@/types';
import { name, avatar, social } from './profile';

export const SITE = {
    name,
    author: name,
    // Shown for a page that has no image of its own. @todo swap for a real social card.
    image: { src: '/960x540.jpg', alt: name, width: 960, height: 540 } as Image,
    // @todo drop when the site is ready.
    robots: 'noindex, nofollow',
};

// Open Graph wants a territory, not a bare language code.
const ogLocale: Record<string, string> = { en: 'en_US', es: 'es_ES' };

// What a page knows about itself before its Meta is applied.
export type MetaContext = {
    title: string;
    description?: string;
    lang: string;
    url: string;
    origin: string;
};

const abs = (origin: string, path: string) => (path.startsWith('http') ? path : origin + path);

// What a page says about itself, built the way the canonical URL is: from the alternate matching
// its own language, so page two of a listing points at itself rather than at page one.
export function pageContext(
    astro: { site?: URL | undefined; url: URL },
    title: string,
    description: string | undefined,
    lang: string,
    alternates: Alternate[],
): MetaContext {
    const origin = astro.site?.origin ?? astro.url.origin;
    const self = alternates.find((a) => a.lang === lang);

    return { title, description, lang, origin, url: `${origin}${self ? self.path : astro.url.pathname}` };
}

// Every metatag the site emits, in one list: adding one is adding a line here.
export function buildMeta(meta: Meta, ctx: MetaContext): MetaTag[] {
    const title = meta.title ?? ctx.title;
    const description = meta.description ?? ctx.description;
    const image = meta.image ?? SITE.image;
    const imageUrl = abs(ctx.origin, image.src);
    const article = meta.article;

    const tags: (MetaTag | false | undefined)[] = [
        description && { name: 'description', content: description },
        { name: 'author', content: meta.author ?? SITE.author },
        { name: 'robots', content: meta.robots ?? SITE.robots },
        meta.keywords?.length ? { name: 'keywords', content: meta.keywords.join(', ') } : undefined,

        { property: 'og:type', content: meta.type ?? 'website' },
        { property: 'og:site_name', content: SITE.name },
        { property: 'og:locale', content: ogLocale[ctx.lang] ?? ctx.lang },
        { property: 'og:title', content: title },
        description && { property: 'og:description', content: description },
        { property: 'og:url', content: ctx.url },
        { property: 'og:image', content: imageUrl },
        { property: 'og:image:alt', content: image.alt },
        { property: 'og:image:width', content: String(image.width) },
        { property: 'og:image:height', content: String(image.height) },

        article?.publishedTime && { property: 'article:published_time', content: article.publishedTime.toISOString() },
        article?.modifiedTime && { property: 'article:modified_time', content: article.modifiedTime.toISOString() },
        article?.section && { property: 'article:section', content: article.section },
        ...(article?.tags ?? []).map((tag) => ({ property: 'article:tag', content: tag })),

        ...(meta.extra ?? []),
    ];

    return tags.filter((tag): tag is MetaTag => Boolean(tag));
}

const person = (origin: string, lang: string) => ({
    '@type': 'Person',
    name: SITE.author,
    url: abs(origin, `/${lang}/`),
});

// One node per thing the page is. A listing is og:type website but schema.org Blog, and a post
// needs two nodes, so the shapes are built separately rather than switched on Meta.type.
export function articleLd(post: ArticleLdInput, ctx: MetaContext): Record<string, unknown> {
    return {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        image: abs(ctx.origin, post.image.src),
        datePublished: post.pubDate.toISOString(),
        ...(post.updatedDate && { dateModified: post.updatedDate.toISOString() }),
        inLanguage: ctx.lang,
        ...(post.category && { articleSection: post.category.name }),
        keywords: post.tags.map((tag) => tag.name),
        author: { ...person(ctx.origin, ctx.lang), image: abs(ctx.origin, avatar.src) },
        mainEntityOfPage: { '@type': 'WebPage', '@id': ctx.url },
    };
}

export type ArticleLdInput = {
    title: string;
    description: string;
    image: Image;
    pubDate: Date;
    updatedDate?: Date;
    category?: Term;
    tags: Term[];
};

export function personLd(ctx: MetaContext): Record<string, unknown> {
    return {
        ...person(ctx.origin, ctx.lang),
        image: abs(ctx.origin, avatar.src),
        description: ctx.description,
        sameAs: [social.github, social.linkedin, social.drupal],
    };
}

export function collectionLd(type: 'Blog' | 'CollectionPage', ctx: MetaContext): Record<string, unknown> {
    return {
        '@type': type,
        name: ctx.title,
        ...(ctx.description && { description: ctx.description }),
        url: ctx.url,
        inLanguage: ctx.lang,
    };
}

export function breadcrumbLd(trail: { label: string; href?: string }[], origin: string): Record<string, unknown> {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((step, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: step.label,
            ...(step.href && { item: abs(origin, step.href) }),
        })),
    };
}

// A post describes its own SEO: title, description, cover, date, category and tags are already in
// the frontmatter, so the seo block only has to carry what should differ from them.
export function postMeta(entry: CollectionEntry<'blog'>, category: Term, tags: Term[]): Meta {
    const { seo, image, pubDate, updatedDate, author } = entry.data;

    return {
        title: seo?.title,
        description: seo?.description,
        image: seo?.image ?? image,
        canonical: seo?.canonical,
        robots: seo?.robots,
        author,
        type: 'article',
        keywords: seo?.keywords ?? tags.map((tag) => tag.name),
        article: {
            publishedTime: pubDate,
            modifiedTime: updatedDate,
            section: category.name,
            tags: tags.map((tag) => tag.name),
        },
    };
}
