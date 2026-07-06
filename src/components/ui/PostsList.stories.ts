import PostsList from "./PostsList.astro";

export default {
  title: 'Components/PostsList',
  component: PostsList,
  args:  {
    title: 'You may also like',
    posts: [
        {
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
        },
        {
            title: 'My awesome post',
            category: 'Test',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            tags: [
            {
                name: 'Tag 1',
                cid: 'tag1',
                slug: 'tag1',
            },
            {
                name: 'Tag 2',
                cid: 'tag2',
                slug: 'tag2',
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
        }
    ]
  },
};

export const Default = {};
