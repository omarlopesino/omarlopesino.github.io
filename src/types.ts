
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
    class?: string;
    itemClass?: string;
    [key: string]: unknown;
}
