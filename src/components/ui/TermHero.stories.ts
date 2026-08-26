import TermHero from "./TermHero.astro";

export default {
  title: 'Components/TermHero',
  component: TermHero,
  args: {
    type: 'tag',
    name: 'Drupal',
    description: 'Notes from years of building and maintaining Drupal sites: the entity API, migrations, and the contrib patches that never quite made it upstream.',
    image: {
      src: '/960x540.jpg',
      alt: 'My awesome image',
      width: 960,
      height: 540,
    },
  },
};

export const Tag = {};

export const Category = {
  args: {
    type: 'category',
    name: 'Backend',
    description: 'Server-side work: APIs, data modelling, queues, and the unglamorous reliability that keeps them all up at 3am.',
  },
};
