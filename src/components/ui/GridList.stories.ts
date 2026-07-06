import GridList from "./GridList.astro";

const post = {
    title: 'My awesome post',
    category: 'Test',
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
  title: 'Components/GridList',
  component: GridList,
  args:  {
    posts: Array.from({ length: 9 }, () => ({ ...post })),
  },
};

export const Default = {};
