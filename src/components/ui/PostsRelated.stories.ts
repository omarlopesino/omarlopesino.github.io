import PostsRelated from "./PostsRelated.astro";

const image = {
  src: '/960x540.jpg',
  alt: 'My awesome image',
  width: 960,
  height: 540,
};

const category = {
  name: 'Backend',
  cid: 'backend',
  slug: 'backend',
  language: 'en',
};

export default {
  title: 'Components/PostsRelated',
  component: PostsRelated,
  args: {
    title: 'Keep reading',
    posts: [
      { title: 'Config split without the config drift', url: '#', pubDate: new Date('2026-06-12'), image, category },
      { title: 'Entity queries that survive a schema change', url: '#', pubDate: new Date('2026-05-28'), image, category },
      { title: 'Reading a stack trace you did not write', url: '#', pubDate: new Date('2026-05-09'), image, category },
    ],
  },
};

export const Default = {};

// One recommendation is the common case, and the row has to hold up on its own.
export const SinglePost = {
  args: {
    posts: [
      { title: 'Config split without the config drift', url: '#', pubDate: new Date('2026-06-12'), image, category },
    ],
  },
};

export const LongTitle = {
  args: {
    posts: [
      { title: 'Migrating 400k nodes without a maintenance window, and what broke on the way', url: '#', pubDate: new Date('2026-06-30'), image, category },
    ],
  },
};
