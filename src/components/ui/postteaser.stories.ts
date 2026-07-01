import PostTeaser from "./PostTeaser.astro";

export default {
  title: 'Components/PostTeaser',
  component: PostTeaser,
  args:  {
    class: 'w-70',
    category: {
      name: 'Test',
      id: 'test',
      path: 'test',
      language: 'es',
    },
    title: 'My awesome post',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [
      {
        name: 'Tag 1',
        id: 'tag1',
        slug: 'tag1',
        language: 'es',
      },
      {
        name: 'Tag 2',
        id: 'tag2',
        slug: 'tag2',
        language: 'es',
      },
    ],
    pubDate: '2026-06-26',
    image: {
        src: '/960x540.jpg',
        alt: 'My awesome image',
        width: 960,
        height: 540,
    },
    url: '#',
  },
};

export const Default = {};
