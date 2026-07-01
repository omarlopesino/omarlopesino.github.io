import TagsSelector from "./TagsSelector.astro";

export default {
  title: 'Components/TagsSelector',
  component: TagsSelector,
  args: {
    name: 'tags',
    tags: [
      {id: 'tag1', name: 'Tag 1', slug: 'tag1'},
      {id: 'tag2', name: 'Tag 2', slug: 'tag2'},
      {id: 'tag3', name: 'Tag 3', slug: 'tag3'},
      {id: 'tag4', name: 'Tag 4', slug: 'tag4'},
      {id: 'tag4', name: 'Tag 5', slug: 'tag5'}
    ],
  }
};

export const Default = {};
