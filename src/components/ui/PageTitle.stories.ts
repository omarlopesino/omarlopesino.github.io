import PageTitle from "./PageTitle.astro";

export default {
  title: 'Components/PageTitle',
  component: PageTitle,
  args: {
    slots: {
      default: 'Blog',
    },
  },
};

export const Default = {};

// A tag page repeats the '#' the bubbles show.
export const Tag = {
  args: {
    slots: {
      default: '<span class="opacity-40">#</span>drupal',
    },
  },
};

export const LongTitle = {
  args: {
    slots: {
      default: 'Posts tagged with something rather long',
    },
  },
};
