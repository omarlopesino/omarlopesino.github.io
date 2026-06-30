import PostTeaser from "./PostTeaser.astro";

export default {
  title: 'Components/PostTeaser',
  component: PostTeaser,
  args:  {
    class: 'w-70',
    category: 'Test',
    title: 'My awesome post',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [
      {
        name: 'Tag 1',
        key: 'tag1',
      },
      {
        name: 'Tag 2',
        key: 'tag2',
      },
    ],
    publishedDate: '2026-06-26',
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
