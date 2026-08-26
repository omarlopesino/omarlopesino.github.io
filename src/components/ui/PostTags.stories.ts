import PostTags from "./PostTags.astro";

export default {
  title: 'Components/PostTags',
  component: PostTags,
  args: {
    tags: [
      { name: 'Drupal', slug: 'drupal', cid: 'drupal', language: 'en' },
      { name: 'Migrations', slug: 'migrations', cid: 'migrations', language: 'en' },
      { name: 'PHP', slug: 'php', cid: 'php', language: 'en' },
    ],
  },
};

export const Default = {};

export const SingleTag = {
  args: {
    tags: [
      { name: 'Drupal', slug: 'drupal', cid: 'drupal', language: 'en' },
    ],
  },
};
