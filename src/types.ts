
export type Image = {
    src: string;
    alt: string;
    width: number;
    height: number;
}

type PostTag = {
  name: string;
  path: string;
};

type Post = {
    title: string;
    description: string;
    url: string;
    publishedDate: string;
    category: string;
    tags?: PostTag[];
    image: Image,
    class?: string;
    [key: string]: unknown;
}

export interface PostInterface extends Post {
}
