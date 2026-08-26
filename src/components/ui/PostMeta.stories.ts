import PostMeta from "./PostMeta.astro";

export default {
  title: 'Components/PostMeta',
  component: PostMeta,
  args: {
    pubDate: new Date('2026-06-30'),
    category: {
      name: 'Backend',
      slug: 'backend',
      cid: 'backend',
      language: 'en',
    },
    readingTime: 8,
  },
};

export const Default = {};

export const WithoutReadingTime = {
  args: {
    readingTime: undefined,
  },
};
