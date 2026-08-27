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

// The archive, where the page title already says what the list is.
export const Untitled = {
  args: {
    title: undefined,
    facets: [
      { title: '2026', path: '#', count: 12 },
      { title: '2025', path: '#', count: 31 },
      { title: '2024', path: '#', count: 8 },
    ],
  },
};
