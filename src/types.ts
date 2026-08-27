
export type Image = {
    src: string;
    alt: string;
    width: number;
    height: number;
}

export type Term = {
  name: string;
  slug: string;
  language: string;
  cid: string;
  description?: string;
  image?: Image;
};

type Post = {
    title: string;
    description: string;
    url: string;
    pubDate: Date;
    category: Term;
    tags?: Term[];
    image: Image,
    class?: string;
    [key: string]: unknown;
}

export interface PostInterface extends Post {
}

export type PostsListProps = {
    title?: string;
    posts: PostInterface[];
    // Whether the first post leads the listing at the full width of the grid.
    featured?: boolean;
    class?: string;
    itemClass?: string;
    [key: string]: unknown;
}

// A head tag in either flavour: name for standard metas, property for Open Graph.
export type MetaTag = {
    name?: string;
    property?: string;
    content: string;
};

// The SEO surface of a page. Everything is optional: what a page leaves unset is derived from its
// title, description and language, or falls back to SITE. Mirrors the seo block in
// content.config.ts, which is what a post fills it from.
export type Meta = {
    title?: string;
    description?: string;
    image?: Image;
    canonical?: string;
    type?: 'website' | 'article' | 'profile';
    robots?: string;
    keywords?: string[];
    author?: string;
    article?: {
        publishedTime?: Date;
        modifiedTime?: Date;
        section?: string;
        tags?: string[];
    };
    jsonLd?: Record<string, unknown>[];
    // Whatever the fields above do not cover yet.
    extra?: MetaTag[];
};
