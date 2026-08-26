import PostCategory from "./PostCategory.astro";

export default {
  title: 'Components/PostCategory',
  component: PostCategory,
  args: {
    name: 'Backend',
    slug: 'backend',
    cid: 'backend',
    language: 'en',
  },
};

export const Default = {};
