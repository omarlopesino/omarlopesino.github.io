import Section from "./Section.astro";

export default {
  title: 'Components/Section',
  component: Section,
  args: {
    id: 'work',
    title: 'Work',
    intro: 'Where I have spent the last ten years, and what I was responsible for.',
    slots: {
      default: '<p class="text-center opacity-70">Section body goes here.</p>',
    },
  },
};

export const Default = {};

export const WithoutIntro = {
  args: {
    title: 'Languages',
    intro: undefined,
  },
};

export const LeftAligned = {
  args: {
    titleClass: 'text-title',
  },
};

// Inside a container that brings its own padding — a modal box — the section drops its margins.
export const WithoutOuterSpacing = {
  args: {
    spacingClass: 'my-0',
  },
};
