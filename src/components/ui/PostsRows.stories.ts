import PostsRows from "./PostsRows.astro";

const post = {
    title: 'My awesome post',
    category: {
        name: 'Test',
        cid: 'test',
        slug: 'test',
        language: 'en',
    },
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [
        {
            name: 'Tag 1',
            cid: 'tag1',
            slug: 'tag1',
            language: 'en',
        },
        {
            name: 'Tag 2',
            cid: 'tag2',
            slug: 'tag2',
            language: 'en',
        },
    ],
    pubDate: new Date('2026-06-26'),
    image: {
        src: '/960x540.jpg',
        alt: 'My awesome image',
        width: 960,
        height: 540,
    },
    url: '#',
};

export default {
  title: 'Components/PostsRows',
  component: PostsRows,
  args:  {
    posts: Array.from({ length: 4 }, () => ({ ...post })),
  },
};

// Rows alternate the cover's side: odd rows lead with it, even rows close with it.
export const Default = {};

// Every listing on the site: the newest post leads on a wider cover, the rest follow at one size.
export const WithLead = {
  args: {
    lead: true,
    posts: Array.from({ length: 5 }, () => ({ ...post })),
  },
};

// A short description cannot pull the row below the cover's 16:9 floor.
export const ShortDescriptions = {
  args: {
    posts: Array.from({ length: 3 }, () => ({ ...post, description: 'One short line.' })),
  },
};
