import ImageText from "./ImageText.astro";

export default {
  title: 'Components/ImageText',
  component: ImageText,
  args: {
    image: {
      src: '/960x540.jpg',
      alt: 'My awesome image',
      width: 960,
      height: 540,
    },
    text: 'Notes from years of building and maintaining Drupal sites: the entity API, migrations, and the contrib patches that never quite made it upstream.',
  },
};

export const Default = {};

export const ShortText = {
  args: {
    text: 'Everything about the Drupal entity API.',
  },
};
