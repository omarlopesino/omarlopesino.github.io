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

export const Avatar = {
  args: {
    image: {
      src: '/200x200.jpg',
      alt: 'Omar Lopesino',
      width: 200,
      height: 200,
    },
    imageClass: 'w-32 shrink-0 rounded-full aspect-square object-cover',
    textClass: 'text-lede',
    text: 'I am Omar Lopesino, a senior backend developer building and running web platforms for NGOs, public administrations and news media.',
  },
};

export const SlottedText = {
  args: {
    imageClass: 'w-32 shrink-0 rounded-full aspect-square object-cover',
    textClass: 'text-lede',
    slots: {
      default: 'I am <strong>Omar Lopesino</strong>, a senior backend developer.',
    },
  },
};
