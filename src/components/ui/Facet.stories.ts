import Facet from "./Facet.astro";
export default {
  title: 'Components/Facet',
  component: Facet,
  args:  {
    title: 'Facet example',
    facets: [
      { title: 'Facet 1', path: '/blog/facet1' },
      { title: 'Facet 2', path: '/blog/facet2', count: 3 },
    ],
  },
};
export const Default = {};

// The rail shows the five values with the most posts and sends the rest to the index page.
export const WithMore = {
  args: {
    title: 'Categories',
    facets: [
      { title: 'Drupal', path: '#', count: 12 },
      { title: 'Backend', path: '#', count: 9 },
      { title: 'DevOps', path: '#', count: 4 },
      { title: 'Frontend', path: '#', count: 2 },
      { title: 'Notes', path: '#', count: 1 },
    ],
    more: { title: 'View more', path: '#' },
  },
};
