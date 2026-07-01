
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
  id: string;
};

type Post = {
    title: string;
    description: string;
    url: string;
    pubDate: string;
    category: Term;
    tags?: Term[];
    image: Image,
    class?: string;
    [key: string]: unknown;
}

export interface PostInterface extends Post {
}
